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
  /**
   * 左队获取的投票数量
   * TO-CHECK
   */
  const leftVoteCount = useMemo(() => props.voteList.find((v: { tag_id: number }) => v.tag_id === 1)?.num ?? 0, [props.voteList]);
  /**
   * 右队获取的投票数量
   * TO-CHECK
   */
  const rightVoteCount = useMemo(() => props.voteList.find((v: { tag_id: number }) => v.tag_id === 2)?.num ?? 0, [props.voteList]);
  /**
   * 比赛是否结束（是否有队伍晋级）
   * TO-CHECK
   */
  const isMatchEnded = useMemo(() => props.successTeam !== 0, [props.successTeam]);

  return {
    isVoted,
    isLeftSelected,
    isRightSelected,
    isLeftAdvanced,
    isRightAdvanced,
    isSelectedTeamAdvaced,
    leftVoteCount,
    rightVoteCount,
    isMatchEnded,
  }
}

export type UseDerivedReturn = ReturnType<typeof useDerived>
