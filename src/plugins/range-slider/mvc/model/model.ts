import { RangeSliderOptions, CalcDotPositionOpt } from './model.d';


class Model {

  private type: string;
  private orientation: string;
  private theme: string;
  private min: number;
  private max: number;
  private from: number;
  private to: number;
  private step: number;
  private valP: number;
  private stepP: number;
  private fromP: number;
  private toP: number;
  private dotP: number; // XXXXXXXXXXXXXXXXXXX
  private limitFrom: number;
  private limitTo: number;
  private fromTo: number;
  private valFrom: number;
  private valTo: number;
  private wrapWidth: number;
  private tipPrefix: string;

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
      step: 1,          // с каким шагом будет перемещяться точка
      tipPrefix: '',     // Префикс для подсказок не больше 3 символов.
    }, options);
  }

  private createProperties(options: RangeSliderOptions) {

    // тут можно произвести проверку входных данных на ошибки и 
    // попытаться их исправить

    this.type = options.type;
    this.orientation = options.orientation;
    this.theme = options.theme;
    this.min = options.min;
    this.max = options.max;
    this.to = options.to;
    this.from = options.from;
    this.step = options.step;

    const DTipPrefix = options.tipPrefix.trim(); // убераем пробелы
    this.tipPrefix = DTipPrefix.substr(0, 3); // префикс МАКС 3 символа.
  }


  set setFrom(val: number) {
    this.fromP = val;
    this.valFrom = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeFrom({
      fromP: val,
      valFrom: this.valFrom
    });

  }

  set setTo(val: number) {
    this.toP = val;
    this.valTo = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeTo({
      toP: val,
      valTo: this.valTo
    });
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
      valTo: this.valTo,
      tipPrefix: this.tipPrefix,
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

  calcWidthP(width: number) {
    return (width * 100 / this.wrapWidth) / 2;
  }

  calcPositionTipFrom(tipFrom: number) {
    const tipFromP = this.calcWidthP(tipFrom - 4);
    const tipFromX = this.getFrom - tipFromP;
    return tipFromX;
  }

  calcPositionTipSingle(widthSingle: number) {
    const line = (this.getTo - this.getFrom) / 2;
    const centerFromTo = this.getFrom + line;
    const tipSingleP = this.calcWidthP(widthSingle);
    const center = centerFromTo - tipSingleP;
    return center;
  }

  calcPositionTipTo(tipTo: number) {
    const tipToP = this.calcWidthP(tipTo - 4);
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