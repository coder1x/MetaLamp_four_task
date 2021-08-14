
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


  createHandle(wrapElem: HTMLElement, handler: Function) {

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


    handler(
      this.elemFrom.offsetWidth,
      this.wrapElem.offsetWidth);

  }


  setFrom(fromP: number) {
    this.elemFrom.style.left = fromP + '%';
  }

  setTo(toP: number) {
    if (this.options.type == 'double')
      this.elemTo.style.left = toP + '%';
  }


  setActions(handler: Function) {

    let shiftX = 0;

    const moveDot = (event: PointerEvent, elem: HTMLElement, type: string) => {

      const wrapWidth = this.wrapElem.offsetWidth;
      const position = this.wrapElem.getBoundingClientRect().left;

      handler({
        dotWidth: elem.offsetWidth,
        type: type,
        wrapWidth: wrapWidth,
        wrapLeft: position,
        clientX: event.clientX,
        shiftX: shiftX
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


    if (this.options.type == 'double') {
      this.elemTo.addEventListener('pointerdown', (event: PointerEvent) => {

        if (this.options.type == 'double')
          this.elemTo.style.zIndex = '2';
        this.elemFrom.style.zIndex = '1';


        mouseDown(event, this.elemTo);
        document.addEventListener('pointermove', mouseMoveTo);
        document.addEventListener('pointerup', mouseUpTo);
      });
      cancellation(this.elemTo);
    }


    this.elemFrom.addEventListener('pointerdown', (event: PointerEvent) => {

      if (this.options.type == 'double')
        this.elemTo.style.zIndex = '1';
      this.elemFrom.style.zIndex = '2';

      mouseDown(event, this.elemFrom);
      document.addEventListener('pointermove', mouseMoveFrom);
      document.addEventListener('pointerup', mouseUpFrom);
    });
    cancellation(this.elemFrom);

  }



}





export { Handle };