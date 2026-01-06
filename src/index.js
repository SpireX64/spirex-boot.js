var frz = Object.freeze;

var errAddAfterRun = "Tasks cannot be added after the boot process has started";
var errAlreadyStarted = "The boot process already started"

var emptyDepsList = frz([]);

export function createBootTask(name, run, optionsOrDependencies) {
    var deps = emptyDepsList,
        optional = false;
    if (typeof optionsOrDependencies === "object") {
        if (Array.isArray(optionsOrDependencies)) {
            deps = optionsOrDependencies;
        } else {
            deps = optionsOrDependencies.deps;
            optional = !!optionsOrDependencies.optional;
        }
    }

    deps &&= frz(deps.map((it) => frz(it.on ? it : { on: it })));

    return frz({ name, run, deps, optional });
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
            if (currentState !== "idle") throw Error(errAddAfterRun);
            tasks.add(task);
            stateMap.set(task, { state: "idle", awaiters: [] });
            return this;
        },

        async run() {
            if (currentState !== "idle")
                throw Error(errAlreadyStarted);
            currentState = "run";
            var promises = [];
            tasks.forEach((task) => {
                var res = task.run();
                if (res != null && res.then) promises.push(res);
            });

            if (promises.length) await Promise.allSettled(promises);

            currentState = "done";
        },
    };
}
