
interface RangeSliderOptions {
  type?: string;
  orientation?: string;
  theme?: string;
  min: number;
  max: number;
  from: number;
  to?: number;
  step: number;
}


interface RangeSliderFunction {
  // eslint-disable-next-line no-unused-vars
  (options: RangeSliderOptions): JQuery;
}


interface RangeSlider extends
  RangeSliderFunction { }


// eslint-disable-next-line no-unused-vars
interface JQuery {
  RangeSlider: RangeSlider;
}


