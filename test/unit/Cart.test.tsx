import React from "react";
import { Form, MemoryRouter, Route, Routes } from "react-router-dom";
import { AxiosResponse } from "axios";
import { CartApi, ExampleApi } from "../../src/client/api";
import { CartState, Product, ProductShortInfo } from "../../src/common/types";
import { initStore } from "../../src/client/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import events from "@testing-library/user-event";
import { Cart } from "../../src/client/pages/Cart";
import { Application } from "../../src/client/Application";
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

describe("Корзина", () => {
  it("должна рендерится", () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Shopping cart"));
  });

  it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
    const api = new MockApi("");
    const cartApi = new MockCartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "catalog" }));
  });

  it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const api = new MockApi("");
    const cartApi = new CartApi();
    const store = initStore(api, cartApi);

    store.dispatch({
      type: "ADD_TO_CART",
      product: mockProducts[0],
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    await events.click(screen.getByText("Clear shopping cart"));
    expect(screen.getByText(/Cart is empty/i));
  });
});

describe("Компонент формы", () => {
  it("Должно выводится сообщение если номер заполнен некоректно", async () => {
    const api = new MockApi("");
    const cartApi = new CartApi();
    const store = initStore(api, cartApi);

    store.dispatch({
      type: "ADD_TO_CART",
      product: mockProducts[0],
    });

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const addressInput = screen.getByLabelText(/address/i);
    const submitButton = screen.getByText(/checkout/i);

    fireEvent.change(nameInput, { target: { value: "Татьяна" } });
    fireEvent.change(phoneInput, { target: { value: "invalid-phone" } });
    fireEvent.change(addressInput, { target: { value: "Dvurechensk" } });

    await fireEvent.click(submitButton);

    expect(
      await screen.getByText(/please provide a valid phone/i)
    ).toBeInTheDocument();
  });

  it("Отправка формы", async () => {
    const api = new MockApi("");
    const cartApi = new CartApi();
    const store = initStore(api, cartApi);

    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const addressInput = screen.getByLabelText(/address/i);
    const submitButton = screen.getByText(/checkout/i);

    fireEvent.change(nameInput, { target: { value: "Татьяна" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });

    fireEvent.click(submitButton);

    expect(nameInput).not.toHaveClass("is-invalid");
    expect(phoneInput).not.toHaveClass("is-invalid");
    expect(addressInput).not.toHaveClass("is-invalid");
  });
});
