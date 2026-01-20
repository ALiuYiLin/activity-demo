---
name: hooks-pipeline-agent
description: 将 CSV 配置文件转换为完整的 React Hooks 并绑定到 TSX 视图。当用户需要"生成完整 hooks"、"CSV 到视图"、"完整 hooks 流程"时触发此 Agent。
tools: 
enabled: true
enabledAutoRun: true
---
# Hooks Pipeline Agent

## 概述

此 Agent 负责将 CSV 配置文件转换为完整的 React Hooks，并绑定到目标 TSX 视图。

**完整流程：**
```
CSV → 优化 → 生成 → 合并 → 实现 → 绑定 → TSX
```

## 目录结构

```
src/
├── MyComponent.tsx          ← 目标 TSX 文件
└── hooks/
    ├── config.csv           ← 配置文件（输入）
    ├── output/              ← 生成的临时目录
    │   ├── useBase.ts
    │   ├── useDerived.ts
    │   ├── useUI.ts
    │   └── useOptions.ts
    ├── useBase.ts           ← 合并后的 hooks
    ├── useDerived.ts
    ├── useUI.ts
    └── useOptions.ts
```

---

## 执行步骤

### 步骤 1：优化 CSV

**调用 skill**: `hooks-csv-optimizer`

**功能**：
- 根据描述补充变量名
- 根据描述自动判断层级

**输入**：`hooks/config.csv`
**输出**：优化后的 `hooks/config.csv`

**示例：**
```csv
# 优化前
,是否已投票,boolean,false,

# 优化后
isVoted,是否已投票,boolean,false,Derived
```

---

### 步骤 2：生成基础架构

**调用 skill**: `hooks-generator`

**功能**：
- 根据 CSV 生成 hooks 基础架构
- 所有逻辑用 TODO 占位

**输入**：`hooks/config.csv`
**输出**：`hooks/output/*.ts`

**示例输出：**
```tsx
// output/useDerived.ts
const isVoted = useMemo(() => false, []);  // TODO: Implement isVoted
```

---

### 步骤 3：合并到现有代码

**调用 skill**: `hooks-merger`

**功能**：
- 根据 TODO/TO-CHECK 规则合并代码
- 输出待实现的 TODO 列表

**规则**：
- 无 TODO/TO-CHECK = 已实现 → 保留
- 有 TO-CHECK = 已实现待检查 → 保留
- 有 TODO = 待实现 → 可被覆盖

**输入**：`hooks/output/*.ts` + `hooks/*.ts`
**输出**：合并后的 `hooks/*.ts` + TODO 列表

---

### 步骤 4：实现 TODO

**调用 skill**: `hooks-implementer`

**功能**：
- 实现带 TODO 的变量逻辑
- 将 TODO 改为 TO-CHECK

**实现原则**：
1. 优先复用已有派生属性
2. 其次使用 props 参数

**输入**：TODO 列表 + `hooks/*.ts`
**输出**：实现后的 `hooks/*.ts`（带 TO-CHECK）

**示例：**
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

---

### 步骤 5：绑定到视图

**调用 skill**: `hooks-binder`

**功能**：
- 扫描 TSX 中的 TODO 注释
- 自动绑定对应的 hooks

**输入**：`MyComponent.tsx` + `hooks/*.ts`
**输出**：绑定后的 `MyComponent.tsx`（带 TO-CHECK）

**示例：**
```tsx
// 绑定前
{/* TODO 打开选择弹窗 */}
<Button>选择</Button>

// 绑定后
{/* TO-CHECK 打开选择弹窗 */}
<Button onClick={() => options.openSelectModal(1)}>选择</Button>
```

---

## 快速开始

### 方式 1：完整流程

```
用户：请根据 src/MyComponent/hooks/config.csv 生成完整 hooks 并绑定到 MyComponent.tsx
```

Agent 将依次执行所有 5 个步骤。

### 方式 2：单步执行

```
用户：请优化 CSV 配置
用户：请生成 hooks
用户：请合并到现有代码
用户：请实现 TODO
用户：请绑定到视图
```

可以单独调用每个 skill。

---

## 输出汇总

完成所有步骤后，输出最终汇总：

```markdown
## Hooks Pipeline 执行完成

### 步骤 1：CSV 优化
- 补充变量名：3 个
- 自动判断层级：5 个

### 步骤 2：生成架构
- useBase.ts: 4 变量
- useDerived.ts: 8 变量
- useUI.ts: 3 变量
- useOptions.ts: 3 变量

### 步骤 3：合并代码
- 保留现有：12 个
- 新增变量：6 个
- TODO 列表：8 个

### 步骤 4：实现 TODO
- 已实现：8 个
- TO-CHECK 待确认：8 个

### 步骤 5：绑定视图
- TSX TODO 绑定：15 个
- TO-CHECK 待确认：15 个

---

**TO-CHECK 列表（需人工确认）：**

Hooks 文件：
- useDerived.ts: isVoted, leftVoteCount, ...
- useOptions.ts: openSelectModal, closeSelectModal, ...

TSX 文件：
- L25: onClick 绑定
- L42: className 绑定
- ...

请检查所有 TO-CHECK 注释，确认无误后移除。
```

---

## 注意事项

1. **保留现有实现**：不会覆盖无 TODO 的代码
2. **TO-CHECK 需确认**：所有 AI 实现都标记为 TO-CHECK
3. **可中断恢复**：每步完成后状态保存，可随时继续
4. **单步可选**：可跳过某些步骤或单独执行