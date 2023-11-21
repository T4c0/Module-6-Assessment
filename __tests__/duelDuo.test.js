const { Builder, Browser, By, until } = require("selenium-webdriver");
require('chromedriver')

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  
  test("clicking the Draw button displays the div with id = 'choices'", async () => {
    // Navigate to the game page
    await driver.get("http://localhost:8000");

    // Find and click on the Draw button
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();

    // Wait for the choices div to be displayed
    const choicesDiv = await driver.findElement(By.id("choices"));
    await driver.wait(until.elementIsVisible(choicesDiv), 1000);

    // Assert that the choices div is displayed
    expect(await choicesDiv.isDisplayed()).toBe(true);
  });

  test("clicking an 'Add to Duo' button displays the div with id = 'player-duo'", async () => {
    // Navigate to the game page
    await driver.get("http://localhost:8000");

    // Find and click on the Draw button
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();

    // Find and click on an 'Add to Duo' button (assuming it has a class 'add-to-duo')
    const addToDuoButton = await driver.findElement(By.className("bot-btn"));
    await addToDuoButton.click();

    // Wait for the player-duo div to be displayed
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    await driver.wait(until.elementIsVisible(playerDuoDiv), 1000);

    // Assert that the player-duo div is displayed
    expect(await playerDuoDiv.isDisplayed()).toBe(true);
  });
});

