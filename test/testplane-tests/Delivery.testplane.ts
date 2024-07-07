describe("Интеграционные тесты для страницы доставки", () => {
  it("Скриншотный тест для страницы доставки", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/delivery");

    const deliveryPage = await browser.$(".Application");

    await deliveryPage.waitForDisplayed();

    await deliveryPage.assertView("plain");
  });
});
