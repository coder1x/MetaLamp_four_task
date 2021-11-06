import './panel.scss';

import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/glob-interface';

import { Values } from '../values/values';
import { InputData } from '../input-data/input-data';
import { Grid } from '../grid/grid';
import { Hints } from '../hints/hints';
import { Different } from '../different/different';
import { CopyCode } from '../code/code';
import { KeyboardControl } from '../keyboard-control/keyboard-control';


class Panel {

  private elem: HTMLElement;
  private objValues: Values;
  private objInputData: InputData;
  private objGrid: Grid;
  private objHints: Hints;
  private objDifferent: Different;
  private objCopyCode: CopyCode;
  private className: string;
  private objKeyboardControl: KeyboardControl;


  constructor(elem: HTMLElement, className: string) {
    this.elem = elem;
    this.className = className;
    this.init();
  }

  private getDom(str: string) {
    return this.elem.querySelector(str) as HTMLElement;
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


  private setValue(data: RangeSliderOptions) {
    this.objValues.setData({
      ...data
    });
  }


  private setCopyCode(data: RangeSliderOptions) {
    this.objCopyCode.setData({
      ...data
    });
  }


  private setDifferent(data: RangeSliderOptions) {
    this.objDifferent.setData({
      ...data
    });
  }


  private setKeyboardControl(data: RangeSliderOptions) {
    this.objKeyboardControl.setData({
      ...data
    });
  }


  private setGrid(data: RangeSliderOptions) {
    this.objGrid.setData({
      ...data
    });
  }


  private setHints(data: RangeSliderOptions) {
    this.objHints.setData({
      ...data
    });
  }

  private setDataS(data: RangeSliderOptions) {
    this.setValue(data);
    this.setCopyCode(data);
    this.setDifferent(data);
    this.setKeyboardControl(data);
    this.setGrid(data);
    this.setHints(data);
  }

  private setDataC(data: RangeSliderOptions) {
    this.setValue(data);
    this.setCopyCode(data);
  }

  private setDataU(data: RangeSliderOptions) {
    this.setValue(data);
    this.setCopyCode(data);
    this.setDifferent(data);
    this.setKeyboardControl(data);
    this.setGrid(data);
    this.setHints(data);
  }

  private setDataR(data: RangeSliderOptions) {
    this.setValue(data);
    this.setCopyCode(data);
    this.setDifferent(data);
    this.setKeyboardControl(data);
    this.setGrid(data);
    this.setHints(data);
  }


  createRangeSlider(options: RangeSliderOptions) {

    const selector = this.className + '__slider-wrap';
    const elem = this.elem.querySelector(selector);

    const obj = $(elem.firstElementChild).RangeSliderFox({
      ...options
      ,
      onStart: (data: RangeSliderOptions) => {
        this.setDataS(data);
      },
      onChange: (data: RangeSliderOptions) => {
        this.setDataC(data);
      },
      onUpdate: (data: RangeSliderOptions) => {
        this.setDataU(data);
      },
      onReset: (data: RangeSliderOptions) => {
        this.setDataR(data);
      }
    }).data('RangeSliderFox'); // вернёт объект для одного элемента


    this.objValues.setAction(obj);
    this.objGrid.setAction(obj);
    this.objHints.setAction(obj);
    this.objDifferent.setAction(obj);
    this.objKeyboardControl.setAction(obj);
  }
}


function renderPanel(className: string) {
  let components = document.querySelectorAll(className);
  let objMas: Panel[] = [];
  for (let elem of components) {
    objMas.push(new Panel(elem as HTMLElement, className));
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





