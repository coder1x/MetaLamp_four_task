
import { Observer } from '../../../observer';

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
  vertical: boolean;


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

  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let val = '';
      if (this.vertical) {
        if (elem.left == '') return;
        val = elem.left;
        elem.removeProperty('left');
        elem.bottom = val;
      } else {
        if (elem.bottom == '') return;
        val = elem.bottom;
        elem.removeProperty('bottom');
        elem.left = val;
      }
    };

    const convertGap = (elem: CSSStyleDeclaration) => {
      if (elem.left == '') return;
      let val = elem.left;
      if (this.vertical) {
        const num = parseInt(val);
        val = Math.abs(num) + 'px';
      } else {
        val = '-' + val;
      }
      elem.left = val;
    };

    const elements = this.elemGrid.childNodes;

    for (let item of elements) {
      const pol = item as HTMLElement;
      convertStyle(pol.style);

      const mark = pol.firstChild as HTMLElement;
      const stMark = mark.style;
      if (this.vertical) {
        stMark.top = '-' + mark.offsetHeight / 2 + 'px';
      } else {
        stMark.top = pol.offsetHeight + 2 + 'px';
      }
      convertGap(stMark);
    }

  }

  createMark = (val: number, position: number) => {
    const gridPol = this.createElem('div', [this.rsName + '__grid-pol']);
    const gridMark = this.createElem('span', [this.rsName + '__grid-mark']);
    gridMark.innerText = String(val);
    gridPol.appendChild(gridMark);
    this.setAction(gridMark);

    const st = gridPol.style;
    const pos = position + '%';
    this.vertical ? st.bottom = pos : st.left = pos;
    this.elemGrid.appendChild(gridPol);
  }

  setAction(elem: HTMLElement) {
    const _this = this;
    elem.addEventListener('click', function () {
      _this.notifyOB({
        key: 'ClickMark',
        valueG: Number(this.innerText)
      });
    });
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
      if (this.previousElem)
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

    const gridPols = this.elemGrid.getElementsByClassName(
      this.rsName + '__grid-pol'
    );

    const len = gridMarks.length;
    if (len > 1) {
      this.lastElem = (gridMarks[len - 1] as HTMLElement);
    }
    let elemWidth = 0;

    let k = 0;
    for (let item of gridMarks) {
      const mark = (item as HTMLElement);
      const pol = (gridPols[k++] as HTMLElement);

      const stMark = mark.style;

      if (this.vertical) {
        stMark.top = '-' + mark.offsetHeight / 2 + 'px';
        stMark.left = pol.offsetWidth + 2 + 'px';
      } else {
        stMark.left = '-' + mark.offsetWidth / 2 + 'px';
        stMark.top = pol.offsetHeight + 2 + 'px';
      }

      if (!this.vertical) {
        elemWidth += mark.offsetWidth + this.indent;
        this.oddElements[0].push(mark);
      }
    }
    if (this.vertical) return;

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
    if (this.vertical) return;
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
          if (this.offOn && !this.vertical)
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