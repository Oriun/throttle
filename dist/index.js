"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createThrottle(callback, delay) {
    const ArgumentStack = [];
    const PromiseStack = [];
    let promise = null;
    let timeout = null;
    function forceCall() {
        callback(ArgumentStack.splice(0, ArgumentStack.length), PromiseStack.splice(0, PromiseStack.length));
        promise = null;
    }
    function throttle(...args) {
        return new Promise((resolve) => {
            ArgumentStack.push(args);
            PromiseStack.push(resolve);
            if (!promise) {
                promise = new Promise((resolve2) => {
                    timeout = setTimeout(() => {
                        forceCall();
                        resolve2();
                    }, delay);
                });
                return promise;
            }
            return promise;
        });
    }
    ;
    throttle.force = forceCall;
    throttle.flush = () => {
        clearTimeout(timeout);
        ArgumentStack.splice(0, ArgumentStack.length);
        PromiseStack.splice(0, PromiseStack.length);
        promise = null;
    };
    return throttle;
}
;
exports.default = createThrottle;
