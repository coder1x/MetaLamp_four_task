import autoBind from 'auto-bind';
import './grid.scss';

interface Options {
  grid?: boolean;
  gridSnap?: boolean;
  gridNum?: number;
  gridStep?: number;
  gridRound?: number;
}

class Grid {
  private elem: Element;

  private grid: HTMLInputElement;

  private snap: HTMLInputElement;

  private interval: HTMLInputElement;

  private step: HTMLInputElement;

  private gridRound: HTMLInputElement;

  private gridCache: boolean;

  private gridSnapCache: boolean;

  private gridNumCache: number;

  private gridStepCache: number;

  private gridRoundCache: number;

  private nameClass: string;

  private mapInput: Map<string, string>;

  private objRangeSlider: any;

  constructor(nameClass: string, elem: Element) {
    autoBind(this);
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const {
      grid, gridSnap, gridNum, gridStep, gridRound,
    } = options;

    if (this.gridCache !== grid) {
      this.grid.checked = grid;
      this.gridCache = grid;
    }
    if (this.gridSnapCache !== gridSnap) {
      this.snap.checked = gridSnap;
      this.gridSnapCache = gridSnap;
    }
    if (this.gridNumCache !== gridNum) {
      this.interval.value = String(gridNum);
      this.gridNumCache = gridNum;
    }
    if (this.gridStepCache !== gridStep) {
      this.step.value = String(gridStep);
      this.gridStepCache = gridStep;
    }
    if (this.gridRoundCache !== gridRound) {
      this.gridRound.value = String(gridRound);
      this.gridRoundCache = gridRound;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    this.objRangeSlider = obj;
    this.mapInput = new Map();
    this.mapInput.set('gridNum', this.interval.value);
    this.mapInput.set('gridStep', this.step.value);
    this.mapInput.set('gridRound', this.gridRound.value);

    this.gridRound.addEventListener('change', this.handleGridRoundChange);
    this.step.addEventListener('change', this.handleStepChange);
    this.interval.addEventListener('change', this.handleIntervalChange);

    const inputElements = [this.interval, this.step, this.gridRound];

    inputElements.forEach((item) => {
      item.addEventListener('input', this.handleInputProcessing);
    });
    this.grid.addEventListener('click', this.handleGridClick);
    this.snap.addEventListener('click', this.handleSnapClick);
  }

  private handleGridRoundChange(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridRound: +elem.value,
    });
  }

  private handleStepChange(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNum: 0,
      gridStep: +elem.value,
    });
    this.interval.value = '0';
  }

  private handleIntervalChange(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNum: +elem.value,
      gridStep: 0,
    });
    this.step.value = '0';
  }

  private handleInputProcessing(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    const value = elem.value.replace(/[^.\d]/g, '');
    const regexp = /^\d*?[.]?\d*$/;
    const valid = regexp.test(value);

    if (valid) {
      this.mapInput.set(elem.name, value);
      elem.value = value;
    } else {
      elem.value = this.mapInput.get(elem.name);
    }
  }

  private handleGridClick(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      grid: elem.checked,
    });
  }

  private handleSnapClick(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    if (this.grid.checked) {
      this.objRangeSlider.update({
        gridSnap: elem.checked,
      });
    } else {
      event.preventDefault();
    }
  }

  private setDom() {
    const getDom = (str: string): HTMLInputElement => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    );

    this.grid = getDom('grid');
    this.snap = getDom('snap');
    this.interval = getDom('interval');
    this.step = getDom('step');
    this.gridRound = getDom('round');
  }
}

export default Grid;
