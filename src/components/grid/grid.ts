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

  constructor(nameClass: string, elem: Element) {
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
    const mapInput = new Map();
    mapInput.set('gridNum', this.interval.value);
    mapInput.set('gridStep', this.step.value);
    mapInput.set('gridRound', this.gridRound.value);

    this.gridRound.addEventListener('change', () => {
      obj.update({
        gridRound: +this.gridRound.value,
      });
    });

    this.step.addEventListener('change', () => {
      obj.update({
        gridNum: 0,
        gridStep: +this.step.value,
      });
      this.interval.value = '0';
    });

    this.interval.addEventListener('change', () => {
      obj.update({
        gridNum: +this.interval.value,
        gridStep: 0,
      });
      this.step.value = '0';
    });

    const inputProcessing = (event: Event) => {
      const elem = event.target as HTMLInputElement;

      const value = elem.value.replace(/[^.\d]/g, '');
      const regexp = /^\d*?[.]?\d*$/;
      const valid = regexp.test(value);

      if (valid) {
        mapInput.set(elem.name, value);
        elem.value = value;
      } else {
        elem.value = mapInput.get(elem.name);
      }
    };

    const inputElements = [this.interval, this.step, this.gridRound];

    inputElements.forEach((item) => {
      item.addEventListener('input', inputProcessing);
    });

    this.grid.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;

      obj.update({
        grid: elem.checked,
      });
    });

    this.snap.addEventListener('click', (event: Event) => {
      const elem = event.target as HTMLInputElement;

      if (this.grid.checked) {
        obj.update({
          gridSnap: elem.checked,
        });
      } else {
        event.preventDefault();
      }
    });
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
