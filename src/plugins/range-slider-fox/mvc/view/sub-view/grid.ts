import { Observer } from '../../../observer';
import Resize from '../resize';

class Grid extends Observer {
  private rsBottom: HTMLElement;

  private rsName: string;

  private elemGrid: HTMLElement;

  private indent: number;

  private masWH: number[] = [];

  private oddElements: HTMLElement[][] = [[]];

  private evenElements: HTMLElement[][] = [[]];

  private lastElem: Element;

  private previousElem: HTMLElement;

  private offOn: boolean;

  private vertical: boolean;

  private resizeF: boolean = false;

  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;

    if (elem instanceof HTMLElement) { this.rsBottom = elem; }
    this.init();
  }

  setOrientation(str: string) {
    this.vertical = str === 'vertical';
    return this.vertical;
  }

  getOrientation() {
    const width = this.rsBottom.offsetWidth;
    const height = this.rsBottom.offsetHeight;
    return !(width > height);
  }

  createMark = (valMark: {
    val: number,
    position: number,
  }[]) => {
    valMark.forEach((item) => {
      const { val, position } = item;
      const polName = `${this.rsName}__grid-pol`;
      const gridPol = Grid.createElem('div', [polName, `js-${polName}`]);
      const markName = `${this.rsName}__grid-mark`;
      const gridMark = Grid.createElem('span', [markName, `js-${markName}`]);

      gridMark.innerText = String(val);
      gridPol.appendChild(gridMark);
      const st = gridPol.style;
      const pos = `${position}%`;

      if (this.vertical) {
        st.bottom = pos;
      } else {
        st.left = pos;
      }

      this.elemGrid.appendChild(gridPol);
    });
    return this.elemGrid;
  }

  createDomGrid() {
    this.rsBottom.appendChild(this.elemGrid);
    this.offOn = true;
    this.setAction(this.elemGrid);
    return this.rsBottom;
  }

  deleteGrid() {
    const items = this.elemGrid.children;
    if (items.length > 0) {
      this.offOn = false;
      while (this.elemGrid.firstChild) {
        this.elemGrid.firstChild.remove();
      }
      return true;
    }
    return false;
  }

  private static searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    return regexp.test(text);
  }

  private setAction(elem: HTMLElement) {
    elem.addEventListener('click', (e: Event) => {
      const mark = e.target as HTMLElement;
      const selector = `js-${this.rsName}__grid-mark`;
      if (Grid.searchStr(mark.className, selector)) {
        this.notifyOB({
          key: 'ClickMark',
          valueG: Number(mark.innerText),
        });
      }
    });
  }

  private static createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);

    className.forEach((item) => {
      elem.classList.add(item);
    });

    return elem;
  }

  private init() {
    this.offOn = false;
    this.indent = 4; // indent in pixels between values on the scale
    const gridName = `${this.rsName}__grid`;
    this.elemGrid = Grid.createElem('div', [gridName, `js-${gridName}`]);

    const observer = new MutationObserver(() => {
      this.shapingMark();
    });

    observer.observe(this.rsBottom, {
      childList: true,
    });
  }

  private static toggleElem(
    elem: HTMLElement,
    display: string,
    opacity: string,
  ) {
    const st = elem.style;
    st.visibility = display;
    const wrapE = elem.parentNode as HTMLElement;
    wrapE.style.opacity = opacity;
  }

  private shapingMark() {
    this.masWH = [];
    this.oddElements = [[]];
    this.evenElements = [[]];
    let elemWH = 0;

    if (this.previousElem) { this.previousElem.remove(); }
    this.previousElem = null;

    const gridMarks = this.elemGrid.getElementsByClassName(
      `js-${this.rsName}__grid-mark`,
    );

    const gridPols = this.elemGrid.getElementsByClassName(
      `js-${this.rsName}__grid-pol`,
    );

    const len = gridMarks.length;
    if (len > 1) {
      this.lastElem = gridMarks[len - 1];
    }

    let k = 0;
    for (let i = 0; i < len; i += 1) {
      const mark = gridMarks[i] as HTMLElement;
      const gridPolsT = gridPols[k] as HTMLElement;
      k += 1;

      const stMark = mark.style;

      if (this.vertical) {
        stMark.top = `-${mark.offsetHeight / 2}px`;
        stMark.left = `${gridPolsT.offsetWidth + 2}px`;
        elemWH += mark.offsetHeight + this.indent;
      } else {
        stMark.left = `-${mark.offsetWidth / 2}px`;
        stMark.top = `${gridPolsT.offsetHeight + 2}px`;
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
        if (i % 2 === 0) { // every second element of the array
          evenMas.push(elem);
          return false;
        }

        elemWH += this.vertical ? elem.offsetHeight : elem.offsetWidth;
        elemWH += this.indent;
        return true;
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

    if (!this.resizeF) {
      this.resizeF = true;
      const objResize = new Resize(this.elemGrid, 200, () => {
        if (this.offOn && !this.vertical) {
          this.visibleMark();
        }
      });
    }
  }

  // hide or show values on the scale
  private visibleMark() {
    // define element index: show odd values and hide honest ones
    const width = this.elemGrid.offsetWidth;
    const height = this.elemGrid.offsetHeight;
    const size = this.vertical ? height : width;

    const wrapWH = size;
    let i = 0;
    for (; i < this.masWH.length - 1; i += 1) {
      if (this.masWH[i] <= wrapWH) { break; }
    }

    for (let n = 0; n <= i; n += 1) { // hide honest elements till the necessary level
      if (this.evenElements[n]) {
        this.evenElements[n].forEach((elem) => {
          Grid.toggleElem(elem, 'hidden', '0.4');
        });
      }
    }

    const snapNum: number[] = [];

    this.oddElements[i].forEach((elem) => { // show the necessary elements only
      Grid.toggleElem(elem, 'visible', '1');
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
    let snapNumber: number[] = [];

    if (flag) {
      Grid.toggleElem(this.previousElem, 'hidden', '0.4');
      snapNumber = snapNum.filter((item) => item !== number);
    } else {
      Grid.toggleElem(this.previousElem, 'visible', '1');
      const len = snapNum.length - 1;
      if (snapNum[len] !== number) { snapNum.push(number); }
    }

    this.notifyOB({
      key: 'SnapNum',
      snapNum: snapNumber,
    });
    return true;
  }
}

export default Grid;
