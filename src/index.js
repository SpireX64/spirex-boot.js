var frz = Object.freeze;

var errAddAfterRun = "Tasks can't be added after the boot process has started.";
var errAlreadyStarted =
    "The boot process cannot be started because it is already running.";
var errNanPriority = (taskName) =>
    `The provided task priority for task ${taskName} must be a number.`;
var errStrongDependenceOnOptionalTask = (mandatoryTaskName, optionalTaskName) =>
    `Mandatory task "${mandatoryTaskName}" can't have a strong dependence on optional task "${optionalTaskName}".`;

var emptyDepsList = frz([]);

var cmpPriority = (lh, rhv) => rhv.priority - lhv.priority;

export function createBootTask(name, run, optionsOrDependencies) {
    var deps = emptyDepsList,
        optional = false,
        priority = 0;
    if (typeof optionsOrDependencies === "object") {
        if (Array.isArray(optionsOrDependencies)) {
            deps = optionsOrDependencies;
        } else {
            deps = optionsOrDependencies.deps;
            optional = !!optionsOrDependencies.optional;
            priority = optionsOrDependencies.priority;
        }
    }

    if (Number.isNaN(priority)) throw Error(errNanPriority(name));

    deps &&= frz(
        deps.map((dep) => {
            dep = frz(dep.on ? dep : { on: dep });
            if (!optional && !dep.weak && dep.on.optional)
                throw Error(
                    errStrongDependenceOnOptionalTask(name, dep.on.name),
                );
            return dep;
        }),
    );

    return frz({ name, run, deps, optional, priority });
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
            if (currentState !== "idle") throw Error(errAlreadyStarted);
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
