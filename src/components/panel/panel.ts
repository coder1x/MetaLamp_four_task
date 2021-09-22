import './panel.scss';
import { RangeSliderOptions } from
  '../../plugins/range-slider-fox/mvc/model/model.d';

import { Values } from '../values/values';




class Panel {

  private elem: HTMLElement;
  private objValues: Values;


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


  }


  createRangeSlider(options: RangeSliderOptions) {
    // метод принимает конфиг

    // подвесим на события все объекты групп
    const theme = options.theme ?? 'base';

    const obj = $('.rslider__' + theme).RangeSliderFox({
      ...options
      ,
      // eslint-disable-next-line no-unused-vars
      onStart: (data: RangeSliderOptions) => {
        this.objValues.setData({
          min: data.min,
          max: data.max,
          from: data.from,
          to: data.to,
        });
      },
      // eslint-disable-next-line no-unused-vars
      onChange: (data: RangeSliderOptions) => {
        this.objValues.setData({
          min: data.min,
          max: data.max,
          from: data.from,
          to: data.to,
        });
      },
      // eslint-disable-next-line no-unused-vars
      onUpdate: (data: RangeSliderOptions) => {

      }
    }).data('RangeSliderFox'); // вернёт объект для одного элемента



    this.objValues.setAction(obj);
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
  // tipPrefix: '°C',
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
  //grid: true,
  //gridSnap: true,
  //gridNum: 6,
  gridStep: 30,
});





