import './panel.scss';
import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/mvc/model/model.d';

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
    this.objInputData = new InputData(
      '.input-data',
      this.className + '__slider-wrap input'
    );
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

  setData(data: RangeSliderOptions) {
    this.objValues.setData({
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
    });

    this.objKeyboardControl.setData({
      keyStepOne: data.keyStepOne,
      keyStepHold: data.keyStepHold,
    });

    this.objInputData.setData();
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
    this.objDifferent.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      bar: data.bar,
      theme: data.theme,
    });

    this.setDataCode(data);
  }

  setDataCode(data: RangeSliderOptions) {

    this.objValues.setData({
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      step: data.step,
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

    this.objInputData.setData();
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

    const selector = this.className + '__slider-wrap input';
    const elem = this.elem.querySelector(selector);

    const obj = $(elem).RangeSliderFox({
      ...options
      ,
      onStart: (data: RangeSliderOptions) => {
        this.setData(data);
      },
      onChange: (data: RangeSliderOptions) => {
        this.setData(data);
      },
      onUpdate: (data: RangeSliderOptions) => {
        this.setDataCode(data);
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
  //type: 'single',
  //theme: 'fox',
  // orientation: 'vertical',
  min: -120,
  max: 800,
  from: 215,
  to: 500,
  bar: true,
  //disabled: true,
  //tipPrefix: '°C',
  // tipMinMax: false,
  // tipFromTo: false,
  grid: true,
  gridSnap: true,
  gridNum: 0,
  gridStep: 40,
  gridRound: 2,
});


objPanel[1].createRangeSlider({
  type: 'double',
  //type: 'single',
  orientation: 'vertical',
  theme: 'dark',
  min: 10,
  max: 800,
  from: 200,
  to: 500,
  bar: true,
  //disabled: true,
  // tipPrefix: '°C',
  // tipMinMax: false,
  // tipFromTo: false,
  grid: true,
  // gridSnap: true,
  gridNum: 10,
  //gridStep: 30,
});


objPanel[2].createRangeSlider({
  type: 'double',
  //type: 'single',
  theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  //disabled: true,
  // tipPrefix: '°C',
  // tipMinMax: false,
  // tipFromTo: false,
  grid: true,
  //gridSnap: true,
  //gridNum: 6,
  gridStep: 30,
});





