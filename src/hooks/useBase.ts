import { useEffect, useState } from "react";

export const useBase = () => {
  /**
   * 选择队伍
   */
  const [tagId, setTagId] = useState<number>(0); 
  /**
   * 晋级队伍
   */
  const [successTeam, setSuccessTeam] = useState<number>(0); 
  /**
   * 领取礼包列表
   */
  const [hasPresentList, setHasPresentList] = useState<any[]>([]); 
  /**
   * 投票数据数组
   */
  const [voteList, setVoteList] = useState<any[]>([{"tag_id":1,"num":333},{"tag_id":2,"num":0}]); 

  useEffect(()=>{
    async function init(){
      // TODO: Implement init logic
    }
    init()
  },[])

  return {
    tagId,
    successTeam,
    hasPresentList,
    voteList,
  }
}

export type UseBaseReturn = ReturnType<typeof useBase>
