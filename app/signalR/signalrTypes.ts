export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export interface MessagePayload {
  sender?: string
  content?: string
  sentTime?: string
}
