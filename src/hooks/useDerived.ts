import type { UseBaseReturn } from './useBase';
import type { UseUIReturn } from './useUI';

import { useMemo } from "react";


type Props = UseUIReturn & UseBaseReturn;

export const useDerived = (props: Props) => {
  /**
   * 是否投票（选择队伍）
   * TO-CHECK
   */
  const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
  /**
   * 左队是否被选择
   * TO-CHECK
   */
  const isLeftSelected = useMemo(() => props.tagId === 1, [props.tagId]);
  /**
   * 右队是否被选择
   * TO-CHECK
   */
  const isRightSelected = useMemo(() => props.tagId === 2, [props.tagId]);
  /**
   * 左队是否晋级
   * TO-CHECK
   */
  const isLeftAdvanced = useMemo(() => props.successTeam === 1, [props.successTeam]);
  /**
   * 右队是否晋级
   * TO-CHECK
   */
  const isRightAdvanced = useMemo(() => props.successTeam === 2, [props.successTeam]);
  /**
   * 是否是选择的队伍晋级了
   * TO-CHECK
   */
  const isSelectedTeamAdvaced = useMemo(() => props.tagId !== 0 && props.tagId === props.successTeam, [props.tagId, props.successTeam]);

  return {
    isVoted,
    isLeftSelected,
    isRightSelected,
    isLeftAdvanced,
    isRightAdvanced,
    isSelectedTeamAdvaced,
  }
}

export type UseDerivedReturn = ReturnType<typeof useDerived>
