import { boundMethod } from 'autobind-decorator';
import Model from '../model/model';
import View from '../view/view';
import RangeSliderOptions from '../../glob-interface';
import { ObserverOptions } from '../../observer';

class Controller {
  private startFlag = false;

  private resetFlag = false;

  private lock = false;

  private funAttributes: Function = () => { };

  private model: Model | null;

  private view: View | null;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async reset() {
    if (this.lock) return false;
    this.resetFlag = await true;

    if (this.model) { await this.model.reset(); }
    this.resetFlag = false;
    return true;
  }

  update(options: RangeSliderOptions) {
    const lock = options.disabled !== false;
    const orientation = typeof options.orientation !== 'string';

    if (lock && orientation) { if (this.lock) return false; }

    if (this.model) { this.model.update(options); }
    return true;
  }

  async destroy() {
    this.lock = true;
    if (!this.view) return false;
    const elem = await this.view.elem as Element;
    if (elem.constructor.name !== 'HTMLInputElement') return false;
    await $.data(elem, 'RangeSliderFox', null);
    await this.view.destroy();
    this.view = null;
    this.model = null;
    return true;
  }

  private async init() {
    await this.createListeners();

    if (!this.view || !this.model) return false;

    if (this.view.onHandle) { await this.view.onHandle(); }
    await this.model.onHandle();

    return true;
  }

  private createListeners() {
    if (!this.model || !this.view) return false;

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

    return true;
  }

  @boundMethod
  private async handleStart(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'Start' || !this.view) return false;

    await this.view.outDataAttr();
    await this.funAttributes();
    this.startFlag = true;
    return true;
  }

  @boundMethod
  private handleDataAttributes(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DataAttributes') return false;

    this.funAttributes = () => {
      this.update(options);
    };

    if (this.startFlag) { this.funAttributes(); }

    return true;
  }

  @boundMethod
  private handleRangeData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'RangeData') return false;

    if (!this.model || !this.view) return false;

    this.model.calcOnePercent();
    const lockFlag = this.startFlag && !this.resetFlag;

    const min = options.min ?? 0;
    const max = options.max ?? 0;

    if (lockFlag) {
      this.view.updateTipMinMax(min, max);
    }

    const obj = this.model.getOptions();
    if (obj.grid && lockFlag) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }

    this.model.calcStep();
    return true;
  }

  @boundMethod
  private handleStep(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'Step' || !this.model) return false;

    this.model.calcStep();
    return true;
  }

  @boundMethod
  private handleDotKeyDown(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DotKeyDown' || !this.model) return false;
    if (this.lock) return false;

    const keyRepeat = options.keyRepeat ?? false;
    const keySign = options.keySign ?? '';
    const dot = options.dot ?? '';

    this.model.calcKeyDown(keyRepeat, keySign, dot);
    return true;
  }

  @boundMethod
  private handleDotData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DotData') return false;
    const type = options.type ?? '';

    if (!this.view || !this.model) return false;

    const lockFlag = this.startFlag && !this.resetFlag;
    this.view.createDotElem(type); // create dot
    const fromCalc = this.model.calcPositionDotFrom();
    this.view.setDotFrom(fromCalc);

    if (type === 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to);
    }

    this.view.setDotActions(type);

    const to = options.to ?? 0;
    // ----------  Hints
    if (type === 'double' && lockFlag) { this.view.toggleTipTo(to); }

    const from = options.from ?? 0;

    if (lockFlag) {
      this.updateHints(type, from, to);
    }

    // ----------  Bar
    if (lockFlag) {
      const position = this.model.calcPositionBar();
      this.view.setBar(position.barX, position.widthBar);
    }

    // ----------  Input
    this.view.setValueInput(from, to, type);
    return true;
  }

  @boundMethod
  private handleDotMove(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DotMove' || !this.model) return false;
    if (this.lock) return false;

    const type = options.type ?? '';
    const wrapWH = options.wrapWH ?? 0;
    const position = options.position ?? 0;
    const clientXY = options.clientXY ?? 0;
    const shiftXY = options.shiftXY ?? 0;

    this.model.calcDotPosition({
      type,
      wrapWH,
      position,
      clientXY,
      shiftXY,
    });
    return true;
  }

  @boundMethod
  private handleGridSnapData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'GridSnapData' || !this.model) return false;

    this.model.snapDot();
    return true;
  }

  @boundMethod
  private handleGridData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'GridData') return false;

    if (!this.view || !this.model) return false;

    const lockFlag = this.startFlag && !this.resetFlag;

    if (lockFlag) {
      this.view.deleteGrid();
      if (options.grid) {
        this.model.createMark();
        this.view.createDomGrid();
      }
    }
    return true;
  }

  @boundMethod
  private async handleOrientationData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'OrientationData') return false;

    if (!this.view || !this.model) return false;

    const orientation = options.orientation ?? '';

    await this.view.setOrientation(orientation);
    const obj = await this.model.getOptions();
    this.updateHints(obj.type, obj.from, obj.to);

    // -------- grid

    if (obj.grid) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomGrid();
    }
    return true;
  }

  @boundMethod
  private handleThemeData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ThemeData' || !this.view) return false;

    const theme = options.theme ?? '';
    this.view.setTheme(theme);
    return true;
  }

  @boundMethod
  private handleHintsData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'HintsData') return false;

    if (!this.view || !this.model) return false;

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);
    this.view.setHintsData(options);

    const lockFlag = this.startFlag && !this.resetFlag;

    const type = options.type ?? '';
    const from = options.from ?? 0;
    const to = options.to ?? 0;

    if (lockFlag) { this.updateHints(type, from, to); }
    return true;
  }

  private async updateHints(type: string, from: number, to: number) {
    if (!this.view || !this.model) return false;

    await this.view.updateTipValue(from, to, type);
    const objTip = await this.view.getWidthTip(this.startFlag, this.resetFlag);

    if (!objTip) return false;

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

    return true;
  }

  @boundMethod
  private handleDisabledData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DisabledData' || !this.view) return false;

    const disabled = options.disabled ?? false;
    this.lock = disabled;
    this.view.disabledRangeSlider(disabled);
    return true;
  }

  @boundMethod
  private handleClickLine(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ClickLine' || !this.model) return false;
    if (this.lock) return false;

    const clientXY = options.clientXY ?? 0;
    this.model.clickLine(clientXY);
    return true;
  }

  @boundMethod
  private handleSizeWrap(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'SizeWrap' || !this.startFlag) return false;

    if (!this.model) return false;

    const wrapWH = options.wrapWH ?? 0;
    this.model.setWrapWH(wrapWH);

    return true;
  }

  @boundMethod
  private handleBarData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'BarData') return false;

    if (!this.view || !this.model) return false;

    const bar = options.bar ?? false;

    this.view.setVisibleBar(bar);
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barX, position.widthBar);
    return true;
  }

  @boundMethod
  private handleClickBar(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ClickBar' || !this.model) return false;

    if (this.lock) return false;

    const clientXY = options.clientXY ?? 0;

    this.model.clickBar(clientXY);
    return true;
  }

  @boundMethod
  private handleCreateGrid(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'CreateGrid' || !this.view) return false;

    const valMark = options.valMark ?? [];
    this.view.createMark(valMark);
    return true;
  }

  @boundMethod
  private handleClickMark(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ClickMark' || !this.model) return false;
    if (this.lock) return false;

    const valueG = options.valueG ?? 0;
    this.model.clickMark(valueG);
    return true;
  }

  @boundMethod
  private handleSnapNum(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'SnapNum' || !this.model) return false;

    const snapNum = options.snapNum ?? [];
    this.model.calcSnap(snapNum);
    return true;
  }
}

export { Controller, Model, View };
