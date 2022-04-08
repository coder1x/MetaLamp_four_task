import autoBind from 'auto-bind';
import { Observer } from '../../../observer';

interface Pointer {
  event: PointerEvent,
  type: string,
  shiftXY: number,
}

type mapKey = Map<string, string>;

class Handle extends Observer {
  private elemFrom: HTMLElement;

  private elemTo: HTMLElement;

  private rsName: string;

  private wrapElem: HTMLElement;

  private eventFromFlag: boolean;

  private eventToFlag: boolean;

  private vertical: boolean;

  private directions: Map<string, string>

  private shiftXY: number = 0;

  private orientation: string;

  constructor(rsCenter: HTMLElement, rsName: string) {
    super();
    autoBind(this);
    this.rsName = rsName;
    this.wrapElem = rsCenter;
    this.eventFromFlag = false;
    this.eventToFlag = false;
  }

  createDomBase(type: string) {
    const double = type === 'double';
    if (double && this.elemFrom && this.elemTo) return false;
    if (!double && this.elemFrom && !this.elemTo) return false;

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);

      className.forEach((item) => {
        elem.classList.add(item);
      });

      elem.setAttribute('tabindex', '0');
      return elem;
    };

    const fromClassName = `${this.rsName}__from`;
    const toClassName = `${this.rsName}__to`;

    const fromElement = Handle.getElem(this.wrapElem, `js-${fromClassName}`);
    const toElement = Handle.getElem(this.wrapElem, `js-${toClassName}`);

    // don't create the element if it is already exist
    if (!fromElement) {
      this.elemFrom = createElem(
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
        this.elemTo = createElem('span', [toClassName, `js-${toClassName}`]);
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

    convertStyle(this.elemFrom.style);

    if (this.elemTo) {
      return convertStyle(this.elemTo.style);
    }

    return false;
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

    if (!this.eventFromFlag) {
      this.elemFrom.addEventListener('keydown', this.handleFromKeydown);
    }

    if (this.elemTo && !this.eventToFlag) {
      this.elemTo.addEventListener('keydown', this.handleToKeydown);
    }

    const cancellation = (elem: HTMLElement) => {
      const dom = elem;
      dom.ondragstart = () => false;
      dom.onselectstart = () => false;
    };

    if (type === 'double') {
      if (!this.eventToFlag) {
        this.elemTo.addEventListener('pointerdown', this.handleToPointerdown);

        cancellation(this.elemTo);
        this.eventToFlag = true;
      }
    }

    if (!this.eventFromFlag) {
      this.elemFrom.addEventListener('pointerdown', this.handleFromPointerdown);

      cancellation(this.elemFrom);
      this.eventFromFlag = true;
    }
    return true;
  }

  private mouseUpFrom() {
    this.wrapElem.removeEventListener('pointerup', this.mouseUpFrom);
    this.wrapElem.removeEventListener('pointermove', this.mouseMoveFrom);
  }

  private mouseUpTo() {
    this.wrapElem.removeEventListener('pointerup', this.mouseUpTo);
    this.wrapElem.removeEventListener('pointermove', this.mouseMoveTo);
  }

  private handleFromPointerdown(event: PointerEvent) {
    if (this.elemTo) { this.elemTo.style.zIndex = '1'; }
    this.elemFrom.style.zIndex = '2';

    this.shiftXY = this.mouseDown(event, this.elemFrom);
    this.wrapElem.addEventListener('pointermove', this.mouseMoveFrom);
    this.wrapElem.addEventListener('pointerup', this.mouseUpFrom);
  }

  private handleToPointerdown(event: PointerEvent) {
    this.elemTo.style.zIndex = '2';
    this.elemFrom.style.zIndex = '1';

    this.shiftXY = this.mouseDown(event, this.elemTo);
    this.wrapElem.addEventListener('pointermove', this.mouseMoveTo);
    this.wrapElem.addEventListener('pointerup', this.mouseUpTo);
  }

  private mouseMoveTo(event: PointerEvent) {
    if (this.orientation === 'double') {
      this.moveDot({
        event,
        type: 'To',
        shiftXY: this.shiftXY,
      });
    }
  }

  private mouseMoveFrom(event: PointerEvent) {
    this.moveDot({
      event,
      type: 'From',
      shiftXY: this.shiftXY,
    });
  }

  private handleFromKeydown(event: KeyboardEvent) {
    this.keyDown(event, this.directions, 'from');
  }

  private handleToKeydown(event: KeyboardEvent) {
    this.keyDown(event, this.directions, 'to');
  }

  private static getElem(elem: Element, str: string) {
    return elem.getElementsByClassName(str)[0];
  }

  private moveDot = (options: Pointer) => {
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
  };

  private keyDown = (event: KeyboardEvent, directions: mapKey, dot: string) => {
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
  };

  private mouseDown = (event: PointerEvent, elem: HTMLElement) => {
    event.preventDefault();
    let shiftXY = 0;
    const rect = elem.getBoundingClientRect();
    if (this.vertical) {
      shiftXY = event.clientY - rect.bottom;
    } else {
      shiftXY = event.clientX - rect.left;
    }
    elem.setPointerCapture(event.pointerId);
    return shiftXY;
  };
}

export default Handle;
