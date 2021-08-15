

interface CreateHandleOptions {
  type: string,
  from: number,
  to: number,
  min: number,
  max: number,
  step: number
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


export {
  CreateHandleOptions,
  TipFromTo,
  CreateHintsOptions,
  CreateTipFromTo
};
