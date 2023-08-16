import { Sequelize } from "sequelize-typescript";

import ListProductUseCase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

const newInputProductA = ProductFactory.create(
  'a',
  'product A',
  1
);

const newInputProductB = ProductFactory.create(
  'b',
  'product B',
  2
);

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([newInputProductA, newInputProductB])),
  };
};

describe("Unit test list all products use case", () => {


  it("should find all products", async () => {
    const productRepository = MockRepository();
    const productListUseCase = new ListProductUseCase(productRepository);

    const output = await productListUseCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(newInputProductA.id);
    expect(output.products[0].name).toBe(newInputProductA.name);
    expect(output.products[0].price).toBe(newInputProductA.price);
    expect(output.products[1].id).toBe(newInputProductB.id);
    expect(output.products[1].name).toBe(newInputProductB.name);
    expect(output.products[1].price).toBe(newInputProductB.price);
  });

});

describe("Integration test to list all Products", () => {

  let sequelize: Sequelize;

beforeEach(async () => {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  sequelize.addModels([ProductModel]);
  await sequelize.sync();
});

afterEach(async () => {
  await sequelize.close();
});


  it("should list two new products", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input = {
      type: 'a',
      name: "Product one",
      price: 123,
    };

    const input2 = {
      type: 'a',
      name: "Product A",
      price: 2,
    };
  
    
    const newProductA = await productCreateUseCase.execute(input);
    const newProductB = await productCreateUseCase.execute(input2);


    const productListUseCase = new ListProductUseCase(productRepository);

    const output = await productListUseCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(newProductA.id);
    expect(output.products[0].name).toBe(newProductA.name);
    expect(output.products[0].price).toBe(newProductA.price);
    expect(output.products[1].id).toBe(newProductB.id);
    expect(output.products[1].name).toBe(newProductB.name);
    expect(output.products[1].price).toBe(newProductB.price);
  });

});
