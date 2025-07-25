// Browser-compatible bundle for testing
// This file manually imports all dependencies with relative paths

// Import core auth
import { initClient } from '../packages/core/dist/index.js';

// Import geotrigger
import { createGeotrigger } from '../packages/geotrigger/dist/index.js';

// Import email
import { createEmailClient } from '../packages/email/dist/index.js';

// Import other packages (simplified for testing)
class BeaconManager {}
class PushNotificationManager {}
class WebhookClient {}

const createBeaconManager = () => new BeaconManager();
const createPushNotificationManager = () => new PushNotificationManager();
const createWebhookClient = () => new WebhookClient();

// Unified SDK class (simplified version for browser testing)
export class OMXClient {
  constructor(config) {
    this.config = config;
    this._jwtToken = null;
  }

  /**
   * Initialize the SDK
   */
  async init() {
    console.log('Initializing OMX SDK...');
    await this._fetchJwtToken();

    // Initialize Supabase client with JWT token
    if (this._jwtToken) {
      initClient(this._jwtToken);
      console.log('✅ OMX client initialized with JWT token');
    } else {
      throw new Error('JWT token is required for initialization');
    }

    // Initialize services
    this._geotrigger = createGeotrigger();
    this._email = createEmailClient();

    console.log('✅ OMX SDK initialized successfully');
  }

  /**
   * Fetch JWT token from the authentication endpoint
   */
  async _fetchJwtToken() {
    const response = await fetch(`${this.config.baseUrl}/create-jwt-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: this.config.clientId,
        secretKey: this.config.secretKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch JWT token: ${response.statusText}`);
    }

    const data = await response.json();
    this._jwtToken = data.token;
    console.log('✅ JWT token fetched successfully');
  }

  // Getters for services
  get geotrigger() {
    if (!this._geotrigger) {
      throw new Error('SDK not initialized. Call init() first.');
    }
    return this._geotrigger;
  }

  get email() {
    if (!this._email) {
      throw new Error('SDK not initialized. Call init() first.');
    }
    return this._email;
  }
}

// Export for browser compatibility
window.OMXClient = OMXClient;
