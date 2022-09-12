import { boundMethod } from 'autobind-decorator';

import { RANGE_SLIDER_NAME } from '@shared/constants';

import Observer from '../../../Observer';
import Resize from '../Resize';

type ObserverOptions = {
  readonly key: 'ClickMark' | 'SnapNumber';
  readonly valueGrid?: number;
  readonly snapNumber?: number[];
  readonly isResized?: boolean;
};

class Grid extends Observer<ObserverOptions> {
  private rangeSliderBottom: HTMLElement;

  private elementGrid: HTMLElement | null = null;

  private indent: number = 0;

  private sizeWidthHeight: number[] = [];

  private oddElements: HTMLElement[][] = [[]];

  private evenElements: HTMLElement[][] = [[]];

  private lastElement: Element | null = null;

  private previousElement: HTMLElement | null = null;

  private offOn: boolean = false;

  vertical: boolean = false;

  private isResized: boolean = false;

  constructor(element: HTMLElement | Element) {
    super();
    this.rangeSliderBottom = element as HTMLElement;
    this.init();
  }

  setOrientation(orientation: string) {
    this.vertical = orientation === 'vertical';
    return this;
  }

  @boundMethod
  createMark(valueMark: {
    value: number,
    position: number,
  }[]) {
    valueMark.forEach((item) => {
      const { value, position } = item;
      const lineName = `${RANGE_SLIDER_NAME}__grid-line`;
      const gridLine = Grid.createElement('div', [lineName, `js-${lineName}`]);
      const markName = `${RANGE_SLIDER_NAME}__grid-mark`;
      const gridMark = Grid.createElement('span', [markName, `js-${markName}`]);

      gridMark.innerText = String(value);
      gridLine.appendChild(gridMark);
      const { style } = gridLine;
      const positionLine = `${position}%`;

      if (this.vertical) {
        style.bottom = positionLine;
      } else {
        style.left = positionLine;
      }

      if (this.elementGrid) {
        this.elementGrid.appendChild(gridLine);
      }
    });
    return this.elementGrid;
  }

  createDomElementGrid() {
    if (!this.elementGrid) {
      return false;
    }

    this.rangeSliderBottom.appendChild(this.elementGrid);
    this.offOn = true;
    this.bindEvent(this.elementGrid);

    return this.rangeSliderBottom;
  }

  deleteGrid() {
    if (!this.elementGrid) {
      return false;
    }

    if (this.elementGrid.children.length > 0) {
      this.offOn = false;
      while (this.elementGrid.firstChild) {
        this.elementGrid.firstChild.remove();
      }

      return true;
    }
    return false;
  }

  private static searchString(text: string, regExp: string) {
    return new RegExp(regExp, 'g').test(text);
  }

  private bindEvent(element: HTMLElement) {
    element.addEventListener('click', this.handleMarkClick);
  }

  @boundMethod
  private handleMarkClick(event: Event) {
    const mark = event.target as HTMLElement;

    if (Grid.searchString(mark.className, `js-${RANGE_SLIDER_NAME}__grid-mark`)) {
      this.notifyObserver({
        key: 'ClickMark',
        valueGrid: Number(mark.innerText),
      });
    }
  }

  private static createElement(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    return element;
  }

  private init() {
    this.offOn = false;
    this.indent = 4; // indent in pixels between values on the scale
    const gridName = `${RANGE_SLIDER_NAME}__grid`;
    this.elementGrid = Grid.createElement('div', [gridName, `js-${gridName}`]);

    new MutationObserver(() => {
      this.shapingMark();
    }).observe(this.rangeSliderBottom, {
      childList: true,
    });
  }

  private static toggleElement(
    element: HTMLElement,
    display: string,
    opacity: string,
  ) {
    const { style } = element;
    style.visibility = display;
    const wrapE = element.parentNode as HTMLElement;
    wrapE.style.opacity = opacity;
  }

  private shapingMark() {
    if (!this.elementGrid) {
      return false;
    }

    this.sizeWidthHeight = [];
    this.oddElements = [[]];
    this.evenElements = [[]];
    let markWidthHeight = 0;

    if (this.previousElement) {
      this.previousElement.remove();
    }
    this.previousElement = null;

    const gridMarks = this.elementGrid.getElementsByClassName(
      `js-${RANGE_SLIDER_NAME}__grid-mark`,
    );

    const gridLines = this.elementGrid.getElementsByClassName(
      `js-${RANGE_SLIDER_NAME}__grid-line`,
    );

    const { length } = gridMarks;
    if (length > 1) {
      this.lastElement = gridMarks[length - 1];
    }

    let lineLength = 0;
    for (let i = 0; i < length; i += 1) {
      const mark = gridMarks[i] as HTMLElement;
      const gridLine = gridLines[lineLength] as HTMLElement;
      lineLength += 1;

      const { style } = mark;

      const INDENT_GRID_LINE = 2;
      if (this.vertical) {
        style.top = `-${mark.offsetHeight / 2}px`;
        style.left = `${gridLine.offsetWidth + INDENT_GRID_LINE}px`;
        markWidthHeight += mark.offsetHeight + this.indent;
      } else {
        style.left = `-${mark.offsetWidth / 2}px`;
        style.top = `${gridLine.offsetHeight + INDENT_GRID_LINE}px`;
        markWidthHeight += mark.offsetWidth + this.indent;
      }

      this.oddElements[0].push(mark);
    }

    this.sizeWidthHeight.push(markWidthHeight);
    this.oddElements[0].shift();
    this.oddElements[0].pop();

    let evenElements: HTMLElement[] = [];

    const breakIntoPieces = (elements: HTMLElement[]) => {
      markWidthHeight = 0;
      const hideMark = elements.filter((element, i) => {
        if (i % 2 === 0) { // every second element of the array
          evenElements.push(element);
          return false;
        }

        markWidthHeight += this.vertical ? element.offsetHeight : element.offsetWidth;
        markWidthHeight += this.indent;
        return true;
      });

      const MIN_MARK = 2;
      if (hideMark.length >= MIN_MARK) {
        this.oddElements.push(hideMark);
        this.evenElements.push(evenElements);
        evenElements = [];
        this.sizeWidthHeight.push(markWidthHeight);
        breakIntoPieces(hideMark);
      }
    };

    breakIntoPieces(this.oddElements[0]);

    this.evenElements.shift();
    this.visibleMark();

    if (this.isResized) {
      return false;
    }

    this.isResized = true;
    const DELAY_TIME = 200;
    new Resize(this.elementGrid, DELAY_TIME, () => {
      if (this.offOn && !this.vertical) {
        this.visibleMark(true);
      }
    });

    return true;
  }

  // hide or show values on the scale
  private visibleMark(isResized = false) {
    if (!this.elementGrid) {
      return false;
    }
    // define element index: show odd values and hide honest ones
    const wrapperWidthHeight = this.vertical
      ? this.elementGrid.offsetHeight
      : this.elementGrid.offsetWidth;

    let i = 0;
    for (; i < this.sizeWidthHeight.length - 1; i += 1) {
      if (this.sizeWidthHeight[i] <= wrapperWidthHeight) {
        break;
      }
    }

    for (let n = 0; n <= i; n += 1) { // hide honest elements till the necessary level
      if (this.evenElements[n]) {
        this.evenElements[n].forEach((element) => {
          Grid.toggleElement(element, 'hidden', '0.4');
        });
      }
    }

    const snapNumber: number[] = [];

    this.oddElements[i].forEach((element) => { // show the necessary elements only
      Grid.toggleElement(element, 'visible', '1');
      snapNumber.push(Number(element.innerText));
    });

    this.previousElement = this.oddElements[i][this.oddElements[i].length - 1];

    this.visibleLastElement(snapNumber, isResized);

    return true;
  }

  private visibleLastElement(snapNumber: number[], isResized = false) {
    if (!this.lastElement || !this.previousElement) {
      return false;
    }

    let snap = snapNumber;

    const lastRect = this.lastElement.getBoundingClientRect();
    const previousRect = this.previousElement.getBoundingClientRect();
    const lastXY = this.vertical ? lastRect.bottom : lastRect.left;

    let previousXY = this.vertical ? previousRect.top : previousRect.right;
    previousXY += this.indent;

    const isVisible = this.vertical ? previousXY <= lastXY : previousXY > lastXY;
    const number = Number(this.previousElement.innerText);

    if (isVisible) {
      Grid.toggleElement(this.previousElement, 'hidden', '0.4');
      snap = snap.filter((item) => item !== number);
    } else {
      Grid.toggleElement(this.previousElement, 'visible', '1');
      const length = snap.length - 1;
      if (snap[length] !== number) {
        snap.push(number);
      }
    }

    this.notifyObserver({
      key: 'SnapNumber',
      snapNumber: snap,
      isResized,
    });
    return true;
  }
}

export default Grid;
