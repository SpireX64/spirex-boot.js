export function createBootTask(name, runnable) {
    return Object.freeze({ name, runnable });
}

export function createBootProcess() {
    var currentState = "idle";
    var tasks = new Set();

    return {
        get state() {
            return currentState;
        },

        get count() {
            return tasks.size;
        },

        add(task) {
            tasks.add(task);
            return this;
        },

        run() {
            currentState = "done";
            return Promise.resolve();
        },
    };
}
