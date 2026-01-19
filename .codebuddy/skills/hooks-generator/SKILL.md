---
name: hooks-generator
description: 根据 CSV 配置文件自动生成 React Hooks 的 skill。当用户需要批量生成 hooks、根据配置生成状态管理代码、或需要将生成的 hooks 合并到 TSX 文件时触发此 skill。
---

# Hooks Generator

## 概述

此 skill 用于根据 CSV 配置文件自动生成 React Hooks 代码，并支持将生成的 hooks 合并到目标 TSX 文件中。

## 工作流程

### 1. 编辑 CSV 配置

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

### 2. 运行生成脚本

```bash
npx ts-node --esm scripts/generate-hooks.ts
```

或者使用 pnpm：

```bash
pnpm exec ts-node --esm scripts/generate-hooks.ts
```

脚本会读取 `assets/config.csv`，根据 `templates/` 中的 Handlebars 模板生成 hooks 到 `output/` 目录。

### 3. 生成的文件结构

```
output/
├── useBase.ts      # Meta 层数据（基础状态）
├── useDerived.ts   # Derived 层数据（派生计算）
├── useUI.ts        # UI 层数据（界面状态）
└── useOptions.ts   # Option 层数据（操作函数）
```

### 4. 合并到目标 TSX 文件

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

## 快速开始

1. 复制 `assets/config.csv` 到项目并编辑配置
2. 复制 `scripts/` 和 `templates/` 到项目
3. 运行 `npx ts-node --esm scripts/generate-hooks.ts`
4. 将 `output/` 中的文件复制到项目的 hooks 目录
5. 在 TSX 中导入并使用生成的 hooks
