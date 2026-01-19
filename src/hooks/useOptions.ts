import type { UseBaseReturn } from './useBase';
import type { UseDerivedReturn } from './useDerived';
import type { UseUIReturn } from './useUI';

type Props = UseBaseReturn & UseDerivedReturn & UseUIReturn;

export const useOptions = (props: Props) => {
  /**
   * 打开选择模态框(1:left\2:right)
   */
  function openSelectModal(teamId: number) {
    props.setTempSelectTeam(teamId);
    props.setShowSelectModal(true);
  }

  /**
   * 关闭选择模态框
   */
  function closeSelectModal() {
    props.setShowSelectModal(false);
    props.setTempSelectTeam(0);
  }

  /**
   * 确认选择
   */
  function comfirmSelect() {
    if (!props.tempSelectTeam) return;
    props.setTagId(props.tempSelectTeam);
    props.setVoteList((prev: any[]) =>
      prev.map((v) =>
        v.tag_id === props.tempSelectTeam ? { ...v, num: (v.num || 0) + 1 } : v,
      ),
    );
    closeSelectModal();
  }

  return {
    openSelectModal,
    closeSelectModal,
    comfirmSelect,
  }
}

export type UseOptionsReturn = ReturnType<typeof useOptions>
