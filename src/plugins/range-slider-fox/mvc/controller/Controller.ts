import { boundMethod } from 'autobind-decorator';

import RangeSliderOptions from '../../glob-interface';
import { ObserverOptions } from '../../Observer';
import Model from '../model/Model';
import View from '../view/View';

class Controller {
  private isStarted = false;

  private isReset = false;

  private lock = false;

  private functionAttributes: Function = () => { };

  private model: Model | null;

  private view: View | null;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async reset() {
    if (this.lock) return false;
    this.isReset = await true;

    if (this.model) { await this.model.reset(); }
    this.isReset = false;
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
    const element = await this.view.element as Element;
    if (element.constructor.name !== 'HTMLInputElement') return false;
    await $.data(element, 'RangeSliderFox', null);
    await this.view.destroy();
    this.view = null;
    this.model = null;
    return true;
  }

  private async init() {
    await this.createListeners();

    if (!this.view || !this.model) return false;

    if (this.view.onHandle) { await this.view.onHandle(); }

    if (this.model.onHandle) { await this.model.onHandle(); }

    return true;
  }

  private static subscribe(talking: Model | View, items: Function[]) {
    return items.forEach((item) => {
      talking.subscribeObserver(item);
    });
  }

  private createListeners() {
    if (!this.model || !this.view) return false;

    const handlesModel = [
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

    Controller.subscribe(this.model, handlesModel);

    const handlesView = [
      this.handleDotMove,
      this.handleClickLine,
      this.handleSizeWrapper,
      this.handleClickBar,
      this.handleClickMark,
      this.handleSnapNumber,
      this.handleDotKeyDown,
      this.handleDataAttributes,
    ];

    Controller.subscribe(this.view, handlesView);

    return true;
  }

  @boundMethod
  private async handleStart(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'Start' || !this.view) return false;

    await this.view.outputDataAttribute();
    await this.functionAttributes();
    this.isStarted = true;
    return true;
  }

  @boundMethod
  private handleDataAttributes(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DataAttributes') return false;

    this.functionAttributes = () => {
      this.update(options);
    };

    if (this.isStarted) { this.functionAttributes(); }

    return true;
  }

  @boundMethod
  private handleRangeData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'RangeData') return false;

    if (!this.model || !this.view) return false;

    this.model.calcOnePercent();
    const lock = this.isStarted && !this.isReset;

    if (lock) {
      this.view.updateTipMinMax(
        options.min ?? 0,
        options.max ?? 0,
      );
    }

    if (this.model.getOptions().grid && lock) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomElementGrid();
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

    this.model.calcKeyDown(
      options.keyRepeat ?? false,
      options.keySign ?? '',
      options.dot ?? '',
    );
    return true;
  }

  @boundMethod
  private handleDotData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'DotData') return false;
    const type = options.type ?? '';

    if (!this.view || !this.model) return false;

    const lock = this.isStarted && !this.isReset;
    this.view.createDotElement(type); // create dot
    this.view.setDotFrom(this.model.calcPositionDotFrom());

    if (type === 'double') {
      this.view.setDotTo(this.model.calcPositionDotTo());
    }

    this.view.setDotActions(type);

    const to = options.to ?? 0;
    // ----------  Hints
    if (type === 'double' && lock) { this.view.toggleTipTo(to); }

    const from = options.from ?? 0;

    if (lock) {
      this.updateHints(type, from, to);
    }

    // ----------  Bar
    if (lock) {
      const position = this.model.calcPositionBar();
      this.view.setBar(position.barXY, position.widthBar);
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

    this.model.calcDotPosition({
      type: options.type ?? '',
      wrapperWidthHeight: options.wrapperWidthHeight ?? 0,
      position: options.position ?? 0,
      clientXY: options.clientXY ?? 0,
      shiftXY: options.shiftXY ?? 0,
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

    if (this.isStarted && !this.isReset) {
      this.view.deleteGrid();
      if (options.grid) {
        this.model.createMark();
        this.view.createDomElementGrid();
      }
    }
    return true;
  }

  @boundMethod
  private async handleOrientationData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'OrientationData') return false;

    if (!this.view || !this.model) return false;

    await this.view.setOrientation(options.orientation ?? '');
    const modelOptions = await this.model.getOptions();
    this.updateHints(modelOptions.type ?? '', modelOptions.from ?? 0, modelOptions.to ?? 0);

    // -------- grid

    if (modelOptions.grid) {
      this.view.deleteGrid();
      this.model.createMark();
      this.view.createDomElementGrid();
    }
    return true;
  }

  @boundMethod
  private handleThemeData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ThemeData' || !this.view) return false;

    this.view.setTheme(options.theme ?? '');
    return true;
  }

  @boundMethod
  private handleHintsData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'HintsData') return false;

    if (!this.view || !this.model) return false;

    this.model.setWrapperWidthHeight(this.view.getWrapWidthHeight());
    this.view.setHintsData(options);

    if (this.isStarted && !this.isReset) {
      this.updateHints(
        options.type ?? '',
        options.from ?? 0,
        options.to ?? 0,
      );
    }
    return true;
  }

  private async updateHints(type: string, from: number, to: number) {
    if (!this.view || !this.model) return false;

    await this.view.updateTipValue(from, to, type);
    const sizeTip = await this.view.getWidthTip(this.isStarted, this.isReset);

    if (!sizeTip) return false;

    if (sizeTip.fromWidthHeight || sizeTip.toWidthHeight) {
      const fromXY = await this.model.calcPositionTipFrom(sizeTip.fromWidthHeight);
      let toXY = 0;
      let singleXY = 0;
      if (type === 'double') {
        toXY = await this.model.calcPositionTipTo(sizeTip.toWidthHeight);
        singleXY = await this.model.calcPositionTipSingle(sizeTip.singleWidthHeight);
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

    this.model.clickLine(options.clientXY ?? 0);
    return true;
  }

  @boundMethod
  private handleSizeWrapper(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'SizeWrapper' || !this.isStarted) return false;

    if (!this.model) return false;

    this.model.setWrapperWidthHeight(options.wrapperWidthHeight ?? 0);

    return true;
  }

  @boundMethod
  private handleBarData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'BarData') return false;

    if (!this.view || !this.model) return false;

    this.view.setVisibleBar(options.bar ?? false);
    const position = this.model.calcPositionBar();
    this.view.setBar(position.barXY, position.widthBar);
    return true;
  }

  @boundMethod
  private handleClickBar(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ClickBar' || !this.model) return false;

    if (this.lock) return false;

    this.model.clickBar(options.clientXY ?? 0);
    return true;
  }

  @boundMethod
  private handleCreateGrid(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'CreateGrid' || !this.view) return false;

    this.view.createMark(options.valueMark ?? []);
    return true;
  }

  @boundMethod
  private handleClickMark(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'ClickMark' || !this.model) return false;
    if (this.lock) return false;

    this.model.clickMark(options.valueGrid ?? 0);
    return true;
  }

  @boundMethod
  private handleSnapNumber(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'SnapNumber' || !this.model) return false;

    this.model.calcSnap(options.snapNumber ?? []);
    return true;
  }
}

export { Controller, Model, View };
