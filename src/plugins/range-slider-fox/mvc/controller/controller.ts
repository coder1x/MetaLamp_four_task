import { Model } from '../model/model';
import { View } from '../view/view';
import { RangeSliderOptions } from '../../glob-interface';
import { TOB } from '../../observer';


class Controller {

  private startFL = false;
  private lock = false;
  private funAtrr: Function = () => { };

  // eslint-disable-next-line no-unused-vars
  constructor(private model: Model, private view: View) {
    this.init();
  }

  private async init() {
    await this.createListeners();
    await this.view.onHandle();
    await this.model.onHandle();
  }


  private createListeners() {

    const subscribe = (talking: Model | View, items: Function[]) => {
      for (let item of items) {
        talking.subscribeOB(item);
      }
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


  private handleStart = async (options: TOB) => {
    const key = options.key;
    if (key != 'Start') return false;

    await this.view.outDataAttr();
    await this.funAtrr();
    this.startFL = true;
    return true;
  };


  private handleDataAttributes = (options: TOB) => {
    const key = options.key;
    if (key != 'DataAttributes') return false;
    console.log('DataAttributes');
    this.funAtrr = () => {
      this.update(options);
    };
    return true;
  };


  private handleRangeData = (options: TOB) => {
    const key = options.key;
    if (key != 'RangeData') return false;
    console.log('RangeData');
    this.model.calcOnePercent();

    if (this.startFL)
      this.view.ubdateTipMinMax(options.min, options.max);

    const obj = this.model.getOptions();
    if (obj.grid && this.startFL) {
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
    console.log('handleStep');
    this.model.calcStep();
    return true;
  };


  private handleDotKeyDown = (options: TOB) => {
    const key = options.key;
    if (key != 'DotKeyDown') return false;
    if (this.lock) return false;
    console.log('DotKeyDown');
    this.model.calcKeyDown(options.keyRepeat, options.keySign, options.dot);
    return true;
  };


  private handleDotData = (options: TOB) => {
    const key = options.key;
    if (key != 'DotData') return false;
    const type = options.type;
    console.log('handleDotData');
    this.view.createDotElem(type); // создаём точки

    const from = this.model.calcPositionDotFrom();
    this.view.setDotFrom(from);

    if (type == 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to);
    }

    this.view.setDotActions(type);

    // ----------  Hints
    if (this.startFL) {
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
    console.log('handleDotMove');

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
    console.log('handleGridSnapData');
    this.model.snapDot();
    return true;
  };

  private handleGridData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridData') return false;
    console.log('handleGridData');

    if (this.startFL) {
      this.view.deleteGrid();
      if (options.grid) {
        this.model.createMark();
        this.view.createDomGrid();
      }
    }
    return true;
  };


  private handleOrientationData = async (options: TOB) => {
    const key = options.key;
    if (key != 'OrientationData') return false;
    console.log('OrientationData');

    await this.view.setOrientation(options.orientation);
    const obj = await this.model.getOptions();


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
    console.log('handleThemeData');

    this.view.setTheme(options.theme);
    return true;
  };


  private handleHintsData = (options: TOB) => {
    const key = options.key;
    if (key != 'HintsData') return false;
    console.log('handleHintsData');

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);
    this.view.setHintsData(options);

    if (this.startFL)
      this.ubdateHints(options.type, options.from, options.to);
    return true;
  };


  private async ubdateHints(type: string, from: number, to: number) {
    console.log('--------------------------- ubdateHints');

    // необходимо дожидаться выполнения всех процессов.

    await this.view.ubdateTipValue(from, to, type);


    // setTimeout(async () => {

    const objTip = await this.view.getWidthTip(this.startFL);

    console.log(objTip);

    if (objTip.fromWH || objTip.toWH) {
      const fromXY = await this.model.calcPositionTipFrom(objTip.fromWH);
      let toXY = 0;
      let singleXY = 0;
      if (type == 'double') {
        toXY = await this.model.calcPositionTipTo(objTip.toWH);
        singleXY = await this.model.calcPositionTipSingle(objTip.singleWH);
      } else {
        await this.view.deleteTipTo();
      }

      await this.view.ubdateTipPosition({
        fromXY,
        toXY,
        singleXY,
      });
    }

    // });







  }


  private handleDisabledData = (options: TOB) => {
    const key = options.key;
    if (key != 'DisabledData') return false;
    console.log('handleDisabledData');
    this.lock = options.disabled;
    this.view.disabledRangeSlider(options.disabled);
    return true;
  };


  private handleClickLine = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickLine') return false;
    if (this.lock) return false;
    console.log('handleClickLine');
    this.model.clickLine(options.clientXY);
    return true;
  };


  private handleSizeWrap = (options: TOB) => {
    const key = options.key;
    if (key != 'SizeWrap') return false;

    console.log('handleSizeWrap');
    console.log(options.wrapWH);

    this.model.setWrapWH(options.wrapWH);
    return true;
  };


  private handleBarData = (options: TOB) => {
    const key = options.key;
    if (key != 'BarData') return false;
    console.log('handleBarData');
    this.view.setVisibleBar(options.bar);
    // this.model.calcPositionDotFrom();
    // this.model.calcPositionDotTo();
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);
    return true;
  };


  private handleClickBar = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickBar') return false;
    console.log('handleClickBar');
    if (this.lock) return false;
    this.model.clickBar(options.clientXY);
    return true;
  };


  private handleCreateGrid = (options: TOB) => {
    const key = options.key;
    if (key != 'CreateGrid') return false;
    console.log('handleCreateGrid');
    this.view.createMark(options.valMark);

    return true;
  };


  private handleClickMark = (options: TOB) => {
    const key = options.key;
    if (key != 'ClickMark') return false;
    if (this.lock) return false;
    console.log('handleClickMark');
    this.model.clickMark(options.valueG);
    return true;
  };


  private handleSnapNum = (options: TOB) => {
    const key = options.key;
    if (key != 'SnapNum') return false;
    console.log('handleSnapNum');
    this.model.calcSnap(options.snapNum);
    return true;
  };


}

export { Controller, Model, View };
