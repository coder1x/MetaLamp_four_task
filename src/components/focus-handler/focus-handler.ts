
class focusHandler {
  input: any;
  keyF: boolean;

  // eslint-disable-next-line no-unused-vars
  constructor(public className: string, public elem: Element) {

    this.keyF = false;

    this.setDomElem();
    this.setActions();
  }

  private setDomElem() {
    const name = this.className + '__input';
    this.input = this.elem.querySelectorAll(name);
  }


  private toggleModif(elem: Element, modif: string, flag = false) {
    let clearName = this.className.replace(/^\./, '') + modif;
    let objClass = elem.classList;
    flag ? objClass.add(clearName) : objClass.remove(clearName);
  }

  private setActions() {

    const focusToggle = (elem: HTMLElement, fl = false) => {
      const bef = elem.nextElementSibling;
      this.toggleModif(bef, '__bef_border', fl);
    };

    for (let item of this.input) {
      item.addEventListener('click', (e: any) => {
        if (!this.keyF)
          focusToggle(e.target);

        this.keyF = false;
      });

      item.addEventListener('focus', (e: any) => {
        focusToggle(e.target, true);
      });

      item.addEventListener('focusout', (e: any) => {
        focusToggle(e.target);
      });

      item.addEventListener('keyup', () => {
        this.keyF = true;
      });
    }
  }
}




function renderFocusHandler(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new focusHandler(className, elem));
  }
  return objMas;
}


renderFocusHandler('.toggle-buttons');