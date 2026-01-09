var psIdle = "idle";
var psRun = "run";
var psDone = "done";

var makeReadOnly = Object.freeze;
var isPromise = (obj) => typeof obj === "object" && obj.then;

export function createBootTask(name, run) {
    return makeReadOnly({ name, run });
}

export function createBootProcess() {
    var processState = psIdle;

    var tasks = new Set();

    return makeReadOnly({
        get state() {
            return processState;
        },

        get count() {
            return tasks.size;
        },

        add(task) {
            if (processState !== psIdle) throw Error("Attempt to add task after process run")
            tasks.add(task);
            return this;
        },

        async run() {
            if (processState !== psIdle) throw Error("Process already started");

            processState = psRun;

            var promises = [];
            tasks.forEach((task) => {
                var maybePromise = task.run();
                if (isPromise(maybePromise)) promises.push(maybePromise);
            });

            await Promise.allSettled(promises);

            processState = psDone;
        },
    });
}
