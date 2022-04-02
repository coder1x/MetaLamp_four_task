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

    this.throttle('resize', 'optimizedResize');

    window.addEventListener('optimizedResize', () => {
      rTime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, this.sleep);
      }
    });
  }

  private throttle(type: string, name: string, obj = window) {
    let running = false;
    const func = function () {
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