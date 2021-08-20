import './select.scss';

interface optE {
  str: string,
  fl?: boolean,
  dom?: Element
}


class Select {

  className: string;
  elem: HTMLElement;
  button: HTMLElement;
  input: HTMLInputElement;
  items: HTMLElement[];
  displayedWrap: HTMLElement;
  options: HTMLElement;

  constructor(className: string, elem: HTMLElement) {
    this.className = className;
    this.elem = elem;

    this.setDomElem();
    this.setActions();
  }

  private getElem(param: optE) {
    let elem: HTMLElement[] | Element;
    let dom = param.dom ?? this.elem;
    let name = this.className + param.str;
    if (param.fl) {
      elem = [...dom.querySelectorAll<HTMLElement>(name)];
    }
    else {
      elem = dom.querySelector(name);
    }
    return elem;
  }

  setDomElem() {

    this.button = this.getElem({
      str: '__displayed'
    }) as HTMLButtonElement;

    this.input = this.getElem({
      str: '__input'
    }) as HTMLInputElement;

    this.items = this.getElem({
      str: '__item',
      fl: true
    }) as HTMLElement[];

    this.options = this.getElem({
      str: '__options',
    }) as HTMLElement;


    this.displayedWrap = this.getElem({
      str: '__displayed-wrap'
    }) as HTMLElement;



    //classList.contains('js-selected');
    this.setDisplayed();
  }


  setDisplayed() {
    for (let item of this.items) {
      if (item.classList.contains('js-selected')) {
        const text = item.innerText;
        this.button.innerText = text;
        item.classList.remove('js-selected');
        break;
      }
    }
  }

  private getVisible(elem: Element) {
    let display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display === 'none' ? false : true;
  }

  private toggle(flag = false) {
    const UlVisible: boolean = this.getVisible(this.options);
    let flagVis = !UlVisible && !flag;
    this.toggleModif(this.elem, '_visible', flagVis);
  }


  private toggleModif(elem: Element, modif: string, flag = false) {
    let clearName = this.className.replace(/^\./, '') + modif;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  setActions() {


    this.displayedWrap.addEventListener('click', (e: MouseEvent) => {

      this.toggle();

    });

  }



}


//==========================================================================

function renderSelect(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new Select(className, elem as HTMLElement));
  }
  return objMas;
}

renderSelect('.select');