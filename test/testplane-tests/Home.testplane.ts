describe("Интеграционные тесты для главной страницы", () => {
  it("Скриншотный тест для главной страницы", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/");

    const homePage = await browser.$(".Application");

    await homePage.waitForDisplayed();

    await homePage.assertView("plain");
  });
});
