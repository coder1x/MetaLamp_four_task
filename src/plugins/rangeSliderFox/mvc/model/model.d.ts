interface CalcFromToOptions {
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

interface DirectionData {
  from: number | null,
  to: number | null,
  isFrom: boolean,
  isTo: boolean,
}

type Prop = number | string | boolean | undefined | null;

export {
  CalcFromToOptions,
  Prop,
  PositionData,
  DirectionData,
};
