import { RangeSliderOptions } from '../../glob-interface';
import { CalcDotPositionOpt, PROP } from './model.d';
import { Observer } from '../../observer';

class Model extends Observer {

  // --- данные конфига
  private type: string;
  private orientation: string;
  private theme: string;
  private min: number;
  private max: number;
  private from: number;
  private to: number;
  private step: number;
  private keyStepOne: number;
  private keyStepHold: number;
  private bar: boolean;
  private tipPrefix: string;
  private tipPostfix: string;
  private tipMinMax: boolean;
  private tipFromTo: boolean;
  private gridSnap: boolean;
  private gridNum: number;
  private gridStep: number;
  private gridRound: number;
  private grid: boolean;
  private disabled: boolean;
  private defaultData: RangeSliderOptions;

  // --- внутренние данные. 
  private valP: number;
  private fromP: number;
  private toP: number;
  private limitFrom: number;
  private limitTo: number;
  private wrapWH: number;
  private snapNum: number[] = [];
  private stepNum: number[] = [];
  private stepGrid: number;
  private MAX_VAL = 999999999999999;
  private MIN_VAL = -999999999999999;
  private startConfFl: boolean;
  private ubdateConfFl: boolean;
  onHandle: Function;
  onChange: Function;
  onUpdate: Function;
  onStart: Function;
  onReset: Function;


  constructor(options: RangeSliderOptions) {
    super();
    this.createProperties(this.defaultConfig(options));
  }


  private defaultConfig(options: RangeSliderOptions) {

    this.startConfFl = false;
    this.ubdateConfFl = false;

    return Object.assign({
      type: 'single',   // тип - одна или две точки
      orientation: 'horizontal',  // положение слайдера
      theme: 'base',    // тема слайдера
      min: 0,           // минимальное значение на школе
      max: 10,          // максимальное значение на школе
      from: 1,          // позиция первой точки
      to: 2,            // позиция второй точки
      step: 0,           // Шаг для ползунков
      keyStepOne: 0,    // Шаг при нажатии кнопки с клавиатуры
      keyStepHold: 0,   // Шаг при удержании кнопки с клавиатуры
      bar: false,       // Показать или скрыть полусу диапазона
      tipPrefix: '',    // Префикс для подсказок не больше 15 символов.
      tipPostfix: '',   // Префикс для подсказок не больше 15 символов.
      tipMinMax: true,  // подсказки включены
      tipFromTo: true,  // подсказки точек включены
      grid: false,      // Шкала выключена
      gridSnap: false,  // точка переходит по ризкам на Шкале
      gridNum: 0,       // интервал в шкале
      gridStep: 0,      // Шаг шкалы
      gridRound: 0,     // округление дробной части
      disabled: false,  // Включен или Выключен.
    }, options);
  }


  private createProperties(options: RangeSliderOptions) {


    this.onHandle = async () => {
      // eslint-disable-next-line no-unused-vars
      const emptyFun = (data: RangeSliderOptions) => { };

      this.onChange = options.onChange ?? emptyFun;
      this.onUpdate = options.onUpdate ?? emptyFun;
      this.onStart = options.onStart ?? emptyFun;
      this.onReset = options.onReset ?? emptyFun;

      await this.update(options);

      this.defaultData = await this.getOptions();
      await this.notifyOB({
        key: 'Start',
        ...this.defaultData,
      });

      await this.onStart(this.defaultData);
    };

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
      keyStepOne: this.keyStepOne,
      keyStepHold: this.keyStepHold,
      bar: this.bar,
      tipPrefix: this.tipPrefix,
      tipPostfix: this.tipPostfix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
      grid: this.grid,
      gridSnap: this.gridSnap,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
      disabled: this.disabled,
    };
  }


  private getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }


  private setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
  }


  reset() {

    const op = this.defaultData;

    if (this.startConfFl)
      this.onReset(this.defaultData);

    let opKey = Object.keys(op);
    for (let key of opKey) {
      const val = this.getProperty(op, key as keyof RangeSliderOptions);
      this.setProperty(this, key as keyof Model, val as this[keyof Model]);
    }

    const keysMap = [
      'RangeData',
      'Step',
      'DotData',
      'GridSnapData',
      'GridData',
      'ThemeData',
      'HintsData',
      'DisabledData',
      'BarData',
      'OrientationData',
      'Start'
    ];

    for (let key of keysMap) {
      this.notifyOB({
        key: key,
        ...op,
      });
    }

  }


  async update(options: RangeSliderOptions) {

    this.ubdateConfFl = true;

    await this.setRangeData(options);
    await this.setStep(options);
    await this.setDotData(options);
    await this.setGridData(options);
    await this.setGridSnapData(options);
    await this.setThemeData(options);
    await this.setBarData(options);
    await this.setDisabledData(options);
    await this.setHintsData(options);
    await this.setOrientationData(options);

    if (this.startConfFl)
      this.onUpdate(this.getOptions());
    this.startConfFl = true;
    this.ubdateConfFl = false;
  }


  private propertiesValidation(properties: string[], obj: RangeSliderOptions) {
    const prop = properties as Array<keyof typeof obj>;
    let flag = false;
    for (let item of prop) {
      const dataT = obj[item] ?? null;
      if (dataT != null) {
        flag = true;
        break;
      }
    }
    if (!flag) return false;
    return true;
  }


  private isEmptu(data: PROP) {
    return (data ?? null) != null ? true : false;
  }


  private checkValue(data: PROP, str: string) {
    const _this = this;
    const key = str as keyof typeof _this;
    const val = this[key];
    const valF = (val ?? null) != null ? true : false;
    if (!this.isEmptu(data)) {
      return valF ? val : null;
    }
    return data;
  }


  private setRangeData(options: RangeSliderOptions): boolean {
    const properties = ['min', 'max'];
    if (!this.propertiesValidation(properties, options)) return false;

    let min: PROP = options.min;
    let max: PROP = options.max;

    min = this.checkValue(min, 'min') as PROP;
    if (min == null) return false;

    max = this.checkValue(max, 'max') as PROP;
    if (max == null) return false;

    if (min < this.MIN_VAL || max > this.MAX_VAL) return false;

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    // нужно првоерять чно новые данные отличаються от тех которые есть в модели.
    if (min != this.min || max != this.max) {
      this.min = +min;
      this.max = +max;

      if (this.max < this.to)
        this.to = this.max;

      if (this.max < this.from)
        this.from = this.max;

      if (this.min > this.to)
        this.to = this.min;

      if (this.min > this.from)
        this.from = this.min;

      this.notifyOB({
        key: 'RangeData',
        min: this.min,
        max: this.max,
      });

      // если обновили Диапазон то пересчитать все зависимые данные.
      if (this.ubdateConfFl) {
        this.setDotData({
          from: this.from,
          to: this.to,
        });
      }
      return true;
    }
    return false;
  }


  private setStep(options: RangeSliderOptions): boolean {
    const properties = ['step', 'keyStepOne', 'keyStepHold'];
    if (!this.propertiesValidation(properties, options)) return false;

    let step: PROP = options.step;
    let keyStepOne: PROP = options.keyStepOne;
    let keyStepHold: PROP = options.keyStepHold;

    step = this.checkValue(step, 'step') as PROP;
    if (step == null)
      step = 0;

    keyStepOne = this.checkValue(keyStepOne, 'keyStepOne') as PROP;
    if (keyStepOne == null)
      keyStepOne = 0;

    keyStepHold = this.checkValue(keyStepHold, 'keyStepHold') as PROP;
    if (keyStepHold == null)
      keyStepHold = 0;

    const validMaxMin = (val: number) => {
      if (val > this.max) return this.max;
      if (val < 0) return 0;
      return val;
    };

    this.step = validMaxMin(+step);
    this.keyStepOne = validMaxMin(+keyStepOne);
    this.keyStepHold = validMaxMin(+keyStepHold);

    this.notifyOB({
      key: 'Step',
      step: this.step,
      keyStepOne: this.keyStepOne,
      keyStepHold: this.keyStepHold,
    });

    return false;
  }


  private setDotData(options: RangeSliderOptions): boolean {
    const properties = ['type', 'from', 'to'];
    if (!this.propertiesValidation(properties, options)) return false;

    let type: PROP = options.type;
    let from: PROP = options.from;
    let to: PROP = options.to;

    // проверяем что необходимые нам данные есть.
    if (!this.isEmptu(this.min)) return false;
    if (!this.isEmptu(this.max)) return false;

    if (type == 'single' || type == 'double') {
      this.type = type;
    } else {
      if (this.isEmptu(this.type)) {
        type = this.type;
      } else return false;
    }

    from = this.checkValue(from, 'from') as PROP;
    if (from == null) return false;

    if (from >= this.min && from <= this.max) {
      this.from = +from;
    } else {
      if (from < this.min)
        this.from = this.min;

      if (from > this.max)
        this.from = this.max;
    }

    if (type == 'double') // проверяем from и to 
    {
      to = this.checkValue(to, 'to') as PROP;
      if (to == null) return false;

      if (from > to) {
        const temp = from;
        from = to;
        to = temp;
      }

      if (to <= this.max) {
        this.to = to as number;
      } else {
        this.to = this.max;
      }
    }

    if (!this.startConfFl && !this.ubdateConfFl)
      if (this.gridSnap && !this.step) {
        this.from = this.getValStep(this.from, this.stepGrid, this.snapNum);
        if (type == 'double')
          this.to = this.getValStep(this.to, this.stepGrid, this.snapNum);
      }

    this.notifyOB({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

    if (this.startConfFl && !this.ubdateConfFl)
      this.onChange(this.getOptions());

    return true;
  }


  private setGridSnapData(options: RangeSliderOptions): boolean {
    const properties = ['gridSnap'];
    if (!this.propertiesValidation(properties, options)) {
      if (this.gridSnap == undefined)
        this.gridSnap = false;
      return false;
    }

    if (!this.grid)
      this.gridSnap = false;
    else
      this.gridSnap = options.gridSnap;

    this.notifyOB({
      key: 'GridSnapData',
      gridSnap: this.gridSnap,
    });
    return true;
  }


  private setGridData(options: RangeSliderOptions): boolean {
    const properties = ['grid', 'gridNum', 'gridStep', 'gridRound'];
    if (!this.propertiesValidation(properties, options)) return false;

    let grid: PROP = options.grid;
    let gridNum: PROP = options.gridNum;
    let gridStep: PROP = options.gridStep;
    let gridRound: PROP = options.gridRound;

    grid = this.checkValue(grid, 'grid') as PROP ?? false;
    this.grid = Boolean(grid);

    if (!this.isEmptu(this.min) || !this.isEmptu(this.max)) return false;

    gridNum = this.checkValue(gridNum, 'gridNum') as PROP ?? 0;
    gridStep = this.checkValue(gridStep, 'gridStep') as PROP ?? 0;
    gridRound = this.checkValue(gridRound, 'gridRound') as PROP ?? 0;

    const long = this.max - this.min;

    if (gridStep > long) {
      gridStep = long;
    }

    if (!gridNum && !gridStep) {
      gridNum = 4;
    }

    if (gridRound < 0 || gridRound > 100) {
      gridRound = 0;
    }

    this.gridRound = +gridRound;
    this.gridNum = +gridNum;
    this.gridStep = +gridStep;

    if (!this.grid) {
      if (this.gridSnap) {
        this.gridSnap = false;
        this.notifyOB({
          key: 'GridSnapData',
          gridSnap: this.gridSnap,
        });
      }
    }

    this.notifyOB({
      key: 'GridData',
      grid: this.grid,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
    });

    return true;
  }


  private setOrientationData(options: RangeSliderOptions): boolean {
    const properties = ['orientation'];
    if (!this.propertiesValidation(properties, options)) return false;

    const orientation = options.orientation.replace(/\s/g, '');

    if (orientation == 'horizontal' || orientation == 'vertical') {
      this.orientation = orientation;
    } else return false;

    this.notifyOB({
      key: 'OrientationData',
      orientation: this.orientation,
    });

    return true;
  }


  private setThemeData(options: RangeSliderOptions): boolean {
    const properties = ['theme'];
    if (!this.propertiesValidation(properties, options)) return false;

    const theme = options.theme.replace(/\s/g, '');

    if (theme.length <= 20) {
      this.theme = theme;
    } else {
      console.log('параметр theme - превышает допустимое ' +
        'количество символов (макс - 20)');
    }

    this.notifyOB({
      key: 'ThemeData',
      theme: this.theme,
    });

    return true;
  }


  private setHintsData(options: RangeSliderOptions): boolean {
    const properties = ['tipPrefix', 'tipPostfix', 'tipMinMax', 'tipFromTo'];
    if (!this.propertiesValidation(properties, options)) return false;

    let tipPrefix: PROP = options.tipPrefix;
    let tipPostfix: PROP = options.tipPostfix;
    let tipMinMax: PROP = options.tipMinMax;
    let tipFromTo: PROP = options.tipFromTo;

    tipPostfix = this.checkValue(tipPostfix, 'tipPostfix') as PROP;
    if (tipPostfix != null) {
      this.tipPostfix = String(tipPostfix).replace(/\s/g, '').substr(0, 15);
    } else {
      this.tipPostfix = '';
    }

    tipPrefix = this.checkValue(tipPrefix, 'tipPrefix') as PROP;
    if (tipPrefix != null) {
      this.tipPrefix = String(tipPrefix).replace(/\s/g, '').substr(0, 15);
    } else {
      this.tipPrefix = '';
    }

    tipMinMax = this.checkValue(tipMinMax, 'tipMinMax') as PROP;
    if (tipMinMax != null) {
      this.tipMinMax = tipMinMax as boolean;
    } else {
      this.tipMinMax = true;
    }

    tipFromTo = this.checkValue(tipFromTo, 'tipFromTo') as PROP;
    if (tipFromTo != null) {
      this.tipFromTo = tipFromTo as boolean;
    } else {
      this.tipFromTo = true;
    }


    this.notifyOB({
      key: 'HintsData',
      tipPrefix: this.tipPrefix,
      tipPostfix: this.tipPostfix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
      min: this.min,
      max: this.max,
      from: this.from,
      to: this.to,
      type: this.type,
    });

    return true;
  }


  private setDisabledData(options: RangeSliderOptions): boolean {
    const properties = ['disabled'];
    if (!this.propertiesValidation(properties, options)) {
      if (this.disabled == undefined)
        this.disabled = false;
      return false;
    }

    this.disabled = options.disabled;

    this.notifyOB({
      key: 'DisabledData',
      disabled: this.disabled,
    });

    return true;
  }


  private setBarData(options: RangeSliderOptions): boolean {
    const properties = ['bar'];
    if (!this.propertiesValidation(properties, options)) {
      if (this.bar == undefined)
        this.bar = false;
      return false;
    }

    this.bar = options.bar;

    this.notifyOB({
      key: 'BarData',
      bar: this.bar,
    });

    return true;
  }

  //---------------------------------------------

  private getRange() {
    return this.max - this.min;
  }


  calcOnePercent() {
    this.valP = this.getRange() / 100;
  }


  //---------------------------------- Handle
  getDataDotFrom() {
    return +(this.min + (this.fromP * this.valP)).toFixed(0);
  }


  getDataDotTo() {
    return +(this.min + (this.toP * this.valP)).toFixed(0);
  }


  calcPositionDotFrom() {
    this.fromP = (this.from - this.min) / this.valP;  // позиция левой точки в процентах
    this.limitFrom = this.fromP;
    return this.fromP;
  }


  calcPositionDotTo() {
    this.toP = (this.to - this.min) / this.valP;      // позиция правой точки в процентах
    this.limitTo = this.toP;
    return this.toP;
  }


  setWrapWH(val: number) {
    this.wrapWH = val;
  }


  calcDotPosition(options: CalcDotPositionOpt) {
    let fromFl = false;
    let toFl = false;
    const typeFrom = options.type == 'From';

    this.setWrapWH(options.wrapWH);

    const vertical = this.orientation == 'vertical';
    const dotXY = options.clientXY - options.shiftXY;
    let num = 0;

    if (vertical) {
      num = options.position - dotXY;
    } else {
      num = dotXY - options.position;
    }

    let percent = num * 100 / this.wrapWH;

    if (typeFrom) {
      this.limitFrom = percent;
    }
    else {
      this.limitTo = percent;
    }

    const limitDot = !(this.limitFrom > this.limitTo);

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const typeF = this.type == 'single';

    if (typeF) {  // если одна точка
      this.fromP = percent;
      fromFl = true;
    } else if (limitDot) { // если две точки и from меньше to
      // в зависемости от того какая точка движется
      if (typeFrom) {
        this.fromP = percent;
        fromFl = true;
      }
      else {
        this.toP = percent;
        toFl = true;
      }
    }
    else { // если from больше to
      // берём значения точки к которой подъезжаем в плотную.
      if (typeFrom)
        this.fromP = this.toP;
      else
        this.toP = this.fromP;

      fromFl = true;
      toFl = true;
    }

    let from: number;
    let to: number;

    if (fromFl) {
      from = this.getDataDotFrom(); // получаем значение from
    }

    if (toFl) {
      to = this.getDataDotTo(); // получаем значение to
    }

    if (this.gridSnap && !this.step) {
      if (fromFl)
        from = this.getValStep(from, this.stepGrid, this.snapNum);
      if (!typeF && toFl)
        to = this.getValStep(to, this.stepGrid, this.snapNum);
    }

    let signF = '';
    if (this.from < from && fromFl) signF = 'right';
    if (this.to < to && toFl) signF = 'right';
    if (this.from > from && fromFl) signF = 'left';
    if (this.to > to && toFl) signF = 'left';
    if (signF == '') return false;

    if (this.step) {
      if (fromFl)
        from = this.getValStep(from, this.step, this.stepNum);
      if (!typeF && toFl)
        to = this.getValStep(to, this.step, this.stepNum);
    }

    this.setDotData({
      from: from,
      to: to,
    });
    return true;
  }


  calcStep() {
    if (!this.step) return false;

    let mas: number[] = [];
    let kol = this.min + this.step;
    mas.push(this.min);
    for (let i = this.min; i < this.max; i++) {
      if (kol == i) {
        mas.push(kol);
        kol += this.step;
      }
    }
    mas.push(this.max);
    this.stepNum = mas;
    return true;
  }


  //---------------------------------- Hints

  private calcWidthP(width: number) {
    return (width * 100 / this.wrapWH) / 2;
  }


  calcPositionTipFrom = (tipFrom: number) => {
    const tipFromP = this.calcWidthP(tipFrom - 4);
    const tipFromXY = this.fromP - tipFromP;
    return tipFromXY;
  }


  calcPositionTipTo = (tipTo: number) => {
    const tipToP = this.calcWidthP(tipTo - 4);
    const tipToXY = this.toP - tipToP;
    return tipToXY;
  }


  calcPositionTipSingle = (singleWH: number) => {
    const line = (this.toP - this.fromP) / 2;
    const centerFromTo = this.fromP + line;
    const tipSingleP = this.calcWidthP(singleWH);
    const center = centerFromTo - tipSingleP;
    return center;
  }

  //---------------------------------- Grid
  private calcGridNumStep() {
    let interval = 0;
    let step = 0;

    if (this.gridStep && !this.gridNum) {     // если задан Шаг а интервал по умолчанию стоит
      step = this.gridStep;
      interval = this.getRange() / step;          // находим новый интервал
    } else {                                      // делаем только по интервалу
      interval = this.gridNum;
      step = (this.max - this.min) / interval;    // находим шаг
    }

    return { interval, step };
  }


  createMark() {
    const range = this.getRange();
    let masMark: {
      val: number,
      position: number,
    }[] = [];

    const calcPositionGrid = (value: number, step: number) => {
      value = value + step;
      const position = ((value - this.min) * 100) / range;
      return { value, position };
    };

    const notify = (valueG: number, position: number) => {
      const val = +valueG.toFixed(this.gridRound);
      masMark.push({ val, position });
    };

    notify(this.min, 0);
    const { interval, step } = this.calcGridNumStep();
    let obj = calcPositionGrid(this.min, step);
    notify(obj.value, obj.position);

    for (let i = 1; i < interval - 1; i++) {
      obj = calcPositionGrid(obj.value, step);
      notify(obj.value, obj.position);
    }
    notify(this.max, 100);

    this.notifyOB({
      key: 'CreateGrid',
      valMark: masMark,
    });
  }

  //---------------------------------- Bar
  calcPositionBar() {
    let barX = 0;
    let widthBar = 0;
    if (this.type == 'double') {
      barX = this.fromP;
      widthBar = this.toP - this.fromP;
    } else {
      widthBar = this.fromP;
    }
    return { barX, widthBar };
  }

  clickBar = (pointXY: number) => {
    const vertical = this.orientation == 'vertical';
    const oneP = this.wrapWH / 100; // один процент от всей школы

    const verticalC = (valP: number) => {
      let remainderP = 100 - valP;
      pointXY = remainderP * oneP + pointXY;
      this.clickLine(pointXY);
    };

    if (this.type == 'single') {
      if (vertical)
        verticalC(this.fromP);
      else
        this.clickLine(pointXY);
    } else {
      if (vertical)
        verticalC(this.toP);
      else
        this.clickLine(this.fromP * oneP + pointXY);
    }
  }

  clickMark = (value: number) => {
    let from = this.from;
    let to = this.to;

    if (this.type == 'single') {
      from = value;
    }
    else if (value > to) {       // если это значение больше чем To
      to = value;                // To  на эту точку
    } else if (value > from) {   // если меньше To то больше From
      const To = to - value;     // из To вычетаем Val
      const From = value - from; // из Val вычетаем From
      From > To ? to = value : from = value; // то число что меньше та точка и ближе
    } else {                              // Если Val меньше From то подвигать From
      from = value;
    }

    this.setDotData({
      type: this.type,
      from: from,
      to: to,
    });
  }


  //---------------------------------- Line
  clickLine = (pointXY: number) => {
    const vertical = this.orientation == 'vertical';
    let from = this.from;
    let to = this.to;
    let fromFl = false;
    let toFl = false;

    const oneP = this.wrapWH / 100; // один процент от всей школы
    let pointP = 0;

    if (vertical) {
      pointP = 100 - (pointXY / oneP); // кол. процентов в области где кликнули
    } else {
      pointP = pointXY / oneP; // кол. процентов в области где кликнули
    }

    if (this.type == 'single') {
      this.fromP = pointP;
      fromFl = true;
    }
    else if (pointP > this.toP) {       // если это значение больше чем To
      this.toP = pointP;                // To  на эту точку
      toFl = true;
    } else if (pointP > this.fromP) {   // если меньше To то больше From
      const To = this.toP - pointP;     // из To вычетаем Val
      const From = pointP - this.fromP; // из Val вычетаем From
      From > To ? this.toP = pointP : this.fromP = pointP; // то число что меньше та точка и ближе
      From > To ? toFl = true : fromFl = true;
    } else {                              // Если Val меньше From то подвигать From
      this.fromP = pointP;
      fromFl = true;
    }

    if (fromFl) {
      from = this.getDataDotFrom(); // получаем значение from
    }

    if (toFl) {
      to = this.getDataDotTo(); // получаем значение to
    }

    this.setDotData({
      type: this.type,
      from: from,
      to: to,
    });
  }


  getValStep(val: number, step: number, mas: number[]) {
    for (let i = 0; i < mas.length; i++) {
      const item = mas[i];
      if (val < item) {
        const ost = step - (item - val);
        return ost < step / 2 ?
          mas[i ? i - 1 : i] : item;
      }
    }
    return val;
  }


  snapDot() {
    if (!this.gridSnap) return false;

    this.from = this.getValStep(this.from, this.stepGrid, this.snapNum);

    if (this.type == 'double') {
      this.to = this.getValStep(this.to, this.stepGrid, this.snapNum);
    }

    this.notifyOB({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

    this.onChange(this.getOptions());
    return true;
  }

  calcSnap = (snapNum: number[]) => {
    this.snapNum = [];
    this.snapNum.push(this.min, ...snapNum, this.max);
    this.stepGrid = this.snapNum[1] - this.snapNum[0];

    this.snapDot();
  }


  calcKeyDown(repeat: boolean, sign: string, dot: string) {
    let from = this.from;
    let to = this.to;
    const signF = sign == '+';
    const dotF = dot == 'from';
    const typeF = this.type == 'double';
    const keyF = !this.keyStepOne && !this.keyStepHold;

    if (this.gridSnap && !this.step && keyF) {

      const prev = this.snapNum[this.snapNum.length - 2];

      const value = (i: number) => {
        const val = this.snapNum[!signF ? i - 2 : i];
        dotF ? from = val : to = val;
      };

      const moveFrom = (item: number, i: number) => {
        if (from < item && dotF) {
          if (from == to && signF && typeF) return false;
          value(i);
          return false;
        }
        else if (from == this.min) {
          if (signF) {
            from = this.snapNum[1];
            return false;
          }
        } else if (from == this.max) {
          if (!signF) {
            from = prev;
            return false;
          }
        }
        return true;
      };

      const moveTo = (item: number, i: number) => {
        if (to < item && !dotF) {
          value(i);
          return false;
        } else if (to == this.max) {
          if (!signF) {
            to = prev;
            return false;
          }
        }
        return true;
      };

      for (let i = 0; i < this.snapNum.length; i++) {
        const item = this.snapNum[i];
        if (!moveFrom(item, i)) break;
        if (!moveTo(item, i)) break;
      }
    } else {
      const value = (step: number) => {
        if (dotF) {
          from = !signF ? from - step : from + step;
        } else {
          to = !signF ? to - step : to + step;
        }
        if (this.type == 'double') {
          if (from > to && dotF) from = to;
          if (from > to && !dotF) to = from;
        }
      };

      if (!keyF) {
        if (!this.keyStepOne && this.keyStepHold) {
          this.keyStepOne = 1;
        }
        if (!this.keyStepHold && this.keyStepOne) {
          this.keyStepHold = this.keyStepOne;
        }
        repeat ? value(this.keyStepHold) : value(this.keyStepOne);
      } else if (this.step) {
        value(this.step);
      } else {
        value(1);
      }
    }

    this.setDotData({
      from: from,
      to: to,
    });
  }

}



export { Model };