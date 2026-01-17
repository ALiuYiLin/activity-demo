import { Config, VarLayer } from "./types";

export const config: Config[] = [
  // 元数据
  {
    name: 'tag_id',
    desc: '选择队伍',
    type: 'number',
    defaultValue: 0,
    layer: VarLayer.Meta,
  },
  {
    name: 'success_team',
    desc: '晋级队伍',
    type: 'number',
    defaultValue: 0,
    layer: VarLayer.Meta,
  },
  {
    name: 'has_present_list',
    desc: '领取礼包列表',
    type: 'array',
    defaultValue: [],
    layer: VarLayer.Meta,
  },
  {
    name: 'vote_list',
    desc: '投票数据数组',
    type: 'array',
    defaultValue: [{tag_id:1,num:0},{tag_id:2,num:0}],
    layer: VarLayer.Meta,
  },
  
  // 派生数据
  {
    name: 'isLeftSelected',
    desc: '左队是否被选择',
    type: 'number',
    defaultValue: 0,
    layer: VarLayer.Derived,
  },
  {
    name: 'isRightSelected',
    desc: '右队是否被选择',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.Derived,
  },
  {
    name: 'isLeftAdvanced',
    desc: '左队是否晋级',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.Derived,
  },
  {
    name: 'isRightAdvanced',
    desc: '右队是否晋级',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.Derived,
  },
  {
    name: 'isSelectedTeamAdvaced',
    desc: '是否是选择的队伍晋级了',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.Derived,
  },

  // UI数据
  {
    name: 'showSelectModal',
    desc: '是否显示确认选择模态框',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.UI,
  },
  {
    name: 'showRulesModal',
    desc: '是否显示活动规则模态框',
    type: 'boolean',
    defaultValue: false,
    layer: VarLayer.UI,
  },

  // 操作
  {
    name: 'openSelectModal',
    desc: '打开选择模态框',
    type: 'function',
    layer: VarLayer.Option,
  },
  {
    name: 'closeSelectModal',
    desc: '关闭选择模态框',
    type: 'function',
    layer: VarLayer.Option,
  },
]
