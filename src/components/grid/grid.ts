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
    this.grid.checked = options.grid;
    this.snap.checked = options.gridSnap;
    this.interval.value = String(options.gridNum);
    this.step.value = String(options.gridStep);
    this.gridRound.value = String(options.gridRound);
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

    this.snap.addEventListener('click', function () {
      obj.update({
        gridSnap: this.checked
      });
    });

  }


}



export { Grid };
