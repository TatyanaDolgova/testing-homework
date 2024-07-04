import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosResponse } from "axios";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, Product, ProductShortInfo } from "../../src/common/types";
import { initStore } from "../../src/client/store";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import events from "@testing-library/user-event";
import { Cart } from "../../src/client/pages/Cart";
import { Application } from "../../src/client/Application";

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

describe("Корзина", () => {
  it("содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
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
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Routes>
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Provider>
      </MemoryRouter>
    );

    const count = document.querySelector(".Cart-Count");
    expect(count?.textContent).toEqual("1");
  });

  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    const { container, findByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    await events.click(screen.getByRole("link", { name: "Catalog" }));

    const productElements = await waitFor(() =>
      container.querySelectorAll(".ProductItem")
    );

    for (const [index, productElement] of productElements.entries()) {
      const link = productElement.querySelector(".DetailsLink");

      if (link) {
        await events.click(link);

        await waitFor(() => {
          events.click(screen.getByRole("button", { name: "Add to Cart" }));
        });
        await events.click(screen.getByRole("link", { name: "Catalog" }));
      }
    }

    findByText("Cart (2)");
  });
});
