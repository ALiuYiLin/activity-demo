---
name: hooks-merger
description: 将生成的 hooks 合并到现有代码，根据 TODO/TO-CHECK 规则处理冲突，并输出 TODO 列表。当用户需要"合并 hooks"、"同步代码"时触发此 skill。
---

# Hooks Merger

## 概述

此 skill 将 `output/` 目录生成的 hooks 合并到目标 `hooks/` 目录，根据 **TODO/TO-CHECK 注释**判断采用哪边代码。

**核心规则**：
- 无 TODO/TO-CHECK = 已实现 → **保留现有**
- 有 TO-CHECK = 已实现待检查 → **保留现有**
- 有 TODO = 待实现 → **可被覆盖**

## 执行步骤

### 步骤 1：定位文件

```
src/
├── MyComponent.tsx
└── hooks/
    ├── config.csv
    ├── output/          ← 生成的代码
    │   ├── useBase.ts
    │   ├── useDerived.ts
    │   ├── useUI.ts
    │   └── useOptions.ts
    ├── useBase.ts       ← 现有代码（合并目标）
    ├── useDerived.ts
    ├── useUI.ts
    └── useOptions.ts
```

### 步骤 2：逐变量对比

对每个同名文件中的每个变量，判断合并策略：

#### 冲突判断规则

| 现有代码状态 | output 代码状态 | 采用 | 原因 |
|------------|----------------|------|------|
| 无 TODO/TO-CHECK | 有 TODO | **现有** | 已实现的优先 |
| 有 TO-CHECK | 有 TODO | **现有** | TO-CHECK 视为已实现 |
| 有 TODO | 有 TODO | **output** | 采用最新模板 |
| 不存在 | 有 TODO | **output** | 新增变量 |
| 任意 | 不存在 | **现有** | 不删除现有变量 |

### 步骤 3：执行合并

```tsx
// 现有代码（无 TODO，保留）
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);

// output 新增（有 TODO，合并）
const isNewField = useMemo(() => false, []);  // TODO: Implement isNewField
```

**合并后：**
```tsx
// 保留：已实现
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);

// 新增：从 output 合并
const isNewField = useMemo(() => false, []);  // TODO: Implement isNewField
```

### 步骤 4：更新 return 和类型

- 将新增变量添加到 return 语句
- 更新 Props interface（如有需要）

### 步骤 5：输出 TODO 列表

合并完成后，扫描所有文件，输出待实现的 TODO 列表：

**合并汇总：**

| 文件 | 保留 | 新增 | 覆盖 |
|-----|-----|------|-----|
| useBase.ts | 4 | 0 | 0 |
| useDerived.ts | 5 | 2 | 1 |
| useUI.ts | 3 | 0 | 0 |
| useOptions.ts | 2 | 1 | 0 |

**TODO 列表（需 AI 实现）：**

```markdown
## useDerived.ts
- [ ] `isNewField` - TODO: Implement isNewField
- [ ] `isOtherField` - TODO: Implement isOtherField

## useOptions.ts  
- [ ] `newAction` - TODO: Implement newAction

共 3 个 TODO 待实现，请使用 hooks-implementer skill 处理。
```

## 注意事项

1. **不删除现有变量**：即使 output 中没有
2. **只看注释状态**：不根据代码逻辑判断是否实现
3. **保持代码顺序**：新增变量添加到已有变量之后
4. **完整输出 TODO**：合并后必须输出 TODO 列表供下一步处理
