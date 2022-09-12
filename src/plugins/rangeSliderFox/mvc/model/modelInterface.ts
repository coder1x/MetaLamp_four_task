type CalcFromToOptions = {
  readonly type: string;
  readonly position: number;
  readonly clientXY: number;
  readonly shiftXY: number;
  readonly dimensions: number;
};

type PositionData = {
  readonly typeFrom: boolean;
  readonly clientXY: number;
  readonly shiftXY: number;
  readonly position: number;
  readonly dimensions: number;
};

type DirectionData = {
  from: number | null;
  to: number | null;
  isFrom: boolean;
  isTo: boolean;
};

type KeyDownSnap = {
  type: boolean;
  isSign: boolean;
  isDot: boolean;
  from: number | null;
  to: number | null;
};

type KeyDownStep = {
  isDot: boolean;
  isSign: boolean;
  isKey: boolean;
  from: number | null;
  to: number | null;
  repeat: boolean;
};

export {
  CalcFromToOptions,
  PositionData,
  DirectionData,
  KeyDownSnap,
  KeyDownStep,
};
