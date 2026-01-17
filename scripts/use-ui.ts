import { useState } from "react";

export const useUI = () => {
  /**
   * 选择模态框是否显示
   */
  const [showSelectModal, setShowSelectModal] = useState(false); 

  return {
    showSelectModal,
    setShowSelectModal,
  }
}
export type UseUIReturn = ReturnType<typeof useUI>
