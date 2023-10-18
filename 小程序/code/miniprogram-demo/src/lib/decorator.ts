export function before(beforeFn) {
    return function(target, name, descriptor) {
        let oldValue = descriptor.value;

        descriptor.value = function() {
            beforeFn.apply(this, arguments);
            return oldValue.apply(this, arguments);
        };

        return descriptor;
    };
}

export function after(afterFn) {
    return function(target, name, descriptor) {
        let oldValue = descriptor.value;

        descriptor.value = function() {
            let ret = oldValue.apply(this, arguments);
            afterFn.apply(this, arguments);
            return ret;
        };

        return descriptor;
    };
}

export function measure(target, name, descriptor) {
    let oldValue = descriptor.value;

    descriptor.value = async function() {
        const start = Date.now();
        let ret = await oldValue.apply(this, arguments);
        console.log(`${name}执行耗时 ${Date.now() - start}ms`);
        return ret;
    };

    return descriptor;
}
