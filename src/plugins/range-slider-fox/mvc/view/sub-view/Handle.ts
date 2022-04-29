import { boundMethod } from 'autobind-decorator';

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

  private rangeSliderName: string;

  private wrapperElement: HTMLElement;

  private isFromEvent: boolean;

  private isToEvent: boolean;

  private vertical: boolean = false;;

  private directions: Map<string, string> | null = null;

  private shiftXY: number = 0;

  private orientation: string = '';

  constructor(rsCenter: HTMLElement, rangeSliderName: string) {
    super();
    this.rangeSliderName = rangeSliderName;
    this.wrapperElement = rsCenter;
    this.isFromEvent = false;
    this.isToEvent = false;
  }

  createDomElementBase(type: string) {
    const double = type === 'double';
    if (double && this.elementFrom && this.elementTo) return false;
    if (!double && this.elementFrom && !this.elementTo) return false;

    const fromClassName = `${this.rangeSliderName}__from`;
    const toClassName = `${this.rangeSliderName}__to`;

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

    if (double) {
      // don't create the element if it is already exist
      if (!toElement) {
        this.elementTo = Handle.createElement(
          'span',
          [toClassName, `js-${toClassName}`],
        );
        this.wrapperElement.appendChild(this.elementTo);
      }
    } else if (toElement) { // remove the dot if it exists
      toElement.remove();
      this.elementTo = null;
    }

    return this.wrapperElement;
  }

  setOrientation(str: string) {
    this.vertical = str === 'vertical';

    const convertStyle = (style: CSSStyleDeclaration) => {
      let value = '';
      const styleDom = style;
      if (this.vertical) {
        if (styleDom.left === '') return false;
        value = styleDom.left;
        styleDom.removeProperty('left');
        styleDom.bottom = value;
      } else {
        if (styleDom.bottom === '') return false;
        value = styleDom.bottom;
        styleDom.removeProperty('bottom');
        styleDom.left = value;
      }
      return true;
    };

    let flag = false;

    if (this.elementFrom) {
      flag = convertStyle(this.elementFrom.style);
    }

    if (this.elementTo) {
      flag = convertStyle(this.elementTo.style);
    }

    return flag;
  }

  setFrom(fromPosition: number) {
    if (this.elementFrom) {
      const value = `${fromPosition}%`;
      const from = this.elementFrom.style;

      if (this.vertical) {
        from.bottom = value;
      } else {
        from.left = value;
      }

      return from;
    }
    return false;
  }

  setTo(toPosition: number) {
    if (this.elementTo) {
      const value = `${toPosition}%`;
      const { style } = this.elementTo;

      if (this.vertical) {
        style.bottom = value;
      } else {
        style.left = value;
      }

      return style;
    }
    return false;
  }

  bindEvent(type: string) {
    this.orientation = type;
    const eventFromTo = this.isFromEvent && this.isToEvent;
    if (type === 'double' && eventFromTo) return false;
    if (type === 'single' && eventFromTo) {
      this.isToEvent = false;
    }

    this.directions = new Map();
    this.directions.set('ArrowRight', '+');
    this.directions.set('ArrowUp', '+');
    this.directions.set('ArrowLeft', '-');
    this.directions.set('ArrowDown', '-');

    if (!this.isFromEvent && this.elementFrom) {
      this.elementFrom.addEventListener('keydown', this.handleFromKeydown);
    }

    if (this.elementTo && !this.isToEvent) {
      this.elementTo.addEventListener('keydown', this.handleToKeydown);
    }

    if (!this.isToEvent && this.elementTo && type === 'double') {
      this.elementTo.addEventListener('pointerdown', this.handleToPointerdown);

      Handle.cancellation(this.elementTo);
      this.isToEvent = true;
    }

    if (!this.isFromEvent && this.elementFrom) {
      this.elementFrom.addEventListener('pointerdown', this.handleFromPointerdown);

      Handle.cancellation(this.elementFrom);
      this.isFromEvent = true;
    }
    return true;
  }

  private static cancellation(element: HTMLElement) {
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
  private handleMouseUpFrom() {
    this.wrapperElement.removeEventListener('pointerup', this.handleMouseUpFrom);
    this.wrapperElement.removeEventListener('pointermove', this.handleMouseMoveFrom);
  }

  @boundMethod
  private handleMouseUpTo() {
    this.wrapperElement.removeEventListener('pointerup', this.handleMouseUpTo);
    this.wrapperElement.removeEventListener('pointermove', this.handleMouseMoveTo);
  }

  @boundMethod
  private handleFromPointerdown(event: PointerEvent) {
    if (!this.elementFrom) return false;

    if (this.elementTo) { this.elementTo.style.zIndex = '1'; }
    this.elementFrom.style.zIndex = '2';

    this.shiftXY = this.mouseDown(event, this.elementFrom);
    this.wrapperElement.addEventListener('pointermove', this.handleMouseMoveFrom);
    this.wrapperElement.addEventListener('pointerup', this.handleMouseUpFrom);

    return true;
  }

  @boundMethod
  private handleToPointerdown(event: PointerEvent) {
    if (!this.elementFrom || !this.elementTo) return false;

    this.elementTo.style.zIndex = '2';
    this.elementFrom.style.zIndex = '1';

    this.shiftXY = this.mouseDown(event, this.elementTo);
    this.wrapperElement.addEventListener('pointermove', this.handleMouseMoveTo);
    this.wrapperElement.addEventListener('pointerup', this.handleMouseUpTo);

    return true;
  }

  @boundMethod
  private handleMouseMoveTo(event: PointerEvent) {
    if (this.orientation === 'double') {
      this.moveDot({
        event,
        type: 'To',
        shiftXY: this.shiftXY,
      });
    }
  }

  @boundMethod
  private handleMouseMoveFrom(event: PointerEvent) {
    this.moveDot({
      event,
      type: 'From',
      shiftXY: this.shiftXY,
    });
  }

  @boundMethod
  private handleFromKeydown(event: KeyboardEvent) {
    if (!this.directions) return false;
    this.keyDown(event, this.directions, 'from');
    return true;
  }

  @boundMethod
  private handleToKeydown(event: KeyboardEvent) {
    if (!this.directions) return false;
    this.keyDown(event, this.directions, 'to');
    return true;
  }

  private static getElement(element: Element, string: string) {
    return element.getElementsByClassName(string)[0];
  }

  @boundMethod
  private moveDot(options: Pointer) {
    const { event, type, shiftXY } = options;
    const rect = this.wrapperElement.getBoundingClientRect();
    const wrapper = this.wrapperElement;

    const wrapperWidthHeight = this.vertical ? wrapper.offsetHeight : wrapper.offsetWidth;
    const position = this.vertical ? rect.bottom : rect.left;
    const clientXY = this.vertical ? event.clientY : event.clientX;

    this.notifyOB({
      key: 'DotMove',
      type, // dot type
      wrapperWidthHeight, // wrapper width or height
      position, // left or bottom coordinates of the wrapper
      clientXY, // coordinates of the dot
      shiftXY, // shift = coordinates of the dot minus coordinates of the dot border
    });
  }

  @boundMethod
  private keyDown(event: KeyboardEvent, directions: mapKey, dot: string) {
    const isHorizontalMovement = (event.key === 'ArrowRight' || event.key === 'ArrowLeft');
    const isVertical = this.vertical && isHorizontalMovement;
    const isHorizontal = (!this.vertical && !isHorizontalMovement);
    if (isVertical || isHorizontal) {
      return false;
    }

    if (!directions.get(event.key)) return false;
    event.preventDefault();
    const { repeat } = event;
    const sign = directions.get(event.key);

    if (sign) {
      this.notifyOB({
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
    if (this.vertical) {
      shiftXY = event.clientY - rect.bottom;
    } else {
      shiftXY = event.clientX - rect.left;
    }
    element.setPointerCapture(event.pointerId);
    return shiftXY;
  }
}

export default Handle;
