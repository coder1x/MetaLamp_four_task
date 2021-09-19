import { RangeSliderOptions, CalcDotPositionOpt, PROP } from './model.d';
import { Observer, TOB } from '../../observer';



class Model extends Observer {

  // --- данные конфига
  private type: string;
  private orientation: string;
  private theme: string;
  private min: number;
  private max: number;
  private from: number;
  private to: number;
  private tipPrefix: string;
  private tipMinMax: boolean;
  private tipFromTo: boolean;
  private gridSnap: boolean;
  private gridNum: number;
  private gridStep: number;
  private grid: boolean;
  private disabled: boolean;
  private defaultData: RangeSliderOptions;

  // --- внутренние данные. 
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

  private MAX_VAL = 999999999999999;
  private MIN_VAL = -999999999999999;


  // private fromStartFl: boolean;
  // private toStartFl: boolean;

  private startConfFl: boolean;

  // onChangeFrom: Function;
  // onChangeTo: Function;
  onChange: Function;
  onUpdate: Function;
  onStart: Function;


  //options: RangeSliderOptions;

  constructor(options: RangeSliderOptions) {
    super();

    this.createProperties(this.defaultConfig(options));
  }

  private defaultConfig(options: RangeSliderOptions) {

    this.startConfFl = false;

    return Object.assign({
      type: 'single',   // тип - одна или две точки
      orientation: 'horizontal',  // положение слайдера
      theme: 'base',    // тема слайдера
      min: 0,           // минимальное значение на школе
      max: 10,          // максимальное значение на школе
      from: 1,          // позиция первой точки
      to: 2,            // позиция второй точки
      tipPrefix: '',    // Префикс для подсказок не больше 3 символов.
      tipMinMax: true,  // подсказки включены
      tipFromTo: true,  // подсказки точек включены
      grid: false,      // Шкала выключена
      gridSnap: false,  // точка переходит по ризкам на Шкале
      gridNum: 0,       // интервал в шкале
      gridStep: 0,      // Шаг шкалы
      disabled: false,  // Включен или Выключен.
    }, options);
  }

  private createProperties(options: RangeSliderOptions) {

    // eslint-disable-next-line no-unused-vars
    const emptyFun = (data: RangeSliderOptions) => { };

    this.onChange = options.onChange ?? emptyFun;
    this.onUpdate = options.onUpdate ?? emptyFun;
    this.onStart = options.onStart ?? emptyFun;

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
      tipPrefix: this.tipPrefix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
      grid: this.grid,
      gridSnap: this.gridSnap,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
      disabled: this.disabled,
    };
  }

  reset() {
    const op = this.defaultData;
    // тут будут все вызовы нотифая по конфигу
    // которые будут запущены последовательно

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
    });

    this.notifyOB({
      key: 'OrientationData',
      orientation: op.orientation,
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
    });

    this.notifyOB({
      key: 'DisabledData',
      disabled: op.disabled,
    });


  }

  update(options: RangeSliderOptions) {

    this.setRangeData(options);
    this.setDotData(options);
    this.setGridData(options);
    this.setGridSnapData(options);
    this.setOrientationData(options);
    this.setThemeData(options);
    this.setHintsData(options);
    this.setDisabledData(options);

    // при первом старте не вызываем
    if (this.startConfFl)
      this.onUpdate(this.getOptions());
    this.startConfFl = true;
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

      // вызываем оповещение подписчиков
      this.notifyOB({
        key: 'RangeData',
        min: this.min,
        max: this.max,
      });

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
    } else return false;

    if (type == 'double') // проверяем from и to 
    {
      if (from > to) {
        const temp = from;
        from = to;
        to = temp;
      }

      to = this.checkValue(to, 'to') as PROP;
      if (to == null) return false;

      if (to <= this.max) {
        this.to = to as number;
      } else return false;
    }

    // вызываем оповещение подписчиков

    this.notifyOB({
      key: 'DotData',
      type: this.type,
      from: this.from,
      to: this.to,
    });

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

    const properties = ['grid', 'gridNum', 'gridStep'];
    // проверяем есть ли вообще для нас обнавления 
    if (!this.propertiesValidation(properties, options)) return false;

    let grid: PROP = options.grid;
    let gridNum: PROP = options.gridNum;
    let gridStep: PROP = options.gridStep;

    grid = this.checkValue(grid, 'grid') as PROP ?? false;
    this.grid = Boolean(grid);


    if (!this.isEmptu(this.min) || !this.isEmptu(this.max)) return false;

    gridNum = this.checkValue(gridNum, 'gridNum') as PROP ?? 0;
    gridStep = this.checkValue(gridStep, 'gridStep') as PROP ?? 0;

    const long = this.max - this.min;

    if (gridStep > long) {
      gridStep = long;
    }

    if (gridNum && gridStep) {
      gridStep = 0;
    } else if (!gridNum && !gridStep) {
      gridNum = 4;
    }

    this.gridNum = +gridNum;
    this.gridStep = +gridStep;



    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'GridData',
      grid: this.grid,
      gridNum: this.gridNum,
      gridStep: this.gridStep,
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

    const properties = ['tipPrefix', 'tipMinMax', 'tipFromTo'];
    // проверяем есть ли вообще для нас обнавления 
    if (!this.propertiesValidation(properties, options)) return false;

    let tipPrefix: PROP = options.tipPrefix;
    let tipMinMax: PROP = options.tipMinMax;
    let tipFromTo: PROP = options.tipFromTo;

    tipPrefix = this.checkValue(tipPrefix, 'tipPrefix') as PROP;
    if (tipPrefix != null) {
      this.tipPrefix = String(tipPrefix).replace(/\s/g, '').substr(0, 3);
    } else {
      this.tipPrefix = '';
    }

    tipMinMax = this.checkValue(tipMinMax, 'tipMinMax') as PROP;
    if (tipMinMax != null) {
      this.tipMinMax = tipMinMax as boolean;
    } else {
      this.tipMinMax = true;
    }

    tipFromTo = this.checkValue(tipFromTo, 'tipMinMax') as PROP;
    if (tipFromTo != null) {
      this.tipFromTo = tipFromTo as boolean;
    } else {
      this.tipFromTo = true;
    }

    // вызываем оповещение подписчиков
    this.notifyOB({
      key: 'HintsData',
      tipPrefix: this.tipPrefix,
      tipMinMax: this.tipMinMax,
      tipFromTo: this.tipFromTo,
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



  // set setFrom(val: number) {
  //   this.fromP = val;
  //   this.valFrom = +(this.min + (val * this.valP)).toFixed(0);
  //   this.onChangeFrom({
  //     fromP: val,
  //     valFrom: this.valFrom
  //   });

  //   if (!this.fromStartFl) {
  //     //console.log('setFrom');
  //     this.onChange(this.getOptions());
  //   }
  //   this.fromStartFl = false;
  // }

  // set setTo(val: number) {
  //   this.toP = val;
  //   this.valTo = +(this.min + (val * this.valP)).toFixed(0);
  //   this.onChangeTo({
  //     toP: val,
  //     valTo: this.valTo
  //   });

  //   if (!this.toStartFl) {
  //     //console.log('setTo');
  //     this.onChange(this.getOptions());
  //   }
  //   this.toStartFl = false;
  // }

  // get getFrom() {
  //   return this.fromP;
  // }

  // get getTo() {
  //   return this.toP;
  // }


  // // setOptions(options: RangeSliderOptions) {

  // //   const key = Object.keys(options);
  // //   const val = Object.values(options);


  // //   for (let i = 0; i < key.length; i++) {
  // //     switch (key[i]) {
  // //       case 'type':
  // //         this.type = val[i];
  // //         break;

  // //       case 'orientation':
  // //         this.orientation = val[i];
  // //         break;

  // //       case 'theme':
  // //         this.theme = val[i];
  // //         break;

  // //       case 'min':
  // //         this.min = val[i];
  // //         break;

  // //       case 'max':
  // //         this.max = val[i];
  // //         break;

  // //       case 'from':
  // //         this.from = val[i];
  // //         break;

  // //       case 'to':
  // //         this.to = val[i];
  // //         break;

  // //       case 'grid':
  // //         this.grid = val[i];
  // //         break;

  // //       case 'gridSnap':
  // //         this.gridSnap = val[i];
  // //         break;

  // //       case 'tipPrefix':
  // //         this.tipPrefix = val[i];
  // //         break;

  // //       case 'gridNum':
  // //         this.gridNum = val[i];
  // //         break;
  // //       case 'gridStep':
  // //         this.gridStep = val[i];
  // //         break;
  // //       default:
  // //         break;
  // //     }
  // //   }

  // // }

  // getOptions() {
  //   return {
  //     type: this.type,
  //     orientation: this.orientation,
  //     theme: this.theme,
  //     min: this.min,
  //     max: this.max,
  //     to: this.to,
  //     from: this.from,
  //     fromX: this.getFrom,
  //     toX: this.getTo,
  //     valFrom: this.valFrom,
  //     valTo: this.valTo,
  //     tipPrefix: this.tipPrefix,
  //     grid: this.grid,
  //     gridSnap: this.gridSnap,
  //     gridNum: this.gridNum,
  //     gridStep: this.gridStep,
  //   };
  // }

  // getRange() {
  //   return this.max - this.min;
  // }

  // calcPosition(fromWidth: number, wrapWidth: number) {

  //   this.wrapWidth = wrapWidth;
  //   this.dotP = fromWidth * 100 / wrapWidth; // XXXXXXXXXXXXXXXXXXX

  //   this.valP = this.getRange() / 100;                  // один процент
  //   // this.stepP = this.step / this.valP;              // количество процентов в шаге
  //   this.setFrom = (this.from - this.min) / this.valP;  // позиция левой точки в процентах
  //   this.setTo = (this.to - this.min) / this.valP;      // позиция правой точки в процентах

  //   this.limitFrom = this.getFrom;
  //   this.limitTo = this.getTo;
  // }


  // calcGridNumStep() {
  //   let interval = 0;
  //   let step = 0;

  //   if (this.gridStep && this.gridNum == 4) {     // если задан Шаг а интервал по умолчанию стоит
  //     step = this.gridStep;
  //     interval = this.getRange() / step;          // находим новый интервал
  //   } else {                                      // делаем только по интервалу
  //     interval = this.gridNum;
  //     step = this.getRange() / interval;          // находим шаг
  //   }

  //   this.gridStep = step;
  //   this.gridNum = interval;

  //   return interval;
  // }

  // calcPositionGrid(value: number) {
  //   value = value + this.gridStep;
  //   const position = ((value - this.min) * 100) / this.getRange();
  //   return { value, position };
  // }


  // calcWidthP(width: number) {
  //   return (width * 100 / this.wrapWidth) / 2;
  // }

  // calcPositionTipFrom(tipFrom: number) {
  //   const tipFromP = this.calcWidthP(tipFrom - 4);
  //   const tipFromX = this.getFrom - tipFromP;
  //   return tipFromX;
  // }

  // calcPositionTipSingle(widthSingle: number) {
  //   const line = (this.getTo - this.getFrom) / 2;
  //   const centerFromTo = this.getFrom + line;
  //   const tipSingleP = this.calcWidthP(widthSingle);
  //   const center = centerFromTo - tipSingleP;
  //   return center;
  // }

  // calcPositionTipTo(tipTo: number) {
  //   const tipToP = this.calcWidthP(tipTo - 4);
  //   const tipToX = this.getTo - tipToP;
  //   return tipToX;
  // }



  // calcPositionBar() {
  //   let barX = 0;
  //   let widthBar = 0;

  //   if (this.type == 'double') {
  //     barX = this.getFrom;
  //     widthBar = this.getTo - this.getFrom;
  //   } else {
  //     widthBar = this.getFrom;
  //   }

  //   return { barX, widthBar };
  // }


  // clickLine = (pointX: number, wrapWidth: number) => {

  //   this.wrapWidth = wrapWidth;
  //   const oneP = wrapWidth / 100; // один процент от всей школы
  //   const pointP = pointX / oneP; // кол. процентов в области где кликнули

  //   if (this.type == 'single') {
  //     this.setFrom = pointP;
  //   }
  //   else if (pointP > this.getTo) {       // если это значение больше чем To
  //     this.setTo = pointP;                // To  на эту точку
  //   } else if (pointP > this.getFrom) {   // если меньше To но больше From
  //     const To = this.getTo - pointP;     // из To вычетаем Val
  //     const From = pointP - this.getFrom; // из Val вычетаем From
  //     From > To ? this.setTo = pointP : this.setFrom = pointP; // то число что меньше та точка и ближе
  //   } else {                              // Если Val меньше From то подвигать From
  //     this.setFrom = pointP;
  //   }
  //   this.limitTo = this.getTo;
  //   this.limitFrom = this.getFrom;
  // }


  // calcDotPosition(options: CalcDotPositionOpt) {

  //   //this.dotP = options.dotWidth * 100 / options.wrapWidth; // ширина точки в процентах
  //   this.wrapWidth = options.wrapWidth;
  //   const num = options.clientX - options.shiftX - options.wrapLeft;
  //   let percent = num * 100 / this.wrapWidth;

  //   if (options.type == 'From') {
  //     this.limitFrom = percent;
  //   }
  //   else {
  //     this.limitTo = percent;
  //   }

  //   const limitDot = !(this.limitFrom > this.limitTo);

  //   if (percent < 0) percent = 0;
  //   if (percent > 100) percent = 100;

  //   const type = this.type == 'single';

  //   if (type) {
  //     this.setFrom = percent;
  //   } else if (limitDot) {
  //     this.fromTo = percent;

  //     if (options.type == 'From') {
  //       this.setFrom = percent;
  //     }
  //     else {
  //       this.setTo = percent;
  //     }

  //   }
  //   else {
  //     this.setFrom = this.fromTo;
  //     this.setTo = this.fromTo;
  //   }
  // }


}



export { Model };