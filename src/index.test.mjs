import { vi, describe, test, expect } from "vitest";
import { createBootTask } from "./index";

describe("SpireX/Boot", () => {
    describe("Boot Task", () => {
        describe("Create Task", () => {
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
                expect(task.runnable).eq(taskRunnable);

                expect(taskRunnable).not.toHaveBeenCalled();
            });
        });
    });
});
