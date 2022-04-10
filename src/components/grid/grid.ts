import { boundMethod } from 'autobind-decorator';
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

  private grid: HTMLInputElement | null = null;

  private snap: HTMLInputElement | null = null;

  private interval: HTMLInputElement | null = null;

  private step: HTMLInputElement | null = null;

  private gridRound: HTMLInputElement | null = null;

  private gridCache: boolean = false;

  private gridSnapCache: boolean = false;

  private gridNumCache: number = 0;

  private gridStepCache: number = 0;

  private gridRoundCache: number = 0;

  private nameClass: string;

  private mapInput: Map<string, string> | null = null;

  private objRangeSlider: any;

  constructor(nameClass: string, elem: Element) {
    this.nameClass = nameClass;
    this.elem = elem;
    this.setDom();
  }

  setData(options: Options) {
    const {
      grid, gridSnap, gridNum, gridStep, gridRound,
    } = options;

    if (this.gridCache !== grid && this.grid) {
      this.grid.checked = grid ?? false;
      this.gridCache = grid ?? false;
    }
    if (this.gridSnapCache !== gridSnap && this.snap) {
      this.snap.checked = gridSnap ?? false;
      this.gridSnapCache = gridSnap ?? false;
    }
    if (this.gridNumCache !== gridNum && this.interval) {
      this.interval.value = String(gridNum);
      this.gridNumCache = gridNum ?? 0;
    }
    if (this.gridStepCache !== gridStep && this.step) {
      this.step.value = String(gridStep);
      this.gridStepCache = gridStep ?? 0;
    }
    if (this.gridRoundCache !== gridRound && this.gridRound) {
      this.gridRound.value = String(gridRound);
      this.gridRoundCache = gridRound ?? 0;
    }
  }

  // тут тип any, потому что метод data из jQuery его возвращает. ( data(key: string): any; )
  setAction(obj: any) {
    this.objRangeSlider = obj;
    this.mapInput = new Map();

    const interval = (this.interval && this.interval.value) ?? '';
    const step = (this.step && this.step.value) ?? '';
    const gridRound = (this.gridRound && this.gridRound.value) ?? '';

    this.mapInput.set('gridNum', interval);
    this.mapInput.set('gridStep', step);
    this.mapInput.set('gridRound', gridRound);

    if (!this.gridRound || !this.step) return false;

    this.gridRound.addEventListener('change', this.handleGridRoundChange);
    this.step.addEventListener('change', this.handleStepChange);

    if (!this.interval || !this.grid) return false;

    this.interval.addEventListener('change', this.handleIntervalChange);

    const inputElements = [this.interval, this.step, this.gridRound];

    inputElements.forEach((item) => {
      item.addEventListener('input', this.handleInputProcessing);
    });
    this.grid.addEventListener('click', this.handleGridClick);

    if (this.snap) {
      this.snap.addEventListener('click', this.handleSnapClick);
    }

    return true;
  }

  @boundMethod
  private handleGridRoundChange(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridRound: +elem.value,
    });
  }

  @boundMethod
  private handleStepChange(event: Event) {
    if (!this.interval) return false;
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNum: 0,
      gridStep: +elem.value,
    });
    this.interval.value = '0';
    return true;
  }

  @boundMethod
  private handleIntervalChange(event: Event) {
    if (!this.step) return false;
    const elem = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNum: +elem.value,
      gridStep: 0,
    });
    this.step.value = '0';
    return true;
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    if (!this.mapInput) return false;
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value.replace(/[^.\d]/g, '');
    const regexp = /^\d*?[.]?\d*$/;
    const valid = regexp.test(value);

    if (valid) {
      this.mapInput.set(elem.name, value);
      elem.value = value;
    } else {
      elem.value = this.mapInput.get(elem.name) ?? '';
    }

    return true;
  }

  @boundMethod
  private handleGridClick(event: Event) {
    const elem = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      grid: elem.checked,
    });
  }

  @boundMethod
  private handleSnapClick(event: Event) {
    if (!this.grid) return false;
    const elem = event.currentTarget as HTMLInputElement;

    if (this.grid.checked) {
      this.objRangeSlider.update({
        gridSnap: elem.checked,
      });
    } else {
      event.preventDefault();
    }

    return true;
  }

  private setDom() {
    const getDom = (str: string) => this.elem.querySelector(
      `${this.nameClass}__${str}-wrap input`,
    ) as HTMLInputElement;

    this.grid = getDom('grid');
    this.snap = getDom('snap');
    this.interval = getDom('interval');
    this.step = getDom('step');
    this.gridRound = getDom('round');
  }
}

export default Grid;
