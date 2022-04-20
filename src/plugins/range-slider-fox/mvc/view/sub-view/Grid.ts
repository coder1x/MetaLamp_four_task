import { boundMethod } from 'autobind-decorator';
import { Observer } from '../../../Observer';
import Resize from '../Resize';

class Grid extends Observer {
  private rsBottom: HTMLElement;

  private rsName: string;

  private elemGrid: HTMLElement | null = null;

  private indent: number = 0;

  private sizeWH: number[] = [];

  private oddElements: HTMLElement[][] = [[]];

  private evenElements: HTMLElement[][] = [[]];

  private lastElem: Element | null = null;

  private previousElem: HTMLElement | null = null;

  private offOn: boolean = false;

  private vertical: boolean = false;

  private resizeFlag: boolean = false;

  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsBottom = elem as HTMLElement;
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
      const { style } = gridPol;
      const pos = `${position}%`;

      if (this.vertical) {
        style.bottom = pos;
      } else {
        style.left = pos;
      }

      if (this.elemGrid) { this.elemGrid.appendChild(gridPol); }
    });
    return this.elemGrid;
  }

  createDomGrid() {
    if (!this.elemGrid) return null;
    this.rsBottom.appendChild(this.elemGrid);
    this.offOn = true;
    this.setAction(this.elemGrid);
    return this.rsBottom;
  }

  deleteGrid() {
    if (!this.elemGrid) return null;

    if (this.elemGrid.children.length > 0) {
      this.offOn = false;
      while (this.elemGrid.firstChild) {
        this.elemGrid.firstChild.remove();
      }
      return true;
    }
    return false;
  }

  private static searchStr(text: string, str: string) {
    return new RegExp(str, 'g').test(text);
  }

  private setAction(elem: HTMLElement) {
    elem.addEventListener('click', this.handleMarkClick);
  }

  @boundMethod
  private handleMarkClick(event: Event) {
    const mark = event.target as HTMLElement;
    if (Grid.searchStr(mark.className, `js-${this.rsName}__grid-mark`)) {
      this.notifyOB({
        key: 'ClickMark',
        valueG: Number(mark.innerText),
      });
    }
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

    new MutationObserver(() => {
      this.shapingMark();
    }).observe(this.rsBottom, {
      childList: true,
    });
  }

  private static toggleElem(
    elem: HTMLElement,
    display: string,
    opacity: string,
  ) {
    const { style } = elem;
    style.visibility = display;
    const wrapE = elem.parentNode as HTMLElement;
    wrapE.style.opacity = opacity;
  }

  private shapingMark() {
    if (!this.elemGrid) return false;

    this.sizeWH = [];
    this.oddElements = [[]];
    this.evenElements = [[]];
    let markWH = 0;

    if (this.previousElem) { this.previousElem.remove(); }
    this.previousElem = null;

    const gridMarks = this.elemGrid.getElementsByClassName(
      `js-${this.rsName}__grid-mark`,
    );

    const gridPols = this.elemGrid.getElementsByClassName(
      `js-${this.rsName}__grid-pol`,
    );

    const { length } = gridMarks;
    if (length > 1) {
      this.lastElem = gridMarks[length - 1];
    }

    let k = 0;
    for (let i = 0; i < length; i += 1) {
      const mark = gridMarks[i] as HTMLElement;
      const gridPolsT = gridPols[k] as HTMLElement;
      k += 1;

      const { style } = mark;

      if (this.vertical) {
        style.top = `-${mark.offsetHeight / 2}px`;
        style.left = `${gridPolsT.offsetWidth + 2}px`;
        markWH += mark.offsetHeight + this.indent;
      } else {
        style.left = `-${mark.offsetWidth / 2}px`;
        style.top = `${gridPolsT.offsetHeight + 2}px`;
        markWH += mark.offsetWidth + this.indent;
      }

      this.oddElements[0].push(mark);
    }

    this.sizeWH.push(markWH);
    this.oddElements[0].shift();
    this.oddElements[0].pop();

    let evenMas: HTMLElement[] = [];

    const breakIntoPieces = (elements: HTMLElement[]) => {
      markWH = 0;
      const hideMark = elements.filter((elem, i) => {
        if (i % 2 === 0) { // every second element of the array
          evenMas.push(elem);
          return false;
        }

        markWH += this.vertical ? elem.offsetHeight : elem.offsetWidth;
        markWH += this.indent;
        return true;
      });

      if (hideMark.length >= 2) {
        this.oddElements.push(hideMark);
        this.evenElements.push(evenMas);
        evenMas = [];
        this.sizeWH.push(markWH);
        breakIntoPieces(hideMark);
      }
    };

    breakIntoPieces(this.oddElements[0]);

    this.evenElements.shift();
    this.visibleMark();

    if (!this.resizeFlag) {
      this.resizeFlag = true;
      new Resize(this.elemGrid, 200, () => {
        if (this.offOn && !this.vertical) {
          this.visibleMark();
        }
      });
    }

    return true;
  }

  // hide or show values on the scale
  private visibleMark() {
    if (!this.elemGrid) return false;
    // define element index: show odd values and hide honest ones
    const wrapWH = this.vertical
      ? this.elemGrid.offsetHeight
      : this.elemGrid.offsetWidth;

    let i = 0;
    for (; i < this.sizeWH.length - 1; i += 1) {
      if (this.sizeWH[i] <= wrapWH) { break; }
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

    this.previousElem = this.oddElements[i][this.oddElements[i].length - 1];

    this.visibleLastElem(snapNum);

    return true;
  }

  private visibleLastElem(snapNum: number[]) {
    if (!this.lastElem || !this.previousElem) return false;

    let snap = snapNum;

    const lastRect = this.lastElem.getBoundingClientRect();
    const previousRect = this.previousElem.getBoundingClientRect();
    const lastXY = this.vertical ? lastRect.bottom : lastRect.left;

    let previousXY = this.vertical ? previousRect.top : previousRect.right;
    previousXY += this.indent;

    const flag = this.vertical ? previousXY <= lastXY : previousXY > lastXY;
    const number = +this.previousElem.innerText;

    if (flag) {
      Grid.toggleElem(this.previousElem, 'hidden', '0.4');
      snap = snap.filter((item) => item !== number);
    } else {
      Grid.toggleElem(this.previousElem, 'visible', '1');
      const len = snap.length - 1;
      if (snap[len] !== number) { snap.push(number); }
    }

    this.notifyOB({
      key: 'SnapNum',
      snapNum: snap,
    });
    return true;
  }
}

export default Grid;
