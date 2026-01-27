// Core authentication and HTTP client for OMX SDK
export interface OMXClientConfig {
  clientId?: string;
  secretKey?: string;
  baseUrl?: string;
}

export class OMXClient {
  private config: Required<OMXClientConfig>;
  
  constructor(config: OMXClientConfig = {}) {
    this.config = {
      clientId: config.clientId || process.env['OMX_CLIENT_ID'] || '',
      secretKey: config.secretKey || process.env['OMX_SECRET_KEY'] || '',
      baseUrl: config.baseUrl || process.env['OMX_BASE_URL'] || 'https://api.oxinion.com/v1'
    };

    if (!this.config.clientId) {
      throw new Error('OMX Client ID is required. Provide via config or OMX_CLIENT_ID environment variable.');
    }
    
    if (!this.config.secretKey) {
      throw new Error('OMX Secret Key is required. Provide via config or OMX_SECRET_KEY environment variable.');
    }
  }

  public async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.secretKey}`,
      'X-Client-ID': this.config.clientId,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  public get clientId(): string {
    return this.config.clientId;
  }

  public get secretKey(): string {
    return this.config.secretKey;
  }

  public get baseUrl(): string {
    return this.config.baseUrl || 'https://api.oxinion.com/v1';
  }
}

export function createOmxClient(config: OMXClientConfig = {}): OMXClient {
  return new OMXClient(config);
}

// Legacy export for backwards compatibility
export const createOMXClient = createOmxClient;