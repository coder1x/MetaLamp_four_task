
import { Observer } from '../../../observer';
import { Resize } from '../resize';
import { HElem, HTElem, HPElem } from '../../../glob-interface';

class Grid extends Observer {

  private rsBottom: HElem;
  private rsName: string;
  private elemGrid: HTMLElement;
  private indent: number;
  private masWH: number[] = [];
  private oddElements: HElem[][] = [[]];
  private evenElements: HElem[][] = [[]];
  private lastElem: HElem;
  private previousElem: HElem;
  private offOn: boolean;
  private vertical: boolean;
  private resizeF: boolean = false;


  constructor(elem: HTMLElement | Element, rsName: string) {
    super();
    this.rsName = rsName;
    this.rsBottom = elem;
    this.init();
  }


  setOrientation(str: string) {
    return this.vertical = str == 'vertical' ? true : false;
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
      const polName = this.rsName + '__grid-pol';
      const gridPol = this.createElem('div', [polName, 'js-' + polName]);
      const markName = this.rsName + '__grid-mark';
      const gridMark = this.createElem('span', [markName, 'js-' + markName]);
      gridMark.innerText = String(val);
      gridPol.appendChild(gridMark);
      const st = gridPol.style;
      const pos = position + '%';
      this.vertical ? st.bottom = pos : st.left = pos;
      this.elemGrid.appendChild(gridPol);
    }
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


  private searchStr(text: string, str: string) {
    const regexp = new RegExp(str, 'g');
    return regexp.test(text);
  }

  private setAction(elem: HTMLElement) {
    elem.addEventListener('click', (e: Event) => {
      const mark: HTElem = e.target;
      const selector = 'js-' + this.rsName + '__grid-mark';
      if (this.searchStr(mark.className, selector)) {
        this.notifyOB({
          key: 'ClickMark',
          valueG: Number(mark.innerText)
        });
      }
    });
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
    this.indent = 4; //indent in pixels between values on the scale
    const gridName = this.rsName + '__grid';
    this.elemGrid = this.createElem('div', [gridName, 'js-' + gridName]);

    const observer = new MutationObserver(() => {
      this.shapingMark();
    });

    observer.observe(this.rsBottom, {
      childList: true,
    });
  }


  private toggleElem(elem: HElem, display: string, opacity: string) {
    const st = elem.style;
    st.visibility = display;
    const wrapE: HPElem = elem.parentNode;
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
      'js-' + this.rsName + '__grid-mark'
    );

    const gridPols = this.elemGrid.getElementsByClassName(
      'js-' + this.rsName + '__grid-pol'
    );

    const len = gridMarks.length;
    if (len > 1) {
      this.lastElem = gridMarks[len - 1];
    }


    let k = 0;
    for (let item of gridMarks) {
      const mark: HElem = item;
      const pol: HElem = gridPols[k++];

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

    let evenMas: HElem[] = [];

    const breakIntoPieces = (mas: HElem[]) => {
      elemWH = 0;
      const newMas = mas.filter((elem, i) => {
        if (i % 2 == 0) { // every second element of the array
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

    if (!this.resizeF) {
      this.resizeF = true;
      new Resize(this.elemGrid, 200, () => {
        if (this.offOn && !this.vertical) {
          this.visibleMark();
        }
      }
      );
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
    for (; i < this.masWH.length - 1; i++) {
      if (this.masWH[i] <= wrapWH)
        break;
    }

    for (let n = 0; n <= i; n++) { //hide honest elements till the necessary level
      if (this.evenElements[n])
        for (let elem of this.evenElements[n]) {
          this.toggleElem(elem, 'hidden', '0.4');
        }
    }

    let snapNum: number[] = [];

    this.oddElements[i].map((elem) => { // show the necessary elements only
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

}



export { Grid };