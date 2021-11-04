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


  setDataChange(data: RangeSliderOptions) {
    this.objValues.setData({
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
    });

    this.objCopyCode.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      theme: data.theme,
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
      keyStepOne: data.keyStepOne,
      keyStepHold: data.keyStepHold,
      bar: data.bar,
      grid: data.grid,
      gridSnap: data.gridSnap,
      gridNum: data.gridNum,
      gridStep: data.gridStep,
      gridRound: data.gridRound,
      tipMinMax: data.tipMinMax,
      tipFromTo: data.tipFromTo,
      tipPrefix: data.tipPrefix,
      tipPostfix: data.tipPostfix,
    });
  }

  setData(data: RangeSliderOptions) {
    this.setDataU(data);
  }

  setDataU(data: RangeSliderOptions) {
    this.objValues.setData({
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
    });

    this.objDifferent.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      bar: data.bar,
      theme: data.theme,
    });

    this.objKeyboardControl.setData({
      keyStepOne: data.keyStepOne,
      keyStepHold: data.keyStepHold,
    });

    this.objGrid.setData({
      grid: data.grid,
      gridSnap: data.gridSnap,
      gridNum: data.gridNum,
      gridStep: data.gridStep,
      gridRound: data.gridRound,
    });

    this.objHints.setData({
      tipMinMax: data.tipMinMax,
      tipFromTo: data.tipFromTo,
      tipPrefix: data.tipPrefix,
      tipPostfix: data.tipPostfix,
    });

    this.objCopyCode.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      theme: data.theme,
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
      keyStepOne: data.keyStepOne,
      keyStepHold: data.keyStepHold,
      bar: data.bar,
      grid: data.grid,
      gridSnap: data.gridSnap,
      gridNum: data.gridNum,
      gridStep: data.gridStep,
      gridRound: data.gridRound,
      tipMinMax: data.tipMinMax,
      tipFromTo: data.tipFromTo,
      tipPrefix: data.tipPrefix,
      tipPostfix: data.tipPostfix,
    });
  }


  createRangeSlider(options: RangeSliderOptions) {

    const selector = this.className + '__slider-wrap';
    const elem = this.elem.querySelector(selector);

    const obj = $(elem.firstElementChild).RangeSliderFox({
      ...options
      ,
      onStart: (data: RangeSliderOptions) => {
        this.setData(data);
      },
      onChange: (data: RangeSliderOptions) => {
        this.setDataChange(data);
      },
      onUpdate: (data: RangeSliderOptions) => {
        this.setDataU(data);
      },
      onReset: (data: RangeSliderOptions) => {
        this.setData(data);
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
  orientation: 'horizontal',
  theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  grid: true,
  gridNum: 40,
});


// objPanel[1].createRangeSlider({
//   type: 'double',
//   orientation: 'vertical',
//   theme: 'dark',
//   min: -120,
//   max: 800,
//   from: 200,
//   to: 500,
//   bar: true,
//   grid: true,
//   gridStep: 33,
// });


// objPanel[2].createRangeSlider({
//   type: 'double',
//   min: -120,
//   max: 800,
//   from: 200,
//   to: 500,
//   grid: true,
//   bar: true,
//   gridStep: 30,
// });





