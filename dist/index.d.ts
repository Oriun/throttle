export type Throttle<T extends unknown[], S> = {
    (...args: T): Promise<S>;
    flush(): void;
    force(): void;
};
export type Resolve<S> = (value: S | PromiseLike<S>) => void;
export type ThrottleCallback<T extends unknown[], S> = (args: T[], promises: Resolve<S>[]) => void;
declare function createThrottle<T extends unknown[], S>(callback: ThrottleCallback<T, S>, delay: number): Throttle<T, S>;
export default createThrottle;
