---
name: hooks-binder
description: 将 hooks 绑定到 TSX 文件中的 TODO 注释。当用户需要"绑定视图"、"处理 TODO"、"hooks 绑定到 TSX"时触发此 skill。
---

# Hooks Binder

## 概述

此 skill 扫描目标 TSX 文件中的 `{/* TODO xxx */}` 注释，根据 hooks 自动匹配并绑定属性或方法。

**前置条件**：已完成前 4 个步骤（CSV 优化 → 生成 → 合并 → 实现）。

## 执行步骤

### 步骤 1：定位文件

```
src/
├── MyComponent.tsx      ← 目标 TSX 文件
└── hooks/
    ├── config.csv       ← 配置文件
    ├── useBase.ts
    ├── useDerived.ts
    ├── useUI.ts
    └── useOptions.ts
```

### 步骤 2：读取配置和 hooks

1. 读取 `hooks/config.csv` 获取所有变量定义
2. 读取 `hooks/*.ts` 确认可用的属性和方法

### 步骤 3：扫描 TSX 中的 TODO

扫描目标 TSX 文件，查找 `{/* TODO xxx */}` 格式的注释。

### 步骤 4：匹配并绑定

根据 TODO 描述，从 CSV 中查找匹配的变量并绑定到 JSX 元素。

### 步骤 5：更新状态

将 `TODO` 改为 `TO-CHECK`，等待人工确认。

---

## TODO 注释格式

```tsx
{/* TODO 描述 [绑定方式] */}
<Element>...</Element>
```

**绑定方式（可选）：**
- 无指定：根据元素类型自动判断
- `isSelected`：绑定到 className 的 isSelected
- `show`：绑定到 className 的 show
- `onClick`：绑定到 onClick 事件

---

## 匹配规则

根据 TODO 注释关键词匹配 `config.csv` 中的变量：

| 注释关键词 | 匹配层级 | hooks 对象 |
|-----------|---------|-----------|
| 打开/关闭/点击/确认 | Option | `options.xxx` |
| 是否/选中/晋级 | Derived | `derived.xxx` |
| 显示/隐藏/弹窗 | UI | `ui.xxx` |
| 列表/数据/数组 | Meta | `base.xxx` |

---

## 绑定方式

根据元素类型和 TODO 描述选择绑定方式：

### 按钮点击

```tsx
// TODO
{/* TODO 打开选择队伍弹窗 */}
<Button>选择队伍</Button>

// TO-CHECK
{/* TO-CHECK 打开选择队伍弹窗 */}
<Button onClick={() => options.openSelectModal(1)}>选择队伍</Button>
```

### 条件样式

```tsx
// TODO（指定绑定到 isSelected）
{/* TODO 左队是否被选中 isSelected */}
<div className="team-card"></div>

// TO-CHECK
{/* TO-CHECK 左队是否被选中 isSelected */}
<div className={classNames("team-card", { isSelected: derived.isLeftSelected })}></div>
```

### 条件显示/隐藏

```tsx
// TODO（指定绑定到 show）
{/* TODO 左队晋级背景 show */}
<div className="advance-bg"></div>

// TO-CHECK
{/* TO-CHECK 左队晋级背景 show */}
<div className={classNames("advance-bg", { show: derived.isLeftAdvanced })}></div>
```

### 条件渲染

```tsx
// TODO
{/* TODO 未投票时显示选择按钮 */}
<Button>立即选择</Button>

// TO-CHECK
{/* TO-CHECK 未投票时显示选择按钮 */}
{!derived.isVoted && <Button>立即选择</Button>}
```

### 文本显示

```tsx
// TODO
{/* TODO 左队投票数 */}
<span>0</span>

// TO-CHECK
{/* TO-CHECK 左队投票数 */}
<span>{derived.leftVoteCount}</span>
```

### Modal 控制

```tsx
// TODO
{/* TODO 选择队伍弹窗 */}
<Modal title="选择队伍"></Modal>

// TO-CHECK
{/* TO-CHECK 选择队伍弹窗 */}
<Modal
  title="选择队伍"
  open={ui.showSelectModal}
  onCancel={options.closeSelectModal}
  onOk={options.confirmSelect}
></Modal>
```

---

## 输出格式

绑定完成后，输出汇总：

| 位置 | TODO 描述 | 绑定变量 | 绑定方式 | 状态 |
|-----|----------|---------|---------|------|
| L25 | 打开选择弹窗 | `options.openSelectModal` | onClick | TO-CHECK |
| L42 | 左队是否选中 | `derived.isLeftSelected` | className | TO-CHECK |
| L58 | 左队投票数 | `derived.leftVoteCount` | text | TO-CHECK |

**TO-CHECK 列表（需人工确认）：**

```markdown
共绑定 8 个 TODO，请检查 TSX 文件中的 TO-CHECK 注释：
- L25: onClick={options.openSelectModal}
- L42: className isSelected
- L58: text {derived.leftVoteCount}
...

确认无误后，移除 TO-CHECK 前缀即可。
```

---

## 跳过规则

以下情况直接跳过：

1. 无 `TODO` 前缀的注释
2. 已是 `TO-CHECK` 状态
3. 元素已绑定相应属性（如已有 `onClick`）
4. 无法从 CSV 中匹配到变量

---

## 注意事项

1. **导入 classNames**：如使用条件样式，确保导入 `classNames`
2. **导入 hooks**：确保 TSX 文件已导入所需的 hooks
3. **保持结构**：只修改绑定属性，不改变 JSX 结构
4. **TO-CHECK 需确认**：绑定后需人工检查确认
