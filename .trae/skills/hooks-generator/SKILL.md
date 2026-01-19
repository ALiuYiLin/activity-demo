---
name: hooks-generator
description: 根据 CSV 配置文件自动生成 React Hooks 并合并到项目中。当用户需要"生成 hooks"、"更新配置"、"根据 CSV 生成状态管理代码"时触发此 skill。
---

# Hooks Generator

## 概述

此 skill 用于根据 CSV 配置文件自动生成 React Hooks 代码，并将生成的 hooks 合并到项目的 `src/hooks/` 目录。

**注意**：此 skill 只负责 hooks 的生成和合并，不处理 TSX 文件中的 TODO 绑定。如需绑定视图，请使用 `hooks-binder` skill。

## 执行步骤

### 步骤 1：运行生成脚本

执行生成脚本，将 hooks 生成到 `output/` 目录：

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
