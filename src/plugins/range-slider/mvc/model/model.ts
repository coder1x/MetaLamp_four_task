import { RangeSliderOptions, CalcDotPositionOpt } from './model.d';


class Model {

  type: string;
  orientation: string;
  theme: string;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  valP: number;
  stepP: number;
  private fromP: number;
  private toP: number;
  dotP: number; // XXXXXXXXXXXXXXXXXXX
  limitFrom: number;
  limitTo: number;
  fromTo: number;
  valFrom: number;
  valTo: number;
  wrapWidth: number;

  onChangeFrom: Function;
  onChangeTo: Function;


  options: RangeSliderOptions;

  constructor(options: RangeSliderOptions) {

    this.createProperties(this.getConfig(options));
  }

  private getConfig(options: RangeSliderOptions) {
    return Object.assign({
      type: 'single',   // тип - одна или две точки
      orientation: 'horizontal',  // положение слайдера
      theme: 'base',    // тема слайдера
      min: 0,           // минимальное значение на школе
      max: 10,          // максимальное значение на школе
      from: 1,          // позиция первой точки
      to: 2,            // позиция второй точки
      step: 1           // с каким шагом будет перемещяться точка
    }, options);
  }

  private createProperties(options: RangeSliderOptions) {
    this.type = options.type;
    this.orientation = options.orientation;
    this.theme = options.theme;
    this.min = options.min;
    this.max = options.max;
    this.to = options.to;
    this.from = options.from;
    this.step = options.step;
  }



  set setFrom(val: number) {

    this.valFrom = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeFrom({
      fromP: val,
      valFrom: this.valFrom
    });
    this.fromP = val;
  }

  set setTo(val: number) {

    this.valTo = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeTo({
      toP: val,
      valTo: this.valTo
    });
    this.toP = val;
  }

  get getFrom() {
    return this.fromP;
  }

  get getTo() {
    return this.toP;
  }


  getOptions() {
    return {
      type: this.type,
      orientation: this.orientation,
      theme: this.theme,
      min: this.min,
      max: this.max,
      to: this.to,
      from: this.from,
      step: this.step,
      fromX: this.getFrom,
      toX: this.getTo,
      valFrom: this.valFrom,
      valTo: this.valTo
    };
  }

  calcPosition(fromWidth: number, wrapWidth: number) {

    this.wrapWidth = wrapWidth;
    this.dotP = fromWidth * 100 / wrapWidth; // XXXXXXXXXXXXXXXXXXX

    this.valP = (this.max - this.min) / 100;            // один процент
    this.stepP = this.step / this.valP;                 // количество процентов в шаге
    this.setFrom = (this.from - this.min) / this.valP;  // позиция левой точки в процентах
    this.setTo = (this.to - this.min) / this.valP;      // позиция правой точки в процентах

    this.limitFrom = this.getFrom;
    this.limitTo = this.getTo;
  }


  calcPositionTipFrom(tipFrom: number) {
    const tipFromP = ((tipFrom - 4) * 100 / this.wrapWidth) / 2;
    const tipFromX = this.getFrom - tipFromP;
    return tipFromX;
  }

  calcPositionTipTo(tipTo: number) {
    const tipToP = ((tipTo - 4) * 100 / this.wrapWidth) / 2;
    const tipToX = this.getTo - tipToP;
    return tipToX;
  }



  clickLine = (pointX: number, wrapWidth: number) => {

    this.wrapWidth = wrapWidth;
    const oneP = wrapWidth / 100; // один процент от всей школы
    const pointP = pointX / oneP; // кол. процентов в области где кликнули


    if (this.type == 'single') {
      this.setFrom = pointP;
    }
    else if (pointP > this.getTo) {            // если это значение больше чем To
      this.setTo = pointP;                // To  на эту точку
    } else if (pointP > this.getFrom) {   // если меньше To но больше From
      const To = this.getTo - pointP;     // из To вычетаем Val
      const From = pointP - this.getFrom; // из Val вычетаем From
      From > To ? this.setTo = pointP : this.setFrom = pointP; // то число что меньше та точка и ближе
    } else {                              // Если Val меньше From то подвигать From
      this.setFrom = pointP;
    }
    this.limitTo = this.getTo;
    this.limitFrom = this.getFrom;
  }


  calcDotPosition(options: CalcDotPositionOpt) {

    //this.dotP = options.dotWidth * 100 / options.wrapWidth; // ширина точки в процентах
    this.wrapWidth = options.wrapWidth;
    const num = options.clientX - options.shiftX - options.wrapLeft;
    let percent = num * 100 / this.wrapWidth;

    if (options.type == 'From') {
      this.limitFrom = percent;
    }
    else {
      this.limitTo = percent;
    }

    const limitDot = !(this.limitFrom > this.limitTo);

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const type = this.type == 'single';

    if (type) {
      this.setFrom = percent;
    } else if (limitDot) {
      this.fromTo = percent;

      if (options.type == 'From') {
        this.setFrom = percent;
      }
      else {
        this.setTo = percent;
      }

    }
    else {
      this.setFrom = this.fromTo;
      this.setTo = this.fromTo;
    }
  }


}



export { Model };