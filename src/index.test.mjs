import { vi, describe, test, expect } from "vitest";
import { createBootTask } from "./index";

describe("SpireX/Boot", () => {
    describe("Boot Task", () => {
        describe("Create boot task", () => {
            test("WHEN: Create simple task", () => {
                // Arrange ------
                var expectedName = "bootTaskForTest";

                // Act ----------
                var task = createBootTask(expectedName);

                // Assert -------
                expect(task).instanceOf(Object);
                expect(task).is.frozen;
                expect(task.name).eq(expectedName);
            });
        });
    });
});
