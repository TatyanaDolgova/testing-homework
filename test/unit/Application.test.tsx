import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Application } from "../../src/client/Application";
import { Provider } from "react-redux";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, ProductShortInfo } from "../../src/common/types";
import { AxiosResponse } from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

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
  it("В шапке отображаются ссылки на страницы магазина", async () => {
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

    expect(screen.getByRole("link", { name: "Catalog" }));
    expect(screen.getByRole("link", { name: "Delivery" }));
    expect(screen.getByRole("link", { name: "Contacts" }));
    expect(screen.getByRole("link", { name: "Cart" }));
  });

  it("название магазина в шапке должно быть ссылкой на главную страницу", async () => {
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

    const storeLink = screen.getByRole("link", { name: "Kogtetochka store" });

    fireEvent.click(storeLink);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  it("на ширине меньше 576px навигационное меню должно скрываться за гамбургер", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    window.innerWidth = 575;
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const toggleButton = container.querySelector(".navbar-toggler");
    expect(toggleButton);

    const navMenu = container.querySelector(".navbar-collapse");
    expect(navMenu).toHaveClass("collapse");

    if (toggleButton) fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(navMenu).not.toHaveClass("collapse");
    });
  });

  it("При выборе элемента из меню гамбургера, меню должно закрываться", async () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    window.innerWidth = 575;
    window.dispatchEvent(new Event("resize"));

    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const toggleButton = container.querySelector(".navbar-toggler");
    if (toggleButton) fireEvent.click(toggleButton);

    const catalogLink = screen.getByRole("link", { name: "Catalog" });
    fireEvent.click(catalogLink);

    const navMenu = container.querySelector(".navbar-collapse");
    await waitFor(() => {
      expect(navMenu).toHaveClass("collapse");
    });
  });
});
