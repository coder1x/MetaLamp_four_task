import './select.scss';

interface optE {
  str: string,
  fl?: boolean,
  dom?: Element
}


class Select {

  private className: string;
  private elem: HTMLElement;
  private button: HTMLElement;
  private input: HTMLInputElement;
  private items: HTMLElement[];
  private displayedWrap: HTMLElement;
  private options: HTMLElement;
  onChange: Function;
  onUpdate: Function;
  private updateFlag = false;
  private startFlag = true;


  constructor(className: string, elem: HTMLElement) {
    this.className = className;
    this.elem = elem;
    this.init();
  }


  getData() {
    return this.input.value;
  }

  update(val: string) {
    this.updateFlag = true;
    let flag = false;
    for (let item of this.items) {
      const data = item.getAttribute('data-val');
      if (data == val) {
        flag = true;
        this.setValSelect(item);
        break;
      }
    }

    this.updateFlag = false;
    if (flag) {
      this.onUpdate(val);
    }
  }


  private init() {
    const emptyFun = (val: string) => { return val; };
    this.onChange = emptyFun;
    this.onUpdate = emptyFun;

    this.setDomElem();
    this.setActions();
    this.startFlag = false;
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


  private setDomElem() {

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

  private setValSelect(elem: HTMLElement) {
    const text = elem.innerText;
    this.button.innerText = text;
    const val = elem.getAttribute('data-val');
    this.input.value = val;

    if (!this.updateFlag && !this.startFlag)
      this.onChange(val);
  }

  private setDisplayed() {
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
    this.toggleModify(this.elem, flagVis);
  }

  private getModify() {
    const selector = this.className + '_visible';
    return selector.replace(/^\./, '');
  }

  private toggleModify(elem: Element, flag = false) {
    const clearName = this.getModify();
    const objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private setActions() {
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
        e.preventDefault();
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
      const domEl = target.closest('.' + this.getModify()) ?? false;
      if (!domEl) {
        this.toggle(true);
      }
    });


    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const linkEl = target.closest(
        this.className + '__options'
      ) ?? false;
      const ulEl = target.closest('.' + this.getModify()) ?? false;
      if (!linkEl && !ulEl) { this.toggle(true); }
    });

  }

}



export { Select };