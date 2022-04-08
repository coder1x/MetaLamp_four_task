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
    const eventFromTo = this.eventFromFlag && this.eventToFlag;
    if (type === 'double' && eventFromTo) return false;
    if (type === 'single' && eventFromTo) {
      this.eventToFlag = false;
    }
    let shiftXY = 0;

    const directions = new Map();
    directions.set('ArrowRight', '+');
    directions.set('ArrowUp', '+');
    directions.set('ArrowLeft', '-');
    directions.set('ArrowDown', '-');

    if (!this.eventFromFlag) {
      this.elemFrom.addEventListener('keydown', (event: KeyboardEvent) => {
        this.keyDown(event, directions, 'from');
      });
    }

    if (this.elemTo && !this.eventToFlag) {
      this.elemTo.addEventListener('keydown', (event: KeyboardEvent) => {
        this.keyDown(event, directions, 'to');
      });
    }

    const mouseMoveFrom = (event: PointerEvent) => {
      this.moveDot({
        event,
        type: 'From',
        shiftXY,
      });
    };

    const mouseUpFrom = () => {
      this.wrapElem.removeEventListener('pointerup', mouseUpFrom);
      this.wrapElem.removeEventListener('pointermove', mouseMoveFrom);
    };

    const mouseMoveTo = (event: PointerEvent) => {
      if (type === 'double') {
        this.moveDot({
          event,
          type: 'To',
          shiftXY,
        });
      }
    };

    const mouseUpTo = () => {
      this.wrapElem.removeEventListener('pointerup', mouseUpTo);
      this.wrapElem.removeEventListener('pointermove', mouseMoveTo);
    };

    const cancellation = (elem: HTMLElement) => {
      const dom = elem;
      dom.ondragstart = () => false;
      dom.onselectstart = () => false;
    };

    if (type === 'double') {
      if (!this.eventToFlag) {
        this.elemTo.addEventListener('pointerdown', (event: PointerEvent) => {
          this.elemTo.style.zIndex = '2';
          this.elemFrom.style.zIndex = '1';

          shiftXY = this.mouseDown(event, this.elemTo);
          this.wrapElem.addEventListener('pointermove', mouseMoveTo);
          this.wrapElem.addEventListener('pointerup', mouseUpTo);
        });

        cancellation(this.elemTo);
        this.eventToFlag = true;
      }
    }

    if (!this.eventFromFlag) {
      this.elemFrom.addEventListener('pointerdown', (event: PointerEvent) => {
        if (this.elemTo) { this.elemTo.style.zIndex = '1'; }
        this.elemFrom.style.zIndex = '2';

        shiftXY = this.mouseDown(event, this.elemFrom);
        this.wrapElem.addEventListener('pointermove', mouseMoveFrom);
        this.wrapElem.addEventListener('pointerup', mouseUpFrom);
      });

      cancellation(this.elemFrom);
      this.eventFromFlag = true;
    }
    return true;
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
