import type { UseBaseReturn } from './useBase';
import type { UseUIReturn } from './useUI';

import { useMemo } from "react";


type Props = UseUIReturn & UseBaseReturn;

export const useDerived = (props: Props) => {
  /**
   * 是否投票（选择队伍）
   * TODO: Implement derived isVoted
   */
  const isVoted = useMemo(() => false,[]);
  /**
   * 左队是否被选择
   * TODO: Implement derived isLeftSelected
   */
  const isLeftSelected = useMemo(() => 0,[]);
  /**
   * 右队是否被选择
   * TODO: Implement derived isRightSelected
   */
  const isRightSelected = useMemo(() => false,[]);
  /**
   * 左队是否晋级
   * TODO: Implement derived isLeftAdvanced
   */
  const isLeftAdvanced = useMemo(() => false,[]);
  /**
   * 右队是否晋级
   * TODO: Implement derived isRightAdvanced
   */
  const isRightAdvanced = useMemo(() => false,[]);
  /**
   * 是否是选择的队伍晋级了
   * TODO: Implement derived isSelectedTeamAdvaced
   */
  const isSelectedTeamAdvaced = useMemo(() => false,[]);
  /**
   * 左队获取的投票数量
   * TODO: Implement derived leftVoteCount
   */
  const leftVoteCount = useMemo(() => 0,[]);
  /**
   * 右队获取的投票数量
   * TODO: Implement derived rightVoteCount
   */
  const rightVoteCount = useMemo(() => 0,[]);

  return {
    isVoted,
    isLeftSelected,
    isRightSelected,
    isLeftAdvanced,
    isRightAdvanced,
    isSelectedTeamAdvaced,
    leftVoteCount,
    rightVoteCount,
  }
}

export type UseDerivedReturn = ReturnType<typeof useDerived>
