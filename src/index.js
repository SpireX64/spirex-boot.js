export function createBootTask(name, run) {
    return Object.freeze({ name, run });
}

export function createBootProcess() {
    return Object.freeze({});
}
