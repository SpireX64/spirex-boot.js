var frz = Object.freeze;

var errAddAfterRun = "Tasks can't be added after the boot process has started.";
var errAlreadyStarted =
    "The boot process cannot be started because it is already running.";
var errNanPriority = (taskName) =>
    `The provided task priority for task ${taskName} must be a number.`;
var errStrongDependenceOnOptionalTask = (mandatoryTaskName, optionalTaskName) =>
    `Mandatory task "${mandatoryTaskName}" can't have a strong dependence on optional task "${optionalTaskName}".`;
var errMandatoryTaskSkipped = (taskName, depName) =>
    `Important task "${taskName}" was skipped because dependency "${depName}" was not met.`;

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

/**
 * Prepares the execution graph for a set of tasks by linking dependencies
 * and determining root tasks that can be executed first.
 *
 * @param tasks - A set of all tasks to include in the execution graph.
 * @param stateMap - A map from each task to its execution state.
 * @returns An array of root tasks, sorted by priority, ready to start execution.
 */
function prepareExecutionGraph(tasks, stateMap) {
    var roots = [];
    var maybeRoots = [];

    tasks.forEach((task) => {
        var taskState = stateMap.get(task);

        // Skip tasks that are already processed
        if (taskState.state !== "idle") return;

        // Изначально задача потенциально коренная
        var isRoot = true;
        var isMaybeRoot = true;

        if (task.deps.length > 0) {
            for (var dep of task.deps) {
                var depState = stateMap.get(dep.on);

                // A strict or mandatory dependency prevents task from being "maybeRoot"
                if (!dep.weak || !dep.on.optional) isMaybeRoot = false;

                if (depState) {
                    depState.awaiters.push(task);

                    // If any dependency is still idle, this task is not a root
                    if (depState.state === "idle") isRoot = false;
                } else if (!dep.weak) {
                    // Mandatory dependency missing
                    if (task.optional) {
                        taskState.state = "skip";
                        isRoot = false;
                        break;
                    }
                    else
                        throw Error(
                            errMandatoryTaskSkipped(task.name, dep.on.name),
                        );
                }
            }
        }
        if (isRoot) roots.push(task);
        else if (isMaybeRoot) maybeRoots.push(task);
    });

    // Promote tasks from "maybeRoots" if all their dependencies were not skipped
    maybeRoots.forEach((task) => {
        var isRoot = task.deps.every(
            (dep) => stateMap.get(dep.on).state !== "skip",
        );
        if (isRoot) roots.push(task);
    });

    // Return roots sorted by priority
    return roots.sort(cmpPriority);
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

            var roots = prepareExecutionGraph(tasks, stateMap);

            currentState = "run";
            var promises = [];
            roots.forEach((task) => {
                var res = task.run();
                if (res != null && res.then) promises.push(res);
            });

            if (promises.length) await Promise.allSettled(promises);

            currentState = "done";
        },
    };
}
