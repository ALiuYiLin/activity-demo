---
name: hooks-csv-optimizer
description: 优化 CSV 配置文件，补充变量名并根据描述自动判断层级。当用户需要"优化 CSV"、"补充变量"、"自动判断层级"时触发此 skill。
---

# Hooks CSV Optimizer

## 概述

此 skill 负责优化 CSV 配置文件：
1. 根据描述自动补充规范的变量名
2. 根据描述和变量名自动判断所属层级

## CSV 格式

```csv
name,desc,type,defaultValue,layer
```

| 列名 | 说明 | 是否必填 |
|-----|------|---------|
| name | 变量名（camelCase） | 可自动生成 |
| desc | 变量描述 | **必填** |
| type | 类型 | 必填 |
| defaultValue | 默认值 | 可选 |
| layer | 所属层级 | 可自动判断 |

## 执行步骤

### 步骤 1：读取 CSV 文件

读取目标 TSX 文件相对目录下的 `hooks/config.csv`：

```
src/
├── MyComponent.tsx
└── hooks/
    └── config.csv  ← 读取此文件
```

### 步骤 2：补充变量名

根据 `desc` 描述自动生成规范的变量名：

**命名规则：**

| 描述特征 | 变量名前缀 | 示例 |
|---------|----------|------|
| "是否..." | `is` | 是否投票 → `isVoted` |
| "...数量/数目" | 无前缀，后缀 `Count` | 投票数量 → `voteCount` |
| "...列表/数组" | 无前缀，后缀 `List` | 礼包列表 → `presentList` |
| "打开/关闭/显示..." | 动词开头 | 打开弹窗 → `openModal` |
| "确认/提交..." | 动词开头 | 确认选择 → `confirmSelect` |
| 其他 | 直接翻译 | 选择队伍 → `selectedTeam` |

**示例：**
```csv
# 输入
,是否已投票,boolean,false,
,左队投票数量,number,0,

# 输出
isVoted,是否已投票,boolean,false,Derived
leftVoteCount,左队投票数量,number,0,Derived
```

### 步骤 3：自动判断层级

根据描述和类型自动判断 layer：

**层级判断规则（按优先级）：**

| 规则 | 层级 | 示例 |
|-----|------|------|
| type = `function` | **Option** | 打开弹窗、确认选择 |
| 描述含"弹窗/模态框/显示/临时" | **UI** | 显示规则弹窗 |
| 描述含"是否/数量/计算" 且依赖其他变量 | **Derived** | 是否已投票 |
| 来自接口/初始化数据 | **Meta** | 投票列表、队伍ID |

**详细规则：**

#### Meta 层（基础数据）
- 来自接口返回的原始数据
- 需要初始化的状态
- 描述含：列表、数据、ID、配置

#### Derived 层（派生数据）
- 描述以"是否"开头
- 描述含"数量"且需要计算
- 描述含"晋级/选择/获胜"等判断词
- 变量名以 `is` 开头

#### UI 层（界面状态）
- 描述含"弹窗/模态框/Modal"
- 描述含"显示/隐藏/展开/收起"
- 描述含"临时/暂存"
- 变量名含 `show/visible/temp`

#### Option 层（操作函数）
- type = `function`
- 描述以动词开头：打开、关闭、确认、提交、选择

### 步骤 4：输出优化后的 CSV

更新 CSV 文件，输出变更摘要：

| 变量 | 操作 | 原值 | 新值 |
|-----|------|-----|------|
| isVoted | 补充 name | - | `isVoted` |
| showModal | 判断 layer | - | `UI` |
| ... | ... | ... | ... |

## 示例

**优化前：**
```csv
name,desc,type,defaultValue,layer
,是否已投票,boolean,false,
tagId,选择的队伍,number,0,
,打开选择弹窗,function,,
```

**优化后：**
```csv
name,desc,type,defaultValue,layer
isVoted,是否已投票,boolean,false,Derived
tagId,选择的队伍,number,0,Meta
openSelectModal,打开选择弹窗,function,,Option
```

## 注意事项

1. **保留已有值**：如果 name 或 layer 已填写，不覆盖
2. **变量名规范**：使用 camelCase，避免拼音
3. **层级准确性**：优先根据业务语义判断，其次根据命名规则
4. **人工确认**：输出优化结果供开发者确认
