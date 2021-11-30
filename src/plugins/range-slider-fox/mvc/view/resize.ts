
class Resize {

  wrapper: HTMLElement;
  sleep: number;
  onChange: Function;

  constructor(wrapper: HTMLElement,
    sleep: number, onChange: Function) {
    this.wrapper = wrapper ?? document.body;
    this.sleep = sleep ?? 200;
    const emptyFun = () => { };
    this.onChange = onChange ?? emptyFun;
    this.resize();
  }


  private resize() {
    let rTime: Date;
    let timeout = false;
    let startWidth = this.wrapper.offsetWidth;

    this.throttle("resize", "optimizedResize");

    const resizeEnd = () => {
      if (Number(new Date()) - Number(rTime) < this.sleep) {
        setTimeout(resizeEnd, this.sleep);
      } else {
        timeout = false;
        let totalWidth = this.wrapper.offsetWidth;
        if (totalWidth != startWidth) {
          this.onChange();
          startWidth = totalWidth;
        }
      }
    };

    window.addEventListener("optimizedResize", () => {
      rTime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, this.sleep);
      }
    });
    return true;
  }

  private throttle(type: string, name: string, obj = window) {
    let running = false;
    let func = function () {
      if (running) { return false; }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  }

}


export { Resize };