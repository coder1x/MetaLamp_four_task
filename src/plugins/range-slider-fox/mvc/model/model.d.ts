interface CalcDotPositionOpt {
  readonly type: string,
  readonly wrapWH: number,
  readonly position: number,
  readonly clientXY: number,
  readonly shiftXY: number
}

interface PositionData {
  readonly fl: boolean,
  readonly clientXY: number,
  readonly shiftXY: number,
  readonly position: number,
}

type Prop = number | string | boolean | undefined | null;

export { CalcDotPositionOpt, Prop, PositionData };
