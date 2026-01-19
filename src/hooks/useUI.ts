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

  return {
    showSelectModal,
    setShowSelectModal,
    showRulesModal,
    setShowRulesModal,
  }
}

export type UseUIReturn = ReturnType<typeof useUI>
