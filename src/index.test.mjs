import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";

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
        });
    });
});
