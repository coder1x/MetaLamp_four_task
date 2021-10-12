
// eslint-disable-next-line no-unused-vars
interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  bar?: boolean;
  grid?: boolean;
  gridSnap?: boolean;
  tipPrefix?: string;
  tipPostfix?: string;
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  gridNum?: number;
  gridStep?: number;
  gridRound?: number;
  disabled?: boolean;
  onStart?: Function;
  onChange?: Function;
  onUpdate?: Function;
  onReset?: Function;
}

interface CalcDotPositionOpt {
  // dotWidth: number,
  type: string,
  wrapWH: number,
  position: number,
  clientXY: number,
  shiftXY: number
}

type PROP = number | string | boolean | undefined | null;


export { RangeSliderOptions, CalcDotPositionOpt, PROP };