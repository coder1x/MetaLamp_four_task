import { Model } from '../model/model';
import { View } from '../view/view';
import { RangeSliderOptions } from '../../glob-interface';
import { TOB } from '../../observer';


class Controller {

  private startFl = false;
  private lock = false;
  private funAtrr: Function;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: Model, private view: View) {
    this.createListeners();
    this.init();
  }


  private createListeners() {
    const subscribe = (talking: Model | View, items: Function[]) => {
      for (let item of items)
        talking.subscribeOB(item);
    };

    const SModel = [
      this.handleStart,
      this.handleRangeData,
      this.handleDotData,
      this.handleGridSnapData,
      this.handleGridData,
      this.handleOrientationData,
      this.handleThemeData,
      this.handleHintsData,
      this.handleDisabledData,
      this.handleBarData,
      this.handleCreateGrid,
      this.handleStep,
    ];

    subscribe(this.model, SModel);

    const SView = [this.handleDotMove,
    this.handleClickLine,
    this.handleSizeWrap,
    this.handleClickBar,
    this.handleClickMark,
    this.handleSnapNum,
    this.handleDotKeyDown,
    this.handleDataAttributes
    ];

    subscribe(this.view, SView);
  }


  private init() {
    this.funAtrr = () => { };
    this.reset();
    this.startFl = true;
    this.funAtrr();
  }


  reset = () => {
    if (this.lock) return false;
    this.model.reset();
  }

  // eslint-disable-next-line no-unused-vars
  update = (options: RangeSliderOptions) => {
    const lock = options.disabled !== false;
    const orientation = typeof options.orientation !== 'string';
    if (lock && orientation)
      if (this.lock) return false;
    this.model.update(options);
    return true;
  }


  private handleStart = (options: TOB) => {
    const key = options.key;
    if (key != 'Start') return false;
    this.view.outDataAttr();
    return true;
  };


  private handleDataAttributes = (options: TOB) => {
    const key = options.key;
    if (key != 'DataAttributes') return false;

    this.funAtrr = () => {
      this.update(options);
    };
    return true;
  };


  private handleRangeData = (options: TOB) => {
    const key = options.key;
    if (key != 'RangeData') return false;

    this.model.calcOnePercent();

    this.view.ubdateTipMinMax(options.min, options.max);

    const obj = this.model.getOptions();
    if (obj.grid && this.startFl) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }

    this.model.calcStep();
    return true;
  };


  private handleStep = (options: TOB) => {
    const key = options.key;
    if (key != 'Step') return false;

    this.model.calcStep();
    return true;
  };


  private handleDotKeyDown = (options: TOB) => {
    const key = options.key;
    if (key != 'DotKeyDown') return false;
    if (this.lock) return false;

    this.model.calcKeyDown(options.keyRepeat, options.keySign, options.dot);
    return true;
  };


  private handleDotData = (options: TOB) => {
    const key = options.key;
    if (key != 'DotData') return false;
    const type = options.type;

    this.view.createDotElem(type); // создаём точки

    const from = this.model.calcPositionDotFrom();
    this.view.setDotFrom(from);

    if (type == 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to);
    }

    this.view.setDotActions(type);

    // ----------  Hints

    if (this.startFl) {
      if (type == 'double')
        this.view.toggleTipTo(options.to);
      this.ubdateHints(options.type, options.from, options.to);
    }



    // ----------  Bar
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);

    // ----------  Input
    this.view.setValueInput(options.from, options.to, options.type);
    return true;
  };


  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return false;
    if (this.lock) return false;

    this.model.calcDotPosition({
      type: options.type,
      wrapWH: options.wrapWH,
      position: options.position,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
    });
    return true;
  };


  private handleGridSnapData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridSnapData') return false;

    this.model.snapDot();
    return true;
  };

  private handleGridData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridData') return false;

    // проверить есть ли грид - если есть то удалить его. 
    // потому что любое изменение перестраивает всю шкалу. 


    if (this.startFl) {
      this.view.deleteGrid();
      if (options.grid) {
        this.model.createMark();
        this.view.createDomGrid();
      }
    }
    return true;
  };


  private handleOrientationData = (options: TOB) => {
    const key = options.key;
    if (key != 'OrientationData') return false;

    this.view.setOrientation(options.orientation);
    const obj = this.model.getOptions();

    this.ubdateHints(obj.type, obj.from, obj.to);


    //-------- grid

    if (obj.grid) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }
    return true;
  };


  private handleThemeData = (options: TOB) => {
    const key = options.key;
    if (key != 'ThemeData') return false;

    this.view.setTheme(options.theme);
    return true;
  };


  private handleHintsData = (options: TOB) => {
    const key = options.key;
    if (key != 'HintsData') return false;

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);
    this.view.setHintsData(options);

    this.ubdateHints(options.type, options.from, options.to);
    return true;
  };


  private ubdateHints(type: string, from: number, to: number) {

    this.view.ubdateTipValue(from, to, type);

    const objTip = this.view.getWidthTip();

    if (objTip.fromWH || objTip.toWH) {
      this.model.calcPositionDotFrom();
      const fromXY = this.model.calcPositionTipFrom(objTip.fromWH);
      let toXY = 0;
      let singleXY = 0;
      if (type == 'double') {
        this.model.calcPositionDotTo();
        toXY = this.model.calcPositionTipTo(objTip.toWH);
        singleXY = this.model.calcPositionTipSingle(objTip.singleWH);
      } else {
        this.view.deleteTipTo();
      }

      this.view.ubdateTipPosition({
        fromXY,
        toXY,
        singleXY,
      });
    }



  }


  private handleDisabledData = (options: TOB) => {
    const key = options.key;
    if (key != 'DisabledData') return false;

    this.lock = options.disabled;
    this.view.disabledRangeSlider(options.disabled);
    return true;
  };


  private handleClickLine = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickLine') return false;
    if (this.lock) return false;

    this.model.clickLine(options.clientXY);
    return true;
  };


  private handleSizeWrap = (options: TOB) => {
    const key = options.key;
    if (key != 'SizeWrap') return false;

    this.model.setWrapWH(options.wrapWH);
    return true;
  };


  private handleBarData = (options: TOB) => {
    const key = options.key;
    if (key != 'BarData') return false;

    this.view.setVisibleBar(options.bar);
    this.model.calcPositionDotFrom();
    this.model.calcPositionDotTo();
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);
    return true;
  };


  private handleClickBar = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickBar') return false;
    if (this.lock) return false;
    this.model.clickBar(options.clientXY);
    return true;
  };


  private handleCreateGrid = (options: TOB) => {
    const key = options.key;
    if (key != 'CreateGrid') return false;

    this.view.createMark(options.valMark);

    return true;
  };


  private handleClickMark = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickMark') return false;
    if (this.lock) return false;

    this.model.clickMark(options.valueG);
    return true;
  };


  private handleSnapNum = (options: TOB) => {
    const key = options.key;
    if (key != 'SnapNum') return false;

    this.model.calcSnap(options.snapNum);
    return true;
  };


}

export { Controller, Model, View };
