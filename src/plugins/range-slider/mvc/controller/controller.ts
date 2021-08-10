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


  handleCreateDomBase() {
    console.log('create Dom Elem');

  }



}



export { Controller, Model, View };