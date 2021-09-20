
import { CreateHandleOptions } from '../view.d';

import { Observer, TOB } from '../../../observer';

class Handle extends Observer {

  elemFrom: HTMLElement;
  elemTo: HTMLElement;
  rsName: string;
  wrapElem: HTMLElement;
  eventFromF: boolean;
  eventToF: boolean;

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
      }
    }
  }



  setFrom(fromP: number) {
    this.elemFrom.style.left = fromP + '%';
  }


  setTo(toP: number, type: string) {
    if (type == 'double')
      this.elemTo.style.left = toP + '%';
  }


  setActions(type: string) {

    // нужны проверки которые будут проверять что мы не вешаем события повторно.

    const eventFromTo = this.eventFromF && this.eventToF;

    if (type == 'double' && eventFromTo) return;

    if (type == 'single' && eventFromTo) {
      this.eventToF = false;
    }




    let shiftX = 0;


    // moveDot - будет передовать данные - так что на эти изменения нужно подписывать слушателей
    // из модели. - которые будут менять конфиг и в свою очередь вызывать слушателей из Вью.

    const moveDot = (event: PointerEvent, elem: HTMLElement, type: string) => {

      const wrapWidth = this.wrapElem.offsetWidth;
      const position = this.wrapElem.getBoundingClientRect().left;

      // вызываем нотифай и опрашиваем подписчиков. 


      // console.log(type);  // какая точка 
      // //console.log(elem.offsetWidth); // ширина точки - это нужно отдельно где то просчитывать 
      // console.log(event.clientX);  // координаты точки 
      // console.log(wrapWidth);  // ширина враппера - это нужно отдельно где то просчитывать 
      // console.log(position); // координаты левого края враппера
      // console.log(shiftX); // сдвиг = координаты точки минус координаты левой стороны этой точки.

      this.notifyOB({
        key: 'DotMove',
        type: type,
        wrapWidth: wrapWidth,
        wrapLeft: position,
        clientX: event.clientX,
        shiftX: shiftX,
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
      moveDot(event, this.elemTo, 'To');
    };


    const mouseUpTo = () => {
      document.removeEventListener('pointerup', mouseUpTo);
      document.removeEventListener('pointermove', mouseMoveTo);
    };

    const mouseDown = (event: PointerEvent, elem: HTMLElement) => {
      event.preventDefault();
      const position = elem.getBoundingClientRect().left;
      shiftX = event.clientX - position;

      elem.setPointerCapture(event.pointerId);
    };


    const cancellation = (elem: HTMLElement) => {
      elem.ondragstart = function () { return false; };
      elem.onselectstart = function () { return false; };
    };


    if (type == 'double') {
      if (!this.eventToF) {
        this.elemTo.addEventListener('pointerdown', (event: PointerEvent) => {

          if (type == 'double')
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

        if (type == 'double')
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