import EnviaConsoleLog2Handler from "../event/handler/customer-created-2.handler";
import EnviaConsoleLog1Handler from "../event/handler/customer-created-1.handler";
import Address from "../value-object/address";
import Customer from "./customer";
import EnviaConsoleLogHandler from "../event/handler/address-updated.handler";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should dispatch two events when a customer is created", () => {
    const spyEventHandler1 = jest.spyOn(EnviaConsoleLog1Handler.prototype, "handle");
    const spyEventHandler2 = jest.spyOn(EnviaConsoleLog2Handler.prototype, "handle");

    new Customer("1", "Customer 1");
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should dispatch a event when the customer address is updated", () => {
    const spyEventHandler = jest.spyOn(EnviaConsoleLogHandler.prototype, "handle");

    const newCustomer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    newCustomer.changeAddress(address);
    expect(spyEventHandler).toHaveBeenCalled();
  });

  
});
