---
name: hooks-binder
description: 将 hooks 绑定到 TSX 文件中的 TODO 注释。当用户需要"绑定视图"、"处理 TODO"、"hooks 绑定到 TSX"时触发此 skill。
---

# Hooks Binder

## 概述

此 skill 用于扫描 TSX 文件中的 `{/* TODO xxx */}` 注释，根据 `hooks-generator` 的 CSV 配置自动匹配并绑定相应的 hooks 属性或方法。

**前置条件**：确保已使用 `hooks-generator` skill 生成并合并了 hooks 文件到 `src/hooks/` 目录。

## 执行步骤

### 步骤 1：读取配置和 hooks

1. 读取 `assets/config.csv` 获取所有变量定义
2. 读取 `src/hooks/` 目录下的 hooks 文件，确认可用的属性和方法

### 步骤 2：扫描 TSX 文件中的 TODO

扫描目标 TSX 文件，查找 `{/* TODO xxx */}` 格式的注释。

### 步骤 3：匹配并绑定 hooks

根据 TODO 注释的描述，从 `config.csv` 中查找匹配的变量并绑定。

### 步骤 4：更新 TODO 状态

完成绑定后，将 `TODO` 改为 `TO-CHECK`，等待人工确认。

---

## TODO 注释自动绑定规则

当在 TSX 文件中遇到 `{/* TODO xxx */}` 格式的注释时，自动匹配并绑定相应的 hooks 属性或方法。

### 处理流程

1. **识别 TODO 注释**：扫描 TSX 文件中的 `{/* TODO xxx */}` 注释
2. **匹配 hooks 属性**：根据注释描述，从 `config.csv` 中查找匹配的变量
   - 操作类（如"打开模态框"）→ 匹配 `Option` 层的函数
   - 状态类（如"是否选中"）→ 匹配 `Derived` 或 `UI` 层的属性
   - 数据类（如"队伍列表"）→ 匹配 `Meta` 层的数据
3. **自动绑定**：将匹配的属性/方法绑定到对应的 JSX 元素
4. **标记完成**：将 `TODO` 改为 `TO-CHECK`，等待人工检查

### 注释状态说明

| 注释格式 | 状态 | 说明 |
|---------|------|------|
| `{/* TODO xxx */}` | 待处理 | 需要自动匹配并绑定 hooks |
| `{/* TO-CHECK xxx */}` | 待检查 | 已自动绑定，等待人工确认 |
| 无注释 | 已完成 | 人工检查通过，已删除注释 |

### 示例

**处理前（TODO 状态）：**
```tsx
{/* TODO 打开选择队伍模态框 */}
<Button type="primary">打开选择队伍模态框</Button>

{/* TODO 显示左队是否被选中 isSelected */}
<div className="team-status"></div>

{/* TODO 显示背景 左队是否晋级 show */}
<div className='bg'></div>
```

**处理后（TO-CHECK 状态）：**
```tsx
{/* TO-CHECK 打开选择队伍模态框 */}
<Button type="primary" onClick={options.openSelectModal}>打开选择队伍模态框</Button>

{/* TO-CHECK 显示左队是否被选中 isSelected */}
<div className={classNames("team-status", { isSelected: derived.isLeftSelected })}></div>

{/* TO-CHECK 显示背景 左队是否晋级 show */}
<div className={classNames("bg", { show: derived.isLeftAdvanced })}></div>
```

**人工确认后（无 TODO 注释）：**
```tsx
{/* 打开选择队伍模态框 */}
<Button type="primary" onClick={options.openSelectModal}>打开选择队伍模态框</Button>

{/* 显示左队是否被选中 isSelected */}
<div className={classNames("team-status", { isSelected: derived.isLeftSelected })}></div>

{/* 显示背景 左队是否晋级 show */}
<div className={classNames("bg", { show: derived.isLeftAdvanced })}></div>
```

### 匹配规则

根据 TODO 注释的关键词匹配 `config.csv` 中的变量：

| 注释关键词 | 匹配字段 | 优先匹配层级 | hooks 对象 |
|-----------|---------|-------------|-----------|
| 打开/关闭/点击/操作 | `desc` 包含相关动作 | Option | `options.xxx` |
| 是否/状态/选中/晋级 | `desc` 包含相关状态 | Derived > UI | `derived.xxx` / `ui.xxx` |
| 列表/数据/数组 | `desc` 包含相关数据 | Meta | `base.xxx` |
| 显示/隐藏/模态框 | `desc` 包含相关 UI | UI | `ui.xxx` |

### 绑定方式

根据 TODO 注释的上下文和元素类型，选择合适的绑定方式：

| 场景 | 绑定方式 | 示例 |
|-----|---------|------|
| 按钮点击 | `onClick={options.xxx}` | `onClick={() => options.openSelectModal(1)}` |
| 条件渲染 | `{condition && <Element>}` | `{!derived.isVoted && <Button>}` |
| 条件样式 | `className={classNames(...)}` | `className={classNames('base', { 'active': derived.isSelected })}` |
| 文本显示 | `{value}` | `{derived.leftVoteCount}` |
| 布尔显示 | `{value ? '是' : '否'}` | `{derived.isVoted ? '是' : '否'}` |
| Modal 控制 | `open/onCancel/onOk` | `open={ui.showModal} onCancel={options.closeModal}` |

### 跳过规则

以下情况直接跳过，不做处理：
- 没有 `TODO` 前缀的注释
- 已经是 `TO-CHECK` 状态的注释
- 元素已经绑定了相应属性（如已有 `onClick`）

## 配置文件路径

此 skill 依赖 `hooks-generator` 的配置文件：
- CSV 配置：`.codebuddy/skills/hooks-generator/assets/config.csv`
- Hooks 目录：`src/hooks/`
