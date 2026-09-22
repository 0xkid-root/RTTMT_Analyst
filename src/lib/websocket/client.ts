import { logger } from '../utils/logger';

export type ConnectionState = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'ERROR';

export interface WsEvent<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'DISCONNECTED';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private listeners: Map<string, Set<(payload: any) => void>> = new Map();
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();

  constructor(url?: string) {
    this.url = url || (process.env.NEXT_PUBLIC_WS_URL as string) || 'ws://localhost:8080/ws';
  }

  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.state === 'CONNECTING') return;

    this.updateState('CONNECTING');
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      logger.error('WebSocket connection failed:', error);
      this.updateState('ERROR');
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Intentional Disconnect');
      this.ws = null;
    }
    this.updateState('DISCONNECTED');
  }

  public subscribe(eventType: string, callback: (payload: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
    return () => this.unsubscribe(eventType, callback);
  }

  public unsubscribe(eventType: string, callback: (payload: any) => void) {
    this.listeners.get(eventType)?.delete(callback);
  }

  public onStateChange(callback: (state: ConnectionState) => void) {
    this.stateListeners.add(callback);
    callback(this.state);
    return () => this.stateListeners.delete(callback);
  }

  private handleOpen() {
    logger.info('WebSocket Connected');
    this.updateState('CONNECTED');
    this.reconnectAttempts = 0;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data: WsEvent = JSON.parse(event.data);
      if (this.listeners.has(data.type)) {
        this.listeners.get(data.type)?.forEach(cb => cb(data.payload));
      }
    } catch (error) {
      logger.error('Failed to parse WebSocket message', error);
    }
  }

  private handleClose(event: CloseEvent) {
    logger.info(`WebSocket Closed: ${event.code} ${event.reason}`);
    if (event.code !== 1000) {
      this.scheduleReconnect();
    } else {
      this.updateState('DISCONNECTED');
    }
  }

  private handleError(event: Event) {
    logger.error('WebSocket Error:', event);
    this.updateState('ERROR');
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateState('RECONNECTING');
      logger.info(`Scheduling WebSocket reconnect... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectInterval * this.reconnectAttempts);
    } else {
      this.updateState('DISCONNECTED');
      logger.error('Max WebSocket reconnect attempts reached.');
    }
  }

  private updateState(newState: ConnectionState) {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach(cb => cb(newState));
    }
  }
}

export const wsClient = typeof window !== 'undefined' ? new WebSocketClient() : null;
