export function createBootTask(name, runnable) {
    return Object.freeze({ name, runnable });
}

export function createBootProcess() {
    var tasks = new Set();
    return {
        get count() {
            return tasks.size;
        },

        add(task) {
            tasks.add(task);
            return this;
        }
    };
}
