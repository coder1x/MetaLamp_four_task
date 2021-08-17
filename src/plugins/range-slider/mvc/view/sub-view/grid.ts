import { DateGrid } from '../view.d';

class Grid {

  rsBottom: HTMLElement;
  rsName: string;
  elemGrid: HTMLElement;
  interval: number;
  min: number;
  max: number;
  indent: number;
  masWidth: number[] = [];
  oddElements: HTMLElement[][] = [[]];
  evenElements: HTMLElement[][] = [[]];
  lastElem: HTMLElement;
  previousElem: HTMLElement;


  constructor(elem: HTMLElement | Element) {
    this.rsName = 'range-slider';
    this.indent = 4; // отступ в пикселях между числами на шкале
    this.rsBottom = (elem as HTMLElement);
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }


  setData(options: DateGrid) {
    this.interval = options.interval;
    this.min = options.min;
    this.max = options.max;
  }



  createDomGrid(handler: Function) {

    this.elemGrid = this.createElem('div', [this.rsName + '__grid']);

    const createMark = (val: number, position: number, elem: HTMLElement) => {
      const gridPol = this.createElem('div', [this.rsName + '__grid-pol']);
      const gridMark = this.createElem('span', [this.rsName + '__grid-mark']);
      gridMark.innerText = String(val);
      gridPol.appendChild(gridMark);
      gridPol.style.left = position + '%';
      elem.appendChild(gridPol);

    };


    createMark(this.min, 0, this.elemGrid);
    let obj = handler(this.min);
    createMark(obj.value, obj.position, this.elemGrid);

    for (let i = 1; i < this.interval - 1; i++) {
      obj = handler(obj.value);
      createMark(obj.value, obj.position, this.elemGrid);
    }

    createMark(this.max, 100, this.elemGrid);
    this.rsBottom.appendChild(this.elemGrid);
    this.shapingMark();
  }


  visibleLastElem() {
    const lastX = this.lastElem.getBoundingClientRect().left;
    const previousX = this.previousElem.getBoundingClientRect().left +
      this.previousElem.offsetWidth + this.indent;

    if (previousX >= lastX) {
      this.previousElem.style.visibility = 'hidden';
    } else {
      this.previousElem.style.visibility = 'visible';
    }
  }


  shapingMark() {
    const gridMarks = this.elemGrid.getElementsByClassName(
      this.rsName + '__grid-mark'
    );


    const len = gridMarks.length;
    if (len > 1) {
      this.lastElem = (gridMarks[len - 1] as HTMLElement);
    }


    let elemWidth = 0;

    for (let item of gridMarks) {
      const mark = (item as HTMLElement);
      const markX = mark.offsetWidth / 2;
      mark.style.left = '-' + markX + 'px';

      elemWidth += mark.offsetWidth + this.indent;
      this.oddElements[0].push(mark);
    }

    this.masWidth.push(elemWidth);

    this.oddElements[0].shift();
    this.oddElements[0].pop();

    let evenMas: HTMLElement[] = [];
    const breakIntoPieces = (mas: HTMLElement[]) => {
      elemWidth = 0;
      const newMas = mas.filter((elem, i) => {
        if (i % 2 == 0) { // каждый второй элемент массива
          evenMas.push(elem);
          return false;
        }
        else {
          elemWidth += elem.offsetWidth + this.indent;
          return true;
        }
      });

      if (newMas.length >= 2) {
        this.oddElements.push(newMas);
        this.evenElements.push(evenMas);
        evenMas = [];
        this.masWidth.push(elemWidth);
        breakIntoPieces(newMas);
      }
    };

    breakIntoPieces(this.oddElements[0]);

    this.visibleMark();

  }


  // скрываем или показываем цифры на шкале.
  visibleMark() {

    // находим индекс элементов - для нечётных - показать для чётных скрыть.
    const wrapWidth = this.elemGrid.offsetWidth;
    let i = 0;
    for (; i < this.masWidth.length; i++) {
      if (this.masWidth[i] <= wrapWidth)
        break;
    }

    for (let n = 0; n <= i; n++) { // скрываем все чётные элементы до необходимого уровня.
      for (let elem of this.evenElements[n]) {
        elem.style.visibility = 'hidden';
      }
    }

    this.oddElements[i].map((elem) => { // делаем видемыми только нужные.
      elem.style.visibility = 'visible';
    });

    const len = this.oddElements[i].length - 1;
    this.previousElem = this.oddElements[i][len];

    this.visibleLastElem();
  }




}








export { Grid };