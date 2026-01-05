export function createBootTask(name, runnable) {
    return Object.freeze({ name, runnable });
}

export function createBootProcess() {
    return {};
}
