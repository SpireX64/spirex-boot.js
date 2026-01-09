import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";

var noop = () => {};

var catchErrorAsync = async (fn) => {
    try {
        await fn();
    } catch (error) {
        return error;
    }
};

describe("SpireX/Boot", () => {
    describe("Boot Task", () => {
        describe("Create boot task", () => {
            test("WHEN: Create simple task", () => {
                // Arrange ------
                var expectedName = "bootTaskForTest";
                var runnable = vi.fn();

                // Act ----------
                var task = createBootTask(expectedName, runnable);

                // Assert -------
                expect(task).instanceOf(Object);
                expect(task).is.frozen;
                expect(task.name).eq(expectedName);
                expect(task.run).eq(runnable);
                expect(runnable).not.toHaveBeenCalled();
            });
        });
    });

    describe("Boot Process", () => {
        test("WHEN: Create boot process instance", () => {
            // Act -------
            var process = createBootProcess();

            // Assert ----
            expect(process).toBeInstanceOf(Object);
            expect(process).is.frozen;
            expect(process.state).eq("idle");
            expect(process.count).eq(0);
        });

        describe("Adding tasks to boot process", () => {
            test("WHEN: Add simple task to process", () => {
                // Arrange ---------
                var runnable = vi.fn();
                var task = createBootTask("task", runnable);

                var process = createBootProcess();

                // Act -------------
                var chainingProcessRef = process.add(task);
                var taskState = process.getTaskState(task);

                // Assert ----------
                expect(chainingProcessRef).eq(process);
                expect(taskState).eq("idle");
                expect(process.count).eq(1);
                expect(runnable).not.toHaveBeenCalled();
            });

            test("WHEN: Adding the same task twice", () => {
                // Arrange ---------
                var runnable = vi.fn();
                var task = createBootTask("task", runnable);

                var process = createBootProcess().add(task);

                // Act -------------
                process.add(task);
                var taskState = process.getTaskState(task);

                // Assert ----------
                expect(taskState).eq("idle");
                expect(process.count).eq(1);
                expect(runnable).not.toHaveBeenCalled();
            });

            test("WHEN: Add many tasks to process", () => {
                // Arrange ---------
                var taskA = createBootTask("A", noop);
                var taskB = createBootTask("B", noop);

                var process = createBootProcess();

                // Act -------------
                process.add(taskA).add(taskB);

                var taskAState = process.getTaskState(taskA);
                var taskBState = process.getTaskState(taskB);

                // Assert ----------
                expect(taskAState).eq("idle");
                expect(taskBState).eq("idle");
                expect(process.count).eq(2);
            });

            test("WHEN: Trying to add task after process run", async () => {
                // Arrange ---------
                var task = createBootTask("task", noop);

                var process = createBootProcess();
                var promise = process.run();

                // Act -------------
                var error = await catchErrorAsync(() => {
                    process.add(task);
                });

                // Assert ----------
                expect(error).instanceOf(Error);
                expect(process.state).eq("done");

                // Teardown --------
                await promise;
            });
        });

        describe("Running boot process", () => {
            test("WHEN: Run process", async () => {
                // Arrange --------
                var task = createBootTask("task", noop);

                var process = createBootProcess().add(task);

                // Act ------------
                var promise = process.run();

                // Assert ---------
                expect(process.state).eq("run");

                // Teardown -------
                await promise;
            });

            test("WHEN: Run process without tasks", async () => {
                // Arrange -----------
                var process = createBootProcess();

                // Act ---------------
                await process.run();

                // Assert ------------
                expect(process.state).eq("done");
                expect(process.count).eq(0);
            });

            test("WHEN: Run process with single sync task", async () => {
                // Arrange --------
                var syncRunnable = vi.fn();
                var syncTask = createBootTask("syncTask", syncRunnable);

                var process = createBootProcess().add(syncTask);

                // Act -----------
                await process.run();
                var taskState = process.getTaskState(syncTask);

                // Arrange -------
                expect(taskState).eq("done");
                expect(process.state).eq("done");
                expect(process.count).eq(1);
                expect(syncRunnable).toHaveBeenCalledOnce();
            });

            test("WHEN: Run process with single async task", async () => {
                // Arrange --------
                var asyncRunnable = vi.fn();
                var asyncTask = createBootTask("asyncTask", asyncRunnable);

                var process = createBootProcess().add(asyncTask);

                // Act -------------
                await process.run();
                var taskState = process.getTaskState(asyncTask);

                // Assert ----------
                expect(taskState).eq("done");
                expect(process.state).eq("done");
                expect(process.count).eq(1);
                expect(asyncRunnable).toHaveBeenCalledOnce();
            });

            test("WHEN: Trying to run process again", async () => {
                // Arrange ---------
                var process = createBootProcess();
                var promise = process.run();

                // Act -------------
                var error = await catchErrorAsync(() => process.run());

                // Assert ----------
                expect(error).instanceOf(Error);
                expect(process.state).eq("done");

                // Teardown --------
                await promise;
            });
        });
    });
});
