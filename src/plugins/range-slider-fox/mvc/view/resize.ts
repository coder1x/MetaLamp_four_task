import { boundMethod } from 'autobind-decorator';

class Resize {
  wrapper: HTMLElement;

  sleep: number;

  onChange: Function;

  private rTime: Date;

  private timeout: boolean = false;

  private running: boolean = false;

  private startWidth: number = 0;

  private eventName: string;

  private objectResize: Window & typeof globalThis;

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

  @boundMethod
  private resizeEnd() {
    if (Number(new Date()) - Number(this.rTime) < this.sleep) {
      setTimeout(this.resizeEnd, this.sleep);
    } else {
      this.timeout = false;
      const totalWidth = this.wrapper.offsetWidth;
      if (totalWidth !== this.startWidth) {
        this.onChange();
        this.startWidth = totalWidth;
      }
    }
  }

  private resize() {
    this.startWidth = this.wrapper.offsetWidth;

    this.throttle('resize', 'optimizedResize');

    window.addEventListener('optimizedResize', this.handleOptimizedResize);
  }

  @boundMethod
  private handleOptimizedResize() {
    this.rTime = new Date();
    if (this.timeout === false) {
      this.timeout = true;
      setTimeout(this.resizeEnd, this.sleep);
    }
  }

  private throttle(type: string, name: string, obj = window) {
    this.eventName = name;
    this.objectResize = obj;

    obj.addEventListener(type, this.handleThrottle);
  }

  @boundMethod
  private handleThrottle() {
    if (this.running) { return false; }
    this.running = true;
    requestAnimationFrame(() => {
      this.objectResize.dispatchEvent(new CustomEvent(this.eventName));
      this.running = false;
    });
    return true;
  }
}

export default Resize;
