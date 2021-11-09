
interface CalcDotPositionOpt {
  type: string,
  wrapWH: number,
  position: number,
  clientXY: number,
  shiftXY: number
}

interface TP {
  fl: boolean,
  clientXY: number,
  shiftXY: number,
  position: number,
}

type PROP = number | string | boolean | undefined | null;


export { CalcDotPositionOpt, PROP, TP };