
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
  gridNum?: number;
  gridStep?: number;
  onStart?: Function;
  onChange?: Function;
  onUpdate?: Function;
}

interface CalcDotPositionOpt {
  dotWidth: number,
  type: string,
  wrapWidth: number,
  wrapLeft: number,
  clientX: number,
  shiftX: number
}


export { RangeSliderOptions, CalcDotPositionOpt };