import { UseBaseReturn } from "./use-base";
import { UseUIReturn } from "./use-ui";
import { UseDerivedReturn } from "./use-derived";
type Props = UseBaseReturn & UseDerivedReturn & UseUIReturn
export const useOptions = (props: Props) => {
 
  /**
   * 打开选择模态框
   */
  function openSelectModal() {
    props.setShowSelectModal(true);
  }

  /**
   * 关闭选择模态框
   */
  function closeSelectModal() {
    props.setShowSelectModal(false);
  }

  return {
    openSelectModal,
    closeSelectModal,
  }
}
export type UseOptionsReturn = ReturnType<typeof useOptions>
