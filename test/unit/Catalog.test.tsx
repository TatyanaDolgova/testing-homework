import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Application } from "../../src/client/Application";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, Product, ProductShortInfo } from "../../src/common/types";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import { Catalog } from "../../src/client/pages/Catalog";
import "@testing-library/jest-dom";

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
  it("должен рендериться", () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter initialEntries={["/catalog"]}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Catalog"));
  });

  it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const mockApi = {
      getProducts: jest.fn().mockResolvedValue({ data: mockProducts }),
      getProductById: jest.fn(),
      checkout: jest.fn(),
    };

    const api = new ExampleApi("");
    const cartApi = new MockCartApi();
    const store = initStore(mockApi as unknown as ExampleApi, cartApi);

    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("LOADING")).not.toBeInTheDocument();
    });

    mockProducts.forEach((product) => {
      const nameElement = screen.getByText(product.name);
      expect(nameElement).toBeInTheDocument();
    });

    mockProducts.forEach((product) => {
      const priceElement = screen.getByText(`$${product.price}`);
      expect(priceElement).toBeInTheDocument();
    });

    mockProducts.forEach((product) => {
      const linkElements = screen.getAllByRole("link", { name: "Details" });
      const linkElement = linkElements.find(
        (link) => link.getAttribute("href") === `/catalog/${product.id}`
      );
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", `/catalog/${product.id}`);
    });
  });

  it("если товар уже добавлен в корзину, на странице каталога и товара должно отображаться сообщение об этом", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    store.dispatch({
      type: "ADD_TO_CART",
      product: mockProducts[0],
    });

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

    expect(screen.getByText("Item in cart"));
  });
});
