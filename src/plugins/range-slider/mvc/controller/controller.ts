import { Model } from '../model/model';
import { View } from '../view/view';



class Controller {

  constructor(model: Model, view: View) {

    console.log('Controller');
    console.log(model);
    console.log(view);


  }

}



export { Controller, Model, View };