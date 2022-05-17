import { boundMethod } from 'autobind-decorator';

class Select {
  private className: string;

  private element: Element;

  private button: HTMLButtonElement | null = null;

  private input: HTMLInputElement | null = null;

  private items: Element[] = [];

  private displayedWrap: HTMLElement | null = null;

  private options: HTMLElement | null = null;

  // eslint-disable-next-line no-unused-vars
  onChange: ((value: string | null) => void) | null = null;

  // eslint-disable-next-line no-unused-vars
  onUpdate: ((value: string | null) => void) | null = null;

  private isUpdated = false;

  private isStarted = true;

  constructor(className: string, element: Element) {
    this.className = className;
    this.element = element;
    this.init();
  }

  getData() {
    if (!this.input) return '';
    return this.input.value;
  }

  update(value: string) {
    this.isUpdated = true;
    let isData = false;

    for (let i = 0; i < this.items.length; i += 1) {
      const element = this.items[i] as HTMLElement;
      const data = element.getAttribute('data-value');
      if (data === value) {
        isData = true;
        this.setValueSelect(element);
        break;
      }
    }

    this.isUpdated = false;
    if (isData && this.onUpdate) {
      this.onUpdate(value);
    }
  }

  private init() {
    this.setDomElem();
    this.bindEvent();
    this.isStarted = false;
  }

  private getElement(string: string, parentElement?: Element) {
    return (parentElement ?? this.element).querySelector(this.className + string);
  }

  private getElements(str: string, parentElement?: Element): Element[] {
    return [
      ...(parentElement ?? this.element).querySelectorAll(this.className + str),
    ];
  }

  private setDomElem() {
    this.button = this.getElement('__displayed') as HTMLButtonElement;
    this.input = this.getElement('__input') as HTMLInputElement;
    this.items = this.getElements('__item');
    this.options = this.getElement('__options') as HTMLElement;
    this.displayedWrap = this.getElement('__displayed-wrapper') as HTMLElement;
    this.setDisplayed();
  }

  private setValueSelect(element: HTMLElement) {
    if (!this.button || !this.input) return false;

    this.button.innerText = element.innerText;
    const value = element.getAttribute('data-value');
    this.input.value = value ?? '';

    const isNotChanged = !this.isUpdated && !this.isStarted;

    if (isNotChanged && this.onChange) { this.onChange(value); }

    return true;
  }

  private setDisplayed() {
    for (let i = 0; i < this.items.length; i += 1) {
      const element = this.items[i] as HTMLElement;
      const { classList } = element;
      if (classList.contains('js-selected')) {
        this.setValueSelect(element);
        classList.remove('js-selected');
        break;
      }
    }
  }

  private static getVisible(element: HTMLElement) {
    return window.getComputedStyle(element, null)
      .getPropertyValue('display') !== 'none';
  }

  private toggle(isVisible = false) {
    if (!this.options) return false;

    this.toggleModifier(
      this.element,
      !Select.getVisible(this.options) && !isVisible,
    );

    return true;
  }

  private getModifier() {
    return `${this.className.replace('js-', '')}_visible`.replace(/^\./, '');
  }

  private toggleModifier(element: Element, isVisible = false) {
    const clearName = this.getModifier();
    const { classList } = element;

    if (isVisible) {
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
    const isEnter = event.key === 'Enter';
    const isSpace = event.key === ' ';

    if (isEnter || isSpace) {
      event.preventDefault();
      this.toggle();
    }
  }

  @boundMethod
  private handleItemsSet(event: MouseEvent | KeyboardEvent) {
    let isSelected = false;
    let mouse: string = '';
    let key: string = '';

    if (event instanceof MouseEvent) {
      mouse = event.type;
    }
    if (event instanceof KeyboardEvent) {
      key = event.key;
    }

    const isEnter = key === 'Enter';
    const isSpace = key === ' ';

    if (isEnter || isSpace) {
      event.preventDefault();
      isSelected = true;
    } else if (mouse === 'click') { isSelected = true; }

    if (isSelected) {
      this.setValueSelect(event.target as HTMLElement);
      this.toggle(true);
    }
  }

  @boundMethod
  private handleDocumentClick(event: MouseEvent) {
    const element = (event.target as Element)
      .closest(`.${this.getModifier()}`) ?? false;
    if (!element) {
      this.toggle(true);
    }
  }

  @boundMethod
  private handleDocumentFocusin(event: FocusEvent) {
    const element = event.target as Element;
    const isLink = element.closest(`${this.className}__options`) ?? false;
    const isList = element.closest(`.${this.getModifier()}`) ?? false;
    if (!isLink && !isList) { this.toggle(true); }
  }

  private bindEvent() {
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
