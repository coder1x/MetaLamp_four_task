import { Model } from '../model/model';
import { View } from '../view/view';

// eslint-disable-next-line no-unused-vars
import { CalcDotPositionOpt } from '../model/model.d';

// eslint-disable-next-line no-unused-vars
import { onChangeFrom, onChangeTo } from './controller.d';

import { RangeSliderOptions } from '../model/model.d';

import { TOB } from '../../observer';


class Controller {

  private startFl = false;

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
    this.startFl = true;
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

    this.model.calcOnePercent();

    // if (this.startFl) {
    //   const options = this.model.getOptions();
    //   this.model.update({
    //     from: options.from,
    //     to: options.to,
    //   });
    // }

  };


  private handleDotData = (options: TOB) => {
    const key = options.key;
    if (key != 'DotData') return;

    const type = options.type;

    this.view.createDotElem(type); // создаём точки

    const from = this.model.calcPositionDotFrom();
    this.view.setDotFrom(from);

    if (type == 'double') {
      const to = this.model.calcPositionDotTo();
      this.view.setDotTo(to);
    }

    this.view.setDotActions(type);

    if (this.startFl) {
      if (type == 'double') {
        if (!this.view.checkTipTo()) {
          this.view.createTipTo();
          this.view.setValTipTo(options.to);
        }
      }
      this.ubdateTipFromTo(options.from, options.to, options.type);
    }

  };


  private handleDotMove = (options: TOB) => {
    const key = options.key;
    if (key != 'DotMove') return;

    // console.log('handleDotMove');
    // console.log(options);

    this.model.calcDotPosition({
      type: options.type,
      wrapWH: options.wrapWH,
      position: options.position,
      clientXY: options.clientXY,
      shiftXY: options.shiftXY,
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


    this.view.setOrientation(options.orientation);
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

    const wrapWH = this.view.getWrapWH();
    this.model.setWrapWH(wrapWH);

    this.view.setHintsData(options);

    this.ubdateTipFromTo(options.from, options.to, options.type);
  };

  private ubdateTipFromTo(from: number, to: number, type: string) {

    const obj = this.view.getWidthTip();
    if (!obj.fromW && !obj.toW) return;

    let coorXY = this.model.calcPositionTipFrom(obj.fromW);
    this.view.setPositionFrom(coorXY, from);

    if (type == 'double') {
      coorXY = this.model.calcPositionTipTo(obj.toW);
      this.view.setPositionTo(coorXY, to);

      coorXY = this.model.calcPositionTipSingle(obj.singleW);
      this.view.setPositionSingle(coorXY);
    } else {
      this.view.deleteTipTo();
    }
  }




  private handleDisabledData = (options: TOB) => {
    const key = options.key;
    if (key != 'DisabledData') return;

    // console.log('handleDisabledData');
    // console.log(options);

  };





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



  // private handleActionsView = (pointX: number, wrapWidth: number) => {
  //   this.model.clickLine(pointX, wrapWidth);
  // }

  // private handleActionsHandle = (options: CalcDotPositionOpt) => {
  //   this.model.calcDotPosition(options);
  // }

}

export { Controller, Model, View };
