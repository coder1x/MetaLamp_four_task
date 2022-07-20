import { boundMethod } from 'autobind-decorator';

import {
  getProperty,
  setProperty,
} from '@shared/helpers/readWriteProperties';
import { RANGE_SLIDER_NAME } from '@shared/constants';

import { Observer } from '../../../Observer';

interface Pointer {
  event: PointerEvent,
  type: string,
  shiftXY: number,
}

type mapKey = Map<string, string>;

class Handle extends Observer {
  private elementFrom: HTMLElement | null = null;

  private elementTo: HTMLElement | null = null;

  private wrapperElement: HTMLElement;

  private isFromEvent: boolean;

  private isToEvent: boolean;

  private isVertical: boolean = false;

  private directions: Map<string, string> | null = null;

  private shiftXY: number = 0;

  private orientation: string = '';

  constructor(rsCenter: HTMLElement) {
    super();

    this.wrapperElement = rsCenter;
    this.isFromEvent = false;
    this.isToEvent = false;
  }

  createDomElementBase(type: string) {
    const double = type === 'double';

    const isFromTo = this.elementFrom && this.elementTo;
    const isFrom = this.elementFrom && !this.elementTo;

    if (double && isFromTo) { return false; }
    if (!double && isFrom) { return false; }

    const fromClassName = `${RANGE_SLIDER_NAME}__from`;
    const toClassName = `${RANGE_SLIDER_NAME}__to`;

    const fromElement = Handle.getElement(this.wrapperElement, `js-${fromClassName}`);
    const toElement = Handle.getElement(this.wrapperElement, `js-${toClassName}`);

    // don't create the element if it is already exist
    if (!fromElement) {
      this.elementFrom = Handle.createElement(
        'span',
        [
          fromClassName,
          `js-${fromClassName}`,
        ],
      );
      this.wrapperElement.appendChild(this.elementFrom);
    }

    if (double && !toElement) {
      // don't create the element if it is already exist
      this.elementTo = Handle.createElement(
        'span',
        [toClassName, `js-${toClassName}`],
      );
      this.wrapperElement.appendChild(this.elementTo);
    } else if (toElement) { // remove the dot if it exists
      toElement.remove();
      this.elementTo = null;
    }

    return this.wrapperElement;
  }

  setOrientation(str: string) {
    this.isVertical = str === 'vertical';
    let isConverted = false;

    if (this.elementFrom) {
      isConverted = this.convertStyle(this.elementFrom.style);
    }

    if (this.elementTo) {
      isConverted = this.convertStyle(this.elementTo.style);
    }

    return isConverted;
  }

  setFrom(fromPosition: number) {
    if (!this.elementFrom) { return false; }

    const value = `${fromPosition}%`;
    const from = this.elementFrom.style;

    if (this.isVertical) {
      from.bottom = value;
    } else {
      from.left = value;
    }

    return from;
  }

  setIndexFromTo(direction: keyof CSSStyleDeclaration) {
    if (!this.elementFrom || !this.elementTo) { return false; }

    const from = getProperty(this.elementFrom.style, direction);
    const to = getProperty(this.elementTo.style, direction);

    const isMaxTo = to === '100%';
    const isMaxFrom = from === '100%';

    if (isMaxTo && isMaxFrom) {
      this.elementTo.style.zIndex = '1';
      this.elementFrom.style.zIndex = '2';
      return true;
    }

    const isMinTo = to === '0%';
    const isMinFrom = from === '0%';

    if (isMinTo && isMinFrom) {
      this.elementTo.style.zIndex = '2';
      this.elementFrom.style.zIndex = '1';
      return true;
    }

    return false;
  }

  setTo(toPosition: number) {
    if (!this.elementTo) { return false; }

    const value = `${toPosition}%`;
    const { style } = this.elementTo;

    if (this.isVertical) {
      style.bottom = value;
      this.setIndexFromTo('bottom');
    } else {
      style.left = value;
      this.setIndexFromTo('left');
    }

    return style;
  }

  bindEvent(type: string) {
    this.orientation = type;
    const eventFromTo = this.isFromEvent && this.isToEvent;
    const isDouble = type === 'double';
    const isSingle = type === 'single';

    if (isDouble && eventFromTo) { return false; }

    if (isSingle && eventFromTo) {
      this.isToEvent = false;
    }

    this.directions = new Map();
    this.directions.set('ArrowRight', '+');
    this.directions.set('ArrowUp', '+');
    this.directions.set('ArrowLeft', '-');
    this.directions.set('ArrowDown', '-');

    if (!this.isFromEvent && this.elementFrom) {
      this.elementFrom.addEventListener('keydown', this.handleFromKeyDown);
    }

    if (this.elementTo && !this.isToEvent) {
      this.elementTo.addEventListener('keydown', this.handleToKeyDown);
    }

    const isToEvent = !this.isToEvent && isDouble;

    if (isToEvent && this.elementTo) {
      this.elementTo.addEventListener('pointerdown', this.handleToPointerDown);

      Handle.cancel(this.elementTo);
      this.isToEvent = true;
    }

    if (!this.isFromEvent && this.elementFrom) {
      this.elementFrom.addEventListener('pointerdown', this.handleFromPointerDown);

      Handle.cancel(this.elementFrom);
      this.isFromEvent = true;
    }
    return true;
  }

  private static cancel(element: HTMLElement) {
    const domElement = element;
    domElement.ondragstart = () => false;
    domElement.onselectstart = () => false;
  }

  private static createElement(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    element.setAttribute('tabindex', '0');
    return element;
  }

  @boundMethod
  private handleFromPointerUp() {
    this.wrapperElement.removeEventListener('pointerup', this.handleFromPointerUp);
    this.wrapperElement.removeEventListener('pointermove', this.handleFromPointerMove);
  }

  @boundMethod
  private handleToPointerUp() {
    this.wrapperElement.removeEventListener('pointerup', this.handleToPointerUp);
    this.wrapperElement.removeEventListener('pointermove', this.handleToPointerMove);
  }

  @boundMethod
  private handleFromPointerDown(event: PointerEvent) {
    if (!this.elementFrom) { return false; }

    if (this.elementTo) { this.elementTo.style.zIndex = '1'; }
    this.elementFrom.style.zIndex = '2';

    this.shiftXY = this.mouseDown(event, this.elementFrom);
    this.wrapperElement.addEventListener('pointermove', this.handleFromPointerMove);
    this.wrapperElement.addEventListener('pointerup', this.handleFromPointerUp);

    return true;
  }

  @boundMethod
  private handleToPointerDown(event: PointerEvent) {
    if (!this.elementFrom || !this.elementTo) { return false; }

    this.elementTo.style.zIndex = '2';
    this.elementFrom.style.zIndex = '1';

    this.shiftXY = this.mouseDown(event, this.elementTo);
    this.wrapperElement.addEventListener('pointermove', this.handleToPointerMove);
    this.wrapperElement.addEventListener('pointerup', this.handleToPointerUp);

    return true;
  }

  @boundMethod
  private handleToPointerMove(event: PointerEvent) {
    if (this.orientation === 'double') {
      this.moveDot({
        event,
        type: 'To',
        shiftXY: this.shiftXY,
      });
    }
  }

  @boundMethod
  private handleFromPointerMove(event: PointerEvent) {
    this.moveDot({
      event,
      type: 'From',
      shiftXY: this.shiftXY,
    });
  }

  @boundMethod
  private handleFromKeyDown(event: KeyboardEvent) {
    if (!this.directions) { return false; }
    this.keyDown(event, this.directions, 'from');
    return true;
  }

  @boundMethod
  private handleToKeyDown(event: KeyboardEvent) {
    if (!this.directions) { return false; }
    this.keyDown(event, this.directions, 'to');
    return true;
  }

  private static getElement(element: Element, nameElement: string) {
    return element.getElementsByClassName(nameElement)[0];
  }

  private convertStyle(element: CSSStyleDeclaration) {
    const domElement = element;

    function setOrientation(
      from: keyof CSSStyleDeclaration,
      to: keyof CSSStyleDeclaration,
    ) {
      const data = getProperty(domElement, from);
      if (String(data) === '') { return false; }
      domElement.removeProperty(String(from));
      setProperty(
        domElement,
        to,
        data,
      );
      return true;
    }

    if (this.isVertical) {
      return setOrientation('left', 'bottom');
    }
    return setOrientation('bottom', 'left');
  }

  @boundMethod
  private moveDot(options: Pointer) {
    const { event, type, shiftXY } = options;
    const rect = this.wrapperElement.getBoundingClientRect();
    const wrapper = this.wrapperElement;

    const wrapperWidthHeight = this.isVertical ? wrapper.offsetHeight : wrapper.offsetWidth;
    const position = this.isVertical ? rect.bottom : rect.left;
    const clientXY = this.isVertical ? event.clientY : event.clientX;

    this.notifyObserver({
      key: 'DotMove',
      type, // dot type
      dimensions: wrapperWidthHeight, // wrapper width or height
      position, // left or bottom coordinates of the wrapper
      clientXY, // coordinates of the dot
      shiftXY, // shift = coordinates of the dot minus coordinates of the dot border
    });
  }

  @boundMethod
  private keyDown(event: KeyboardEvent, directions: mapKey, dot: string) {
    const isHorizontalMovement = (event.key === 'ArrowRight' || event.key === 'ArrowLeft');
    const isVertical = this.isVertical && isHorizontalMovement;
    const isHorizontal = (!this.isVertical && !isHorizontalMovement);
    if (isVertical || isHorizontal) {
      return false;
    }

    if (!directions.get(event.key)) { return false; }
    event.preventDefault();
    const { repeat } = event;
    const sign = directions.get(event.key);

    if (sign) {
      this.notifyObserver({
        key: 'DotKeyDown',
        keyRepeat: repeat,
        keySign: sign,
        dot,
      });
    }
    return true;
  }

  @boundMethod
  private mouseDown(event: PointerEvent, element: HTMLElement) {
    event.preventDefault();
    let shiftXY = 0;
    const rect = element.getBoundingClientRect();

    if (this.isVertical) {
      shiftXY = event.clientY - rect.bottom;
    } else {
      shiftXY = event.clientX - rect.left;
    }

    element.setPointerCapture(event.pointerId);
    return shiftXY;
  }
}

export default Handle;
