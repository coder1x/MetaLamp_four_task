import './panel.scss';
import RangeSliderOptions from '@com/interface/glob-interface.d';
import Values from '@com/values/Values';
import InputData from '@com/input-data/InputData';
import Grid from '@com/grid/Grid';
import Hints from '@com/hints/Hints';
import Different from '@com/different/Different';
import CopyCode from '@com/code/CopyCode';
import KeyboardControl from '@com/keyboard-control/KeyboardControl';

interface Actions {
  setAction: Function
}

class Panel {
  private elem: Element | null = null;

  private objValues: Values | null = null;

  private objInputData: InputData | null = null;

  private objGrid: Grid | null = null;

  private objHints: Hints | null = null;

  private objDifferent: Different | null = null;

  private objCopyCode: CopyCode | null = null;

  private className: string = '';

  private objKeyboardControl: KeyboardControl | null = null;

  constructor(elem: Element, className: string) {
    this.elem = elem;
    this.className = className;
    this.init();
  }

  createRangeSlider(options: RangeSliderOptions) {
    if (!this.elem) return false;

    const elem = this.elem.querySelector(`${this.className}__slider-wrap`);

    const onStart = (data: RangeSliderOptions) => {
      this.setDataS(data);
    };

    const onChange = (data: RangeSliderOptions) => {
      this.setDataC(data);
    };

    const onUpdate = (data: RangeSliderOptions) => {
      this.setDataU(data);
    };

    const onReset = (data: RangeSliderOptions) => {
      this.setDataR(data);
    };

    const dom = elem && elem.firstElementChild;

    if (!dom) return false;

    const obj = $(dom).RangeSliderFox({
      ...options,
      onStart,
      onChange,
      onUpdate,
      onReset,
    }).data('RangeSliderFox'); // will return an object for one item

    const setAction = <T extends Actions | null>(object: T) => {
      if (!object) return false;
      object.setAction(obj);
      return true;
    };

    setAction(this.objValues);
    setAction(this.objGrid);
    setAction(this.objHints);

    let flag = false;

    if (this.objDifferent) {
      this.objDifferent.onUnsubscribtion = () => {
        if (!flag) {
          flag = true;
          obj.update({
            onStart: null,
            onChange: null,
            onUpdate: null,
            onReset: null,
          });
        } else {
          flag = false;
          obj.update({
            onStart,
            onChange,
            onUpdate,
            onReset,
          });
        }
      };
    }

    setAction(this.objDifferent);
    setAction(this.objKeyboardControl);

    return true;
  }

  private init() {
    this.objValues = new Values(
      '.js-values',
      this.getDom('.js-values') as Element,
    );

    if (this.elem) {
      this.objInputData = new InputData(this.className, this.elem);
    }
    this.objGrid = new Grid(
      '.js-grid',
      this.getDom('.js-grid') as Element,
    );
    this.objHints = new Hints(
      '.js-hints',
      this.getDom('.js-hints') as Element,
    );

    if (this.elem) {
      this.objDifferent = new Different(
        '.js-different',
        this.getDom('.js-different') as Element,
        this.elem,
      );
    }
    this.objCopyCode = new CopyCode(
      '.js-code',
      this.getDom('.js-code') as Element,
    );

    this.objKeyboardControl = new KeyboardControl(
      '.js-keyboard-control',
      this.getDom('.js-keyboard-control') as Element,
    );
  }

  private getDom(str: string) {
    if (!this.elem) return null;
    return this.elem.querySelector(str);
  }

  private setDataS(data: RangeSliderOptions) {
    [
      this.objValues,
      this.objCopyCode,
      this.objDifferent,
      this.objKeyboardControl,
      this.objGrid,
      this.objHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataC(data: RangeSliderOptions) {
    [
      this.objValues,
      this.objCopyCode,
      this.objKeyboardControl,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataU(data: RangeSliderOptions) {
    [
      this.objValues,
      this.objCopyCode,
      this.objDifferent,
      this.objKeyboardControl,
      this.objGrid,
      this.objHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }

  private setDataR(data: RangeSliderOptions) {
    [
      this.objValues,
      this.objCopyCode,
      this.objDifferent,
      this.objKeyboardControl,
      this.objGrid,
      this.objHints,
    ].forEach((item) => {
      if (!item) return;
      item.setData({ ...data });
    });
  }
}

function renderPanel(className: string) {
  const panels: Panel[] = [];

  document.querySelectorAll(className).forEach((elem) => {
    panels.push(new Panel(elem, className));
  });

  return panels;
}

const objPanel = renderPanel('.js-panel');

objPanel[0].createRangeSlider({
  type: 'double',
  theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridNum: 40,
});

objPanel[1].createRangeSlider({
  type: 'double',
  orientation: 'vertical',
  theme: 'dark',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridStep: 33,
});

objPanel[2].createRangeSlider({
  type: 'double',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  grid: true,
  bar: true,
  gridStep: 30,
});
