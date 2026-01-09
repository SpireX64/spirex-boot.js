var isPromise = (obj) => typeof obj === "object" && obj.then;

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

        run() {
            var promises = [];
            tasks.forEach((task) => {
                var maybePromise = task.run();
                if (isPromise(maybePromise)) promises.push(maybePromise);
            });
            return Promise.allSettled(promises);
        },
    });
}
