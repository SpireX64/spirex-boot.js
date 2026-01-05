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
                // Arrange --------

                // Act ------------
                var process = createBootProcess();

                // Assert ---------
                expect(process).instanceOf(Object);
            });
        });
    });
});
