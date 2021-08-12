
import { CreateHandleOptions } from '../view.d';

class Handle {

  elemFrom: HTMLElement;
  elemTo: HTMLElement;
  rsName: string;
  wrapElem: HTMLElement;

  // eslint-disable-next-line no-unused-vars
  constructor(public options: CreateHandleOptions) {
    this.rsName = 'range-slider';

  }

  createHandle(wrapElem: HTMLElement) {

    const createElem = (teg: string, className: string[]) => {
      const elem = document.createElement(teg);
      for (let item of className) {
        elem.classList.add(item);
      }
      elem.setAttribute('tabindex', '0');
      return elem;
    };

    if (this.options.type == 'double') {
      this.elemTo = createElem('span', [this.rsName + '__to']);
      wrapElem.appendChild(this.elemTo);
    }

    this.elemFrom = createElem('span', [this.rsName + '__from']);
    wrapElem.appendChild(this.elemFrom);

    this.wrapElem = wrapElem;
  }


  setActions() {

    let shiftX = 0;

    const moveDot = (event: PointerEvent, elem: HTMLElement) => {
      const position = this.wrapElem.getBoundingClientRect().left;
      let newLeft = event.clientX - shiftX - position;

      if (newLeft < 0) newLeft = 0;

      const rightEdge =
        this.wrapElem.offsetWidth - elem.offsetWidth;
      if (newLeft > rightEdge) newLeft = rightEdge;

      elem.style.left = newLeft + 'px';
    };


    const mouseMoveFrom = (event: PointerEvent) => {

      // 

      moveDot(event, this.elemFrom);
    };


    const mouseUpFrom = () => {
      document.removeEventListener('pointerup', mouseUpFrom);
      document.removeEventListener('pointermove', mouseMoveFrom);
    };

    const mouseMoveTo = (event: PointerEvent) => {
      moveDot(event, this.elemTo);
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


    if (this.options.type == 'double') {
      this.elemTo.addEventListener('pointerdown', (event: PointerEvent) => {

        // определяем Левый край точки (From) - 
        // это будет служить нам границей по левой стороне
        // активная точка в момент движения получает z-index:2 
        // а не активная точка получает z-index:1
        // так мы сможем наплыть сверху и при нажатии будет доступна лишь верхняя точка.

        mouseDown(event, this.elemTo);
        document.addEventListener('pointermove', mouseMoveTo);
        document.addEventListener('pointerup', mouseUpTo);
      });
      cancellation(this.elemTo);
    }


    this.elemFrom.addEventListener('pointerdown', (event: PointerEvent) => {


      // определяем Правый край точки (TO) - 
      // это будет служить нам границей по правой стороне
      // активная точка в момент движения получает z-index:2 
      // а не активная точка получает z-index:1
      // так мы сможем наплыть сверху и при нажатии будет доступна лишь верхняя точка.

      mouseDown(event, this.elemFrom);
      document.addEventListener('pointermove', mouseMoveFrom);
      document.addEventListener('pointerup', mouseUpFrom);
    });
    cancellation(this.elemFrom);


  }



}





export { Handle };