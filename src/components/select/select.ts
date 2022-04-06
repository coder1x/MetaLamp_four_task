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

  update(value: string) {
    this.updateFlag = true;
    let flag = false;

    for (let i = 0; i < this.items.length; i += 1) {
      const dom = this.items[i] as HTMLElement;
      const data = dom.getAttribute('data-val');
      if (data === value) {
        flag = true;
        this.setValSelect(dom);
        break;
      }
    }

    this.updateFlag = false;
    if (flag) {
      this.onUpdate(value);
    }
  }

  private init() {
    const emptyFun = (val: string) => val;
    this.onChange = emptyFun;
    this.onUpdate = emptyFun;

    this.setDomElem();
    this.setActions();
    this.startFlag = false;
  }

  private getElement(str: string, domBase?: Element) {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    return dom.querySelector(selector);
  }

  private getElements(str: string, domBase?: Element): Element[] {
    const dom = domBase ?? this.elem;
    const selector = this.className + str;
    return [...dom.querySelectorAll(selector)];
  }

  private setDomElem() {
    this.button = this.getElement('__displayed') as HTMLButtonElement;
    this.input = this.getElement('__input') as HTMLInputElement;
    this.items = this.getElements('__item');
    this.options = this.getElement('__options') as HTMLElement;
    this.displayedWrap = this.getElement('__displayed-wrap') as HTMLElement;
    this.setDisplayed();
  }

  private setValSelect(elem: HTMLElement) {
    const text = elem.innerText;
    this.button.innerText = text;
    const val = elem.getAttribute('data-val');
    this.input.value = val;

    if (!this.updateFlag && !this.startFlag) { this.onChange(val); }
  }

  private setDisplayed() {
    for (let i = 0; i < this.items.length; i += 1) {
      const dom = this.items[i] as HTMLElement;
      if (dom.classList.contains('js-selected')) {
        this.setValSelect(dom);
        dom.classList.remove('js-selected');
        break;
      }
    }
  }

  private static getVisible(elem: HTMLElement) {
    const display = window.getComputedStyle(elem, null)
      .getPropertyValue('display');
    return display !== 'none';
  }

  private toggle(flag = false) {
    const UlVisible: boolean = Select.getVisible(this.options);
    const flagVis = !UlVisible && !flag;
    this.toggleModify(this.elem, flagVis);
  }

  private getModify() {
    const selector = `${this.className.replace('js-', '')}_visible`;
    return selector.replace(/^\./, '');
  }

  private toggleModify(elem: Element, flag = false) {
    const clearName = this.getModify();
    const objClass = elem.classList;

    if (flag) {
      objClass.add(clearName);
    } else {
      objClass.remove(clearName);
    }
  }

  private setActions() {
    this.displayedWrap.addEventListener('click', () => {
      this.toggle();
    });

    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.toggle(true);
      }
    };

    this.button.addEventListener('keydown', keydown);
    this.options.addEventListener('keydown', keydown);
    this.button.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
    });

    const setValue = (event: MouseEvent | KeyboardEvent) => {
      let flag = false;
      let mousE: string;
      let keyE: string;

      if (event instanceof MouseEvent) {
        mousE = event.type;
      }
      if (event instanceof KeyboardEvent) {
        keyE = event.key;
      }

      if (keyE === 'Enter' || keyE === ' ') {
        event.preventDefault();
        flag = true;
      } else if (mousE === 'click') { flag = true; }

      if (flag) {
        const { target } = event;
        if (target instanceof HTMLElement) { this.setValSelect(target); }
        this.toggle(true);
      }
    };

    this.items.forEach((item) => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', setValue);
        item.addEventListener('keydown', setValue);
      }
    });

    document.addEventListener('click', (event: MouseEvent) => {
      const { target } = event;
      let domEl: false | Element;
      if (target instanceof Element) {
        domEl = target.closest(`.${this.getModify()}`) ?? false;
      }
      if (!domEl) {
        this.toggle(true);
      }
    });

    document.addEventListener('focusin', (event: FocusEvent) => {
      const { target } = event;
      if (target instanceof Element) {
        const linkEl = target.closest(`${this.className}__options`) ?? false;
        const ulEl = target.closest(`.${this.getModify()}`) ?? false;
        if (!linkEl && !ulEl) { this.toggle(true); }
      }
    });
  }
}

export default Select;
