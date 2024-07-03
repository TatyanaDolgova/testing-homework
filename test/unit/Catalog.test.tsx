import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Application } from "../../src/client/Application";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, ProductShortInfo } from "../../src/common/types";

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

describe("Каталог", () => {
  it("должен отображать товары, список которых приходит с сервера", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("link", { name: "Catalog" }));

    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name));
        expect(screen.getByText(`$${product.price}`));
      });
    });
  });
});
