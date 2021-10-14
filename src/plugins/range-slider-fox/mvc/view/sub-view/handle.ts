

import { Observer } from '../../../observer';

class Handle extends Observer {

  elemFrom: HTMLElement;
  elemTo: HTMLElement;
  rsName: string;
  wrapElem: HTMLElement;
  eventFromF: boolean;
  eventToF: boolean;
  vertical: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(rsName: string, rsCenter: HTMLElement) {
    super();
    this.rsName = rsName;
    this.wrapElem = rsCenter;
    this.eventFromF = false;
    this.eventToF = false;
  }

  getElem = (elem: Element, str: string) => {
    return elem.getElementsByClassName(str)[0] as HTMLElement;
  };


  createDomBase(type: string) {
    if (type == 'double' && this.elemFrom && this.elemTo) return;
    if (type == 'single' && this.elemFrom && !this.elemTo) return;

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

    if (type == 'double') {
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
  }


  setOrientation(str: string) {
    this.vertical = str == 'vertical' ? true : false;

    const convertStyle = (elem: CSSStyleDeclaration) => {
      let val = '';
      if (this.vertical) {
        if (elem.left == '') return;
        val = elem.left;
        elem.removeProperty('left');
        elem.bottom = val;
      } else {
        if (elem.bottom == '') return;
        val = elem.bottom;
        elem.removeProperty('bottom');
        elem.left = val;
      }
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


  setActions(type: string) {

    // нужны проверки которые будут проверять что мы не вешаем события повторно.

    const eventFromTo = this.eventFromF && this.eventToF;

    if (type == 'double' && eventFromTo) return;

    if (type == 'single' && eventFromTo) {
      this.eventToF = false;
    }




    let shiftXY = 0;


    // moveDot - будет передовать данные - так что на эти изменения нужно подписывать слушателей
    // из модели. - которые будут менять конфиг и в свою очередь вызывать слушателей из Вью.

    const moveDot = (event: PointerEvent, elem: HTMLElement, type: string) => {

      let wrapWH = 0;
      const rect = this.wrapElem.getBoundingClientRect();

      let position = 0;
      let clientXY = 0;

      if (this.vertical) {
        wrapWH = this.wrapElem.offsetHeight;
        position = rect.bottom;
        clientXY = event.clientY;
      } else {
        wrapWH = this.wrapElem.offsetWidth;
        position = rect.left;
        clientXY = event.clientX;
      }


      this.notifyOB({
        key: 'DotMove',
        type: type,  // какая точка 
        wrapWH: wrapWH, // ширина или высота враппера  
        position: position,  // координаты левого или нижнего края враппера
        clientXY: clientXY, // координаты точки 
        shiftXY: shiftXY, // сдвиг = координаты точки минус координаты края этой точки.
      });

    };


    const mouseMoveFrom = (event: PointerEvent) => {
      moveDot(event, this.elemFrom, 'From');
    };


    const mouseUpFrom = () => {
      document.removeEventListener('pointerup', mouseUpFrom);
      document.removeEventListener('pointermove', mouseMoveFrom);
    };

    const mouseMoveTo = (event: PointerEvent) => {
      if (type == 'double')
        moveDot(event, this.elemTo, 'To');
    };


    const mouseUpTo = () => {
      document.removeEventListener('pointerup', mouseUpTo);
      document.removeEventListener('pointermove', mouseMoveTo);
    };

    const mouseDown = (event: PointerEvent, elem: HTMLElement) => {
      event.preventDefault();
      const rect = elem.getBoundingClientRect();

      if (this.vertical) {
        shiftXY = event.clientY - rect.bottom;
      } else {
        shiftXY = event.clientX - rect.left;
      }

      elem.setPointerCapture(event.pointerId);
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


          mouseDown(event, this.elemTo);
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

        mouseDown(event, this.elemFrom);
        document.addEventListener('pointermove', mouseMoveFrom);
        document.addEventListener('pointerup', mouseUpFrom);
      });

      cancellation(this.elemFrom);
      this.eventFromF = true;
    }

  }



}





export { Handle };