import { DateGrid } from '../view.d';

class Grid {

  rsBottom: HTMLElement;
  rsName: string;
  elemGrid: HTMLElement;
  interval: number;
  min: number;
  max: number;
  indent: number;


  constructor(elem: HTMLElement | Element) {
    this.rsName = 'range-slider';
    this.indent = 4; // отступ в пикселях между числами на шкале
    this.rsBottom = (elem as HTMLElement);
  }

  createElem(teg: string, className: string[]) {
    const elem = document.createElement(teg);
    for (let item of className) {
      elem.classList.add(item);
    }
    return elem;
  }


  setData(options: DateGrid) {
    this.interval = options.interval;
    this.min = options.min;
    this.max = options.max;
  }



  createDomGrid(handler: Function) {

    this.elemGrid = this.createElem('div', [this.rsName + '__grid']);

    const createMark = (val: number, position: number, elem: HTMLElement) => {
      const gridPol = this.createElem('div', [this.rsName + '__grid-pol']);
      const gridMark = this.createElem('span', [this.rsName + '__grid-mark']);
      gridMark.innerText = String(val);
      gridPol.appendChild(gridMark);
      gridPol.style.left = position + '%';
      elem.appendChild(gridPol);

    };


    createMark(this.min, 0, this.elemGrid);
    let obj = handler(this.min);
    createMark(obj.value, obj.position, this.elemGrid);

    for (let i = 1; i < this.interval - 1; i++) {
      obj = handler(obj.value);
      createMark(obj.value, obj.position, this.elemGrid);
    }

    createMark(this.max, 100, this.elemGrid);
    this.rsBottom.appendChild(this.elemGrid);
    this.shapingMark();
  }




  shapingMark() {
    const gridMarks = this.elemGrid.getElementsByClassName(
      this.rsName + '__grid-mark'
    );


    // скрываем предпоследнее число если оно не поместилось.
    const len = gridMarks.length;
    if (len > 1) {
      const last = gridMarks[len - 1];
      const previous = (gridMarks[len - 2] as HTMLElement);

      const lastX = last.getBoundingClientRect().left;
      const previousX = previous.getBoundingClientRect().left +
        previous.offsetWidth + this.indent;

      if (previousX >= lastX) {
        const elem = (previous.parentNode as HTMLElement);
        elem.style.visibility = 'hidden';
      }
    }


    // выравниваем цифры по серидине чёрточки
    for (let item of gridMarks) {
      const mark = (item as HTMLElement);
      const markX = mark.offsetWidth / 2;
      mark.style.left = '-' + markX + 'px';
    }


    this.visibleMark();
  }


  visibleMark() {

    // не трогаем предпоследний и последний элемент.
    // для него нужно отдельную логику можно ту часть которая его скрыла
    // сделать отдельным методом и в конце вызывать для того что бы определить
    // вдруг под это число появилось место и его можно показать.. :).. 
    //-----------------------------------------


    // нужно учитывать для каждого элемента this.indent .. 

    // короче нужен многомерный массив
    // заранее его разбиваем до самого низкого уровня 
    // записывая в начале ширину всех объектов а дальше индексы элементов
    // короче в зависемости от ширины врапера и ширины в списке элементов
    // выбираем то что помещается - таким образом мы можем крутить массив сколько угодно и показывать
    // всегда только нужные элементы.
    // для этого скрываем элементы которые не под индексами в массиве
    // а те индексы что совпадают из массива показываем. 
    // при определённых разрешениях скрывать промежуточные чёрточки. 


    // делать промежуточные либо 4 чёрточки либо 2 либо они исчезают
    // подумать как сделать что бы они так же с числами менялись .. 



  }




}








export { Grid };