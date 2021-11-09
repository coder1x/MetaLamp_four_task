import { Observer } from '../../../observer';

interface MD {
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
  private eventFromF: boolean;
  private eventToF: boolean;
  private vertical: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(rsCenter: HTMLElement, rsName: string) {
    super();
    this.rsName = rsName;
    this.wrapElem = rsCenter;
    this.eventFromF = false;
    this.eventToF = false;
  }

  private getElem = (elem: Element, str: string) => {
    return elem.getElementsByClassName(str)[0] as HTMLElement;
  };


  createDomBase(type: string) {
    const double = type == 'double' ? true : false;
    if (double && this.elemFrom && this.elemTo) return false;
    if (!double && this.elemFrom && !this.elemTo) return false;

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);
      for (let item of className) {
        elem.classList.add(item);
      }
      elem.setAttribute('tabindex', '0');
      return elem;
    };

    const fromClassName = this.rsName + '__from';
    const toClassName = this.rsName + '__to';

    const fromE = this.getElem(this.wrapElem, fromClassName);
    const toE = this.getElem(this.wrapElem, toClassName);

    // не создаём если элемент уже существует
    if (!fromE) {
      this.elemFrom = createElem('span', [fromClassName]);
      this.wrapElem.appendChild(this.elemFrom);
    }

    if (double) {
      // не создаём если элемент уже существует
      if (!toE) {
        this.elemTo = createElem('span', [toClassName]);
        this.wrapElem.appendChild(this.elemTo);
      }
    } else {
      // удаляем точку если есть
      if (toE) {
        toE.remove();
        this.elemTo = null;
      }
    }
    return true;
  }


  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let val = '';
      if (this.vertical) {
        if (elem.left == '') return false;
        val = elem.left;
        elem.removeProperty('left');
        elem.bottom = val;
      } else {
        if (elem.bottom == '') return false;
        val = elem.bottom;
        elem.removeProperty('bottom');
        elem.left = val;
      }
      return true;
    };

    convertStyle(this.elemFrom.style);

    if (this.elemTo)
      convertStyle(this.elemTo.style);
  }


  setFrom(fromP: number) {
    const val = fromP + '%';
    const from = this.elemFrom.style;
    this.vertical ? from.bottom = val : from.left = val;
  }


  setTo(toP: number) {
    if (this.elemTo) {
      const val = toP + '%';
      const to = this.elemTo.style;
      this.vertical ? to.bottom = val : to.left = val;
    }
  }

  private moveDot = (options: MD) => {

    const { event, type, shiftXY } = options;
    const rect = this.wrapElem.getBoundingClientRect();
    const wrap = this.wrapElem;
    const fl = this.vertical;

    const wrapWH = fl ? wrap.offsetHeight : wrap.offsetWidth;
    const position = fl ? rect.bottom : rect.left;
    const clientXY = fl ? event.clientY : event.clientX;

    this.notifyOB({
      key: 'DotMove',
      type,  // какая точка 
      wrapWH, // ширина или высота враппера  
      position,  // координаты левого или нижнего края враппера
      clientXY, // координаты точки 
      shiftXY, // сдвиг = координаты точки минус координаты края этой точки.
    });
  };

  private keyDown = (e: KeyboardEvent, directions: mapKey, dot: string) => {
    const fl = (e.key == 'ArrowRight' || e.key == 'ArrowLeft');
    if (this.vertical && fl || !this.vertical && !fl)
      return {};

    if (!directions.get(e.key)) return {};
    e.preventDefault();
    const repeat = e.repeat;
    const sign = directions.get(e.key);

    if (sign)
      this.notifyOB({
        key: 'DotKeyDown',
        keyRepeat: repeat,
        keySign: sign,
        dot: dot,
      });
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


  setActions(type: string) {
    const eventFromTo = this.eventFromF && this.eventToF;
    if (type == 'double' && eventFromTo) return false;
    if (type == 'single' && eventFromTo) {
      this.eventToF = false;
    }
    let shiftXY = 0;

    const directions = new Map();
    directions.set('ArrowRight', '+');
    directions.set('ArrowUp', '+');
    directions.set('ArrowLeft', '-');
    directions.set('ArrowDown', '-');

    if (!this.eventFromF)
      this.elemFrom.addEventListener('keydown', (e: KeyboardEvent) => {
        this.keyDown(e, directions, 'from');
      });

    if (this.elemTo && !this.eventToF)
      this.elemTo.addEventListener('keydown', (e: KeyboardEvent) => {
        this.keyDown(e, directions, 'to');
      });

    const mouseMoveFrom = (event: PointerEvent) => {
      this.moveDot({
        event: event,
        type: 'From',
        shiftXY
      });
    };

    const mouseUpFrom = () => {
      document.removeEventListener('pointerup', mouseUpFrom);
      document.removeEventListener('pointermove', mouseMoveFrom);
    };

    const mouseMoveTo = (event: PointerEvent) => {
      if (type == 'double')
        this.moveDot({
          event: event,
          type: 'To',
          shiftXY
        });
    };

    const mouseUpTo = () => {
      document.removeEventListener('pointerup', mouseUpTo);
      document.removeEventListener('pointermove', mouseMoveTo);
    };

    const cancellation = (elem: HTMLElement) => {
      elem.ondragstart = function () { return false; };
      elem.onselectstart = function () { return false; };
    };

    if (type == 'double') {
      if (!this.eventToF) {
        this.elemTo.addEventListener('pointerdown', (event: PointerEvent) => {
          this.elemTo.style.zIndex = '2';
          this.elemFrom.style.zIndex = '1';

          shiftXY = this.mouseDown(event, this.elemTo);
          document.addEventListener('pointermove', mouseMoveTo);
          document.addEventListener('pointerup', mouseUpTo);
        });

        cancellation(this.elemTo);
        this.eventToF = true;
      }
    }

    if (!this.eventFromF) {
      this.elemFrom.addEventListener('pointerdown', (event: PointerEvent) => {
        if (this.elemTo)
          this.elemTo.style.zIndex = '1';
        this.elemFrom.style.zIndex = '2';

        shiftXY = this.mouseDown(event, this.elemFrom);
        document.addEventListener('pointermove', mouseMoveFrom);
        document.addEventListener('pointerup', mouseUpFrom);
      });

      cancellation(this.elemFrom);
      this.eventFromF = true;
    }
    return true;
  }

}


export { Handle };