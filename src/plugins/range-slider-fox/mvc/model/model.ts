import { RangeSliderOptions, CalcDotPositionOpt, PROP } from './model.d';
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

  private MAX_VAL = 999999999999999;
  private MIN_VAL = -999999999999999;


  // private fromStartFl: boolean;
  // private toStartFl: boolean;

  private startConfFl: boolean;
  private ubdateConfFl: boolean;

  // onChangeFrom: Function;
  // onChangeTo: Function;
  onChange: Function;
  onUpdate: Function;
  onStart: Function;
  onReset: Function;


  //options: RangeSliderOptions;

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
      bar: false,
      tipPrefix: '',    // Префикс для подсказок не больше 3 символов.
      tipPostfix: '',
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

    // eslint-disable-next-line no-unused-vars
    const emptyFun = (data: RangeSliderOptions) => { };

    this.onChange = options.onChange ?? emptyFun;
    this.onUpdate = options.onUpdate ?? emptyFun;
    this.onStart = options.onStart ?? emptyFun;
    this.onReset = options.onStart ?? emptyFun;

    this.update(options);

    this.defaultData = this.getOptions();
    this.onStart(this.defaultData);

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

  reset() {
    const op = this.defaultData;

    if (this.startConfFl)
      this.onReset(this.defaultData);

    this.type = op.type;
    this.orientation = op.orientation;
    this.theme = op.theme;
    this.min = op.min;
    this.max = op.max;
    this.to = op.to;
    this.bar = op.bar;
    this.from = op.from;
    this.tipPrefix = op.tipPrefix;
    this.tipMinMax = op.tipMinMax;
    this.tipFromTo = op.tipFromTo;
    this.grid = op.grid;
    this.gridSnap = op.gridSnap;
    this.gridNum = op.gridNum;
    this.gridStep = op.gridStep;
    this.gridRound = op.gridRound;
    this.disabled = op.disabled;

    this.notifyOB({
      key: 'RangeData',
      min: op.min,
      max: op.max,
    });

    this.notifyOB({
      key: 'DotData',
      type: op.type,
      from: op.from,
      to: op.to,
    });

    this.notifyOB({
      key: 'GridSnapData',
      gridSnap: op.gridSnap,
    });

    this.notifyOB({
      key: 'GridData',
      grid: op.grid,
      gridNum: op.gridNum,
      gridStep: op.gridStep,
      gridRound: op.gridRound,
    });



    this.notifyOB({
      key: 'ThemeData',
      theme: op.theme,
    });

    this.notifyOB({
      key: 'HintsData',
      tipPrefix: op.tipPrefix,
      tipMinMax: op.tipMinMax,
      tipFromTo: op.tipFromTo,
      min: op.min,
      max: op.max,
      from: op.from,
      to: op.to,
      type: op.type,
    });

    this.notifyOB({
      key: 'DisabledData',
      disabled: op.disabled,
    });

    this.notifyOB({
      key: 'BarData',
      bar: op.bar,
    });

    this.notifyOB({
      key: 'OrientationData',
      orientation: op.orientation,
    });

  }

  update(options: RangeSliderOptions) {
    this.ubdateConfFl = true;

    this.setRangeData(options);
    this.setDotData(options);
    this.setGridData(options);
    this.setGridSnapData(options);
    this.setThemeData(options);
    this.setHintsData(options);
    this.setDisabledData(options);
    this.setBarData(options);
    this.setOrientationData(options);


    // при первом старте не вызываем
    if (this.startConfFl)
      this.onUpdate(this.getOptions());
    this.startConfFl = true;
    this.ubdateConfFl = false;
  }


  propertiesValidation(properties: string[], obj: RangeSliderOptions) {
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


  isEmptu(data: PROP) {
    return (data ?? null) != null ? true : false;
  }

  checkValue(data: PROP, str: string) {
    const _this = this;
    const key = str as keyof typeof _this;
    const val = this[key];
    const valF = (val ?? null) != null ? true : false;
    if (!this.isEmptu(data)) {
      return valF ? val : null;
    }
    return data;
  }



  /*
  min: 0,  // минимальное значение на школе
  max: 10, // максимальное значение на школе

  -проверяем что эти свойства есть и они не пустые
  если нет не одного свойства то return false;
  если одно свойство есть а другого нет то ищим 
  в свойствах Модели - проверяем есть ли данные там
  если есть то Валид. если нет То return false;
  -проверяем на предельно допустимые значения. 
  -Проверяем что min меньше max.
*/
  setRangeData(options: RangeSliderOptions): boolean {

    const properties = ['min', 'max'];
    // проверяем есть ли вообще для нас обнавления 
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

      // вызываем оповещение подписчиков
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




  /*
  
    type: 'single',   // тип - одна или две точки
    from: 1,          // позиция первой точки
    to: 2,            // позиция второй точки

    -проверяем на существование данных
    -проверяем что type корректный

    --для одной точки
    смотрим что бы from был больше min и меньше max

    --для двух точек
    смотрим что бы from был меньше чем to 
    если нет то поменять их значения местами

    -проверяем что точки не выходят за границы
  */
  setDotData(options: RangeSliderOptions): boolean {

    const properties = ['type', 'from', 'to'];
    // проверяем есть ли вообще для нас обнавления 
    if (!this.propertiesValidation(properties, options)) return false;

    let type: PROP = options.type;
    let from: PROP = options.from;
    let to: PROP = options.to;

    // проверяем что необходимые нам данные есть.
    if (!this.isEmptu(this.min)) return false;
    if (!this.isEmptu(this.max)) return false;

    // ещё проверять что this.type != type иначе зачем перезаписывать

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

    // вызываем оповещение подписчиков

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





  // gridSnap: false,  // точка переходит по ризкам на Шкале
  setGridSnapData(options: RangeSliderOptions): boolean {

    const properties = ['gridSnap'];
    // проверяем есть ли вообще для нас обнавления 

    if (!this.propertiesValidation(properties, options)) {
      if (this.gridSnap == undefined)
        this.gridSnap = false;
      return false;
    }

    this.gridSnap = options.gridSnap;

    // console.log('gridSnap: ' + this.gridSnap);


    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'GridSnapData',
      gridSnap: this.gridSnap,
    });
    return true;
  }


  /*
  
  grid: false,      // Шкала выключена
  gridNum: 4,       // интервал в шкале
  gridStep: 0,      // Шаг шкалы 

  нужно проверять есть ли данные в min max - потому что без них не построить.

gridStep - не должен привышать max - min = 

gridNum >= 1

  */
  setGridData(options: RangeSliderOptions): boolean {

    const properties = ['grid', 'gridNum', 'gridStep', 'gridRound'];
    // проверяем есть ли вообще для нас обнавления 
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

    // console.log(gridNum);
    // console.log(gridStep);

    this.gridRound = +gridRound;
    this.gridNum = +gridNum;
    this.gridStep = +gridStep;

    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'GridData',
      grid: this.grid,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      gridRound: this.gridRound,
    });

    return true;
  }


  // orientation: 'horizontal',  // положение слайдера
  setOrientationData(options: RangeSliderOptions): boolean {

    const properties = ['orientation'];
    // проверяем есть ли вообще для нас обнавления 
    if (!this.propertiesValidation(properties, options)) return false;

    const orientation = options.orientation.replace(/\s/g, '');

    if (orientation == 'horizontal' || orientation == 'vertical') {
      this.orientation = orientation;
    } else return false;


    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'OrientationData',
      orientation: this.orientation,
    });

    return true;
  }


  // theme: 'base',    // тема слайдера
  setThemeData(options: RangeSliderOptions): boolean {

    const properties = ['theme'];
    // проверяем есть ли вообще для нас обнавления 
    if (!this.propertiesValidation(properties, options)) return false;

    const theme = options.theme.replace(/\s/g, '');

    if (theme.length <= 20) {
      this.theme = theme;
    } else {
      console.log('параметр theme - превышает допустимое ' +
        'количество символов (макс - 20)');
    }

    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'ThemeData',
      theme: this.theme,
    });

    return true;
  }




  /*
    tipPrefix: '',    // Префикс для подсказок не больше 3 символов.
    tipMinMax?: boolean;
    tipFromTo?: boolean;
  
    tipPrefix - проверяем что он вообще существует, 
    если нет то берём из Модели а если и там нет то не чего не делать с ним
    Если tipPrefix есть то убираем пробелы, укарачиваем до 3 символов.

    tipMinMax - проверяем что он вообще существует, 
    если нет то берём из Модели а если и там нет то устанавливаем значение true;

    tipFromTo - проверяем что он вообще существует, 
    если нет то берём из Модели а если и там нет то устанавливаем значение true;
  */
  setHintsData(options: RangeSliderOptions): boolean {

    const properties = ['tipPrefix', 'tipPostfix', 'tipMinMax', 'tipFromTo'];
    // проверяем есть ли вообще для нас обнавления 
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


    // вызываем оповещение подписчиков
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


  // disabled: false, // Включен или Выключен. 
  setDisabledData(options: RangeSliderOptions): boolean {

    const properties = ['disabled'];
    // проверяем есть ли вообще для нас обнавления 

    if (!this.propertiesValidation(properties, options)) {
      if (this.disabled == undefined)
        this.disabled = false;
      return false;
    }

    this.disabled = options.disabled;

    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'DisabledData',
      disabled: this.disabled,
    });

    return true;
  }



  // bar: false, // Включен или Выключен. 
  setBarData(options: RangeSliderOptions): boolean {

    const properties = ['bar'];
    // проверяем есть ли вообще для нас обнавления 

    if (!this.propertiesValidation(properties, options)) {
      if (this.bar == undefined)
        this.bar = false;
      return false;
    }

    this.bar = options.bar;

    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'BarData',
      bar: this.bar,
    });

    return true;
  }


  //---------------------------------------------

  getRange() {
    return this.max - this.min;
  }

  calcOnePercent() {
    this.valP = this.getRange() / 100;  // один процент
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

    this.setDotData({
      from: from,
      to: to,
    });
  }


  //---------------------------------- Hints


  calcWidthP(width: number) {
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
  calcGridNumStep() {
    let interval = 0;
    let step = 0;
    // console.log('gridStep: ' + this.gridStep);

    if (this.gridStep && !this.gridNum) {     // если задан Шаг а интервал по умолчанию стоит
      step = this.gridStep;
      interval = this.getRange() / step;          // находим новый интервал
    } else {                                      // делаем только по интервалу
      interval = this.gridNum;
      step = this.getRange() / interval;          // находим шаг
    }

    // console.log({ interval, step });
    return { interval, step };
  }

  createMark() {
    const calcPositionGrid = (value: number, step: number) => {
      value = +(value + step).toFixed(this.gridRound);
      const position = ((value - this.min) * 100) / this.getRange();
      return { value, position };
    };

    const notify = (valueG: number, position: number) => {
      this.notifyOB({
        key: 'CreateGrid',
        valueG: valueG,
        position: position,
      });
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

    if (this.type == 'single') {
      if (vertical) {
        let remainderP = 100 - this.fromP;
        pointXY = remainderP * oneP + pointXY;
        this.clickLine(pointXY);
      } else {
        this.clickLine(pointXY);
      }
    } else {
      if (vertical) {
        let remainderP = 100 - this.toP;
        pointXY = remainderP * oneP + pointXY;
        this.clickLine(pointXY);
      } else {
        this.clickLine(this.fromP * oneP + pointXY);
      }
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





}



export { Model };