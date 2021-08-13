import { RangeSliderOptions } from './model.d';


class Model {

  type: string;
  orientation: string;
  theme: string;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;

  options: RangeSliderOptions;

  constructor(options: RangeSliderOptions) {

    this.createProperties(this.getConfig(options));
  }

  private getConfig(options: RangeSliderOptions) {
    return Object.assign({
      type: 'single',   // тип - одна или две точки
      orientation: 'horizontal',  // положение слайдера
      theme: 'base',    // тема слайдера
      min: 0,           // минимальное значение на школе
      max: 10,          // максимальное значение на школе
      from: 2,          // позиция первой точки
      to: 0,            // позиция второй точки
      step: 1           // с каким шагом будет перемещяться точка
    }, options);
  }

  private createProperties(options: RangeSliderOptions) {
    this.type = options.type;
    this.orientation = options.orientation;
    this.theme = options.theme;
    this.min = options.min;
    this.max = options.max;
    this.to = options.to;
    this.from = options.from;
    this.step = options.step;
  }

}



export { Model };