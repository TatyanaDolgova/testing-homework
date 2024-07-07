import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Contacts } from "../../src/client/pages/Contacts";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { CartState, ProductShortInfo } from "../../src/common/types";
import { CartApi, ExampleApi } from "../../src/client/api";
import { AxiosResponse } from "axios";
import { initStore } from "../../src/client/store";
import { Delivery } from "../../src/client/pages/Delivery";

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

describe("Страница доставки", () => {
  const api = new MockApi("");
  const cartApi = new MockCartApi();
  const store = initStore(api, cartApi);

  it("Страница рендерится", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Delivery />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });
});
