
import { Observer } from '../../../observer';

class Grid extends Observer {

  private rsBottom: HTMLElement;
  private rsName: string;
  private elemGrid: HTMLElement;
  private indent: number;
  private masWH: number[] = [];
  private oddElements: HTMLElement[][] = [[]];
  private evenElements: HTMLElement[][] = [[]];
  private lastElem: HTMLElement;
  private previousElem: HTMLElement;
  private startWidth: number;
  private offOn: boolean;
  private resizeF: boolean;
  private vertical: boolean;


  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsBottom = (elem as HTMLElement);
    this.init();
  }


  private createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }


  private init() {

    this.offOn = false;
    this.resizeF = false;
    this.indent = 4; // отступ в пикселях между числами на шкале
    this.elemGrid = this.createElem('div', [this.rsName + '__grid']);

    const observer = new MutationObserver(() => {
      this.shapingMark();
    });

    observer.observe(this.rsBottom, {
      childList: true,
    });
  }


  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;
  }


  getOrientation() {
    const width = this.rsBottom.offsetWidth;
    const height = this.rsBottom.offsetHeight;
    return width > height ? false : true;
  }


  createMark = (valMark: {
    val: number,
    position: number,
  }[]) => {
    for (let item of valMark) {
      const { val, position } = item;
      const gridPol = this.createElem('div', [this.rsName + '__grid-pol']);
      const gridMark = this.createElem('span', [this.rsName + '__grid-mark']);
      gridMark.innerText = String(val);
      gridPol.appendChild(gridMark);
      const st = gridPol.style;
      const pos = position + '%';
      this.vertical ? st.bottom = pos : st.left = pos;
      this.elemGrid.appendChild(gridPol);
    }
  }


  setAction(elem: HTMLElement) {

    elem.addEventListener('click', (e: Event) => {
      const mark = e.target as HTMLElement;
      //const typeElem = mark.constructor.name;
      const selector = this.rsName + '__grid-mark';
      if (mark.className == selector) {
        this.notifyOB({
          key: 'ClickMark',
          valueG: Number(mark.innerText)
        });
      }
    });
  }


  createDomGrid() {
    this.rsBottom.appendChild(this.elemGrid);
    this.offOn = true;
    this.setAction(this.elemGrid);
  }


  deleteGrid() {
    const items = this.elemGrid.children;
    if (items.length > 0) {
      this.offOn = false;
      while (this.elemGrid.firstChild) {
        this.elemGrid.firstChild.remove();
      }
    }
  }


  private toggleElem(elem: HTMLElement, display: string, opacity: string) {
    const st = elem.style;
    st.visibility = display;
    const wrapE = (elem.parentNode as HTMLElement);
    wrapE.style.opacity = opacity;
  }


  private shapingMark() {
    this.masWH = [];
    this.oddElements = [[]];
    this.evenElements = [[]];
    let elemWH = 0;

    if (this.previousElem)
      this.previousElem.remove();
    this.previousElem = null;

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


    let k = 0;
    for (let item of gridMarks) {
      const mark = (item as HTMLElement);
      const pol = (gridPols[k++] as HTMLElement);

      const stMark = mark.style;

      if (this.vertical) {
        stMark.top = '-' + mark.offsetHeight / 2 + 'px';
        stMark.left = pol.offsetWidth + 2 + 'px';
        elemWH += mark.offsetHeight + this.indent;
      } else {
        stMark.left = '-' + mark.offsetWidth / 2 + 'px';
        stMark.top = pol.offsetHeight + 2 + 'px';
        elemWH += mark.offsetWidth + this.indent;
      }

      this.oddElements[0].push(mark);
    }

    this.masWH.push(elemWH);
    this.oddElements[0].shift();
    this.oddElements[0].pop();

    let evenMas: HTMLElement[] = [];

    const breakIntoPieces = (mas: HTMLElement[]) => {
      elemWH = 0;
      const newMas = mas.filter((elem, i) => {
        if (i % 2 == 0) { // каждый второй элемент массива
          evenMas.push(elem);
          return false;
        }
        else {
          elemWH += this.vertical ? elem.offsetHeight : elem.offsetWidth;
          elemWH += this.indent;
          return true;
        }
      });

      if (newMas.length >= 2) {
        this.oddElements.push(newMas);
        this.evenElements.push(evenMas);
        evenMas = [];
        this.masWH.push(elemWH);
        breakIntoPieces(newMas);
      }
    };

    breakIntoPieces(this.oddElements[0]);

    this.evenElements.shift();

    this.visibleMark();
    this.getResizeWrap();
  }


  // скрываем или показываем цифры на шкале.
  private visibleMark() {
    // находим индекс элементов - для нечётных - показать для чётных скрыть.
    const width = this.elemGrid.offsetWidth;
    const height = this.elemGrid.offsetHeight;
    const size = this.vertical ? height : width;

    const wrapWH = size;
    let i = 0;
    for (; i < this.masWH.length - 1; i++) {
      if (this.masWH[i] <= wrapWH)
        break;
    }

    for (let n = 0; n <= i; n++) { // скрываем все чётные элементы до необходимого уровня.
      if (this.evenElements[n])
        for (let elem of this.evenElements[n]) {
          this.toggleElem(elem, 'hidden', '0.4');
        }
    }

    let snapNum: number[] = [];

    this.oddElements[i].map((elem) => { // делаем видемыми только нужные.
      this.toggleElem(elem, 'visible', '1');
      snapNum.push(+elem.innerText);
    });

    const len = this.oddElements[i].length - 1;
    this.previousElem = this.oddElements[i][len];

    this.visibleLastElem(snapNum);
  }


  private visibleLastElem(snapNum: number[]) {
    if (!this.lastElem || !this.previousElem) return false;

    const lastR = this.lastElem.getBoundingClientRect();
    const previousR = this.previousElem.getBoundingClientRect();
    const lastXY = this.vertical ? lastR.bottom : lastR.left;

    let previousXY = this.vertical ? previousR.top : previousR.right;
    previousXY += this.indent;

    const flag = this.vertical ? previousXY <= lastXY : previousXY > lastXY;
    const number = +this.previousElem.innerText;

    if (flag) {
      this.toggleElem(this.previousElem, 'hidden', '0.4');
      snapNum = snapNum.filter((item) => item !== number);
    } else {
      this.toggleElem(this.previousElem, 'visible', '1');
      const len = snapNum.length - 1;
      if (snapNum[len] != number)
        snapNum.push(number);
    }

    this.notifyOB({
      key: 'SnapNum',
      snapNum: snapNum,
    });
    return true;
  }


  private getResizeWrap() {
    if (this.resizeF) return false;
    this.resizeF = true;
    let sleep = 200;
    let rtime: Date;
    let timeout = false;
    this.startWidth = this.elemGrid.offsetWidth;

    (function () {
      let throttle = function (type: string, name: string, obj = window) {
        let running = false;
        let func = function () {
          if (running) { return false; }
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
          if (this.offOn && !this.vertical) {
            this.visibleMark();
          }
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
    return true;
  }

}



export { Grid };