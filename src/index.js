export var BootError = Object.freeze({
    AddAfterRun: () =>
        `Tasks cannot be added after the boot process has started.`,
    AlreadyStarted: () => "The boot process already started",
});

var emptyDepsList = Object.freeze([]);

export function createBootTask(name, runnable, dependencies) {
    var deps = emptyDepsList;
    if (dependencies) {
        deps = Object.freeze(
            dependencies.map((it) => Object.freeze(it.on ? it : { on: it })),
        );
    }
    return Object.freeze({ name, runnable, deps });
}

export function createBootProcess() {
    var currentState = "idle";
    var tasks = new Set();
    var stateMap = new Map();

    return {
        get state() {
            return currentState;
        },

        get count() {
            return tasks.size;
        },

        add(task) {
            if (currentState !== "idle") throw Error(BootError.AddAfterRun());
            tasks.add(task);
            stateMap.set(task, { state: "idle", awaiters: [] });
            return this;
        },

        async run() {
            if (currentState !== "idle")
                throw Error(BootError.AlreadyStarted());
            currentState = "run";
            var promises = [];
            tasks.forEach((task) => {
                var res = task.runnable();
                if (res != null && res.then) promises.push(res);
            });

            if (promises.length) await Promise.allSettled(promises);

            currentState = "done";
        },
    };
}
