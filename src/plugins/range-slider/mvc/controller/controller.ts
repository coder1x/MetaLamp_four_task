import { Model } from '../model/model';
import { View } from '../view/view';
import { CalcDotPositionOpt } from '../model/model.d';
import { onChangeFrom, onChangeTo } from './controller.d';
import { RangeSliderOptions } from '../model/model.d';


class Controller {

  flagTipCreate: boolean;
  flagBarCreate: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: Model, private view: View) {

    this.createListeners();
    this.init();
  }

  reset = () => {

    // получаем из модели дефаултОптионс которые мы запомнили при анализе конфига

    // вызываем метод update и передаём туда этот конфиг. 
    // в итоге слайдер будет выглядить как в первый запуск.

    console.log('reset');
  }

  update = (options: RangeSliderOptions) => {
    //console.log(options);



    this.model.setOptions(options);



  }

  private init() {
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

  private createListeners() {

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


  private handleCreateDomBase = () => {
    this.view.initDomElem(this.handleInitDomElem);
  }

  private handleInitDomElem = () => {
    this.view.createHandle(this.handleCreateHandle);
  }

  private handleCreateHandle = (fromWidth: number, wrapWidth: number) => {

    this.model.calcPosition(fromWidth, wrapWidth);
    this.view.setActionsHandle(this.handleActionsHandle);
    this.view.setActions(this.handleActionsView);
    this.view.initHints(this.handleInitHints);
  }


  private handleInitHints = () => {
    this.view.createDomHints(
      this.handleCreateDomHints,
      this.getDataHints()
    );

  }


  private handleCreateDomHints = () => {

    this.view.initBar(this.handleInitBar);

    const obj = this.getDataHints();
    this.ubdateTipFrom(obj.valFrom);
    this.ubdateTipTo(obj.valTo);
    this.ubdateTipSingle();
    this.flagTipCreate = true;
  }

  private handleInitBar = () => {
    this.view.createDomBar(this.handleCreateDomBar);
  }

  private handleCreateDomBar = () => {
    this.flagBarCreate = true;
    this.ubdateBar();

    this.view.initGrid(this.handleInitGrid);
  }

  private handleInitGrid = () => {
    this.handleCreateDomGrid(); // это нужно будет убрать... 
  }

  getDataMinMax() {
    const obj = this.model.getOptions();
    return {
      min: obj.min,
      max: obj.max,
    };
  }

  private handleCreateDomGrid = () => {
    const interval = this.model.calcGridNumStep();
    const obj2 = this.getDataMinMax();

    this.view.setDataGrid({
      interval: interval,
      min: obj2.min,
      max: obj2.max
    });

    this.view.createDomGrid(this.getDateGrid);
  }

  private getDateGrid = (value: number) => {
    return this.model.calcPositionGrid(value);
  }


  private ubdateBar = () => {
    const obj = this.model.calcPositionBar();
    this.view.setPositionBar(obj.barX, obj.widthBar);
  }


  private ubdateTipFrom = (valFrom: number) => {
    const obj = this.view.getWidthTipFromTo();
    const tipFromX = this.model.calcPositionTipFrom(obj.tipFrom);
    this.view.setTipFrom(valFrom, tipFromX);
  }

  private ubdateTipTo = (valTo: number) => {
    const obj = this.view.getWidthTipFromTo();
    const tipToX = this.model.calcPositionTipTo(obj.tipTo);
    this.view.setTipTo(valTo, tipToX);
  }

  private ubdateTipSingle = () => {
    const widthSingle = this.view.getWidthTipSingle();
    const position = this.model.calcPositionTipSingle(widthSingle);
    this.view.setTipSingleX(position);
  }

  private handleActionsView = (pointX: number, wrapWidth: number) => {
    this.model.clickLine(pointX, wrapWidth);
  }

  private handleActionsHandle = (options: CalcDotPositionOpt) => {
    this.model.calcDotPosition(options);
  }

}

export { Controller, Model, View };
