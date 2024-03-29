import { boundMethod } from 'autobind-decorator';

class Resize {
  wrapper: HTMLElement;

  sleep: number;

  onChange: () => void;

  private currentTime: number = Date.now();

  private timeout: boolean = false;

  private running: boolean = false;

  private startWidth: number = 0;

  private eventName: string = '';

  private objectResize: Window & typeof globalThis = window;

  constructor(
    wrapper: HTMLElement,
    sleep: number,
    onChange: () => void,
  ) {
    this.wrapper = wrapper ?? document.body;
    this.sleep = sleep ?? 200;
    const emptyFunction = () => { };
    this.onChange = onChange ?? emptyFunction;
    this.resize();
  }

  @boundMethod
  private resizeEnd() {
    const timeInterval = Date.now() - this.currentTime;

    if (timeInterval < this.sleep) {
      setTimeout(this.resizeEnd, this.sleep);
      return null;
    }

    this.timeout = false;
    const totalWidth = this.wrapper.offsetWidth;
    if (totalWidth !== this.startWidth) {
      this.onChange();
      this.startWidth = totalWidth;
      return true;
    }

    return false;
  }

  private resize() {
    this.startWidth = this.wrapper.offsetWidth;

    this.throttle('resize', 'optimizedResize');

    window.addEventListener('optimizedResize', this.handleWindowOptimizedResize);
  }

  @boundMethod
  private handleWindowOptimizedResize() {
    this.currentTime = Date.now();

    if (this.timeout) {
      return true;
    }

    this.timeout = true;
    setTimeout(this.resizeEnd, this.sleep);

    return false;
  }

  private throttle(type: string, name: string, object = window) {
    this.eventName = name;
    this.objectResize = object;

    object.addEventListener(type, this.handleWindowThrottle);
  }

  @boundMethod
  private handleWindowThrottle() {
    if (this.running) {
      return false;
    }
    this.running = true;
    requestAnimationFrame(() => {
      this.objectResize.dispatchEvent(new CustomEvent(this.eventName));
      this.running = false;
    });
    return true;
  }
}

export default Resize;
