import './grid.scss';

interface OP {
  grid?: boolean;
  gridSnap?: boolean;
  gridNum?: number;
  gridStep?: number;
  gridRound?: number;
}


class Grid {

  private elem: HTMLElement;
  private grid: HTMLInputElement;
  private snap: HTMLInputElement;
  private interval: HTMLInputElement;
  private step: HTMLInputElement;
  private gridRound: HTMLInputElement;

  private gridD: boolean;
  private gridSnapD: boolean;
  private gridNumD: number;
  private gridStepD: number;
  private gridRoundD: number;

  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {

    this.elem = elem;
    this.setDom();
  }

  private setDom() {
    const getDom = (str: string) => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      ) as HTMLInputElement;
    };

    this.grid = getDom('grid');
    this.snap = getDom('snap');
    this.interval = getDom('interval');
    this.step = getDom('step');
    this.gridRound = getDom('round');
  }

  setData(options: OP) {
    const { grid, gridSnap, gridNum, gridStep, gridRound } = options;

    if (this.gridD != grid) {
      this.grid.checked = grid;
      this.gridD = grid;
    }
    if (this.gridSnapD != gridSnap) {
      this.snap.checked = gridSnap;
      this.gridSnapD = gridSnap;
    }
    if (this.gridNumD != gridNum) {
      this.interval.value = String(gridNum);
      this.gridNumD = gridNum;
    }
    if (this.gridStepD != gridStep) {
      this.step.value = String(gridStep);
      this.gridStepD = gridStep;
    }
    if (this.gridRoundD != gridRound) {
      this.gridRound.value = String(gridRound);
      this.gridRoundD = gridRound;
    }
  }

  setAction(obj: any) {

    let mapInput = new Map();
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
        gridNum: + this.interval.value,
        gridStep: 0,
      });
      this.step.value = '0';
    });

    const inputProcessing = (e: Event) => {
      const elem = e.target as HTMLInputElement;
      let val = elem.value.replace(/[^.\d]/g, '');

      let regexp = /^\d*?[.]?\d*$/;
      const valid = regexp.test(val);

      if (valid) {
        mapInput.set(elem.name, val);
        elem.value = val;
      } else {
        elem.value = mapInput.get(elem.name);
      }
    };


    const masE = [this.interval, this.step, this.gridRound];

    for (let item of masE) {
      item.addEventListener('input', inputProcessing);
    }

    this.grid.addEventListener('click', function () {
      obj.update({
        grid: this.checked
      });
    });

    this.snap.addEventListener('click', (e: Event) => {
      const elem = e.target as HTMLInputElement;
      if (this.grid.checked) {
        obj.update({
          gridSnap: elem.checked
        });
      } else {
        e.preventDefault();
      }

    });

  }


}



export { Grid };
