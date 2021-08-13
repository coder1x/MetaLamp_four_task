
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



    const calcPosition = () => {

      const min = this.options.min;
      const max = this.options.max;
      const step = this.options.step;
      const from = this.options.from;
      const to = this.options.to;

      const valP = (max - min) / 100; // один процент
      const stepP = step / valP; // количество процентов в шаге
      const fromP = from * stepP; // позиция левой точки в процентах
      const toP = to * stepP; // позиция правой точки

      return { valP, stepP, fromP, toP };
    };


    const pos = calcPosition();


    this.elemFrom.style.left = pos.fromP + '%';
    this.elemTo.style.left = pos.toP + '%';


    let shiftX = 0;
    let limitFrom = pos.fromP;
    let limitTo = pos.toP;
    let fromTo = 0;


    const moveDot = (event: PointerEvent, elem: HTMLElement, type: string) => {


      const dot = elem.offsetWidth * 100 / this.wrapElem.offsetWidth; // ширина точки в процентах

      const position = this.wrapElem.getBoundingClientRect().left;
      const num = event.clientX - shiftX - position;

      const wrapWidth = this.wrapElem.offsetWidth;
      let percent = num * 100 / wrapWidth;

      if (type == 'From') {
        limitFrom = percent;
      }
      else {
        limitTo = percent;
      }

      const limitDot = !(limitFrom > limitTo);

      if (percent < 0) percent = 0;
      if (percent > 100 - dot) percent = 100 - dot;


      if (limitDot) {
        fromTo = percent;
        elem.style.left = percent + '%';
      }
      else {
        this.elemFrom.style.left = fromTo + '%';
        this.elemTo.style.left = fromTo + '%';
      }

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

        this.elemTo.style.zIndex = '2';
        this.elemFrom.style.zIndex = '1';


        mouseDown(event, this.elemTo);
        document.addEventListener('pointermove', mouseMoveTo);
        document.addEventListener('pointerup', mouseUpTo);
      });
      cancellation(this.elemTo);
    }


    this.elemFrom.addEventListener('pointerdown', (event: PointerEvent) => {


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