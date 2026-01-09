import { vi, describe, test, expect } from "vitest";
import { createBootTask, createBootProcess } from "./index";

var noop = () => {};

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

        describe("Adding tasks to boot process", () => {
            test("WHEN: Add simple task to process", () => {
                // Arrange ---------
                var runnable = vi.fn();
                var task = createBootTask("task", runnable);

                var process = createBootProcess();

                // Act -------------
                var chainingProcessRef = process.add(task);

                // Assert ----------
                expect(chainingProcessRef).eq(process);
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

                // Assert ----------
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

                // Assert ----------
                expect(process.count).eq(2);
            });
        });
    });
});
