import { RangeSliderOptions } from '../../globInterface';

type UpdateTip = {
  readonly fromXY?: number;
  readonly toXY?: number;
  readonly singleXY?: number;
};

interface DataAttributesProps extends RangeSliderOptions {
  key: 'DataAttributes';
}

type SnapNumberProps = {
  key: 'SnapNumber'
  isResized: boolean;
  snapNumber: number[];
};

type ClickMarkProps = {
  key: 'ClickMark';
  valueGrid: number;
};

type CreateGridProps = {
  key: 'CreateGrid';
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
};

type GridSnapDataProps = {
  key: 'GridSnapData';
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

type ViewHintsProps = {
  type: string | null;
  tipPrefix: string | null;
  tipPostfix: string | null;
  tipFromTo: boolean | null;
  tipMinMax: boolean | null;
  min: number | null;
  max: number | null;
}

type ViewEventProps = HintsProps |
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
  DataAttributesProps |
  SnapNumberProps;

export {
  ViewEventProps,
  UpdateTip,
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
  DataAttributesProps,
  SnapNumberProps,
  ViewHintsProps,
};
