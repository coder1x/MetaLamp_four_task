import './panel.scss';
import RangeSliderOptions from '@com/interface/glob-interface.d';
import Values from '@com/values/values';
import InputData from '@com/input-data/input-data';
import Grid from '@com/grid/grid';
import Hints from '@com/hints/hints';
import Different from '@com/different/different';
import CopyCode from '@com/code/code';
import KeyboardControl from '@com/keyboard-control/keyboard-control';

class Panel {
  private elem: Element;

  private objValues: Values;

  private objInputData: InputData;

  private objGrid: Grid;

  private objHints: Hints;

  private objDifferent: Different;

  private objCopyCode: CopyCode;

  private className: string;

  private objKeyboardControl: KeyboardControl;

  constructor(elem: Element, className: string) {
    this.elem = elem;
    this.className = className;
    this.init();
  }

  createRangeSlider(options: RangeSliderOptions) {
    const selector = `${this.className}__slider-wrap`;
    const elem = this.elem.querySelector(selector);

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

    const obj = $(elem.firstElementChild).RangeSliderFox({
      ...options,
      onStart,
      onChange,
      onUpdate,
      onReset,
    }).data('RangeSliderFox'); // will return an object for one item

    this.objValues.setAction(obj);
    this.objGrid.setAction(obj);
    this.objHints.setAction(obj);

    let flag = false;
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

    this.objDifferent.setAction(obj);
    this.objKeyboardControl.setAction(obj);
  }

  private init() {
    this.objValues = new Values('.js-values', this.getDom('.js-values'));
    this.objInputData = new InputData(this.className, this.elem);
    this.objGrid = new Grid('.js-grid', this.getDom('.js-grid'));
    this.objHints = new Hints('.js-hints', this.getDom('.js-hints'));
    this.objDifferent = new Different(
      '.js-different',
      this.getDom('.js-different'),
      this.elem,
    );
    this.objCopyCode = new CopyCode('.js-code', this.getDom('.js-code'));

    this.objKeyboardControl = new KeyboardControl(
      '.js-keyboard-control',
      this.getDom('.js-keyboard-control'),
    );
  }

  private getDom(str: string) {
    return this.elem.querySelector(str);
  }

  private setDataS(data: RangeSliderOptions) {
    this.objValues.setData({ ...data });
    this.objCopyCode.setData({ ...data });
    this.objDifferent.setData({ ...data });
    this.objKeyboardControl.setData({ ...data });
    this.objGrid.setData({ ...data });
    this.objHints.setData({ ...data });
  }

  private setDataC(data: RangeSliderOptions) {
    this.objValues.setData({ ...data });
    this.objCopyCode.setData({ ...data });
    this.objKeyboardControl.setData({ ...data });
  }

  private setDataU(data: RangeSliderOptions) {
    this.objValues.setData({ ...data });
    this.objCopyCode.setData({ ...data });
    this.objDifferent.setData({ ...data });
    this.objKeyboardControl.setData({ ...data });
    this.objGrid.setData({ ...data });
    this.objHints.setData({ ...data });
  }

  private setDataR(data: RangeSliderOptions) {
    this.objValues.setData({ ...data });
    this.objCopyCode.setData({ ...data });
    this.objDifferent.setData({ ...data });
    this.objKeyboardControl.setData({ ...data });
    this.objGrid.setData({ ...data });
    this.objHints.setData({ ...data });
  }
}

function renderPanel(className: string) {
  const components = document.querySelectorAll(className);
  const panels: Panel[] = [];

  components.forEach((elem) => {
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
