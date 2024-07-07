describe("Интеграционные тесты для каталога", () => {
  it("На странице отображаются карточки с названием и ценой товаров", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog");

    const productCards = await browser.$$(".ProductItem");

    for (let i = 0; i < productCards.length; i++) {
      const productName = await productCards[i].$(".ProductItem-Name");
      const productPrice = await productCards[i].$(".ProductItem-Price");

      await expect(productName).toBeExisting();
      await expect(productPrice).toBeExisting();

      const nameText = await productName.getText();

      expect(nameText.trim()).toBeTruthy();
    }
  });
});
