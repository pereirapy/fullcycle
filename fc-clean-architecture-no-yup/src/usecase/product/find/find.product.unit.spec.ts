import { Sequelize } from "sequelize-typescript";

import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

const newProductA = {
  type: 'a',
  name: "Product A",
  price: 1,
};

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



describe("Unit test find product use case", () => {
  
  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const input = await productCreateUseCase.execute(newProductA);

    const output = await productFindUseCase.execute({id: input.id});

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });




});

describe("Integration test to find a new Product", () => {

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const outputNewProduct = await productCreateUseCase.execute(newProductA);

    const output = await productFindUseCase.execute({id: outputNewProduct.id});

    expect(output).toEqual({
      id: expect.any(String),
      name: newProductA.name,
      price: newProductA.price,
    });
  });

});
