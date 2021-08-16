

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
  tipPrefix: string,
}

interface CreateTipFromTo {
  valFrom: number,
  valTo: number,
  type: string,
  tipPrefix: string,
}

interface DateGrid {
  interval: number,
  min: number,
  max: number,
}


export {
  CreateHandleOptions,
  TipFromTo,
  CreateHintsOptions,
  CreateTipFromTo,
  DateGrid
};
