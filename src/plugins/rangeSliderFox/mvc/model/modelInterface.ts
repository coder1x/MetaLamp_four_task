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

type SnapNumberProps = {
  key: 'SnapNumber'
  isResized: boolean;
  snapNumber: number[];
}

type ClickMarkProps = {
  key: 'ClickMark';
  valueGrid: number;
};

type CreateGridProps = {
  key: 'CreateGrid'
  valueMark: {
    value: number;
    position: number;
  }[];
};

type ClickBarProps = {
  key: 'ClickBar';
  clientXY: number;
};

type BarDataProps = {
  key: 'BarData';
  bar: boolean | null;
};

type ClickLineProps = {
  key: 'ClickLine';
  clientXY: number;
};

type DisabledDataProps = {
  key: 'DisabledData';
  disabled: boolean | null;
};

type ThemeDataProps = {
  key: 'ThemeData';
  theme: string | null;
};

type OrientationDataProps = {
  key: 'OrientationData';
  orientation: string | null;
};

type GridDataProps = {
  key: 'GridData';
  grid: boolean | null;
  gridNumber: number;
  gridStep: number;
  gridRound: number;
};

type GridSnapDataProps = {
  key: 'GridSnapData';
  gridSnap: boolean;
}

type DotMoveProps = {
  key: 'DotMove';
  type: string | null;
  position: number;
  clientXY: number;
  shiftXY: number;
};

type DotDataProps = {
  key: 'DotData';
  type: string | null;
  to: number | null;
  from: number | null;
};

type DotKeyDownProps = {
  key: 'DotKeyDown'
  keyRepeat: boolean;
  keySign: string;
  dot: string;
};

type RangeDataProps = {
  key: 'RangeData';
  min: number;
  max: number;
};

type StartProps = {
  key: 'Start';
};

type HintsProps = {
  key: 'HintsData';
  type: string | null;
  from: number | null;
  to: number | null;
  tipPrefix: string | null;
  tipPostfix: string | null;
  tipFromTo: boolean | null;
  tipMinMax: boolean | null;
  min: number | null;
  max: number | null;
};

type ModelEventProps = HintsProps |
  StartProps |
  DotDataProps |
  DotKeyDownProps |
  RangeDataProps |
  DotMoveProps |
  GridSnapDataProps |
  GridDataProps |
  OrientationDataProps |
  ThemeDataProps |
  DisabledDataProps |
  ClickLineProps |
  BarDataProps |
  ClickBarProps |
  CreateGridProps |
  ClickMarkProps |
  SnapNumberProps;

type DataAttributesProps = {
  key?: 'DataAttributes';
  tipPrefix?: string | null;
  tipPostfix?: string | null;
  tipMinMax?: boolean | null;
  tipFromTo?: boolean | null;
};

type ArrayKeys = [
  'RangeData',
  'DotData',
  'GridSnapData',
  'GridData',
  'ThemeData',
  'HintsData',
  'DisabledData',
  'BarData',
  'OrientationData',
  'Start',
];

export {
  DataAttributesProps,
  ArrayKeys,
  CalcFromToOptions,
  PositionData,
  DirectionData,
  KeyDownSnap,
  KeyDownStep,
  ModelEventProps,
  HintsProps,
  StartProps,
  DotDataProps,
  DotKeyDownProps,
  RangeDataProps,
  DotMoveProps,
  GridSnapDataProps,
  GridDataProps,
  OrientationDataProps,
  ThemeDataProps,
  DisabledDataProps,
  ClickLineProps,
  BarDataProps,
  ClickBarProps,
  CreateGridProps,
  ClickMarkProps,
  SnapNumberProps,
};
