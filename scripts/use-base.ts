import { useEffect, useState } from "react";

export const useBase = () => {
  /**
   * count 状态
   */
  const [count, setCount] = useState(0); 


  useEffect(()=>{
    async function init(){
      
    }
    init()
  },[])

  return {
    count,
  }
}

export type UseBaseReturn = ReturnType<typeof useBase>