import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  let orderRepository: OrderRepository;

  beforeEach(async () => {
    orderRepository = new OrderRepository();

    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  async function createCustomer(): Promise<Customer> {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    return customer;
  }

  async function createProduct(): Promise<Product> {
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    return product;
  }

  function createOrderItem(product: Product): OrderItem {
    return new OrderItem("1", product.name, product.price, product.id, 2);
  }

  async function createOrder(
    orderItem: OrderItem,
    customer: Customer
  ): Promise<Order> {
    const order = new Order("123", customer.id, [orderItem]);
    try {
      await orderRepository.create(order);
      return order;
    } catch (error) {
      console.error({ error });
      return;
    }
  }

  async function generateOneOrder(): Promise<Order> {
    const customer = await createCustomer();
    const product = await createProduct();
    const orderItem = createOrderItem(product);
    return await createOrder(orderItem, customer);
  }

  it("should create a new order", async () => {
    const order = await generateOneOrder();

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: [
        {
          id: order.items[0].id,
          name: order.items[0].name,
          price: order.items[0].price,
          quantity: order.items[0].quantity,
          order_id: order.id,
          product_id: order.items[0].productId,
        },
      ],
    });
  });

  it("should update a order", async () => {
    const order = await generateOneOrder();

    const productRepository = new ProductRepository();
    const productToUpdate = new Product("product2", "Product 2", 20);
    await productRepository.create(productToUpdate);

    const orderItemToUpdate = new OrderItem(
      "item2",
      productToUpdate.name,
      productToUpdate.price,
      productToUpdate.id,
      4
    );

    const orderToUpdate = new Order(order.id, order.customerId, [
      orderItemToUpdate,
    ]);

    await orderRepository.update(orderToUpdate);

    const orderModelToUpdate = await OrderModel.findOne({
      where: { id: orderToUpdate.id },
      include: ["items"],
    });

    expect(orderModelToUpdate.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      total: orderToUpdate.total(),
      items: [
        {
          id: orderItemToUpdate.id,
          name: orderItemToUpdate.name,
          price: orderItemToUpdate.price,
          quantity: orderItemToUpdate.quantity,
          order_id: order.id,
          product_id: productToUpdate.id,
        },
      ],
    });
  });

  it("should find a order", async () => {
    const orderCreated = await generateOneOrder();
    const orderFromDB = await orderRepository.find(orderCreated.id);
    expect(orderFromDB).toStrictEqual(orderCreated);
  });

  it("should find all orders", async () => {
    const orderCreated = await generateOneOrder();
    const orderFromDB = await orderRepository.findAll();
    expect(orderFromDB).toStrictEqual([orderCreated]);
    expect(orderFromDB).toHaveLength(1)
  });
});
