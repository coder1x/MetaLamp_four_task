

interface CreateHandleOptions {
  type: string,
}


interface TipFromTo {
  valFrom: number,
  valTo: number,
  fromX: Number,
  toX: number
}

interface CreateHintsOptions {
  min: number,
  max: number,
  valFrom: number,
  valTo: number,
  type: string,
  tipMinMax: boolean,
  tipFromTo: boolean,
}

interface CreateTipFromTo {
  valFrom: number,
  valTo: number,
  type: string,
  tipFromTo: boolean,
}

interface CreateTipMinMax {
  min: number,
  max: number,
  tipMinMax: boolean,
}

interface DateGrid {
  interval: number,
  min: number,
  max: number,
}

interface UbdateTip {
  from: number,
  to: number,
  fromXY: Function,
  toXY: Function,
  type: string,
  singleXY: Function,
}


export {
  CreateHandleOptions,
  TipFromTo,
  CreateHintsOptions,
  CreateTipFromTo,
  DateGrid,
  CreateTipMinMax,
  UbdateTip
};
