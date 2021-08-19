import './code.scss';

class CopyCode {

  className: string;
  elem: HTMLElement;
  button: HTMLButtonElement;
  code: HTMLElement;

  constructor(className: string, component: HTMLElement) {
    this.className = className;
    this.elem = component;
    this.setDomElem();
    this.setActions();
  }

  setDomElem() {
    this.button = this.elem.querySelector(this.className + '__copy');
    this.code = this.elem.querySelector(this.className + '__lang-java');
  }

  setActions() {
    this.button.addEventListener('click', () => {
      const text = this.code.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
    });
  }

}


//==========================================================================

function renderCopyCode(className: string) {
  let components = document.querySelectorAll(className);
  let objMas = [];
  for (let elem of components) {
    objMas.push(new CopyCode(className, elem as HTMLElement));
  }
  return objMas;
}

renderCopyCode('.code');
