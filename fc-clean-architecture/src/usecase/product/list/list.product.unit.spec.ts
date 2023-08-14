import ListProductUseCase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

const newProductA = ProductFactory.create(
  'a',
  'product A',
  1
);

const newProductB = ProductFactory.create(
  'b',
  'product B',
  2
);

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([newProductA, newProductB])),
  };
};

describe("Unit test list all products use case", () => {


  it("should find all products", async () => {
    const productRepository = MockRepository();
    const productListUseCase = new ListProductUseCase(productRepository);

    const output = await productListUseCase.execute({});

    expect(output.length).toBe(2);
    expect(output[0].id).toBe(newProductA.id);
    expect(output[0].name).toBe(newProductA.name);
    expect(output[0].price).toBe(newProductA.price);
    expect(output[1].id).toBe(newProductB.id);
    expect(output[1].name).toBe(newProductB.name);
    expect(output[1].price).toBe(newProductB.price);
  });

});
