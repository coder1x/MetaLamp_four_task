import './panel.scss';
import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/mvc/model/model.d';

import { Values } from '../values/values';
import { SliderData } from '../slider-data/slider-data';
import { Grid } from '../grid/grid';
import { Hints } from '../hints/hints';
import { Different } from '../different/different';
import { CopyCode } from '../code/code';



class Panel {

  private elem: HTMLElement;
  private objValues: Values;
  private objSliderData: SliderData;
  private objGrid: Grid;
  private objHints: Hints;
  private objDifferent: Different;
  private objCopyCode: CopyCode;

  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {
    this.elem = elem;
    this.init();
  }

  private getDom(str: string) {
    return this.elem.querySelector(str) as HTMLElement;
  }

  private init() {
    this.objValues = new Values('.values', this.getDom('.values'));
    this.objSliderData = new SliderData(
      '.slider-data',
      this.getDom('.slider-data')
    );
    this.objGrid = new Grid('.grid', this.getDom('.grid'));
    this.objHints = new Hints('.hints', this.getDom('.hints'));
    this.objDifferent = new Different('.different', this.getDom('.different'));
    this.objCopyCode = new CopyCode('.code', this.getDom('.code'));
  }

  setData(data: RangeSliderOptions) {
    this.objValues.setData({
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
    });
    this.objSliderData.setData({
      from: data.from,
      to: data.to,
    });
    this.objGrid.setData({
      grid: data.grid,
      gridSnap: data.gridSnap,
      gridNum: data.gridNum,
      gridStep: data.gridStep,
    });
    this.objHints.setData({
      tipMinMax: data.tipMinMax,
      tipFromTo: data.tipFromTo,
      tipPrefix: data.tipPrefix,
    });
    this.objDifferent.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      theme: data.theme,
    });

    this.setDataCode(data);
  }

  setDataCode(data: RangeSliderOptions) {
    this.objCopyCode.setData({
      type: data.type,
      disabled: data.disabled,
      orientation: data.orientation,
      theme: data.theme,
      min: data.min,
      max: data.max,
      from: data.from,
      to: data.to,
      grid: data.grid,
      gridSnap: data.gridSnap,
      gridNum: data.gridNum,
      gridStep: data.gridStep,
      tipMinMax: data.tipMinMax,
      tipFromTo: data.tipFromTo,
      tipPrefix: data.tipPrefix,
    });
  }


  createRangeSlider(options: RangeSliderOptions) {
    // метод принимает конфиг

    // подвесим на события все объекты групп
    const theme = options.theme ?? 'base';

    const obj = $('.rslider__' + theme).RangeSliderFox({
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
    this.objDifferent.setAction(obj, this.elem);
  }


}



function renderPanel(className: string) {
  let components = document.querySelectorAll(className);
  let objMas: Panel[] = [];
  for (let elem of components) {
    objMas.push(new Panel(className, elem as HTMLElement));
  }
  return objMas;
}



const objPanel = renderPanel('.panel');


objPanel[0].createRangeSlider({
  type: 'double',
  //type: 'single',
  //theme: 'fox',
  min: -120,
  max: 800,
  from: 200,
  to: 500,
  //disabled: true,
  //tipPrefix: '°C',
  // tipMinMax: false,
  // tipFromTo: false,
  //grid: true,
  //gridSnap: true,
  //gridNum: 6,
  gridStep: 30,
});


objPanel[1].createRangeSlider({
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
  gridSnap: true,
  //gridNum: 6,
  gridStep: 30,
});





