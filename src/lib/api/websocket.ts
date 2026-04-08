import { PriceUpdate } from '@/lib/types';

type PriceUpdateCallback = (update: PriceUpdate) => void;

interface WebSocketMessage {
  type: string;
  outcome_id?: string;
  market_id?: string;
  price?: number;
  timestamp?: number;
}

/**
 * WebSocket manager for real-time price updates
 */
export class PriceWebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private callbacks: Set<PriceUpdateCallback> = new Set();
  private isConnecting = false;

  constructor(private url: string) {}

  /**
   * Connect to WebSocket server
   */
  connect(marketIds: string[]): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Subscribe to market updates
        this.subscribe(marketIds);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.attemptReconnect(marketIds);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Subscribe to market updates
   */
  private subscribe(marketIds: string[]): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'subscribe',
          market_ids: marketIds,
        })
      );
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: WebSocketMessage): void {
    if (data.type === 'price_update') {
      // Validate required fields
      if (!data.outcome_id || !data.market_id || data.price === undefined) {
        console.warn('Invalid price update message: missing required fields', data);
        return;
      }

      const update: PriceUpdate = {
        outcomeId: data.outcome_id,
        marketId: data.market_id,
        price: data.price,
        timestamp: data.timestamp || Date.now(),
      };

      this.notifyCallbacks(update);
    }
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(update: PriceUpdate): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in price update callback:', error);
      }
    });
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(marketIds: string[]): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(marketIds);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Register a callback for price updates
   */
  onPriceUpdate(callback: PriceUpdateCallback): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }
}

// Singleton instance
let wsManager: PriceWebSocketManager | null = null;

/**
 * Get or create WebSocket manager instance
 */
export function getWebSocketManager(): PriceWebSocketManager {
  if (!wsManager) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://ws-subscriptions-clob.polymarket.com';
    wsManager = new PriceWebSocketManager(wsUrl);
  }
  return wsManager;
}
