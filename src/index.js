export function createBootTask(name, run) {
    return Object.freeze({ name, run });
}