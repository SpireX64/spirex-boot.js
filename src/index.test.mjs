import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";

function catchError(fn) {
    try {
        fn();
    } catch (e) {
        return e;
    }
}

async function catchErrorAsync(afn) {
    try {
        await afn();
    } catch (e) {
        return e;
    }
}

var noop = () => {};

describe("SpireX/Boot", () => {
    describe("Boot Task", () => {
        test("WHEN: Create task", () => {
            // Arrange ---------
            var taskName = "foo";
            var taskRunnable = vi.fn();

            // Act -------------
            var task = createBootTask(taskName, taskRunnable);

            // Assert ----------
            expect(task).instanceOf(Object);
            expect(task).is.frozen;
            expect(task.name).eq(taskName);
            expect(task.optional).is.false;
            expect(task.run).eq(taskRunnable);
            expect(task.deps).instanceOf(Array);
            expect(task.deps).toHaveLength(0);
            expect(task.deps).is.frozen;

            expect(taskRunnable).not.toHaveBeenCalled();
        });

        test("WHEN: Create task with dependency (direct reference)", () => {
            // Arrange ---------
            var taskA = createBootTask("A", noop);

            // Act --------------
            var taskB = createBootTask("B", noop, [taskA]);

            var taskBDependence = taskB.deps[0];

            // Assert -----------
            expect(taskA.deps).toHaveLength(0);
            expect(taskB.deps).toHaveLength(1);
            expect(taskBDependence).not.eq(taskA);
            expect(taskBDependence.on).eq(taskA);
            expect(taskBDependence).is.frozen;
        });

        test("WHEN: Create task with dependency (dependent object)", () => {
            // Arrange ---------
            var taskA = createBootTask("A", noop);

            // Act --------------
            var taskB = createBootTask("B", noop, [{ on: taskA }]);

            var taskBDependence = taskB.deps[0];

            // Assert -----------
            expect(taskA.deps).toHaveLength(0);
            expect(taskB.deps).toHaveLength(1);
            expect(taskBDependence).not.eq(taskA);
            expect(taskBDependence.on).eq(taskA);
            expect(taskBDependence).is.frozen;
        });

        test("WHEN: Create task with options", () => {
            // Arrange ---------
            var depTask = createBootTask("depTask", noop);

            var taskRunnable = vi.fn();

            // Act -------------
            var task = createBootTask("task", taskRunnable, {
                deps: [depTask],
                optional: true,
            });

            // Assert ----------
            expect(task.run).eq(taskRunnable);
            expect(task.optional).is.true;

            expect(task.deps).instanceOf(Array);
            expect(task.deps).toHaveLength(1);

            var taskDependence = task.deps[0];
            expect(taskDependence.on).eq(depTask);
        });
    });

    describe("Boot Process", () => {
        describe("Create process", () => {
            test("WHEN: Create process instance", () => {
                // Act ------------
                var process = createBootProcess();

                // Assert ---------
                expect(process).instanceOf(Object);
                expect(process.state).eq("idle");
                expect(process.count).eq(0);
            });
        });

        describe("Adding tasks to process", () => {
            test("WHEN: Adding a task", () => {
                // Arrange --------
                var taskRunnable = vi.fn();
                var task = createBootTask("task", taskRunnable);

                var process = createBootProcess();

                // Act ------------
                var chainingRef = process.add(task);

                // Assert ---------
                expect(process.count).eq(1);
                expect(chainingRef).eq(process);
                expect(taskRunnable).not.toHaveBeenCalled();
            });

            test("WHEN: Adding the same task twice", () => {
                // Arrange --------
                var taskRunnable = vi.fn();
                var task = createBootTask("task", taskRunnable);

                var process = createBootProcess().add(task);

                // Act ------------
                process.add(task);

                // Assert --------
                expect(process.count).eq(1);
                expect(taskRunnable).not.toHaveBeenCalled();
            });

            test("WHEN: Add many tasks", () => {
                // Arrange ---------
                var taskA = createBootTask("taskA");
                var taskB = createBootTask("taskB");

                var process = createBootProcess();

                // Act -------------
                process.add(taskA).add(taskB);

                // Assert ----------
                expect(process.count).eq(2);
            });

            test("WHEN: Adding a task when process was started", async () => {
                // Arrange -------
                var taskRunnable = vi.fn();
                var task = createBootTask("task", taskRunnable);

                var process = createBootProcess();
                await process.run();

                // Act -----------
                var error = catchError(() => process.add(task));

                // Assert --------
                expect(error).instanceOf(Error);
            });
        });

        describe("Running process", () => {
            test("WHEN: Run empty process", async () => {
                // Arrange --------
                var process = createBootProcess();

                // Act ------------
                var runningPromise = process.run();

                // Assert ---------
                expect(runningPromise).instanceOf(Promise);
                expect(process.state).eq("done");

                // Teardown -------
                await runningPromise;
            });

            test("WHEN: Run process with sync task", async () => {
                // Arrange -------
                var syncRunnable = vi.fn();
                var syncTask = createBootTask("sync", syncRunnable);

                var process = createBootProcess().add(syncTask);

                // Act -----------
                var runningPromise = process.run();

                // Assert --------
                expect(process.state).eq("done");
                expect(runningPromise).instanceOf(Promise);
                expect(syncRunnable).toHaveBeenCalled();

                // Teardown ------
                await runningPromise;
            });

            test("WHEN: Run process with async task", async () => {
                // Arrange -------
                var asyncRunnable = vi.fn(() => Promise.resolve());
                var asyncTask = createBootTask("async", asyncRunnable);

                var process = createBootProcess().add(asyncTask);

                // Act -----------
                var runningPromise = process.run();
                var stateAfterRun = process.state;

                await runningPromise;

                // Assert --------

                expect(stateAfterRun).eq("run");
                expect(process.state).eq("done");
                expect(runningPromise).instanceOf(Promise);
                expect(asyncRunnable).toHaveBeenCalled();
            });

            test("WHEN: Run process when it already running", async () => {
                // Arrange -------
                var task = createBootTask("task", () => Promise.resolve());

                var process = createBootProcess().add(task);

                var runningPromise = process.run();

                // Act -----------
                var error = await catchErrorAsync(() => process.run());

                // Assert --------
                expect(error).instanceOf(Error);

                // Teardown -------
                await runningPromise;
            });
        });
    });
});
