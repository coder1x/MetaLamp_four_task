import './different.scss';
import { Select } from '../select/select';



interface OP {
  type?: string;
  disabled?: boolean;
  bar?: boolean;
  orientation?: string;
  theme?: string;
}


class Different {

  private elem: HTMLElement;
  private type: HTMLInputElement;
  private disabled: HTMLInputElement;
  private orientation: HTMLInputElement;
  private bar: HTMLInputElement;
  private select: Select;
  private reset: HTMLButtonElement;


  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement) {

    this.elem = elem;
    this.setDom();
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

    this.type = getDom('double');
    this.disabled = getDom('disabled');
    this.bar = getDom('bar');
    this.orientation = getDom('vertical');
    this.reset =
      this.elem.querySelector(this.nameClass + '__reset') as HTMLButtonElement;

    const selectE = this.elem.querySelector('.select');
    this.select = new Select('.select', selectE as HTMLElement);

  }


  setData(options: OP) {
    this.disabled.checked = options.disabled;
    this.bar.checked = options.bar;
    this.type.checked = options.type == 'double' ? true : false;
    const orientF = options.orientation == 'horizontal' ? false : true;
    this.orientation.checked = orientF;
    this.select.update(String(options.theme));
  }

  setAction(obj: any, panelE: HTMLElement) {

    this.reset.addEventListener('click', () => {
      obj.reset();
    });

    this.select.onChange = (val: string) => {
      obj.update({
        theme: val
      });
    };

    this.disabled.addEventListener('click', function () {
      obj.update({
        disabled: this.checked
      });
    });

    this.bar.addEventListener('click', function () {
      obj.update({
        bar: this.checked
      });
    });

    this.type.addEventListener('click', function () {
      const val = this.checked ? 'double' : 'single';
      obj.update({
        type: val
      });
    });



    const modif = panelE.className + '_vertical';

    this.orientation.addEventListener('click', function () {
      const val = this.checked ? 'vertical' : 'horizontal';
      const objP = panelE.classList;
      this.checked ? objP.add(modif) : objP.remove(modif);

      obj.update({
        orientation: val
      });
    });


  }


}



export { Different };