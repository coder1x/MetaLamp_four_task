import { Model } from '../model/model';
import { View } from '../view/view';
import { CalcDotPositionOpt } from '../model/model.d';
import { onChangeFrom, onChangeTo } from './controller.d';



class Controller {

  // eslint-disable-next-line no-unused-vars
  constructor(public model: Model, public view: View) {


    this.createListeners();
    this.init();
  }


  init() {
    this.view.initHandle(
      {
        type: this.model.type,
        from: this.model.from,
        to: this.model.to,
        min: this.model.min,
        max: this.model.max,
        step: this.model.step
      }
    );

    this.view.createDomBase(
      this.handleCreateDomBase,
      this.model.theme
    );

  }

  createListeners() {

    this.model.onChangeFrom = (data: onChangeFrom) => {
      this.view.setPositionFrom(data.fromP);
    };
    this.model.onChangeTo = (data: onChangeTo) => {
      this.view.setPositionTo(data.toP);
    };

  }



  handleCreateDomBase = () => {
    this.view.initDomElem(this.handleInitDomElem);
  }

  handleInitDomElem = () => {
    this.view.createHandle(this.handleCreateHandle);
  }

  handleCreateHandle = (fromWidth: number, wrapWidth: number) => {

    this.model.calcPosition(fromWidth, wrapWidth);
    this.view.setActionsHandle(this.handleActionsHandle);
  }

  handleActionsHandle = (options: CalcDotPositionOpt) => {
    this.model.calcDotPosition(options);



  }

}

export { Controller, Model, View };
