import { boundMethod } from 'autobind-decorator';
import { Observer } from '../../../Observer';

interface Pointer {
  event: PointerEvent,
  type: string,
  shiftXY: number,
}

type mapKey = Map<string, string>;

class Handle extends Observer {
  private elemFrom: HTMLElement | null = null;

  private elemTo: HTMLElement | null = null;

  private rsName: string;

  private wrapElem: HTMLElement;

  private eventFromFlag: boolean;

  private eventToFlag: boolean;

  private vertical: boolean = false;;

  private directions: Map<string, string> | null = null;

  private shiftXY: number = 0;

  private orientation: string = '';

  constructor(rsCenter: HTMLElement, rsName: string) {
    super();
    this.rsName = rsName;
    this.wrapElem = rsCenter;
    this.eventFromFlag = false;
    this.eventToFlag = false;
  }

  createDomBase(type: string) {
    const double = type === 'double';
    if (double && this.elemFrom && this.elemTo) return false;
    if (!double && this.elemFrom && !this.elemTo) return false;

    const fromClassName = `${this.rsName}__from`;
    const toClassName = `${this.rsName}__to`;

    const fromElement = Handle.getElem(this.wrapElem, `js-${fromClassName}`);
    const toElement = Handle.getElem(this.wrapElem, `js-${toClassName}`);

    // don't create the element if it is already exist
    if (!fromElement) {
      this.elemFrom = Handle.createElem(
        'span',
        [
          fromClassName,
          `js-${fromClassName}`,
        ],
      );
      this.wrapElem.appendChild(this.elemFrom);
    }

    if (double) {
      // don't create the element if it is already exist
      if (!toElement) {
        this.elemTo = Handle.createElem(
          'span',
          [toClassName, `js-${toClassName}`],
        );
        this.wrapElem.appendChild(this.elemTo);
      }
    } else if (toElement) { // remove the dot if it exists
      toElement.remove();
      this.elemTo = null;
    }

    return this.wrapElem;
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

    if (this.elemFrom) {
      flag = convertStyle(this.elemFrom.style);
    }

    if (this.elemTo) {
      flag = convertStyle(this.elemTo.style);
    }

    return flag;
  }

  setFrom(fromPosition: number) {
    if (this.elemFrom) {
      const value = `${fromPosition}%`;
      const from = this.elemFrom.style;

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
    if (this.elemTo) {
      const value = `${toPosition}%`;
      const { style } = this.elemTo;

      if (this.vertical) {
        style.bottom = value;
      } else {
        style.left = value;
      }

      return style;
    }
    return false;
  }

  setActions(type: string) {
    this.orientation = type;
    const eventFromTo = this.eventFromFlag && this.eventToFlag;
    if (type === 'double' && eventFromTo) return false;
    if (type === 'single' && eventFromTo) {
      this.eventToFlag = false;
    }

    this.directions = new Map();
    this.directions.set('ArrowRight', '+');
    this.directions.set('ArrowUp', '+');
    this.directions.set('ArrowLeft', '-');
    this.directions.set('ArrowDown', '-');

    if (!this.eventFromFlag && this.elemFrom) {
      this.elemFrom.addEventListener('keydown', this.handleFromKeydown);
    }

    if (this.elemTo && !this.eventToFlag) {
      this.elemTo.addEventListener('keydown', this.handleToKeydown);
    }

    if (type === 'double') {
      if (!this.eventToFlag && this.elemTo) {
        this.elemTo.addEventListener('pointerdown', this.handleToPointerdown);

        Handle.cancellation(this.elemTo);
        this.eventToFlag = true;
      }
    }

    if (!this.eventFromFlag && this.elemFrom) {
      this.elemFrom.addEventListener('pointerdown', this.handleFromPointerdown);

      Handle.cancellation(this.elemFrom);
      this.eventFromFlag = true;
    }
    return true;
  }

  private static cancellation(element: HTMLElement) {
    const dom = element;
    dom.ondragstart = () => false;
    dom.onselectstart = () => false;
  }

  private static createElem(teg: string, className: string[]) {
    const element = document.createElement(teg);

    className.forEach((item) => {
      element.classList.add(item);
    });

    element.setAttribute('tabindex', '0');
    return element;
  }

  @boundMethod
  private mouseUpFrom() {
    this.wrapElem.removeEventListener('pointerup', this.mouseUpFrom);
    this.wrapElem.removeEventListener('pointermove', this.mouseMoveFrom);
  }

  @boundMethod
  private mouseUpTo() {
    this.wrapElem.removeEventListener('pointerup', this.mouseUpTo);
    this.wrapElem.removeEventListener('pointermove', this.mouseMoveTo);
  }

  @boundMethod
  private handleFromPointerdown(event: PointerEvent) {
    if (!this.elemFrom) return false;

    if (this.elemTo) { this.elemTo.style.zIndex = '1'; }
    this.elemFrom.style.zIndex = '2';

    this.shiftXY = this.mouseDown(event, this.elemFrom);
    this.wrapElem.addEventListener('pointermove', this.mouseMoveFrom);
    this.wrapElem.addEventListener('pointerup', this.mouseUpFrom);

    return true;
  }

  @boundMethod
  private handleToPointerdown(event: PointerEvent) {
    if (!this.elemFrom || !this.elemTo) return false;

    this.elemTo.style.zIndex = '2';
    this.elemFrom.style.zIndex = '1';

    this.shiftXY = this.mouseDown(event, this.elemTo);
    this.wrapElem.addEventListener('pointermove', this.mouseMoveTo);
    this.wrapElem.addEventListener('pointerup', this.mouseUpTo);

    return true;
  }

  @boundMethod
  private mouseMoveTo(event: PointerEvent) {
    if (this.orientation === 'double') {
      this.moveDot({
        event,
        type: 'To',
        shiftXY: this.shiftXY,
      });
    }
  }

  @boundMethod
  private mouseMoveFrom(event: PointerEvent) {
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

  private static getElem(element: Element, str: string) {
    return element.getElementsByClassName(str)[0];
  }

  @boundMethod
  private moveDot(options: Pointer) {
    const { event, type, shiftXY } = options;
    const rect = this.wrapElem.getBoundingClientRect();
    const wrap = this.wrapElem;
    const flag = this.vertical;

    const wrapWH = flag ? wrap.offsetHeight : wrap.offsetWidth;
    const position = flag ? rect.bottom : rect.left;
    const clientXY = flag ? event.clientY : event.clientX;

    this.notifyOB({
      key: 'DotMove',
      type, // dot type
      wrapWH, // wrapper width or height
      position, // left or bottom coordinates of the wrapper
      clientXY, // coordinates of the dot
      shiftXY, // shift = coordinates of the dot minus coordinates of the dot border
    });
  }

  @boundMethod
  private keyDown(event: KeyboardEvent, directions: mapKey, dot: string) {
    const flag = (event.key === 'ArrowRight' || event.key === 'ArrowLeft');
    if ((this.vertical && flag) || (!this.vertical && !flag)) { return false; }

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
