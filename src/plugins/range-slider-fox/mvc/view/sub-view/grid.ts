import { DateGrid } from '../view.d';

import { Observer, TOB } from '../../../observer';

class Grid extends Observer {

  rsBottom: HTMLElement;
  rsName: string;
  elemGrid: HTMLElement;
  indent: number;
  masWidth: number[] = [];
  oddElements: HTMLElement[][] = [[]];
  evenElements: HTMLElement[][] = [[]];
  lastElem: HTMLElement;
  previousElem: HTMLElement;
  startWidth: number;
  offOn: boolean;
  resizeF: boolean;


  constructor(elem: HTMLElement | Element) {
    super();
    this.rsBottom = (elem as HTMLElement);
    this.init();
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }


  init() {
    this.offOn = false;
    this.resizeF = false;
    this.rsName = 'range-slider-fox';
    this.indent = 4; // отступ в пикселях между числами на шкале
    this.elemGrid = this.createElem('div', [this.rsName + '__grid']);
  }

  createMark = (val: number, position: number) => {
    const gridPol = this.createElem('div', [this.rsName + '__grid-pol']);
    const gridMark = this.createElem('span', [this.rsName + '__grid-mark']);
    gridMark.innerText = String(val);
    gridPol.appendChild(gridMark);
    gridPol.style.left = position + '%';
    this.elemGrid.appendChild(gridPol);
  }

  createDomGrid() {
    const observer = new MutationObserver(() => {
      this.shapingMark();
    });

    observer.observe(this.rsBottom, {
      childList: true,
    });

    this.rsBottom.appendChild(this.elemGrid);
    this.offOn = true;
  }

  deleteGrid() {
    const items = this.elemGrid.children;

    if (items.length > 0) {
      this.offOn = false;
      while (this.elemGrid.firstChild) {
        this.elemGrid.firstChild.remove();
      }

      this.masWidth = [];
      this.oddElements = [[]];
      this.evenElements = [[]];
      this.previousElem.remove();
      this.previousElem = null;
    }
  }

  toggleElem(elem: HTMLElement, display: string, opacity: string) {
    const st = elem.style;
    st.visibility = display;
    const wrapE = (elem.parentNode as HTMLElement);
    wrapE.style.opacity = opacity;
  }

  visibleLastElem() {
    const lastX = this.lastElem.getBoundingClientRect().left;
    const previousX = this.previousElem.getBoundingClientRect().left +
      this.previousElem.offsetWidth + this.indent;

    if (previousX >= lastX) {
      this.toggleElem(this.previousElem, 'hidden', '0.4');
    } else {
      this.toggleElem(this.previousElem, 'visible', '1');
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
    this.getResizeWrap();
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
        this.toggleElem(elem, 'hidden', '0.4');
      }
    }

    this.oddElements[i].map((elem) => { // делаем видемыми только нужные.
      this.toggleElem(elem, 'visible', '1');
    });

    const len = this.oddElements[i].length - 1;
    this.previousElem = this.oddElements[i][len];

    this.visibleLastElem();
  }


  getResizeWrap() {
    if (this.resizeF) return;
    this.resizeF = true;
    let sleep = 200;
    let rtime: Date;
    let timeout = false;
    this.startWidth = this.elemGrid.offsetWidth;

    (function () {
      let throttle = function (type: string, name: string, obj = window) {
        let running = false;
        let func = function () {
          if (running) { return; }
          running = true;
          requestAnimationFrame(function () {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };
      throttle("resize", "optimizedResize");
    })();

    const resizeend = () => {
      if (Number(new Date()) - Number(rtime) < sleep) {
        setTimeout(resizeend, sleep);
      } else {
        timeout = false;
        let totalWidth = this.elemGrid.offsetWidth;
        if (totalWidth != this.startWidth) {
          if (this.offOn)
            this.visibleMark();
          this.startWidth = totalWidth;
        }
      }
    };

    window.addEventListener("optimizedResize", function () {
      rtime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, sleep);
      }
    });
  }

}








export { Grid };