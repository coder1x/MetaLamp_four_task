type ObserverFunctions<T> = (options: T) => boolean | Promise<boolean>;

abstract class Observer<T> {
  private observers: ObserverFunctions<T>[] = [];

  subscribeObserver(observer: ObserverFunctions<T>) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      return this.observers.length;
    }
    return false;
  }

  unsubscribeOB(observer: ObserverFunctions<T>) {
    this.observers = this.observers.filter((item) => item !== observer);
    return this.observers.length;
  }

  protected notifyObserver(options: T) {
    this.observers.forEach((item) => {
      item(options);
    });
  }
}

export default Observer;
