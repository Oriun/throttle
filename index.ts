export type Throttle<T extends unknown[], S> = (...args: T) => Promise<S>;
export type Resolve<S> = (value: S | PromiseLike<S>) => void;

export type ThrottleCallback = <T extends unknown[], S>(args: T[], promises: Resolve<S>[]) => void;

function createThrottle<T extends unknown[], S>(callback: ThrottleCallback, delay: number): Throttle<T, S> {
    const ArgumentStack: T[] = [];
    const PromiseStack: Resolve<S>[] = [];
    let promise: Promise<any> | null = null;
    return function throttle(...args: T) {
      return new Promise<S>((resolve) => {
        ArgumentStack.push(args);
        PromiseStack.push(resolve);
        if (!promise) {
          promise = new Promise<void>((resolve2) => {
            setTimeout(() => {
              callback(
                ArgumentStack.splice(0, ArgumentStack.length),
                PromiseStack.splice(0, PromiseStack.length)
              );
              promise = null;
              resolve2();
            }, delay);
          });
          return promise;
        }
        return promise;
      });
    };
  };
  
  export default createThrottle;