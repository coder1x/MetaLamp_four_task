import { RangeSliderOptions, CalcDotPositionOpt } from './model.d';


class Model {

  private type: string;
  private orientation: string;
  private theme: string;
  private min: number;
  private max: number;
  private from: number;
  private to: number;
  private valP: number;
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
  private gridSnap: boolean;
  private gridNum: number;
  private gridStep: number;
  private grid: boolean;
  private fromStartFl: boolean;
  private toStartFl: boolean;

  onChangeFrom: Function;
  onChangeTo: Function;
  onChange: Function;
  onUpdate: Function;


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
      tipPrefix: '',    // Префикс для подсказок не больше 3 символов.
      grid: false,      // Шкала выключена
      gridSnap: false,  // точка переходит по ризкам на Шкале
      gridNum: 4,       // интервал в шкале
      gridStep: 0,      // Шаг шкалы
      // eslint-disable-next-line no-unused-vars
      onStart: (data: RangeSliderOptions) => { },
      // eslint-disable-next-line no-unused-vars
      onChange: (data: RangeSliderOptions) => { },
      // eslint-disable-next-line no-unused-vars
      onUpdate: (data: RangeSliderOptions) => { },
    }, options);
  }

  private createProperties(options: RangeSliderOptions) {

    // тут можно произвести проверку входных данных на ошибки и 
    // попытаться их исправить

    this.fromStartFl = true;
    this.toStartFl = true;

    this.type = options.type;
    this.orientation = options.orientation;
    this.theme = options.theme;
    this.min = options.min;
    this.max = options.max;
    this.to = options.to;
    this.from = options.from;
    this.gridSnap = options.gridSnap;
    this.grid = options.grid;

    this.gridNum = options.gridNum;
    this.gridStep = options.gridStep;

    const DTipPrefix = options.tipPrefix.trim();  // убераем пробелы
    this.tipPrefix = DTipPrefix.substr(0, 3);     // префикс МАКС 3 символа.

    this.onChange = options.onChange;
    this.onUpdate = options.onUpdate;

    this.valFrom = this.from;
    this.valTo = this.to;

    options.onStart(this.getOptions());
  }


  set setFrom(val: number) {
    this.fromP = val;
    this.valFrom = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeFrom({
      fromP: val,
      valFrom: this.valFrom
    });

    if (!this.fromStartFl) {
      //console.log('setFrom');
      this.onChange(this.getOptions());
    }
    this.fromStartFl = false;
  }

  set setTo(val: number) {
    this.toP = val;
    this.valTo = +(this.min + (val * this.valP)).toFixed(0);
    this.onChangeTo({
      toP: val,
      valTo: this.valTo
    });

    if (!this.toStartFl) {
      //console.log('setTo');
      this.onChange(this.getOptions());
    }
    this.toStartFl = false;
  }

  get getFrom() {
    return this.fromP;
  }

  get getTo() {
    return this.toP;
  }


  setOptions(options: RangeSliderOptions) {

    const key = Object.keys(options);
    const val = Object.values(options);


    for (let i = 0; i < key.length; i++) {
      switch (key[i]) {
        case 'type':
          this.type = val[i];
          break;

        case 'orientation':
          this.orientation = val[i];
          break;

        case 'theme':
          this.theme = val[i];
          break;

        case 'min':
          this.min = val[i];
          break;

        case 'max':
          this.max = val[i];
          break;

        case 'from':
          this.from = val[i];
          break;

        case 'to':
          this.to = val[i];
          break;

        case 'grid':
          this.grid = val[i];
          break;

        case 'gridSnap':
          this.gridSnap = val[i];
          break;

        case 'tipPrefix':
          this.tipPrefix = val[i];
          break;

        case 'gridNum':
          this.gridNum = val[i];
          break;
        case 'gridStep':
          this.gridStep = val[i];
          break;
        default:
          break;
      }
    }

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
      fromX: this.getFrom,
      toX: this.getTo,
      valFrom: this.valFrom,
      valTo: this.valTo,
      tipPrefix: this.tipPrefix,
      grid: this.grid,
      gridSnap: this.gridSnap,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
    };
  }

  getRange() {
    return this.max - this.min;
  }

  calcPosition(fromWidth: number, wrapWidth: number) {

    this.wrapWidth = wrapWidth;
    this.dotP = fromWidth * 100 / wrapWidth; // XXXXXXXXXXXXXXXXXXX

    this.valP = this.getRange() / 100;                  // один процент
    // this.stepP = this.step / this.valP;              // количество процентов в шаге
    this.setFrom = (this.from - this.min) / this.valP;  // позиция левой точки в процентах
    this.setTo = (this.to - this.min) / this.valP;      // позиция правой точки в процентах

    this.limitFrom = this.getFrom;
    this.limitTo = this.getTo;
  }


  calcGridNumStep() {
    let interval = 0;
    let step = 0;

    if (this.gridStep && this.gridNum == 4) {     // если задан Шаг а интервал по умолчанию стоит
      step = this.gridStep;
      interval = this.getRange() / step;          // находим новый интервал
    } else {                                      // делаем только по интервалу
      interval = this.gridNum;
      step = this.getRange() / interval;          // находим шаг
    }

    this.gridStep = step;
    this.gridNum = interval;

    return interval;
  }

  calcPositionGrid(value: number) {
    value = value + this.gridStep;
    const position = ((value - this.min) * 100) / this.getRange();
    return { value, position };
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



  calcPositionBar() {
    let barX = 0;
    let widthBar = 0;

    if (this.type == 'double') {
      barX = this.getFrom;
      widthBar = this.getTo - this.getFrom;
    } else {
      widthBar = this.getFrom;
    }

    return { barX, widthBar };
  }


  clickLine = (pointX: number, wrapWidth: number) => {

    this.wrapWidth = wrapWidth;
    const oneP = wrapWidth / 100; // один процент от всей школы
    const pointP = pointX / oneP; // кол. процентов в области где кликнули

    if (this.type == 'single') {
      this.setFrom = pointP;
    }
    else if (pointP > this.getTo) {       // если это значение больше чем To
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