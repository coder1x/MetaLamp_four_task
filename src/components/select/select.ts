import { boundMethod } from 'autobind-decorator';
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
    const emptyFun = (value: string) => value;
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
    const value = elem.getAttribute('data-val');
    this.input.value = value;

    if (!this.updateFlag && !this.startFlag) { this.onChange(value); }
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
    const flagVisible = !UlVisible && !flag;
    this.toggleModify(this.elem, flagVisible);
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

  @boundMethod
  private handleDisplayedWrap() {
    this.toggle();
  }

  @boundMethod
  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggle(true);
    }
  }

  @boundMethod
  private handleButtonKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  @boundMethod
  private handleItemsSet(event: MouseEvent | KeyboardEvent) {
    let flag = false;
    let mouse: string;
    let key: string;

    if (event instanceof MouseEvent) {
      mouse = event.type;
    }
    if (event instanceof KeyboardEvent) {
      key = event.key;
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      flag = true;
    } else if (mouse === 'click') { flag = true; }

    if (flag) {
      const dom = event.target as HTMLElement;
      this.setValSelect(dom);
      this.toggle(true);
    }
  }

  @boundMethod
  private handleDocumentClick(event: MouseEvent) {
    const dom = event.target as Element;
    const elem = dom.closest(`.${this.getModify()}`) ?? false;
    if (!elem) {
      this.toggle(true);
    }
  }

  @boundMethod
  private handleDocumentFocusin(event: FocusEvent) {
    const dom = event.target as Element;
    const linkEl = dom.closest(`${this.className}__options`) ?? false;
    const ulEl = dom.closest(`.${this.getModify()}`) ?? false;
    if (!linkEl && !ulEl) { this.toggle(true); }
  }

  private setActions() {
    this.displayedWrap.addEventListener('click', this.handleDisplayedWrap);
    this.button.addEventListener('keydown', this.handleKeydown);
    this.options.addEventListener('keydown', this.handleKeydown);
    this.button.addEventListener('keydown', this.handleButtonKeydown);

    this.items.forEach((item) => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', this.handleItemsSet);
        item.addEventListener('keydown', this.handleItemsSet);
      }
    });
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('focusin', this.handleDocumentFocusin);
  }
}

export default Select;
