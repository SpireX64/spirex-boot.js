// Process states
var psIdle = "idle";
var psRun = "run";
var psDone = "done";

// Task states
var tsIdle = "idle";
var tsRun = "run";
var tsDone = "done";

var makeReadOnly = Object.freeze;
var isPromise = (obj) => typeof obj === "object" && obj.then;

export function createBootTask(name, run, options) {
    var { optional = false, deps = [] } = options || {};
    deps = makeReadOnly(
        deps.map((it) => makeReadOnly(it.on ? it : { on: it })),
    );
    return makeReadOnly({ name, run, deps, optional });
}

export function createBootProcess() {
    var processState = psIdle;

    var tasks = new Set();
    var stateMap = new Map();

    return makeReadOnly({
        get state() {
            return processState;
        },

        get count() {
            return tasks.size;
        },

        getTaskState(task) {
            var taskState = stateMap.get(task);
            return taskState && taskState.state;
        },

        add(task) {
            if (processState !== psIdle)
                throw Error("Attempt to add task after process run");
            if (!tasks.has(task)) {
                tasks.add(task);
                stateMap.set(task, {
                    state: tsIdle,
                });
            }
            return this;
        },

        async run() {
            if (processState !== psIdle) throw Error("Process already started");

            processState = psRun;

            var promises = [];
            tasks.forEach((task) => {
                var taskState = stateMap.get(task);
                taskState.state = tsRun;

                var maybePromise = task.run();
                if (isPromise(maybePromise)) promises.push(maybePromise);

                taskState.state = tsDone;
            });

            await Promise.allSettled(promises);

            processState = psDone;
        },
    });
}
