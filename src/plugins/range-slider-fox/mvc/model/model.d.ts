
// eslint-disable-next-line no-unused-vars
interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  grid?: boolean;
  gridSnap?: boolean;
  tipPrefix?: string;
  tipMinMax?: boolean;
  tipFromTo?: boolean;
  gridNum?: number;
  gridStep?: number;
  disabled?: boolean;
  onStart?: Function;
  onChange?: Function;
  onUpdate?: Function;
  onReset?: Function;
}

interface CalcDotPositionOpt {
  // dotWidth: number,
  type: string,
  wrapWidth: number,
  wrapLeft: number,
  clientX: number,
  shiftX: number
}

type PROP = number | string | boolean | undefined | null;


export { RangeSliderOptions, CalcDotPositionOpt, PROP };