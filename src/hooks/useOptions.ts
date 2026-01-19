import type { UseBaseReturn } from './useBase';
import type { UseDerivedReturn } from './useDerived';
import type { UseUIReturn } from './useUI';

type Props = UseBaseReturn & UseDerivedReturn & UseUIReturn;

export const useOptions = (props: Props) => {
  /**
   * 打开选择模态框(1:left/2:right)
   * TO-CHECK
   */
  function openSelectModal(team: 1 | 2) {
    props.setTempSelectTeam(team);
    props.setShowSelectModal(true);
  }

  /**
   * 关闭选择模态框
   * TO-CHECK
   */
  function closeSelectModal() {
    props.setShowSelectModal(false);
    props.setTempSelectTeam(0);
  }

  /**
   * 确认选择
   * TO-CHECK
   */
  function comfirmSelect() {
    // 确认选择后关闭模态框
    props.setShowSelectModal(false);
  }

  return {
    openSelectModal,
    closeSelectModal,
    comfirmSelect,
  }
}

export type UseOptionsReturn = ReturnType<typeof useOptions>
