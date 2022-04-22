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
  readonly onStart?: Function | null;
  readonly onChange?: Function | null;
  readonly onUpdate?: Function | null;
  readonly onReset?: Function | null;
}

export default RangeSliderOptions;
