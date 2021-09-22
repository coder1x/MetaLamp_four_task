import { Model } from '../model/model';
import { View } from '../view/view';
import { CalcDotPositionOpt } from '../model/model.d';
import { onChangeFrom, onChangeTo } from './controller.d';
import { RangeSliderOptions } from '../model/model.d';

import { TOB } from '../../observer';


class Controller {

  // flagTipCreate: boolean;
  // flagBarCreate: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(private model: Model, private view: View) {

    this.createListeners();
    this.init();
  }


  private createListeners() {

    this.model.subscribeOB(this.handleRangeData);
    this.model.subscribeOB(this.handleDotData);
    this.model.subscribeOB(this.handleGridSnapData);
    this.model.subscribeOB(this.handleGridData);
    this.model.subscribeOB(this.handleOrientationData);
    this.model.subscribeOB(this.handleThemeData);
    this.model.subscribeOB(this.handleHintsData);
    this.model.subscribeOB(this.handleDisabledData);

    this.view.subscribeOB(this.handleDotMove);

  }

  private init() {
    this.reset();

  }



  reset = () => {
    this.model.reset();
  }

  // eslint-disable-next-line no-unused-vars
  update = (options: RangeSliderOptions) => {
    this.model.update(options);
  }


  private handleRangeData = (options: TOB) => {
    const key = options.key;
    if (key != 'RangeData') return;

    // console.log('handleRangeData');
    // console.log(options);

    this.model.calcOnePercent();

  };


  private handleDotData = (options: TOB) => {
    const key = options.key;
    if (key != 'DotData') return;

    // console.log('handleDotData');
    // console.log(options);

    const type = options.type;

    this.view.createDotElem(type); // создаём точки

    const from = this.model.calcPositionDotFrom();
    this.view.setDotFrom(from);

    if (type == 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to, type);
    }

    this.view.setDotActions(type);

  };


  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return;

    // console.log('handleDotMove');
    // console.log(options);

    this.model.calcDotPosition({
      type: options.type,
      wrapWidth: options.wrapWidth,
      wrapLeft: options.wrapLeft,
      clientX: options.clientX,
      shiftX: options.shiftX,
    });

  };


  private handleGridSnapData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridSnapData') return;

    // console.log('handleGridSnapData');
    // console.log(options);

  };

  private handleGridData = (options: TOB) => {
    const key = options.key;
    if (key != 'GridData') return;

    // console.log('handleGridData');
    // console.log(options);

  };

  private handleOrientationData = (options: TOB) => {
    const key = options.key;
    if (key != 'OrientationData') return;

    // console.log('handleOrientationData');
    // console.log(options);

  };


  private handleThemeData = (options: TOB) => {
    const key = options.key;
    if (key != 'ThemeData') return;

    this.view.setTheme(options.theme);

    // console.log('handleThemeData');
    // console.log(options);

  };

  private handleHintsData = (options: TOB) => {
    const key = options.key;
    if (key != 'HintsData') return;

    // console.log('handleHintsData');
    // console.log(options);

  };

  private handleDisabledData = (options: TOB) => {
    const key = options.key;
    if (key != 'DisabledData') return;

    // console.log('handleDisabledData');
    // console.log(options);

  };







  // getDataTheme() {
  //   const obj = this.model.getOptions();
  //   return obj.theme;
  // }

  // getDataInitHandle() {
  //   const obj = this.model.getOptions();
  //   return {
  //     type: obj.type,
  //   };
  // }

  // getDataHints() {
  //   const obj = this.model.getOptions();
  //   return {
  //     min: obj.min,
  //     max: obj.max,
  //     valFrom: obj.valFrom,
  //     valTo: obj.valTo,
  //     type: obj.type,
  //     tipPrefix: obj.tipPrefix,
  //   };
  // }

  // private createListeners() {

  //   this.model.onChangeFrom = (data: onChangeFrom) => {
  //     this.view.setPositionFrom(data.fromP);
  //     if (this.flagTipCreate) {
  //       this.ubdateTipFrom(data.valFrom);
  //       this.ubdateTipSingle();
  //     }

  //     if (this.flagBarCreate)
  //       this.ubdateBar();
  //   };
  //   this.model.onChangeTo = (data: onChangeTo) => {
  //     this.view.setPositionTo(data.toP);
  //     if (this.flagTipCreate) {
  //       this.ubdateTipTo(data.valTo);
  //       this.ubdateTipSingle();
  //     }

  //     if (this.flagBarCreate)
  //       this.ubdateBar();
  //   };

  // }


  // private handleCreateDomBase = () => {
  //   this.view.initDomElem(this.handleInitDomElem);
  // }

  // private handleInitDomElem = () => {
  //   this.view.createHandle(this.handleCreateHandle);
  // }

  // private handleCreateHandle = (fromWidth: number, wrapWidth: number) => {

  //   this.model.calcPosition(fromWidth, wrapWidth);
  //   this.view.setActionsHandle(this.handleActionsHandle);
  //   this.view.setActions(this.handleActionsView);
  //   this.view.initHints(this.handleInitHints);
  // }


  // private handleInitHints = () => {
  //   this.view.createDomHints(
  //     this.handleCreateDomHints,
  //     this.getDataHints()
  //   );

  // }


  // private handleCreateDomHints = () => {

  //   this.view.initBar(this.handleInitBar);

  //   const obj = this.getDataHints();
  //   this.ubdateTipFrom(obj.valFrom);
  //   this.ubdateTipTo(obj.valTo);
  //   this.ubdateTipSingle();
  //   this.flagTipCreate = true;
  // }

  // private handleInitBar = () => {
  //   this.view.createDomBar(this.handleCreateDomBar);
  // }

  // private handleCreateDomBar = () => {
  //   this.flagBarCreate = true;
  //   this.ubdateBar();

  //   this.view.initGrid(this.handleInitGrid);
  // }

  // private handleInitGrid = () => {
  //   this.handleCreateDomGrid(); // это нужно будет убрать... 
  // }

  // getDataMinMax() {
  //   const obj = this.model.getOptions();
  //   return {
  //     min: obj.min,
  //     max: obj.max,
  //   };
  // }

  // private handleCreateDomGrid = () => {
  //   const interval = this.model.calcGridNumStep();
  //   const obj2 = this.getDataMinMax();

  //   this.view.setDataGrid({
  //     interval: interval,
  //     min: obj2.min,
  //     max: obj2.max
  //   });

  //   this.view.createDomGrid(this.getDateGrid);
  // }

  // private getDateGrid = (value: number) => {
  //   return this.model.calcPositionGrid(value);
  // }


  // private ubdateBar = () => {
  //   const obj = this.model.calcPositionBar();
  //   this.view.setPositionBar(obj.barX, obj.widthBar);
  // }


  // private ubdateTipFrom = (valFrom: number) => {
  //   const obj = this.view.getWidthTipFromTo();
  //   const tipFromX = this.model.calcPositionTipFrom(obj.tipFrom);
  //   this.view.setTipFrom(valFrom, tipFromX);
  // }

  // private ubdateTipTo = (valTo: number) => {
  //   const obj = this.view.getWidthTipFromTo();
  //   const tipToX = this.model.calcPositionTipTo(obj.tipTo);
  //   this.view.setTipTo(valTo, tipToX);
  // }

  // private ubdateTipSingle = () => {
  //   const widthSingle = this.view.getWidthTipSingle();
  //   const position = this.model.calcPositionTipSingle(widthSingle);
  //   this.view.setTipSingleX(position);
  // }

  // private handleActionsView = (pointX: number, wrapWidth: number) => {
  //   this.model.clickLine(pointX, wrapWidth);
  // }

  // private handleActionsHandle = (options: CalcDotPositionOpt) => {
  //   this.model.calcDotPosition(options);
  // }

}

export { Controller, Model, View };
