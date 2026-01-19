import { UseBaseReturn } from './useBase';
import { UseDerivedReturn } from './useDerived';
import { UseUIReturn } from './useUI';

type Props = UseBaseReturn & UseDerivedReturn & UseUIReturn;

export const useOptions = (props: Props) => {
  /**
   * 打开选择模态框
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

  return {
    openSelectModal,
    closeSelectModal,
  }
}

export type UseOptionsReturn = ReturnType<typeof useOptions>
