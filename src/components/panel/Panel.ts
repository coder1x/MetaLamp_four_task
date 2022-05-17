import RangeSliderOptions from '@com/interface/globInterface';
import Values from '@com/values/Values';
import InputData from '@com/input-data/InputData';
import Grid from '@com/grid/Grid';
import Hints from '@com/hints/Hints';
import Different from '@com/different/Different';
import CopyCode from '@com/code/CopyCode';
import KeyboardControl from '@com/keyboard-control/KeyboardControl';

interface Actions {
  bindEvent: Function
}

class Panel {
  private element: Element | null = null;

  private objectValues: Values | null = null;

  private objectInputData: InputData | null = null;

  private objectGrid: Grid | null = null;

  private objectHints: Hints | null = null;

  private objectDifferent: Different | null = null;

  private objectCopyCode: CopyCode | null = null;

  private className: string = '';

  private objectKeyboardControl: KeyboardControl | null = null;

  constructor(element: Element, className: string) {
    this.element = element;
    this.className = className;
    this.init();
  }

  createRangeSlider(options: RangeSliderOptions) {
    if (!this.element) return false;

    const element = this.element.querySelector(
      `${this.className}__slider-wrapper`,
    );

    const onStart = (data: RangeSliderOptions) => {
      this.setDataStart(data);
    };

    const onChange = (data: RangeSliderOptions) => {
      this.setDataChange(data);
    };

    const onUpdate = (data: RangeSliderOptions) => {
      this.setDataUpdate(data);
    };

    const onReset = (data: RangeSliderOptions) => {
      this.setDataReset(data);
    };

    const child = element && element.firstElementChild;

    if (!child) return false;

    const rangeSlider = $(child).RangeSliderFox({
      ...options,
      onStart,
      onChange,
      onUpdate,
      onReset,
    }).data('RangeSliderFox'); // will return an object for one item

    const bindEvent = <T extends Actions | null>(object: T) => {
      if (!object) return false;
      object.bindEvent(rangeSlider);
      return true;
    };

    bindEvent(this.objectValues);
    bindEvent(this.objectGrid);
    bindEvent(this.objectHints);

    let isSubscribed = false;

    if (this.objectDifferent) {
      this.objectDifferent.onUnsubscribtion = () => {
        if (!isSubscribed) {
          isSubscribed = true;
          rangeSlider.update({
            onStart: null,
            onChange: null,
            onUpdate: null,
            onReset: null,
          });
        } else {
          isSubscribed = false;
          rangeSlider.update({
            onStart,
            onChange,
            onUpdate,
            onReset,
          });
        }
      };
    }

    bindEvent(this.objectDifferent);
    bindEvent(this.objectKeyboardControl);

    return true;
  }

  private init() {
    this.objectValues = new Values(
      '.js-values',
      this.getDomElement('.js-values') as Element,
    );

    if (this.element) {
      this.objectInputData = new InputData(this.className, this.element);
    }
    this.objectGrid = new Grid(
      '.js-grid',
      this.getDomElement('.js-grid') as Element,
    );
    this.objectHints = new Hints(
      '.js-hints',
      this.getDomElement('.js-hints') as Element,
    );

    if (this.element) {
      this.objectDifferent = new Different(
        '.js-different',
        this.getDomElement('.js-different') as Element,
        this.element,
      );
    }
    this.objectCopyCode = new CopyCode(
      '.js-code',
      this.getDomElement('.js-code') as Element,
    );

    this.objectKeyboardControl = new KeyboardControl(
      '.js-keyboard-control',
      this.getDomElement('.js-keyboard-control') as Element,
    );
  }

  private getDomElement(string: string) {
    if (!this.element) return null;
    return this.element.querySelector(string);
  }

  private setDataStart(data: RangeSliderOptions) {
    [
      this.objectValues,
      this.objectCopyCode,
      this.objectDifferent,
      this.objectKeyboardControl,
      this.objectGrid,
      this.objectHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataChange(data: RangeSliderOptions) {
    [
      this.objectValues,
      this.objectCopyCode,
      this.objectKeyboardControl,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataUpdate(data: RangeSliderOptions) {
    [
      this.objectValues,
      this.objectCopyCode,
      this.objectDifferent,
      this.objectKeyboardControl,
      this.objectGrid,
      this.objectHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataReset(data: RangeSliderOptions) {
    [
      this.objectValues,
      this.objectCopyCode,
      this.objectDifferent,
      this.objectKeyboardControl,
      this.objectGrid,
      this.objectHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }
}

export default Panel;
