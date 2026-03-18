// Core authentication and HTTP client for OMX SDK
declare var process: {
  env: { [key: string]: string | undefined };
};

export interface OMXClientConfig {
  clientId?: string;
  secretKey?: string;
}

export class OMXClient {
  private config: Required<OMXClientConfig>;
  private readonly baseUrl = 'https://omx.oxinion.com/v1';
  
  constructor(config: OMXClientConfig = {}) {
    this.config = {
      clientId: config.clientId || process.env['OMX_CLIENT_ID'] || '',
      secretKey: config.secretKey || process.env['OMX_SECRET_KEY'] || ''
    };

    if (!this.config.clientId) {
      throw new Error('OMX Client ID is required. Provide via config or OMX_CLIENT_ID environment variable.');
    }
    
    if (!this.config.secretKey) {
      throw new Error('OMX Secret Key is required. Provide via config or OMX_SECRET_KEY environment variable.');
    }
  }

  public async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
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

  public get apiUrl(): string {
    return this.baseUrl;
  }
}

export function createOmxClient(config: OMXClientConfig = {}): OMXClient {
  return new OMXClient(config);
}

// Legacy export for backwards compatibility
export const createOMXClient = createOmxClient;