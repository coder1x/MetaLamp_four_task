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
  dotP: number;
  limitFrom: number;
  limitTo: number;
  fromTo: number;

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
      from: 2,          // позиция первой точки
      to: 0,            // позиция второй точки
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
    this.onChangeFrom({
      fromP: val
    });
    this.fromP = val;
  }

  set setTo(val: number) {
    this.onChangeTo({
      toP: val
    });
    this.toP = val;
  }

  get getFrom() {
    return this.fromP;
  }

  get getTo() {
    return this.toP;
  }


  calcPosition(fromWidth: number, wrapWidth: number) {

    this.dotP = fromWidth * 100 / wrapWidth;

    this.valP = (this.max - this.min) / 100; // один процент
    this.stepP = this.step / this.valP; // количество процентов в шаге
    this.setFrom = this.from * this.stepP; // позиция левой точки в процентах
    this.setTo = this.to * this.stepP; // позиция правой точки в процентах

    this.limitFrom = this.getFrom;
    this.limitTo = this.getTo;
  }


  calcDotPosition(options: CalcDotPositionOpt) {

    this.dotP = options.dotWidth * 100 / options.wrapWidth; // ширина точки в процентах
    const num = options.clientX - options.shiftX - options.wrapLeft;
    let percent = num * 100 / options.wrapWidth;

    if (options.type == 'From') {
      this.limitFrom = percent;
    }
    else {
      this.limitTo = percent;
    }

    const limitDot = !(this.limitFrom > this.limitTo);

    if (percent < 0) percent = 0;
    if (percent > 100 - this.dotP) percent = 100 - this.dotP;


    if (limitDot) {
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