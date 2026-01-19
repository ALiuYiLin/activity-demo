import type { UseBaseReturn } from './useBase';
import type { UseUIReturn } from './useUI';

import { useMemo } from "react";


type Props = UseUIReturn & UseBaseReturn;

export const useDerived = (props: Props) => {
  /**
   * 是否投票（选择队伍）
   */
  const isVoted = useMemo(() => props.tagId !== 0, [props.tagId]);
  /**
   * 左队是否被选择
   */
  const isLeftSelected = useMemo(() => (props.tagId === 1 ? 1 : 0), [props.tagId]);
  /**
   * 右队是否被选择
   */
  const isRightSelected = useMemo(() => props.tagId === 2, [props.tagId]);
  /**
   * 左队是否晋级
   */
  const isLeftAdvanced = useMemo(() => props.successTeam === 1, [props.successTeam]);
  /**
   * 右队是否晋级
   */
  const isRightAdvanced = useMemo(() => props.successTeam === 2, [props.successTeam]);
  /**
   * 是否是选择的队伍晋级了
   */
  const isSelectedTeamAdvaced = useMemo(
    () => isVoted && props.tagId === props.successTeam,
    [isVoted, props.tagId, props.successTeam],
  );
  /**
   * 左队获取的投票数量
   */
  const leftVoteCount = useMemo(
    () => props.voteList.find((v: any) => v.tag_id === 1)?.num || 0,
    [props.voteList],
  );
  /**
   * 右队获取的投票数量
   */
  const rightVoteCount = useMemo(
    () => props.voteList.find((v: any) => v.tag_id === 2)?.num || 0,
    [props.voteList],
  );

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
