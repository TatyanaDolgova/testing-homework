import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Application } from "../../src/client/Application";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, Product, ProductShortInfo } from "../../src/common/types";
import events from "@testing-library/user-event";
import { ProductDetails } from "../../src/client/components/ProductDetails";

const mockProductsShortInfo: ProductShortInfo[] = [
  { id: 1, name: "Product 1", price: 1 },
  { id: 2, name: "Product 2", price: 2 },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 1,
    description: "Description 1",
    material: "Material 1",
    color: "Color 1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 2,
    description: "Description 2",
    material: "Material 2",
    color: "Color 2",
  },
];

class MockApi extends ExampleApi {
  async getProducts(): Promise<AxiosResponse<ProductShortInfo[]>> {
    return Promise.resolve({
      data: mockProductsShortInfo,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as AxiosResponse<ProductShortInfo[]>);
  }
}

class MockCartApi extends CartApi {
  getState() {
    return {};
  }

  setState(state: CartState) {}
}

describe("Каталог", () => {
  it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    await events.click(screen.getByRole("link", { name: "Catalog" }));

    const productElements = container.querySelectorAll(".ProductItem");

    mockProductsShortInfo.forEach((product, index) => {
      const productElement = productElements[index];
      if (productElement instanceof HTMLElement) {
        expect(within(productElement).getByText(product.name));
        expect(within(productElement).getByText(`$${product.price}`));
        expect(within(productElement).getByRole("link", { name: "Details" }));
      }
    });
  });
  it("если товар уже добавлен в корзину, на странице каталога должно отображаться сообщение об этом", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter initialEntries={["/product/1"]}>
        <Provider store={store}>
          <Routes>
            <Route
              path="/product/:id"
              element={<ProductDetails product={mockProducts[0]} />}
            />
          </Routes>
        </Provider>
      </MemoryRouter>
    );

    await events.click(screen.getByRole("button", { name: "Add to Cart" }));

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Item in cart"));
  });
});
