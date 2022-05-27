/* eslint no-unused-vars: off */

interface RangeSliderOptions {
  readonly type?: string | null;
  readonly orientation?: string | null;
  readonly theme?: string | null;
  readonly min?: number | null;
  readonly max?: number | null;
  readonly from?: number | null;
  readonly to?: number | null;
  readonly step?: number | null,
  readonly keyStepOne?: number | null,
  readonly keyStepHold?: number | null,
  readonly bar?: boolean | null;
  readonly grid?: boolean | null;
  readonly gridSnap?: boolean | null;
  readonly tipPrefix?: string | null;
  readonly tipPostfix?: string | null;
  readonly tipMinMax?: boolean | null;
  readonly tipFromTo?: boolean | null;
  readonly gridNumber?: number | null;
  readonly gridStep?: number | null;
  readonly gridRound?: number | null;
  readonly disabled?: boolean | null;
  readonly onStart?: ((data: RangeSliderOptions) => void) | null;
  readonly onChange?: ((data: RangeSliderOptions) => void) | null;
  readonly onUpdate?: ((data: RangeSliderOptions) => void) | null;
  readonly onReset?: ((data: RangeSliderOptions) => void) | null;
}

interface RangeSliderFoxFunction {

  // eslint-disable-next-line no-use-before-define
  (options: RangeSliderOptions | void): JQuery;
}

interface RangeSliderFox extends
  RangeSliderFoxFunction { }

interface JQuery {
  RangeSliderFox: RangeSliderFox;
}
