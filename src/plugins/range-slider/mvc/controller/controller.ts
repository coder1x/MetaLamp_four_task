import { Model } from '../model/model';
import { View } from '../view/view';



class Controller {

  // eslint-disable-next-line no-unused-vars
  constructor(public model: Model, public view: View) {

    this.createListeners();
  }


  createListeners() {

    // сначало делаем запрос в модель что бы получить необходимые данные
    // затем вызываем Вью для создания дом элементов


    this.view.createDomBase(
      this.handleCreateDomBase,
      this.model.theme
    );

  }


  handleCreateDomBase = () => {
    this.view.initDomElem(this.handleInitDomElem);
  }

  handleInitDomElem = () => {
    this.view.createHandle(
      this.handleCreateHandle,
      {
        type: this.model.type,
        from: this.model.from,
        to: this.model.to
      });
  }

  handleCreateHandle = () => {




  }



}



export { Controller, Model, View };