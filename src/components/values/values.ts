import './values.scss';



class Values {

  private elem: HTMLElement;
  private min: HTMLInputElement;
  private max: HTMLInputElement;
  private from: HTMLInputElement;
  private to: HTMLInputElement;


  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {

    this.elem = elem;
    this.setDom();

    this.setAction();
  }

  private setDom() {

    const getDom = (str: string) => {
      return this.elem.querySelector(
        this.nameClass +
        '__' +
        str +
        '-wrap input'
      ) as HTMLInputElement;
    };

    this.min = getDom('min');
    this.max = getDom('max');
    this.from = getDom('from');
    this.to = getDom('to');

  }




  private setAction() {

    // this.linkEl.addEventListener('click', () => {
    //   this.toggleLike();
    // });

    // this.linkEl.addEventListener('keydown', (e: KeyboardEvent) => {
    //   if (e.key == 'Enter' || e.key == ' ') {
    //     this.toggleLike();
    //     e.preventDefault();
    //   }
    // });

  }

}



// function renderValues(className: string) {
//   let components = document.querySelectorAll(className);
//   let objMas: Values[] = [];
//   for (let elem of components) {
//     objMas.push(new Values(className, elem as HTMLElement));
//   }
//   return objMas;
// }


// // eslint-disable-next-line no-unused-vars
// const objValues = renderValues('.values');



export { Values };
