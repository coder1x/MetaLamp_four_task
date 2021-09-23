import './different.scss';
import { Select } from '../select/select';



interface OP {
  type?: string;
  disabled?: boolean;
  orientation?: string;
  theme?: string;
}


class Different {

  private elem: HTMLElement;
  private type: HTMLInputElement;
  private disabled: HTMLInputElement;
  private orientation: HTMLInputElement;
  private select: Select;


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
    this.orientation = getDom('vertical');

    const selectE = this.elem.querySelector('.select');
    this.select = new Select('.select', selectE as HTMLElement);

    // this.select.onUpdate = (val: string) => {
    //   console.log('onUpdate: ' + val);
    // };

  }


  setData(options: OP) {
    this.disabled.checked = options.disabled;
    this.type.checked = options.type == 'double' ? true : false;
    const orientF = options.orientation == 'horizontal' ? false : true;
    this.orientation.checked = orientF;
    this.select.update(String(options.theme));
  }

  setAction(obj: any) {

    this.select.onChange = (val: string) => {
      obj.update({
        theme: val
      });
    };

  }


}



export { Different };