---
name: hooks-generator
description: 根据 CSV 配置文件自动生成 React Hooks 的 skill。当用户需要批量生成 hooks、根据配置生成状态管理代码、或需要将生成的 hooks 合并到 TSX 文件时触发此 skill。
---

# Hooks Generator

## 概述

此 skill 用于根据 CSV 配置文件自动生成 React Hooks 代码，并支持将生成的 hooks 合并到目标 TSX 文件中。

## 执行步骤（必须按顺序执行）

**重要：调用此 skill 时，必须严格按以下步骤顺序执行，不可跳过任何步骤。**

### 步骤 1：运行生成脚本

首先执行生成脚本，将 hooks 生成到 `output/` 目录：

```bash
cd <project_root>
npx tsx ".codebuddy/skills/hooks-generator/scripts/generate-hooks.ts"
```

**注意**：使用 `tsx` 而非 `ts-node`，因为 `ts-node --esm` 对 skill 目录下的脚本路径解析有问题。

生成后检查 `output/` 目录，确认生成了以下文件：
- `useBase.ts` - Meta 层数据
- `useDerived.ts` - Derived 层数据  
- `useUI.ts` - UI 层数据
- `useOptions.ts` - Option 层数据

### 步骤 2：合并 hooks 到目标目录

将生成的 hooks 文件从 `output/` **合并**到项目的 `src/hooks/` 目录。

**合并规则：**

1. **对比 `output/` 和 `src/hooks/` 中的同名文件**
2. **新增变量**：`output/` 中有但 `src/hooks/` 中没有的变量，添加到目标文件
3. **保留已有实现**：`src/hooks/` 中已存在的变量保持不变
4. **TODO 状态处理**：
   - 生成的代码中带 `TODO` 注释的变量（如 `// TODO: Implement derived xxx`）
   - 需要根据 `props` 参数，或已有派生变量（优先）实现具体逻辑
   - 实现完成后将 `TODO` 改为 `TO-CHECK`

**合并示例：**

`output/useDerived.ts`（生成的）：
```tsx
const isLeftSelected = useMemo(() => 0, []);  // TODO: Implement derived isLeftSelected
const isNewField = useMemo(() => false, []);  // TODO: Implement derived isNewField
```

`src/hooks/useDerived.ts`（已有的）：
```tsx
const isLeftSelected = useMemo(() => props.tagId === 1, [props.tagId]);  // 已实现
```

**合并后 `src/hooks/useDerived.ts`：**
```tsx
// 保留已有实现
const isLeftSelected = useMemo(() => props.tagId === 1, [props.tagId]);

// TO-CHECK 新增变量，根据 props 实现
const isNewField = useMemo(() => props.someValue > 0, [props.someValue]);
```

### 步骤 3：实现带 TODO 的变量

对于合并后仍带有 `TODO` 的变量，需要实现具体逻辑。

**实现原则（按优先级）：**
1. **优先复用已有派生属性**：如果当前变量的判断逻辑与已有派生属性相同，应直接使用该派生属性，避免重复判断
2. **其次使用 props 参数**：如果没有可复用的派生属性，再使用 props 中的原始数据

**Derived 层实现示例：**
```tsx
// ❌ 错误示例：重复判断 props.tagId !== 0
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
const isSelectedTeamAdvaced = useMemo(() => props.tagId !== 0 && props.tagId === props.successTeam, [...]);

// ✅ 正确示例：复用已有的 isVoted 派生属性
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
const isSelectedTeamAdvaced = useMemo(() => isVoted && props.tagId === props.successTeam, [isVoted, props.tagId, props.successTeam]);
```

**好处：**
- 逻辑更清晰，减少重复代码
- 当判断条件变化时，只需修改一处
- 更易于理解变量之间的依赖关系

**Option 层实现示例：**
```tsx
// 生成的（待实现）
function openSelectModal() {
  // TODO: Implement openSelectModal
}

// 实现后（TO-CHECK）
function openSelectModal() {
  props.setShowSelectModal(true);  // TO-CHECK
}
```

### 步骤 4：处理 TSX 文件中的 TODO 注释

扫描目标 TSX 文件，查找 `{/* TODO xxx */}` 格式的注释，根据 `assets/config.csv` 中的配置自动匹配并绑定 hooks。

### 步骤 5：更新 TODO 状态

完成绑定后，将 `TODO` 改为 `TO-CHECK`，等待人工确认。

---

## CSV 配置说明

编辑 `assets/config.csv` 文件，定义需要生成的变量：

| 列名 | 说明 | 示例 |
|-----|------|------|
| name | 变量名（camelCase） | `tagId`, `isLeftSelected` |
| desc | 变量描述 | `选择的队伍 ID` |
| type | 类型 | `number`, `string`, `boolean`, `array`, `function` |
| defaultValue | 默认值 | `0`, `false`, `[]`, `[{id:1}]` |
| layer | 所属层级 | `Meta`, `Derived`, `UI`, `Option` |

**层级说明：**
- **Meta**: 基础数据（使用 useState，带初始化逻辑）
- **Derived**: 派生数据（使用 useMemo，依赖其他状态计算）
- **UI**: UI 状态（使用 useState，如模态框开关）
- **Option**: 操作函数（定义业务方法）

## 生成的文件结构

```
output/
├── useBase.ts      # Meta 层数据（基础状态）
├── useDerived.ts   # Derived 层数据（派生计算）
├── useUI.ts        # UI 层数据（界面状态）
└── useOptions.ts   # Option 层数据（操作函数）
```

## hooks 使用方式

将生成的 hooks 导入并在组件中使用：

```tsx
import { useBase } from './hooks/useBase';
import { useDerived } from './hooks/useDerived';
import { useUI } from './hooks/useUI';
import { useOptions } from './hooks/useOptions';

export const MyComponent = () => {
  // 1. 基础数据
  const base = useBase();
  
  // 2. UI 状态
  const ui = useUI();
  
  // 3. 派生数据（依赖 base 和 ui）
  const derived = useDerived({ ...base, ...ui });
  
  // 4. 操作函数（依赖所有状态）
  const options = useOptions({ ...base, ...derived, ...ui });

  return (
    <div>
      {/* 使用状态和方法 */}
    </div>
  );
};
```

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
<Button type="primary" onClick={options.openSelectModal}>打开选择队伍模态框</Button>

<div className={classNames("team-status", { isSelected: derived.isLeftSelected })}></div>

<div className={classNames("bg", { show: derived.isLeftAdvanced })}></div>
```

### 匹配规则

根据 TODO 注释的关键词匹配 `config.csv` 中的变量：

| 注释关键词 | 匹配字段 | 优先匹配层级 |
|-----------|---------|-------------|
| 打开/关闭/点击/操作 | `desc` 包含相关动作 | Option |
| 是否/状态/选中/晋级 | `desc` 包含相关状态 | Derived > UI |
| 列表/数据/数组 | `desc` 包含相关数据 | Meta |
| 显示/隐藏/模态框 | `desc` 包含相关 UI | UI |

### 跳过规则

以下情况直接跳过，不做处理：
- 没有 `TODO` 前缀的注释
- 已经是 `TO-CHECK` 状态的注释
- 元素已经绑定了相应属性（如已有 `onClick`）

## 模板说明

### base-hook.hbs
生成带初始化逻辑的 useState hooks：
- 包含 `useEffect` 用于异步初始化
- 返回状态值（不返回 setter）

### derived-hook.hbs
生成 useMemo 派生状态：
- 接收 props（其他 hooks 的返回值）
- 使用 useMemo 计算派生值

### ui-hook.hbs
生成 UI 状态 hooks：
- 返回状态值和 setter 函数
- 用于控制界面显示

### options-hook.hbs
生成操作函数：
- 接收所有其他 hooks 的状态
- 定义业务操作方法

## 资源目录

- `scripts/`: 生成脚本和类型定义
- `templates/`: Handlebars 模板文件
- `assets/`: CSV 配置文件
- `output/`: 生成的 hooks 文件（临时目录）
