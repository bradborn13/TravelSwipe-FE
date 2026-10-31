import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'

export const createSignalRConnection = (): HubConnection => {
  return new HubConnectionBuilder()
    .withUrl(
      'http://localhost:5088/hub',
      //   , {
      //   // transport: HttpTransportType.WebSockets, // force fast failure
      // }
    )
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build()
}
