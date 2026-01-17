import { useEffect, useState } from "react";

export const useBase = () => {
  /**
   * 选择队伍
   */
  const [tag_id, setTag_id] = useState(0); 
  /**
   * 晋级队伍
   */
  const [success_team, setSuccess_team] = useState(0); 
  /**
   * 领取礼包列表
   */
  const [has_present_list, setHas_present_list] = useState([]); 
  /**
   * 投票数据数组
   */
  const [vote_list, setVote_list] = useState([{"tag_id":1,"num":0},{"tag_id":2,"num":0}]); 
  /**
   * 左队是否被选择
   */
  const [isLeftSelected, setIsLeftSelected] = useState(0); 
  /**
   * 右队是否被选择
   */
  const [isRightSelected, setIsRightSelected] = useState(false); 
  /**
   * 左队是否晋级
   */
  const [isLeftAdvanced, setIsLeftAdvanced] = useState(false); 
  /**
   * 右队是否晋级
   */
  const [isRightAdvanced, setIsRightAdvanced] = useState(false); 
  /**
   * 是否是选择的队伍晋级了
   */
  const [isSelectedTeamAdvaced, setIsSelectedTeamAdvaced] = useState(false); 
  /**
   * 是否显示确认选择模态框
   */
  const [showSelectModal, setShowSelectModal] = useState(false); 
  /**
   * 是否显示活动规则模态框
   */
  const [showRulesModal, setShowRulesModal] = useState(false); 

  useEffect(()=>{
    async function init(){
      
    }
    init()
  },[])

  return {
    tag_id,
    success_team,
    has_present_list,
    vote_list,
    isLeftSelected,
    isRightSelected,
    isLeftAdvanced,
    isRightAdvanced,
    isSelectedTeamAdvaced,
    showSelectModal,
    showRulesModal,
  }
}
