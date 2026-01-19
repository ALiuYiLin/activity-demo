import { useState } from "react";

export const useUI = () => {
  /**
   * 是否显示确认选择模态框
   */
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false); 
  /**
   * 是否显示活动规则模态框
   */
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false); 
  /**
   * 临时保存选择队伍，为提交选择使用(1:left/2:right)
   * TO-CHECK
   */
  const [tempSelectTeam, setTempSelectTeam] = useState<number>(0); 

  return {
    showSelectModal,
    setShowSelectModal,
    showRulesModal,
    setShowRulesModal,
    tempSelectTeam,
    setTempSelectTeam,
  }
}

export type UseUIReturn = ReturnType<typeof useUI>
