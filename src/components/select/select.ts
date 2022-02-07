import './select.scss';


class Select {

  private className: string;
  private elem: Element;
  private button: HTMLButtonElement;
  private input: HTMLInputElement;
  private items: Element[];
  private displayedWrap: HTMLElement;
  private options: HTMLElement;
  onChange: Function;
  onUpdate: Function;
  private updateFlag = false;
  private startFlag = true;


  constructor(className: string, elem: Element) {
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
        if (item instanceof HTMLElement)
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



  private getElement(str: string, domBase?: Element): Function {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const elem: Element = dom.querySelector(selector);
    if (elem instanceof HTMLElement)
      return function (): HTMLElement { return elem; };
    if (elem instanceof HTMLButtonElement)
      return function (): HTMLButtonElement { return elem; };
    if (elem instanceof HTMLInputElement)
      return function (): HTMLInputElement { return elem; };
    if (elem instanceof Element)
      return function (): Element { return elem; };
    return () => { return elem; };
  }

  private getElements(str: string, domBase?: Element): Element[] {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    const doms = [...dom.querySelectorAll(selector)];
    return doms;
  }


  private setDomElem() {

    this.button = this.getElement('__displayed')();
    this.input = this.getElement('__input')();
    this.items = this.getElements('__item');
    this.options = this.getElement('__options')();
    this.displayedWrap = this.getElement('__displayed-wrap')();

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
        if (item instanceof HTMLElement)
          this.setValSelect(item);
        item.classList.remove('js-selected');
        break;
      }
    }
  }

  private getVisible(elem: HTMLElement) {
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
    const selector = this.className.replace('js-', '') + '_visible';
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
      let mousE: string;
      let keyE: string;

      if (e instanceof MouseEvent) {
        mousE = e.type;
      }
      if (e instanceof KeyboardEvent) {
        keyE = e.key;
      }

      if (keyE == 'Enter' || keyE == ' ') {
        e.preventDefault();
        flag = true;
      } else if (mousE == 'click')
        flag = true;

      if (flag) {
        const target = e.target;
        if (target instanceof HTMLElement)
          this.setValSelect(target);
        this.toggle(true);
      }
    };


    for (let item of this.items) {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', setValue);
        item.addEventListener('keydown', setValue);
      }
    }


    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target;
      let domEl: false | Element;
      if (target instanceof Element)
        domEl = target.closest('.' + this.getModify()) ?? false;
      if (!domEl) {
        this.toggle(true);
      }
    });


    document.addEventListener('focusin', (e: FocusEvent) => {
      const target = e.target;
      if (target instanceof Element) {
        const linkEl = target.closest(
          this.className + '__options'
        ) ?? false;
        const ulEl = target.closest('.' + this.getModify()) ?? false;
        if (!linkEl && !ulEl) { this.toggle(true); }
      }
    });
  }

}



export { Select };