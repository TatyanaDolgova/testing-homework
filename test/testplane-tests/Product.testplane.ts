describe("Интеграционные тесты для страницы продукта", () => {
  it("Проверка корректного отображения страницы продукта", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog/1");

    const productName = await browser.$(".ProductDetails-Name");
    expect(productName).toBeExisting();
    const productNameText = await productName.getText();
    expect(productNameText).not.toBe("");

    const productDescription = await browser.$(".ProductDetails-Description");
    expect(productDescription).toBeExisting();
    const productDescriptionText = await productDescription.getText();
    expect(productDescriptionText).not.toBe("");

    const productPrice = await browser.$(".ProductDetails-Price");
    expect(productPrice).toBeExisting();
    const productPriceText = await productPrice.getText();
    expect(productPriceText).not.toBe("");

    const productColor = await browser.$(".ProductDetails-Color");
    expect(productColor).toBeExisting();
    const productColorText = await productColor.getText();
    expect(productColorText).not.toBe("");

    const productMaterial = await browser.$(".ProductDetails-Material");
    expect(productMaterial).toBeExisting();
    const productMaterialText = await productMaterial.getText();
    expect(productMaterialText).not.toBe("");

    const addToCartButton = await browser.$(".ProductDetails-AddToCart");
    expect(addToCartButton).toBeExisting();

    await addToCartButton.assertView("plain");
  });
});
