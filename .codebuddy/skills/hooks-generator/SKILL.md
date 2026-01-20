---
name: hooks-generator
description: 根据 CSV 配置文件生成 React Hooks 基础架构到 output 目录。当用户需要"生成 hooks"、"生成架构"、"根据 CSV 生成代码"时触发此 skill。
---

# Hooks Generator

## 概述

此 skill 根据 CSV 配置文件生成 React Hooks 基础架构代码到 `output/` 目录。

**注意**：
- 此 skill 只负责生成，不负责合并。合并请使用 `hooks-merger` skill。
- 生成的代码带有 `TODO` 注释，需要后续实现。

## 执行步骤

### 步骤 1：定位 CSV 文件

读取目标 TSX 文件相对目录下的 `hooks/config.csv`：

```
src/
├── MyComponent.tsx      ← 目标组件
└── hooks/
    ├── config.csv       ← 配置文件
    └── output/          ← 生成目录
```

### 步骤 2：运行生成脚本

执行生成脚本：

```bash
cd <project_root>
npx tsx ".codebuddy/skills/hooks-generator/scripts/generate-hooks.ts" --config "<path-to-config.csv>" --output "<path-to-output>"
```

**参数说明：**
- `--config`: CSV 配置文件路径
- `--output`: 输出目录路径

### 步骤 3：检查生成结果

确认 `output/` 目录生成了以下文件：

```
output/
├── useBase.ts      # Meta 层（基础状态）
├── useDerived.ts   # Derived 层（派生计算）
├── useUI.ts        # UI 层（界面状态）
└── useOptions.ts   # Option 层（操作函数）
```

## 生成代码模板

### useBase.ts（Meta 层）

```tsx
import { useState, useEffect } from 'react';

export function useBase() {
  // Meta 层变量
  const [tagId, setTagId] = useState<number>(0);  // TODO: Initialize tagId
  const [voteList, setVoteList] = useState<any[]>([]);  // TODO: Initialize voteList

  // 初始化逻辑
  useEffect(() => {
    // TODO: Fetch initial data
  }, []);

  return {
    tagId,
    setTagId,
    voteList,
    setVoteList,
  };
}
```

### useDerived.ts（Derived 层）

```tsx
import { useMemo } from 'react';

interface Props {
  tagId: number;
  voteList: any[];
  // ... other props
}

export function useDerived(props: Props) {
  // Derived 层变量
  const isVoted = useMemo(() => false, []);  // TODO: Implement isVoted
  const leftVoteCount = useMemo(() => 0, []);  // TODO: Implement leftVoteCount

  return {
    isVoted,
    leftVoteCount,
  };
}
```

### useUI.ts（UI 层）

```tsx
import { useState } from 'react';

export function useUI() {
  // UI 层变量
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [tempSelectTeam, setTempSelectTeam] = useState(0);

  return {
    showSelectModal,
    setShowSelectModal,
    tempSelectTeam,
    setTempSelectTeam,
  };
}
```

### useOptions.ts（Option 层）

```tsx
interface Props {
  // 所有其他 hooks 的返回值
  setShowSelectModal: (v: boolean) => void;
  setTempSelectTeam: (v: number) => void;
  // ...
}

export function useOptions(props: Props) {
  // Option 层函数
  function openSelectModal(team: number) {
    // TODO: Implement openSelectModal
  }

  function closeSelectModal() {
    // TODO: Implement closeSelectModal
  }

  function confirmSelect() {
    // TODO: Implement confirmSelect
  }

  return {
    openSelectModal,
    closeSelectModal,
    confirmSelect,
  };
}
```

## 输出格式

生成完成后，输出汇总：

| 文件 | 变量数 | TODO 数 |
|-----|-------|--------|
| useBase.ts | 4 | 4 |
| useDerived.ts | 8 | 8 |
| useUI.ts | 3 | 0 |
| useOptions.ts | 3 | 3 |

**TODO 列表：**
```
- [ ] useBase.ts: tagId, voteList, ...
- [ ] useDerived.ts: isVoted, leftVoteCount, ...
- [ ] useOptions.ts: openSelectModal, closeSelectModal, ...
```

## 注意事项

1. **只生成不实现**：所有逻辑用 `TODO` 占位
2. **类型推断**：根据 CSV 的 type 生成 TypeScript 类型
3. **Props 类型**：自动生成 Props interface
4. **导出完整**：确保所有变量都在 return 中导出
