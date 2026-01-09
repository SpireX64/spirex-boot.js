import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";

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
            expect(process.count).eq(0);
        });
    });
});
