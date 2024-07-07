describe("Интеграционные тесты для корзины", () => {
  it("Проверка отображения сообщения об успешном заказе на странице корзины", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog/0");

    const productAddToCartButton = await browser.$(".ProductDetails-AddToCart");
    await productAddToCartButton.click();

    const cartLink = await browser.$("a[href='/hw/store/cart']");
    await cartLink.click();

    const cartTable = await browser.$(".Cart-Table");
    await expect(cartTable).toBeExisting();

    const nameInput = await browser.$("input[id='f-name']");
    const addressInput = await browser.$("textarea[id='f-address']");
    const phoneInput = await browser.$("input[id='f-phone']");

    await nameInput.setValue("Татьяна");
    await addressInput.setValue("123 Main St");
    await phoneInput.setValue("123412341234");

    const submitButton = await browser.$(".Form-Submit");
    await submitButton.click();

    const successMessage = await browser.$(".Cart-SuccessMessage");
    await expect(successMessage).toBeExisting();

    const successMessageText = await successMessage.getText();
    expect(successMessageText).toContain(
      "Order #1 has been successfully completed."
    );

    await successMessage.assertView("plain");
  });
});
