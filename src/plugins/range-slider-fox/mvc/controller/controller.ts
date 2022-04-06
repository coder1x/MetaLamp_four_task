import Model from '../model/model';
import View from '../view/view';
import RangeSliderOptions from '../../glob-interface';
import { ObserverOptions } from '../../observer';

class Controller {
  private startFL = false;

  private resetFL = false;

  private lock = false;

  private funAttributes: Function = () => { };

  private model: Model;

  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async reset() {
    if (this.lock) return false;
    this.resetFL = await true;
    await this.model.reset();
    this.resetFL = false;
    return true;
  }

  update(options: RangeSliderOptions) {
    const lock = options.disabled !== false;
    const orientation = typeof options.orientation !== 'string';
    if (lock && orientation) { if (this.lock) return false; }
    this.model.update(options);
    return true;
  }

  async destroy() {
    this.lock = true;
    if (!this.view) return false;
    const elem = await this.view.elem;
    if (elem.constructor.name !== 'HTMLInputElement') return false;
    await $.data(elem, 'RangeSliderFox', null);
    await this.view.destroy();
    this.view = null;
    this.model = null;
    return true;
  }

  private async init() {
    await this.createListeners();
    await this.view.onHandle();
    await this.model.onHandle();
  }

  private createListeners() {
    const subscribe = (talking: Model | View, items: Function[]) => {
      items.forEach((item) => {
        talking.subscribeOB(item);
      });
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

    const SView = [
      this.handleDotMove,
      this.handleClickLine,
      this.handleSizeWrap,
      this.handleClickBar,
      this.handleClickMark,
      this.handleSnapNum,
      this.handleDotKeyDown,
      this.handleDataAttributes,
    ];

    subscribe(this.view, SView);
  }

  private handleStart = async (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'Start') return false;

    await this.view.outDataAttr();
    await this.funAttributes();
    this.startFL = true;
    return true;
  };

  private handleDataAttributes = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'DataAttributes') return false;

    this.funAttributes = () => {
      this.update(options);
    };

    if (this.startFL) { this.funAttributes(); }

    return true;
  };

  private handleRangeData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'RangeData') return false;

    this.model.calcOnePercent();
    const lockFl = this.startFL && !this.resetFL;

    if (lockFl) { this.view.updateTipMinMax(options.min, options.max); }

    const obj = this.model.getOptions();
    if (obj.grid && lockFl) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }

    this.model.calcStep();
    return true;
  };

  private handleStep = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'Step') return false;

    this.model.calcStep();
    return true;
  };

  private handleDotKeyDown = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'DotKeyDown') return false;
    if (this.lock) return false;

    this.model.calcKeyDown(options.keyRepeat, options.keySign, options.dot);
    return true;
  };

  private handleDotData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'DotData') return false;
    const { type } = options;

    const lockFl = this.startFL && !this.resetFL;
    this.view.createDotElem(type); // create dot
    const from = this.model.calcPositionDotFrom();
    this.view.setDotFrom(from);

    if (type === 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to);
    }

    this.view.setDotActions(type);

    // ----------  Hints
    if (type === 'double' && lockFl) { this.view.toggleTipTo(options.to); }

    if (lockFl) {
      this.updateHints(options.type, options.from, options.to);
    }

    // ----------  Bar
    if (lockFl) {
      const position = this.model.calcPositionBar();
      this.view.setBar(position.barX, position.widthBar);
    }

    // ----------  Input
    this.view.setValueInput(options.from, options.to, options.type);
    return true;
  };

  private handleDotMove = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'DotMove') return false;
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

  private handleGridSnapData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'GridSnapData') return false;

    this.model.snapDot();
    return true;
  };

  private handleGridData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'GridData') return false;

    const lockFl = this.startFL && !this.resetFL;

    if (lockFl) {
      this.view.deleteGrid();
      if (options.grid) {
        this.model.createMark();
        this.view.createDomGrid();
      }
    }
    return true;
  };

  private handleOrientationData = async (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'OrientationData') return false;

    await this.view.setOrientation(options.orientation);
    const obj = await this.model.getOptions();
    this.updateHints(obj.type, obj.from, obj.to);

    // -------- grid

    if (obj.grid) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }
    return true;
  };

  private handleThemeData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'ThemeData') return false;

    this.view.setTheme(options.theme);
    return true;
  };

  private handleHintsData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'HintsData') return false;

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);
    this.view.setHintsData(options);

    const lockFl = this.startFL && !this.resetFL;

    if (lockFl) { this.updateHints(options.type, options.from, options.to); }
    return true;
  };

  private async updateHints(type: string, from: number, to: number) {
    await this.view.updateTipValue(from, to, type);
    const objTip = await this.view.getWidthTip(this.startFL, this.resetFL);

    if (objTip.fromWH || objTip.toWH) {
      const fromXY = await this.model.calcPositionTipFrom(objTip.fromWH);
      let toXY = 0;
      let singleXY = 0;
      if (type === 'double') {
        toXY = await this.model.calcPositionTipTo(objTip.toWH);
        singleXY = await this.model.calcPositionTipSingle(objTip.singleWH);
      } else {
        await this.view.deleteTipTo();
      }

      await this.view.updateTipPosition({
        fromXY,
        toXY,
        singleXY,
      });
    }
    await this.view.checkVisibleTip();
  }

  private handleDisabledData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'DisabledData') return false;

    this.lock = options.disabled;
    this.view.disabledRangeSlider(options.disabled);
    return true;
  };

  private handleClickLine = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'ClickLine') return false;
    if (this.lock) return false;

    this.model.clickLine(options.clientXY);
    return true;
  };

  private handleSizeWrap = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'SizeWrap' || !this.startFL) return false;

    this.model.setWrapWH(options.wrapWH);
    return true;
  };

  private handleBarData = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'BarData') return false;

    this.view.setVisibleBar(options.bar);
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);
    return true;
  };

  private handleClickBar = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'ClickBar') return false;

    if (this.lock) return false;
    this.model.clickBar(options.clientXY);
    return true;
  };

  private handleCreateGrid = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'CreateGrid') return false;

    this.view.createMark(options.valMark);
    return true;
  };

  private handleClickMark = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'ClickMark') return false;
    if (this.lock) return false;

    this.model.clickMark(options.valueG);
    return true;
  };

  private handleSnapNum = (options: ObserverOptions) => {
    const { key } = options;
    if (key !== 'SnapNum') return false;

    this.model.calcSnap(options.snapNum);
    return true;
  };
}

export { Controller, Model, View };
