
interface CalcDotPositionOpt {
  readonly type: string,
  readonly wrapWH: number,
  readonly position: number,
  readonly clientXY: number,
  readonly shiftXY: number
}

interface TP {
  readonly fl: boolean,
  readonly clientXY: number,
  readonly shiftXY: number,
  readonly position: number,
}

type PROP = number | string | boolean | undefined | null;


export { CalcDotPositionOpt, PROP, TP };