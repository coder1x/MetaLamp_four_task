import './panel.scss';
import { RangeSliderOptions, HElem } from
  '../../components/interface/glob-interface';

import { Values } from '../values/values';
import { InputData } from '../input-data/input-data';
import { Grid } from '../grid/grid';
import { Hints } from '../hints/hints';
import { Different } from '../different/different';
import { CopyCode } from '../code/code';
import { KeyboardControl } from '../keyboard-control/keyboard-control';


class Panel {

  private elem: HElem;
  private objValues: Values;
  private objInputData: InputData;
  private objGrid: Grid;
  private objHints: Hints;
  private objDifferent: Different;
  private objCopyCode: CopyCode;
  private className: string;
  private objKeyboardControl: KeyboardControl;


  constructor(elem: HElem, className: string) {
    this.elem = elem;
    this.className = className;
    this.init();
  }


  createRangeSlider(options: RangeSliderOptions) {
    const selector = this.className + '__slider-wrap';
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
      ...options
      ,
      onStart,
      onChange,
      onUpdate,
      onReset
    }).data('RangeSliderFox'); // will return an object for one item


    this.objValues.setAction(obj);
    this.objGrid.setAction(obj);
    this.objHints.setAction(obj);

    let fl = false;
    this.objDifferent.onUnsubscribtion = () => {
      if (!fl) {
        fl = true;
        obj.update({
          onStart: null,
          onChange: null,
          onUpdate: null,
          onReset: null
        });

      } else {
        fl = false;
        obj.update({
          onStart,
          onChange,
          onUpdate,
          onReset
        });
      }
    };

    this.objDifferent.setAction(obj);
    this.objKeyboardControl.setAction(obj);
  }

  private init() {
    this.objValues = new Values('.values', this.getDom('.values'));
    this.objInputData = new InputData(this.className, this.elem);
    this.objGrid = new Grid('.grid', this.getDom('.grid'));
    this.objHints = new Hints('.hints', this.getDom('.hints'));
    this.objDifferent = new Different(
      '.different',
      this.getDom('.different'),
      this.elem);
    this.objCopyCode = new CopyCode('.code', this.getDom('.code'));

    this.objKeyboardControl = new KeyboardControl(
      '.keyboard-control',
      this.getDom('.keyboard-control')
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
  let components = document.querySelectorAll(className);
  let objMas: Panel[] = [];
  for (let elem of components) {
    objMas.push(new Panel(elem, className));
  }
  return objMas;
}



const objPanel = renderPanel('.panel');


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



