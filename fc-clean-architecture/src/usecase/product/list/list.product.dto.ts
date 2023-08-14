import ProductInterface from "../../../domain/product/entity/product.interface"

export interface InputListProductDto {}

export interface OutputListProductDto {
  products: ProductInterface[]
}
