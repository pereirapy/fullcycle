import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";

export default class ProductB extends Entity {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }

  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price * 2;
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
  }

  changePrice(price: number): void {
    this._price = price;
    this.validate();
  }

	validate() {
		if (!this._id)
			this.notification.addError({
				message: 'Id is required',
				context: 'product',
			});
		if (!this._name)
			this.notification.addError({
				message: 'Name is required',
				context: 'product',
			});
		if (!this._price || this._price < 0)
			this.notification.addError({
				message: 'Price must be greater than zero',
				context: 'product',
			});
	}
}
