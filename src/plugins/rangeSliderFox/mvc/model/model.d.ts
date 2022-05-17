interface CalcDotPositionOptions {
  readonly type: string,
  readonly wrapperWidthHeight: number,
  readonly position: number,
  readonly clientXY: number,
  readonly shiftXY: number
}

interface PositionData {
  readonly typeFrom: boolean,
  readonly clientXY: number,
  readonly shiftXY: number,
  readonly position: number,
}

type Prop = number | string | boolean | undefined | null;

export { CalcDotPositionOptions, Prop, PositionData };
