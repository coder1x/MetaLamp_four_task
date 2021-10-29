import { Model } from '../model/model';
import { View } from '../view/view';
import { RangeSliderOptions } from '../model/model.d';
import { TOB } from '../../observer';


class Controller {

  private startFl = false;
  private lock = false;

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
    this.reset();
    this.startFl = true;
  }

  reset = () => {
    if (this.lock) return;
    this.model.reset();
  }

  // eslint-disable-next-line no-unused-vars
  update = (options: RangeSliderOptions) => {
    const lock = options.disabled !== false;
    const orientation = typeof options.orientation !== 'string';
    if (lock && orientation)
      if (this.lock) return;
    this.model.update(options);
  }


  private handleStart = (options: TOB) => {
    const key = options.key;
    if (key != 'Start') return;
    this.view.outDataAttr();
  };

  private handleDataAttributes = (options: TOB) => {
    const key = options.key;
    if (key != 'DataAttributes') return;

    this.update(options);


  };

  private handleRangeData = (options: TOB) => {
    const key = options.key;
    if (key != 'RangeData') return;

    this.model.calcOnePercent();

    this.view.ubdateTipMinMax(options.min, options.max);

    const obj = this.model.getOptions();
    if (obj.grid && this.startFl) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }

    this.model.calcStep();

  };

  private handleStep = (options: TOB) => {
    const key = options.key;
    if (key != 'Step') return;

    this.model.calcStep();
  };

  private handleDotKeyDown = (options: TOB) => {
    const key = options.key;
    if (key != 'DotKeyDown') return;
    if (this.lock) return;

    this.model.calcKeyDown(options.keyRepeat, options.keySign, options.dot);
  };

  private handleDotData = (options: TOB) => {
    const key = options.key;
    if (key != 'DotData') return;


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
      this.view.ubdateTipFromTo({
        from: options.from,
        to: options.to,
        type: options.type,
        fromXY: this.model.calcPositionTipFrom,
        toXY: this.model.calcPositionTipTo,
        singleXY: this.model.calcPositionTipSingle,
      });
    }

    // ----------  Bar
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);

    // ----------  Input
    this.view.setValueInput(options.from, options.to, options.type);

  };


  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return;
    if (this.lock) return;

    this.model.calcDotPosition({
      type: options.type,
      wrapWH: options.wrapWH,
      position: options.position,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
    });

  };


  private handleGridSnapData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridSnapData') return;

    this.model.snapDot();
  };

  private handleGridData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridData') return;

    // проверить есть ли грид - если есть то удалить его. 
    // потому что любое изменение перестраивает всю шкалу. 
    this.view.deleteGrid();

    if (options.grid) {
      this.model.createMark();
      this.view.createDomGrid();
    }

  };

  private handleOrientationData = (options: TOB) => {
    const key = options.key;
    if (key != 'OrientationData') return;

    this.view.setOrientation(options.orientation);

    const obj = this.model.getOptions();
    this.view.ubdateTipFromTo({
      from: obj.from,
      to: obj.to,
      type: obj.type,
      fromXY: this.model.calcPositionTipFrom,
      toXY: this.model.calcPositionTipTo,
      singleXY: this.model.calcPositionTipSingle,
    });
  };


  private handleThemeData = (options: TOB) => {
    const key = options.key;
    if (key != 'ThemeData') return;

    this.view.setTheme(options.theme);
  };

  private handleHintsData = (options: TOB) => {
    const key = options.key;
    if (key != 'HintsData') return;

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);

    this.view.setHintsData(options);

    this.view.ubdateTipFromTo({
      from: options.from,
      to: options.to,
      type: options.type,
      fromXY: this.model.calcPositionTipFrom,
      toXY: this.model.calcPositionTipTo,
      singleXY: this.model.calcPositionTipSingle,
    });
  };


  private handleDisabledData = (options: TOB) => {
    const key = options.key;
    if (key != 'DisabledData') return;

    this.lock = options.disabled;
    this.view.disabledRangeSlider(options.disabled);
  };


  private handleClickLine = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickLine') return;
    if (this.lock) return;

    this.model.clickLine(options.clientXY);
  };


  private handleSizeWrap = (options: TOB) => {
    const key = options.key;
    if (key != 'SizeWrap') return;

    this.model.setWrapWH(options.wrapWH);
  };


  private handleBarData = (options: TOB) => {
    const key = options.key;
    if (key != 'BarData') return;

    this.view.setVisibleBar(options.bar);

    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);
  };

  private handleClickBar = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickBar') return;
    if (this.lock) return;
    this.model.clickBar(options.clientXY);
  };

  private handleCreateGrid = (options: TOB) => {
    const key = options.key;
    if (key != 'CreateGrid') return;

    this.view.createMark(options.valueG, options.position);
  };

  private handleClickMark = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickMark') return;
    if (this.lock) return;

    this.model.clickMark(options.valueG);
  };

  private handleSnapNum = (options: TOB) => {
    const key = options.key;
    if (key != 'SnapNum') return;

    this.model.calcSnap(options.snapNum);
  };


}

export { Controller, Model, View };
