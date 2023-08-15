import { Sequelize } from "sequelize-typescript";

import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";

describe("Integration test for Entity Product", () => {

  let sequelize: Sequelize;

  const input = {
    type: 'b',
    name: "Product B",
    price: 1,
  };
  
  const input2 = {
    type: 'a',
    name: "Product A",
    price: 2,
  };
  

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

  it("should create a new product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);


    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const outputNewProduct = await productCreateUseCase.execute(input);

    const output = await productFindUseCase.execute({id: outputNewProduct.id});

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price * 2,
    });
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

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

  it("should list two new products", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

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
