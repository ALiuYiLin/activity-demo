import { UseBaseReturn } from "./use-base";
import { UseUIReturn } from "./use-ui";

type Props = UseUIReturn & UseBaseReturn
export const useDerived = (props: Props) => {
  
  const isLeftSelected = ()=> true;

  return {
    isLeftSelected,
  }
}

export type UseDerivedReturn = ReturnType<typeof useDerived>
