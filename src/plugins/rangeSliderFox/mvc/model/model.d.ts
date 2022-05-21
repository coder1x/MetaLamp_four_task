interface CalcFromToOptions {
  readonly type: string,
  readonly position: number,
  readonly clientXY: number,
  readonly shiftXY: number
  readonly dimensions: number,
}

interface PositionData {
  readonly typeFrom: boolean,
  readonly clientXY: number,
  readonly shiftXY: number,
  readonly position: number,
  readonly dimensions: number,
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
