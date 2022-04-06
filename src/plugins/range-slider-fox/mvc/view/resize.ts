class Resize {
  wrapper: HTMLElement;

  sleep: number;

  onChange: Function;

  constructor(
    wrapper: HTMLElement,
    sleep: number,
    onChange: Function,
  ) {
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
        const totalWidth = this.wrapper.offsetWidth;
        if (totalWidth !== startWidth) {
          this.onChange();
          startWidth = totalWidth;
        }
      }
    };

    Resize.throttle('resize', 'optimizedResize');

    window.addEventListener('optimizedResize', () => {
      rTime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, this.sleep);
      }
    });
  }

  private static throttle(type: string, name: string, obj = window) {
    let running = false;
    function func() {
      if (running) { return false; }
      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
      return true;
    }
    obj.addEventListener(type, func);
  }
}

export default Resize;
