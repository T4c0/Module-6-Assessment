const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  test("shuffle the elements in the array", () => {
    // Arrange
    const originalArray = [1, 2, 3, 4, 5];

    // Act
    const shuffledArray = shuffle(originalArray);

    // Assert
    expect(shuffledArray).not.toEqual(originalArray);
    // Note: The chance of shuffledArray being in the same order as originalArray is astronomically low
  });

  test("contain all elements from the original array after shuffling", () => {
    // Arrange
    const originalArray = [1, 2, 3, 4, 5];

    // Act
    const shuffledArray = shuffle(originalArray);

    // Assert
    originalArray.forEach((element) => {
      expect(shuffledArray).toContain(element);
    });
  });
});
