import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../event/handler/customer-created-1.handler";
import EnviaConsoleLog2Handler from "../event/handler/customer-created-2.handler";
import Address from "../value-object/address";
import EnviaConsoleLogHandler from "../event/handler/address-updated.handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerUpdateAddressEvent from "../event/customer-update-address.event";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    const eventDispatcher = new EventDispatcher();
    eventDispatcher.register(
      "CustomerCreatedEvent",
      new EnviaConsoleLog1Handler()
    );
    eventDispatcher.register(
      "CustomerCreatedEvent",
      new EnviaConsoleLog2Handler()
    );
    const customerEvent = new CustomerCreatedEvent({ id, name });
    eventDispatcher.notify(customerEvent);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    const eventDispatcher = new EventDispatcher();

    eventDispatcher.register(
      "CustomerUpdateAddressEvent",
      new EnviaConsoleLogHandler()
    );

    const customerEvent = new CustomerUpdateAddressEvent({
      id: this.id,
      name: this.name,
      address: address.toString(),
    });
    eventDispatcher.notify(customerEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
