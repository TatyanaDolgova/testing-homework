import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Application } from "../../src/client/Application";
import { Provider } from "react-redux";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, ProductShortInfo } from "../../src/common/types";
import { AxiosResponse } from "axios";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const basename = "/hw/store";

const mockProducts: ProductShortInfo[] = [
  { id: 1, name: "Product 1", price: 1 },
  { id: 2, name: "Product 2", price: 2 },
];

class MockApi extends ExampleApi {
  async getProducts(): Promise<AxiosResponse<ProductShortInfo[]>> {
    return Promise.resolve({
      data: mockProducts,
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

describe("Проверка общих требований", () => {
  it("Отображаются ссылки на страницы магазина", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();

    const store = initStore(api, cartApi);

    const application = (
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    render(application);

    expect(screen.getByRole("link", { name: "Catalog" }));
    expect(screen.getByRole("link", { name: "Delivery" }));
    expect(screen.getByRole("link", { name: "Contacts" }));
    expect(screen.getByRole("link", { name: "Cart" }));
  });
});
