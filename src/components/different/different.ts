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
  private panel: HTMLElement;
  private modif: string;


  // eslint-disable-next-line no-unused-vars
  constructor(public nameClass: string, elem: HTMLElement, panel: HTMLElement) {
    this.panel = panel;
    this.elem = elem;
    this.setDom();
  }

  private setDom() {

    this.modif = this.panel.className + '_vertical';

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
    console.log('setData');

    this.disabled.checked = options.disabled;
    this.bar.checked = options.bar;
    this.type.checked = options.type == 'double' ? true : false;
    const orientF = options.orientation == 'horizontal' ? false : true;
    this.orientation.checked = orientF;
    this.select.update(String(options.theme));

    if (orientF) {
      this.panel.classList.add(this.modif);
    }
  }

  setAction(obj: any) {
    const modif = this.modif;
    const objP = this.panel.classList;

    this.reset.addEventListener('click', () => {
      obj.reset();

      const fl = this.orientation.checked;
      fl ? objP.add(modif) : objP.remove(modif);
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



    this.orientation.addEventListener('click', function () {
      const val = this.checked ? 'vertical' : 'horizontal';
      this.checked ? objP.add(modif) : objP.remove(modif);

      obj.update({
        orientation: val
      });
    });


  }


}



export { Different };