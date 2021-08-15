
// eslint-disable-next-line no-unused-vars
interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
  tipPrefix?: string;
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