export function createBootTask(name, run) {
    return Object.freeze({ name, run });
}

export function createBootProcess() {
    var tasks = new Set();

    return Object.freeze({
        get count() {
            return tasks.size;
        },

        add(task) {
            tasks.add(task);
            return this;
        },
    });
}
