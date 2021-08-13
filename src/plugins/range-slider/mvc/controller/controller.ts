import { Model } from '../model/model';
import { View } from '../view/view';



class Controller {

  // eslint-disable-next-line no-unused-vars
  constructor(public model: Model, public view: View) {

    this.createListeners();
  }


  createListeners() {


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


  handleCreateDomBase = () => {
    this.view.initDomElem(this.handleInitDomElem);
  }

  handleInitDomElem = () => {
    this.view.createHandle(this.handleCreateHandle);
  }

  handleCreateHandle = () => {

    this.view.setActionsHandle(this.handleActionsHandle);

  }

  handleActionsHandle = () => {

  }


}

export { Controller, Model, View };