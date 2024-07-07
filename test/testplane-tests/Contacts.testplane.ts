describe("Интеграционные тесты для страницы контактов", () => {
  it("Скриншотный тест для страницы контактов", async ({ browser }) => {
    await browser.url("http://localhost:3000/hw/store/contacts");

    const contactsPage = await browser.$(".Application");

    await contactsPage.waitForDisplayed();

    await contactsPage.assertView("plain");
  });
});
