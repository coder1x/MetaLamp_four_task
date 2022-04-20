import { boundMethod } from 'autobind-decorator';
import './select.scss';

class Select {
  private className: string;

  private elem: Element;

  private button: HTMLButtonElement | null = null;

  private input: HTMLInputElement | null = null;

  private items: Element[] = [];

  private displayedWrap: HTMLElement | null = null;

  private options: HTMLElement | null = null;

  onChange: Function = (value: string) => value;

  onUpdate: Function = (value: string) => value;

  private updateFlag = false;

  private startFlag = true;

  constructor(className: string, elem: Element) {
    this.className = className;
    this.elem = elem;
    this.init();
  }

  getData() {
    if (!this.input) return '';
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
    this.setDomElem();
    this.setActions();
    this.startFlag = false;
  }

  private getElement(str: string, domBase?: Element) {
    return (domBase ?? this.elem).querySelector(this.className + str);
  }

  private getElements(str: string, domBase?: Element): Element[] {
    return [
      ...(domBase ?? this.elem).querySelectorAll(this.className + str),
    ];
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
    if (!this.button || !this.input) return false;

    this.button.innerText = elem.innerText;
    const value = elem.getAttribute('data-val');
    this.input.value = value ?? '';

    if (!this.updateFlag && !this.startFlag) { this.onChange(value); }

    return true;
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
    return window.getComputedStyle(elem, null)
      .getPropertyValue('display') !== 'none';
  }

  private toggle(flag = false) {
    if (!this.options) return false;

    this.toggleModify(
      this.elem,
      !Select.getVisible(this.options) && !flag,
    );

    return true;
  }

  private getModify() {
    return `${this.className.replace('js-', '')}_visible`.replace(/^\./, '');
  }

  private toggleModify(elem: Element, flag = false) {
    const clearName = this.getModify();
    const { classList } = elem;

    if (flag) {
      classList.add(clearName);
    } else {
      classList.remove(clearName);
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
    let mouse: string = '';
    let key: string = '';

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
      this.setValSelect(event.target as HTMLElement);
      this.toggle(true);
    }
  }

  @boundMethod
  private handleDocumentClick(event: MouseEvent) {
    const elem = (event.target as Element)
      .closest(`.${this.getModify()}`) ?? false;
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
    if (!this.displayedWrap || !this.button) return false;

    this.displayedWrap.addEventListener('click', this.handleDisplayedWrap);
    this.button.addEventListener('keydown', this.handleKeydown);

    if (this.options) {
      this.options.addEventListener('keydown', this.handleKeydown);
    }
    this.button.addEventListener('keydown', this.handleButtonKeydown);

    this.items.forEach((item) => {
      if (item instanceof HTMLElement) {
        item.addEventListener('click', this.handleItemsSet);
        item.addEventListener('keydown', this.handleItemsSet);
      }
    });
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('focusin', this.handleDocumentFocusin);

    return true;
  }
}

export default Select;
