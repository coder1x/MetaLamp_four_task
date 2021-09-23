
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
}

interface RangeSliderFoxFunction {
  // eslint-disable-next-line no-unused-vars
  (options: RangeSliderOptions): JQuery;
}


interface RangeSliderFox extends
  RangeSliderFoxFunction { }


// eslint-disable-next-line no-unused-vars
interface JQuery {
  RangeSliderFox: RangeSliderFox;
}


