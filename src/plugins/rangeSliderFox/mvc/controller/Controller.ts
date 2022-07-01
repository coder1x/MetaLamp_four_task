import { boundMethod } from 'autobind-decorator';

import { NAME_PLUGIN } from '@shared/constants';

import RangeSliderOptions from '../../globInterface';
import { ObserverOptions } from '../../Observer';
import Model from '../model/Model';
import View from '../view/View';

class Controller {
  private isStarted = false;

  private isReset = false;

  private lock = false;

  private functionAttributes = () => { };

  private model: Model | null;

  private view: View | null;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.init();
  }

  reset() {
    if (this.lock) return false;
    this.isReset = true;

    if (this.model) { this.model.reset(); }
    this.isReset = false;
    return true;
  }

  update(options: RangeSliderOptions) {
    const lock = options.disabled !== false;
    const orientation = typeof options.orientation !== 'string';
    const isLock = this.lock && lock;

    if (isLock && orientation) { return false; }

    if (this.model) {
      this.model.update(options);
    }
    return true;
  }

  destroy() {
    this.lock = true;
    if (!this.view) return false;
    const element = this.view.element as Element;
    if (element.constructor.name !== 'HTMLInputElement') return false;
    $.data(element, NAME_PLUGIN, null);
    this.view.destroy();
    this.view = null;
    this.model = null;
    return true;
  }

  private init() {
    this.createListeners();

    if (!this.view || !this.model) return false;

    if (this.view.onHandle) { this.view.onHandle(); }

    if (this.model.onHandle) { this.model.onHandle(); }

    return true;
  }

  private static subscribe(
    talking: Model | View,

    items: ((options: ObserverOptions) => boolean | Promise<boolean>)[],
  ) {
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
      this.handleGridCreation,
    ];

    Controller.subscribe(this.model, handlesModel);

    const handlesView = [
      this.handleDotMove,
      this.handleLineClick,
      this.handleBarClick,
      this.handleMarkClick,
      this.handleSnapNumber,
      this.handleDotKeyDown,
      this.handleDataAttributes,
    ];

    Controller.subscribe(this.view, handlesView);

    return true;
  }

  @boundMethod
  private handleStart(options: ObserverOptions) {
    const { key } = options;
    const isStarted = key !== 'Start';

    if (isStarted || !this.view) return false;

    this.view.outputDataAttribute();
    this.functionAttributes();
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
      this.model.calcMark();
      this.view.createDomElementGrid();
    }

    return true;
  }

  @boundMethod
  private handleDotKeyDown(options: ObserverOptions) {
    const { key } = options;
    const isDotKeyDown = key !== 'DotKeyDown';

    if (isDotKeyDown || !this.model) return false;
    if (this.lock) return false;

    this.model.calcFromToOnKeyDown(
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
    this.view.setDotFrom(this.model.calcPercentFrom());

    if (type === 'double') {
      this.view.setDotTo(this.model.calcPercentTo());
    }

    this.view.setDotActions(type);

    const to = options.to ?? 0;
    // ----------  Hints
    const isDouble = type === 'double';
    if (isDouble && lock) { this.view.toggleTipTo(to); }

    const from = options.from ?? 0;

    if (lock) {
      this.updateHints(type, from, to);
    }

    // ----------  Bar
    if (lock) {
      const position = this.model.calcBarDimensions();
      this.view.setBar(position.barXY, position.widthBar);
    }

    // ----------  Input
    this.view.setValueInput(from, to, type);
    return true;
  }

  @boundMethod
  private handleDotMove(options: ObserverOptions) {
    const { key } = options;
    const isDotMove = key !== 'DotMove';

    if (isDotMove || !this.model) return false;
    if (this.lock || !this.view) return false;

    this.model.calcFromTo({
      type: options.type ?? '',
      position: options.position ?? 0,
      clientXY: options.clientXY ?? 0,
      shiftXY: options.shiftXY ?? 0,
      dimensions: Number(this.view.getWrapWidthHeight()),
    });
    return true;
  }

  @boundMethod
  private handleGridSnapData(options: ObserverOptions) {
    const { key } = options;
    const isGridSnapData = key !== 'GridSnapData';

    if (isGridSnapData || !this.model) return false;

    this.model.toggleSnapMode();
    return true;
  }

  @boundMethod
  private handleGridData(options: ObserverOptions) {
    const { key } = options;

    if (key !== 'GridData') return false;

    if (!this.view || !this.model) return false;

    if (!this.isStarted && this.isReset) return false;

    this.view.deleteGrid();
    if (options.grid) {
      this.model.calcMark();
      this.view.createDomElementGrid();
    }

    return true;
  }

  @boundMethod
  private async handleOrientationData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'OrientationData') return false;

    if (!this.view || !this.model) return false;

    await this.view.setOrientation(options.orientation ?? '');
    const modelOptions = this.model.getOptions();
    this.updateHints(modelOptions.type ?? 'double', modelOptions.from ?? 0, modelOptions.to ?? 0);

    // -------- grid

    if (modelOptions.grid) {
      this.view.deleteGrid();
      this.model.calcMark();
      this.view.createDomElementGrid();
    }
    return true;
  }

  @boundMethod
  private handleThemeData(options: ObserverOptions) {
    const { key } = options;
    const isThemeData = key !== 'ThemeData';

    if (isThemeData || !this.view) return false;

    this.view.setTheme(options.theme ?? '');
    return true;
  }

  @boundMethod
  private handleHintsData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'HintsData') return false;

    if (!this.view || !this.model) return false;

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

  private updateHints(type: string, from: number, to: number) {
    if (!this.view || !this.model) return false;

    this.view.updateTipValue(from, to, type);
    const sizeTip = this.view.getWidthTip();

    if (!sizeTip) return false;

    if (sizeTip.fromWidthHeight || sizeTip.toWidthHeight) {
      const fromXY = this.model.calcHintFrom(
        sizeTip.fromWidthHeight,
        this.view.getWrapWidthHeight(),
      );
      let toXY = 0;
      let singleXY = 0;

      if (type === 'double') {
        toXY = this.model.calcHintTo(
          sizeTip.toWidthHeight,
          this.view.getWrapWidthHeight(),
        );
        singleXY = this.model.calcHintSingle(
          sizeTip.singleWidthHeight,
          this.view.getWrapWidthHeight(),
        );
      } else {
        this.view.deleteTipTo();
        this.view.deleteTipSingle();
      }

      this.view.updateTipPosition({
        fromXY,
        toXY,
        singleXY,
      });
    }
    this.view.checkVisibleTip();

    return true;
  }

  @boundMethod
  private handleDisabledData(options: ObserverOptions) {
    const { key } = options;
    const isDisabledData = key !== 'DisabledData';

    if (isDisabledData || !this.view) return false;

    const disabled = options.disabled ?? false;
    this.lock = disabled;
    this.view.disabledRangeSlider(disabled);
    return true;
  }

  @boundMethod
  private handleLineClick(options: ObserverOptions) {
    const { key } = options;
    const isClickLine = key !== 'ClickLine';

    if (isClickLine || !this.model) return false;
    if (this.lock || !this.view) return false;

    this.model.takeFromOrToOnLineClick(
      options.clientXY ?? 0,
      this.view.getWrapWidthHeight(),
    );
    return true;
  }

  @boundMethod
  private handleBarData(options: ObserverOptions) {
    const { key } = options;
    if (key !== 'BarData') return false;

    if (!this.view || !this.model) return false;

    this.view.setVisibleBar(options.bar ?? false);
    const position = this.model.calcBarDimensions();
    this.view.setBar(position.barXY, position.widthBar);
    return true;
  }

  @boundMethod
  private handleBarClick(options: ObserverOptions) {
    const { key } = options;
    const isClickBar = key !== 'ClickBar';

    if (isClickBar || !this.model) return false;

    if (this.lock || !this.view) return false;

    this.model.calcBarCoordinates(
      options.clientXY ?? 0,
      this.view.getWrapWidthHeight(),
    );
    return true;
  }

  @boundMethod
  private handleGridCreation(options: ObserverOptions) {
    const { key } = options;
    const isCreateGrid = key !== 'CreateGrid';

    if (isCreateGrid || !this.view) return false;

    this.view.createMark(options.valueMark ?? []);
    return true;
  }

  @boundMethod
  private handleMarkClick(options: ObserverOptions) {
    const { key } = options;
    const isClickMark = key !== 'ClickMark';

    if (isClickMark || !this.model) return false;
    if (this.lock) return false;

    this.model.takeFromOrToOnMarkClick(options.valueGrid ?? 0);
    return true;
  }

  @boundMethod
  private handleSnapNumber(options: ObserverOptions) {
    const { key } = options;
    const isSnapNumber = key !== 'SnapNumber';

    if (isSnapNumber || !this.model) return false;

    if (options.isResized) {
      const modelOptions = this.model.getOptions();
      this.updateHints(modelOptions.type ?? '', modelOptions.from ?? 0, modelOptions.to ?? 0);
    }

    this.model.setSnapFromTo(options.snapNumber ?? []);
    return true;
  }
}

export { Controller, Model, View };
