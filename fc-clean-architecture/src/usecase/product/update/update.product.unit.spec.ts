import { Sequelize } from "sequelize-typescript";

import UpdateProductUseCase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const product = ProductFactory.create('b','Product',1);

const input = {
  id: product.id,
  name: "Product Updated",
  price: 2,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should thrown an error when price is smaller than zero", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    input.price = -1;

    await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });


  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    input.name = "";

    await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

});

describe("Integration test to list update an Products", () => {

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


  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);


    const input = {
      type: 'b',
      name: "Product B",
      price: 1,
    };
  
    const outputNewProduct = await productCreateUseCase.execute(input);

    const outputNewProductUpdated = {
      id: outputNewProduct.id,
      name: "Product Updated",
      price: 2,
    };
    

    const output = await productUpdateUseCase.execute(outputNewProductUpdated);

    expect(output).toEqual({
      id: outputNewProductUpdated.id,
      name: outputNewProductUpdated.name,
      price: outputNewProductUpdated.price,
    });
  });

});

