import { Model } from '../model/model';
import { View } from '../view/view';
import { CalcDotPositionOpt } from '../model/model.d';
import { onChangeFrom, onChangeTo } from './controller.d';



class Controller {

  flagTipCreate: boolean;
  flagBarCreate: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(public model: Model, public view: View) {


    this.createListeners();
    this.init();
  }


  init() {
    this.view.initHandle(this.getDataInitHandle());

    this.view.createDomBase(
      this.handleCreateDomBase,
      this.getDataTheme()
    );
  }


  getDataTheme() {
    const obj = this.model.getOptions();
    return obj.theme;
  }

  getDataInitHandle() {
    const obj = this.model.getOptions();
    return {
      type: obj.type,
      from: obj.from,
      to: obj.to,
      min: obj.min,
      max: obj.max,
      step: obj.step
    };
  }

  getDataHints() {
    const obj = this.model.getOptions();
    return {
      min: obj.min,
      max: obj.max,
      valFrom: obj.valFrom,
      valTo: obj.valTo,
      type: obj.type,
      tipPrefix: obj.tipPrefix,
    };
  }

  createListeners() {

    this.model.onChangeFrom = (data: onChangeFrom) => {
      this.view.setPositionFrom(data.fromP);
      if (this.flagTipCreate) {
        this.ubdateTipFrom(data.valFrom);
        this.ubdateTipSingle();
      }

      if (this.flagBarCreate)
        this.ubdateBar();
    };
    this.model.onChangeTo = (data: onChangeTo) => {
      this.view.setPositionTo(data.toP);
      if (this.flagTipCreate) {
        this.ubdateTipTo(data.valTo);
        this.ubdateTipSingle();
      }

      if (this.flagBarCreate)
        this.ubdateBar();
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
    this.view.setActions(this.handleActionsView);
    this.view.initHints(this.handleInitHints);
  }


  handleInitHints = () => {
    this.view.createDomHints(
      this.handleCreateDomHints,
      this.getDataHints()
    );

  }


  handleCreateDomHints = () => {

    this.view.initBar(this.handleInitBar);

    const obj = this.getDataHints();
    this.ubdateTipFrom(obj.valFrom);
    this.ubdateTipTo(obj.valTo);
    this.ubdateTipSingle();
    this.flagTipCreate = true;
  }

  handleInitBar = () => {
    this.view.createDomBar(this.handleCreateDomBar);
  }

  handleCreateDomBar = () => {

    //console.log('Bar создан');
    this.flagBarCreate = true;

    this.ubdateBar();
    // Bar создан теперь нужно просчитать координаты и ширину. 
    // для этого вызовим тут calc из модели. 
    // нужно будет обнавлять эти события при изменении ползунков. 
  }


  ubdateBar = () => {
    const obj = this.model.calcPositionBar();
    this.view.setPositionBar(obj.barX, obj.widthBar);
  }


  ubdateTipFrom = (valFrom: number) => {
    const obj = this.view.getWidthTipFromTo();
    const tipFromX = this.model.calcPositionTipFrom(obj.tipFrom);
    this.view.setTipFrom(valFrom, tipFromX);
  }

  ubdateTipTo = (valTo: number) => {
    const obj = this.view.getWidthTipFromTo();
    const tipToX = this.model.calcPositionTipTo(obj.tipTo);
    this.view.setTipTo(valTo, tipToX);
  }

  ubdateTipSingle = () => {
    const widthSingle = this.view.getWidthTipSingle();
    const position = this.model.calcPositionTipSingle(widthSingle);
    this.view.setTipSingleX(position);
  }

  handleActionsView = (pointX: number, wrapWidth: number) => {
    this.model.clickLine(pointX, wrapWidth);
  }

  handleActionsHandle = (options: CalcDotPositionOpt) => {
    this.model.calcDotPosition(options);

  }

}

export { Controller, Model, View };
