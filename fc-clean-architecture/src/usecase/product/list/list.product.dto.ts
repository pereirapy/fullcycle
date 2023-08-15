import Product from '../../../domain/product/entity/product';
import ProductInterface from '../../../domain/product/entity/product.interface';

export interface InputListProductDto {}

export interface OutputListProductDto {
	products: {
		id: string;
		name: string;
		price: number;
	}[];
}
