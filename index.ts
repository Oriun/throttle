export type Throttle<T extends unknown[], S> = {
    (...args: T): Promise<S>;
    flush(): void;
    force(): void;
}
export type Resolve<S> = (value: S | PromiseLike<S>) => void;

export type ThrottleCallback<T extends unknown[], S> = (args: T[], promises: Resolve<S>[]) => void;

function createThrottle<T extends unknown[], S>(callback: ThrottleCallback<T, S>, delay: number): Throttle<T, S> {
    const ArgumentStack: T[] = [];
    const PromiseStack: Resolve<S>[] = [];
    let promise: Promise<any> | null = null;
    let timeout: NodeJS.Timeout | null = null;

    function forceCall() {
      callback(
        ArgumentStack.splice(0, ArgumentStack.length),
        PromiseStack.splice(0, PromiseStack.length)
      );
      promise = null;
    }
    function throttle(...args: T) {
      return new Promise<S>((resolve) => {
        ArgumentStack.push(args);
        PromiseStack.push(resolve);
        if (!promise) {
          promise = new Promise<void>((resolve2) => {
            timeout = setTimeout(() => {
              forceCall()
              resolve2()
            }, delay);
          });
          return promise;
        }
        return promise;
      });
    };
    throttle.force = forceCall;
    throttle.flush = () => {
        clearTimeout(timeout!);
        ArgumentStack.splice(0, ArgumentStack.length);
        PromiseStack.splice(0, PromiseStack.length);
        promise = null;
    }
    return throttle;
  };
  
  export default createThrottle;