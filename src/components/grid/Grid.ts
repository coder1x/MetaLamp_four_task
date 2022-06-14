import { boundMethod } from 'autobind-decorator';

interface Options {
  grid?: boolean | null;
  gridSnap?: boolean | null;
  gridNumber?: number | null;
  gridStep?: number | null;
  gridRound?: number | null;
}

class Grid {
  private element: Element;

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

  private fieldValues: Map<string, string> | null = null;

  private objRangeSlider: any;

  constructor(nameClass: string, element: Element) {
    this.nameClass = nameClass;
    this.element = element;
    this.setDomElement();
  }

  setData(options: Options) {
    const {
      grid, gridSnap, gridNumber, gridStep, gridRound,
    } = options;

    let isNewData = this.gridCache !== grid;

    if (isNewData && this.grid) {
      this.grid.checked = grid ?? false;
      this.gridCache = grid ?? false;
    }

    isNewData = this.gridSnapCache !== gridSnap;

    if (isNewData && this.snap) {
      this.snap.checked = gridSnap ?? false;
      this.gridSnapCache = gridSnap ?? false;
    }

    isNewData = this.gridNumCache !== gridNumber;

    if (isNewData && this.interval) {
      this.interval.value = String(gridNumber);
      this.gridNumCache = gridNumber ?? 0;
    }

    isNewData = this.gridStepCache !== gridStep;

    if (isNewData && this.step) {
      this.step.value = String(gridStep);
      this.gridStepCache = gridStep ?? 0;
    }

    isNewData = this.gridRoundCache !== gridRound;

    if (isNewData && this.gridRound) {
      this.gridRound.value = String(gridRound);
      this.gridRoundCache = gridRound ?? 0;
    }
  }

  bindEvent<T>(rangeSlider: T) {
    this.objRangeSlider = rangeSlider;
    this.fieldValues = new Map();

    this.fieldValues.set(
      'gridNumber',
      (this.interval && this.interval.value) ?? '',
    );
    this.fieldValues.set(
      'gridStep',
      (this.step && this.step.value) ?? '',
    );
    this.fieldValues.set(
      'gridRound',
      (this.gridRound && this.gridRound.value) ?? '',
    );

    if (!this.gridRound || !this.step) return false;

    this.gridRound.addEventListener('change', this.handleGridRoundChange);
    this.step.addEventListener('change', this.handleStepChange);

    if (!this.interval || !this.grid) return false;

    this.interval.addEventListener('change', this.handleIntervalChange);

    [this.interval, this.step, this.gridRound].forEach((item) => {
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
    const element = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridRound: Number(element.value),
    });
  }

  @boundMethod
  private handleStepChange(event: Event) {
    if (!this.interval) return false;
    const element = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNumber: 0,
      gridStep: Number(element.value),
    });
    this.interval.value = '0';
    return true;
  }

  @boundMethod
  private handleIntervalChange(event: Event) {
    if (!this.step) return false;
    const element = event.currentTarget as HTMLInputElement;
    this.objRangeSlider.update({
      gridNumber: Number(element.value),
      gridStep: 0,
    });
    this.step.value = '0';
    return true;
  }

  @boundMethod
  private handleInputProcessing(event: Event) {
    if (!this.fieldValues) return false;
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value.replace(/[^.\d]/g, '');
    const REGEXP = /^\d*?[.]?\d*$/;

    if (REGEXP.test(value)) {
      this.fieldValues.set(element.name, value);
      element.value = value;
    } else {
      element.value = this.fieldValues.get(element.name) ?? '';
    }

    return true;
  }

  @boundMethod
  private handleGridClick(event: Event) {
    const element = event.currentTarget as HTMLInputElement;

    this.objRangeSlider.update({
      grid: element.checked,
    });
  }

  @boundMethod
  private handleSnapClick(event: Event) {
    if (!this.grid) return false;
    const element = event.currentTarget as HTMLInputElement;

    if (this.grid.checked) {
      this.objRangeSlider.update({
        gridSnap: element.checked,
      });
    } else {
      event.preventDefault();
    }

    return true;
  }

  private getDomElement(nameElement: string) {
    return this.element.querySelector(
      `${this.nameClass}__${nameElement}-wrapper input`,
    ) as HTMLInputElement;
  }

  private setDomElement() {
    this.grid = this.getDomElement('grid');
    this.snap = this.getDomElement('snap');
    this.interval = this.getDomElement('interval');
    this.step = this.getDomElement('step');
    this.gridRound = this.getDomElement('round');
  }
}

export default Grid;
