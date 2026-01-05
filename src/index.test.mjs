import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";
import { BootError } from "./index.js";

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

describe("SpireX/Boot", () => {
    describe("Boot Task", () => {
        describe("Create task", () => {
            test("WHEN: Create task instance", () => {
                // Arrange ---------
                var taskName = "foo";
                var taskRunnable = vi.fn();

                // Act -------------
                var task = createBootTask(taskName, taskRunnable);

                // Assert ----------
                expect(task).instanceOf(Object);
                expect(task).is.frozen;
                expect(task.name).eq(taskName);
                expect(task.runnable).eq(taskRunnable);

                expect(taskRunnable).not.toHaveBeenCalled();
            });
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
                expect(error.message).eq(BootError.AddAfterRun());
            });
        });

        describe("Running process", () => {
            test("WHEN: Run empty process", async () => {
                // Arrange --------
                var process = createBootProcess();

                // Act ------------
                await process.run();

                // Assert ---------
                expect(process.state).eq("done");
            });
        });
    });
});
