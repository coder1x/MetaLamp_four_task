/* eslint no-unused-vars: off */

interface RangeSliderOptions {
  readonly type?: string;
  readonly orientation?: string;
  readonly theme?: string;
  readonly min?: number;
  readonly max?: number;
  readonly from?: number;
  readonly to?: number;
  readonly step?: number,
  readonly keyStepOne?: number,
  readonly keyStepHold?: number,
  readonly bar?: boolean;
  readonly grid?: boolean;
  readonly gridSnap?: boolean;
  readonly tipPrefix?: string;
  readonly tipPostfix?: string;
  readonly tipMinMax?: boolean;
  readonly tipFromTo?: boolean;
  readonly gridNum?: number;
  readonly gridStep?: number;
  readonly gridRound?: number;
  readonly disabled?: boolean;
  readonly onStart?: Function;
  readonly onChange?: Function;
  readonly onUpdate?: Function;
  readonly onReset?: Function;
}

interface RangeSliderFoxFunction {
  (options: RangeSliderOptions): JQuery;
}

interface RangeSliderFox extends
  RangeSliderFoxFunction { }

interface JQuery {
  RangeSliderFox: RangeSliderFox;
}


