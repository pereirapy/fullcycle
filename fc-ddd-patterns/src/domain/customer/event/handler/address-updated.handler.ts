import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerUpdateAddressEvent from "../customer-update-address.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerUpdateAddressEvent>
{
  handle(event: CustomerUpdateAddressEvent): void {
    console.log(
      `Endereço do Cliente: ${event.eventData.id}, ${
        event.eventData.name
      } alterado para: ${event.eventData.address}`
    );
  }
}
