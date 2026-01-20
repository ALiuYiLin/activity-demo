---
name: hooks-implementer
description: 实现 hooks 中的 TODO 变量并转为 TO-CHECK。当用户需要"实现 TODO"、"实现 hooks"、"自动补全逻辑"时触发此 skill。
---

# Hooks Implementer

## 概述

此 skill 负责实现 `hooks/` 目录中带有 `TODO` 注释的变量，并将其标记为 `TO-CHECK`。

**注意**：
- 此 skill 只处理 TODO 实现，不负责合并。
- 实现后标记为 TO-CHECK，需人工确认。

## 执行步骤

### 步骤 1：接收 TODO 列表

从 `hooks-merger` skill 输出的 TODO 列表获取待实现项：

```markdown
## useDerived.ts
- [ ] `isNewField` - TODO: Implement isNewField

## useOptions.ts
- [ ] `openSelectModal` - TODO: Implement openSelectModal
```

### 步骤 2：分析上下文

对每个 TODO 变量，分析：

1. **变量名**：从命名推断用途
2. **所属层级**：根据文件判断
3. **可用 props**：分析函数签名
4. **已有变量**：可复用的派生变量

### 步骤 3：实现逻辑

**实现原则（按优先级）：**

1. **复用已有派生属性**：避免重复判断
2. **使用 props 参数**：使用传入的原始数据
3. **合理推断**：根据变量名和描述推断

#### Derived 层实现

```tsx
// 实现前
const isVoted = useMemo(() => false, []);  // TODO: Implement isVoted

// 实现后
/**
 * 是否已投票
 * TO-CHECK
 */
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
```

**复用示例：**
```tsx
// ❌ 重复判断
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
const isSelectedAdvanced = useMemo(() => props.tagId !== 0 && props.tagId === props.successTeam, [...]);

// ✅ 复用 isVoted
const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
const isSelectedAdvanced = useMemo(() => isVoted && props.tagId === props.successTeam, [isVoted, ...]);
```

#### Option 层实现

```tsx
// 实现前
function openSelectModal(team: number) {
  // TODO: Implement openSelectModal
}

// 实现后
/**
 * 打开选择弹窗
 * TO-CHECK
 */
function openSelectModal(team: number) {
  props.setTempSelectTeam(team);
  props.setShowSelectModal(true);
}
```

#### UI 层实现

UI 层通常只需确认默认值：

```tsx
// 实现前
const [showModal, setShowModal] = useState(false);  // TODO: Confirm default

// 实现后
/**
 * 弹窗显示状态
 * TO-CHECK
 */
const [showModal, setShowModal] = useState(false);
```

### 步骤 4：更新标记

将 `TODO` 改为 `TO-CHECK`，并添加 JSDoc 注释：

```tsx
// 格式
/**
 * 变量描述（从 CSV 或推断）
 * TO-CHECK
 */
const variableName = ...;
```

## 输出格式

实现完成后，输出汇总：

| 文件 | 变量 | 实现逻辑 | 状态 |
|-----|------|---------|------|
| useDerived.ts | `isVoted` | `props.tagId !== 0` | TO-CHECK |
| useDerived.ts | `leftVoteCount` | `props.voteList[0]?.num ?? 0` | TO-CHECK |
| useOptions.ts | `openSelectModal` | `setTemp + setShow` | TO-CHECK |

**TO-CHECK 列表（需人工确认）：**

```markdown
## useDerived.ts
- [x] `isVoted` → `props.tagId !== 0` - TO-CHECK
- [x] `leftVoteCount` → `props.voteList[0]?.num ?? 0` - TO-CHECK

## useOptions.ts
- [x] `openSelectModal` → 设置临时队伍并打开弹窗 - TO-CHECK

共 3 个实现完成，请检查确认后移除 TO-CHECK 注释。
```

## 注意事项

1. **添加 JSDoc 注释**：每个实现的变量都添加描述
2. **更新依赖数组**：确保 useMemo/useCallback 依赖正确
3. **不修改已有实现**：只处理带 TODO 的变量
4. **TO-CHECK 需确认**：实现后需人工检查
