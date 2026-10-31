import { HubConnection } from '@microsoft/signalr'
import { createSignalRConnection } from './signalrClient'
import { ConnectionState, MessagePayload } from './signalrTypes'
import { Activity } from '../home/types/Activity'
import { UpdatedActivityImages } from './messagePayloads'

class SignalRService {
  private connection: HubConnection | null = null
  private state: ConnectionState = 'disconnected'

  private messageHandlers: ((msg: Activity[] | UpdatedActivityImages) => void)[] = []

  public async connect(): Promise<void> {
    if (this.connection) return

    this.connection = createSignalRConnection()
    this.state = 'connecting'

    await this.startWithTimeout(this.connection)

    this.registerInternalHandlers()
  }

  public disconnect(): void {
    this.connection?.stop()
    this.connection = null
    this.state = 'disconnected'
  }

  public onMessage<T>(eventName: string, handler: (msg: T) => void) {
    if (!this.connection) return

    this.connection.on(eventName, handler)
  }
  public offMessage<T>(eventName: string, handler: (msg: T) => void) {
    this.connection?.off(eventName, handler)
  }

  public async sendMessage(message: string) {
    if (!this.connection || this.connection.state !== 'Connected') {
      console.warn('SignalR not connected')
      return
    }

    await this.connection.invoke('PostMessage', message)
  }

  public getState(): ConnectionState {
    return this.state
  }

  private registerInternalHandlers() {
    if (!this.connection) return

    this.connection.on('ReceiveMessage', (payload: Activity[]) => {
      this.messageHandlers.forEach((h) => h(payload))
    })
    this.connection.on('UpdatedImagesForActivities', (payload: UpdatedActivityImages) => {
      this.messageHandlers.forEach((h) => h(payload))
    })

    this.connection.onreconnecting(() => {
      this.state = 'reconnecting'
      console.warn('SignalR reconnecting...')
    })

    this.connection.onreconnected(() => {
      this.state = 'connected'
      console.log('SignalR reconnected')
    })

    this.connection.onclose(() => {
      this.state = 'disconnected'
      console.warn('SignalR disconnected')
    })
  }

  private async startWithTimeout(connection: HubConnection) {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('SignalR timeout')), 5000))

    try {
      await Promise.race([connection.start(), timeout])
      this.state = 'connected'
      console.log('SignalR connected')
    } catch (err) {
      this.state = 'disconnected'
      console.warn('SignalR failed to connect', err)
      setTimeout(() => {
        console.log('Attempting SignalR reconnect...')
        this.connect()
      }, 3000)
    }
  }
}

export const signalRService = new SignalRService()
