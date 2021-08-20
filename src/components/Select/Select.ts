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

    this.setDisplayed();
  }

  setValSelect(elem: HTMLElement) {
    const text = elem.innerText;
    this.button.innerText = text;
    const val = elem.getAttribute('data-val');
    this.input.value = val;
  }

  setDisplayed() {
    for (let item of this.items) {
      if (item.classList.contains('js-selected')) {
        this.setValSelect(item);
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
    this.toggleModif(this.elem, flagVis);
  }

  private getModif() {
    const selector = this.className + '_visible';
    return selector.replace(/^\./, '');
  }

  private toggleModif(elem: Element, flag = false) {
    const clearName = this.getModif();
    const objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  setActions() {

    this.displayedWrap.addEventListener('click', () => {
      this.toggle();
    });

    const keydown = (e: KeyboardEvent) => {
      if (e.key == 'Escape') {
        e.preventDefault();
        this.toggle(true);
      }

    };

    this.button.addEventListener('keydown', keydown);
    this.options.addEventListener('keydown', keydown);

    this.button.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == 'Enter' || e.key == ' ') {
        e.preventDefault();
        this.toggle();
      }
    });


    const setValue = (e: MouseEvent | KeyboardEvent) => {
      let flag = false;
      const keyE = e as KeyboardEvent;
      const mousE = e as MouseEvent;

      if (keyE.key == 'Enter' || keyE.key == ' ') {
        flag = true;
      } else if (mousE.type == 'click')
        flag = true;

      if (flag) {
        const target = e.target as HTMLElement;
        this.setValSelect(target);
        this.toggle(true);
      }
    };


    for (let item of this.items) {
      item.addEventListener('click', setValue);
      item.addEventListener('keydown', setValue);
    }


    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const domEl = target.closest('.' + this.getModif()) ?? false;
      if (!domEl) {
        this.toggle(true);
      }
    });


    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const linkEl = target.closest(
        this.className + '__options'
      ) ?? false;
      const ulEl = target.closest('.' + this.getModif()) ?? false;
      if (!linkEl && !ulEl) { this.toggle(true); }
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