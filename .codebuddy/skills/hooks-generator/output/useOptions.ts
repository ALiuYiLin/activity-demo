import type { UseBaseReturn } from './useBase';
import type { UseDerivedReturn } from './useDerived';
import type { UseUIReturn } from './useUI';

type Props = UseBaseReturn & UseDerivedReturn & UseUIReturn;

export const useOptions = (props: Props) => {
  /**
   * 打开选择模态框(1:left\2:right)
   */
  function openSelectModal() {
    // TODO: Implement openSelectModal
  }

  /**
   * 关闭选择模态框
   */
  function closeSelectModal() {
    // TODO: Implement closeSelectModal
  }

  /**
   * 确认选择
   */
  function comfirmSelect() {
    // TODO: Implement comfirmSelect
  }

  return {
    openSelectModal,
    closeSelectModal,
    comfirmSelect,
  }
}

export type UseOptionsReturn = ReturnType<typeof useOptions>
