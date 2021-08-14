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

    const valFrom = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeFrom({
      fromP: val,
      valFrom
    });
    this.fromP = val;
  }

  set setTo(val: number) {

    const valTo = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeTo({
      toP: val,
      valTo
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

    this.dotP = fromWidth * 100 / wrapWidth; // XXXXXXXXXXXXXXXXXXX

    this.valP = (this.max - this.min) / 100;            // один процент
    this.stepP = this.step / this.valP;                 // количество процентов в шаге
    this.setFrom = (this.from - this.min) / this.valP;  // позиция левой точки в процентах
    this.setTo = (this.to - this.min) / this.valP;      // позиция правой точки в процентах

    this.limitFrom = this.getFrom;
    this.limitTo = this.getTo;
  }

  clickLine = (pointX: number, wrapWidth: number) => {

    const oneP = wrapWidth / 100; // один процент от всей школы
    const pointP = pointX / oneP; // кол. процентов в области где кликнули

    if (pointP > this.getTo) {            // если это значение больше чем To
      this.setTo = pointP;                // To  на эту точку
    } else if (pointP > this.getFrom) {   // если меньше To но больше From
      const To = this.getTo - pointP;     // из To вычетаем Val
      const From = pointP - this.getFrom; // из Val вычетаем From
      From > To ? this.setTo = pointP : this.setFrom = pointP; // то число что меньше та точка и ближе
    } else {                              // Если Val меньше From то подвигать From
      this.setFrom = pointP;
    }

  }


  calcDotPosition(options: CalcDotPositionOpt) {

    //this.dotP = options.dotWidth * 100 / options.wrapWidth; // ширина точки в процентах
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
    if (percent > 100) percent = 100;


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