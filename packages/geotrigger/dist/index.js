/**
 * @omx-sdk/geotrigger
 * Geotrigger module for creating and managing location-based triggers
 */
// Supabase Edge Function base URL
const SUPABASE_FN_BASE_URL = "https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1";
// UUID v4 generation function
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export class GeotriggerClient {
    constructor(config) {
        this.authToken = null;
        this.regions = new Map();
        this.isWatching = false;
        this.watchId = null;
        this.clientId = config.clientId;
        this.secretKey = config.secretKey;
        this.teamId = config.teamId || generateUUID();
    }
    async getAuthToken() {
        if (!this.authToken) {
            const response = await fetch(`${SUPABASE_FN_BASE_URL}/create-jwt-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientId: this.clientId,
                    secretKey: this.secretKey,
                }),
            });
            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }
            const data = await response.json();
            this.authToken = data.token;
            // Extract team_id from JWT or find from API keys
            try {
                if (this.authToken) {
                    const payload = JSON.parse(atob(this.authToken.split(".")[1]));
                    console.log(`🔍 JWT payload:`, payload);
                    if (payload.team_id) {
                        this.teamId = payload.team_id;
                        console.log(`🆔 Team ID from JWT: ${this.teamId}`);
                    }
                    else {
                        console.log(`🔍 No team_id in JWT, looking up from API keys...`);
                        await this.loadTeamIdFromApiKeys();
                    }
                }
            }
            catch (error) {
                console.warn("Failed to decode JWT, looking up team_id from API keys:", error);
                await this.loadTeamIdFromApiKeys();
            }
        }
        return this.authToken;
    }
    async loadTeamIdFromApiKeys() {
        try {
            console.log(`🔍 Looking up team_id for client_id: ${this.clientId}`);
            const url = `${SUPABASE_FN_BASE_URL}/database-access?table=api_keys&schema=business`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authToken}`,
                },
                body: JSON.stringify({
                    filters: { client_id: this.clientId },
                }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log(`🔍 API keys lookup result:`, result);
                if (result.success && result.data && result.data.length > 0) {
                    const apiKey = result.data[0];
                    if (apiKey.team_id) {
                        this.teamId = apiKey.team_id;
                        console.log(`🆔 Team ID from API keys: ${this.teamId}`);
                    }
                    else {
                        console.warn(`⚠️ API key found but no team_id:`, apiKey);
                    }
                }
                else {
                    console.warn(`⚠️ No API key found for client_id: ${this.clientId}`);
                    console.warn(`⚠️ Using fallback team_id: ${this.teamId}`);
                }
            }
            else {
                const errorText = await response.text();
                console.warn(`⚠️ Failed to lookup API key:`, errorText);
            }
        }
        catch (error) {
            console.warn("Failed to load team_id from API keys:", error);
            console.warn(`⚠️ Using fallback team_id: ${this.teamId}`);
        }
    }
    async ensureDefaultWorkflow() {
        const token = await this.getAuthToken();
        // First, try to find existing default workflow for geotriggers
        const listUrl = `${SUPABASE_FN_BASE_URL}/database-access?table=workflows&schema=business`;
        const listResponse = await fetch(listUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                filters: {
                    team_id: this.teamId,
                    name: "Default Geotrigger Workflow"
                },
            }),
        });
        if (listResponse.ok) {
            const result = await listResponse.json();
            if (result.success && result.data && result.data.length > 0) {
                console.log(`✅ Found existing default workflow: ${result.data[0].id}`);
                return result.data[0].id;
            }
        }
        // Create default workflow if it doesn't exist
        console.log(`🔄 Creating default workflow for team: ${this.teamId}`);
        const createUrl = `${SUPABASE_FN_BASE_URL}/database-access?table=workflows&schema=business`;
        const createResponse = await fetch(createUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                action: "create",
                data: {
                    team_id: this.teamId,
                    name: "Default Geotrigger Workflow",
                    description: "Automatically created workflow for geotrigger nodes",
                    status: "active",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            }),
        });
        if (!createResponse.ok) {
            throw new Error(`Failed to create default workflow: ${createResponse.statusText}`);
        }
        const createResult = await createResponse.json();
        if (!createResult.success) {
            throw new Error(createResult.error || "Failed to create default workflow");
        }
        const workflowId = createResult.data.id || createResult.data[0]?.id;
        console.log(`✅ Created default workflow: ${workflowId}`);
        return workflowId;
    }
    async makeRequest(endpoint, data = {}) {
        const token = await this.getAuthToken();
        let url;
        let method = "POST";
        let body;
        switch (endpoint) {
            case "geotrigger-list":
                url = `${SUPABASE_FN_BASE_URL}/database-access?table=workflow_nodes&schema=omx`;
                method = "POST";
                body = JSON.stringify({
                    filters: {
                        type: "geotrigger",
                        ...data.filters
                    },
                    // Note: team_id filtering will need to be handled via workflow join or config filter
                });
                break;
            case "geotrigger-create":
                // Ensure we have a workflow_id
                const workflowId = data.workflow_id || await this.ensureDefaultWorkflow();
                url = `${SUPABASE_FN_BASE_URL}/database-access?table=workflow_nodes&schema=omx`;
                method = "POST";
                body = JSON.stringify({
                    action: "create",
                    data: {
                        workflow_id: workflowId, // Required field
                        type: "geotrigger",
                        config: {
                            name: data.name,
                            description: data.description,
                            location: data.location,
                            coordinates: data.coordinates,
                            radius: data.radius,
                            event_type: data.event_type,
                            event_payload: data.event_payload,
                            status: data.status || "active",
                            team_id: this.teamId, // Store team_id in config since it's not in the table
                        },
                        position: data.position || { x: 0, y: 0 },
                        node_key: data.node_key || `geotrigger-${Date.now()}`,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                });
                break;
            case "geotrigger-get":
                url = `${SUPABASE_FN_BASE_URL}/database-access?table=workflow_nodes&schema=omx`;
                method = "POST";
                body = JSON.stringify({
                    filters: {
                        id: data.id,
                        type: "geotrigger"
                    },
                });
                break;
            case "geotrigger-update":
                url = `${SUPABASE_FN_BASE_URL}/database-access?table=workflow_nodes&schema=omx`;
                method = "POST";
                body = JSON.stringify({
                    action: "update",
                    filters: {
                        id: data.id,
                        type: "geotrigger"
                    },
                    data: {
                        config: {
                            ...data.updates,
                            team_id: this.teamId, // Maintain team_id in config
                        },
                        updated_at: new Date().toISOString(),
                    },
                });
                break;
            case "geotrigger-delete":
                url = `${SUPABASE_FN_BASE_URL}/database-access?table=workflow_nodes&schema=omx`;
                method = "POST";
                body = JSON.stringify({
                    action: "delete",
                    filters: {
                        id: data.id,
                        type: "geotrigger"
                    },
                });
                break;
            case "geotrigger-stats":
                const geotriggers = await this.listGeotriggers();
                return {
                    totalGeotriggers: geotriggers.length,
                    activeGeotriggers: geotriggers.filter((g) => g.config?.status === "active").length,
                    inactiveGeotriggers: geotriggers.filter((g) => g.config?.status === "inactive").length,
                    teamId: this.teamId,
                };
            default:
                url = `${SUPABASE_FN_BASE_URL}/database-access`;
                method = "POST";
                body = JSON.stringify({ ...data, teamId: this.teamId });
        }
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ ${endpoint} failed:`, errorText);
            throw new Error(`${endpoint} failed: ${response.statusText}`);
        }
        const result = await response.json();
        console.log(`✅ ${endpoint} response:`, result);
        if (result.success !== undefined) {
            if (!result.success) {
                throw new Error(result.error || "Database operation failed");
            }
            return result.data;
        }
        return result.data || result;
    }
    async createGeotrigger(data) {
        return this.makeRequest("geotrigger-create", data);
    }
    async listGeotriggers(filters = {}) {
        return this.makeRequest("geotrigger-list", { filters });
    }
    async deleteGeotrigger(id) {
        await this.makeRequest("geotrigger-delete", { id });
    }
    async getGeotrigger(id) {
        const result = await this.makeRequest("geotrigger-get", { id });
        return Array.isArray(result) ? result[0] : result;
    }
    async updateGeotrigger(id, updates) {
        return this.makeRequest("geotrigger-update", { id, updates });
    }
    async updateGeotriggerStatus(id, status) {
        await this.updateGeotrigger(id, { config: { status } });
    }
    async duplicateGeotrigger(id, newName) {
        const original = await this.getGeotrigger(id);
        const duplicateData = {
            team_id: this.teamId,
            name: newName || `${original.name} (Copy)`,
            description: original.description,
            location: original.config?.location,
            coordinates: original.config?.coordinates,
            radius: original.config?.radius,
            event_type: original.config?.event_type,
            event_payload: original.config?.event_payload,
            status: "inactive",
        };
        return this.createGeotrigger(duplicateData);
    }
    async getGeotriggerStats() {
        return this.makeRequest("geotrigger-stats", {});
    }
    // Legacy browser-based monitoring methods (for backward compatibility)
    /**
     * Add a geofence region to monitor
     */
    addRegion(region) {
        this.regions.set(region.id, region);
        console.log(`Added geofence region: ${region.id}`);
    }
    /**
     * Remove a geofence region
     */
    removeRegion(regionId) {
        const removed = this.regions.delete(regionId);
        if (removed) {
            console.log(`Removed geofence region: ${regionId}`);
        }
        return removed;
    }
    /**
     * Get all registered regions
     */
    getRegions() {
        return Array.from(this.regions.values());
    }
    /**
     * Start monitoring geofence regions
     */
    startMonitoring(onTrigger, options) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }
            if (this.isWatching) {
                resolve();
                return;
            }
            const watchOptions = {
                enableHighAccuracy: options?.enableHighAccuracy ?? true,
                timeout: options?.timeout ?? 10000,
                maximumAge: options?.maximumAge ?? 60000,
            };
            this.watchId = navigator.geolocation.watchPosition((position) => {
                const currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                };
                this.checkRegions(currentLocation, onTrigger);
            }, (error) => {
                console.error('Geolocation error:', error);
                reject(error);
            }, watchOptions);
            this.isWatching = true;
            resolve();
        });
    }
    /**
     * Stop monitoring geofence regions
     */
    stopMonitoring() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        this.isWatching = false;
        console.log('Stopped geofence monitoring');
    }
    /**
     * Get current location
     */
    getCurrentLocation(options) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }
            const locationOptions = {
                enableHighAccuracy: options?.enableHighAccuracy ?? true,
                timeout: options?.timeout ?? 10000,
                maximumAge: options?.maximumAge ?? 60000,
            };
            navigator.geolocation.getCurrentPosition((position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            }, (error) => {
                reject(error);
            }, locationOptions);
        });
    }
    /**
     * Calculate distance between two locations using Haversine formula
     */
    calculateDistance(loc1, loc2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (loc1.latitude * Math.PI) / 180;
        const φ2 = (loc2.latitude * Math.PI) / 180;
        const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
        const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    /**
     * Check if current location triggers any geofence regions
     */
    checkRegions(currentLocation, onTrigger) {
        this.regions.forEach((region) => {
            const distance = this.calculateDistance(currentLocation, region.center);
            const isInside = distance <= region.radius;
            // For simplicity, we'll trigger on every position update when inside
            // In a real implementation, you'd want to track entry/exit states
            if (isInside) {
                const event = {
                    regionId: region.id,
                    type: 'enter',
                    location: currentLocation,
                    timestamp: new Date(),
                };
                onTrigger(event);
            }
        });
    }
    /**
     * Check if the service is currently monitoring
     */
    isMonitoring() {
        return this.isWatching;
    }
    // Public authentication method for testing
    async authenticate() {
        return this.getAuthToken();
    }
}
// Factory function: Create Geotrigger Client based on clientId/secretKey
export function createGeotriggerClient(config) {
    return new GeotriggerClient(config);
}
// Legacy compatibility factory function (deprecated)
export function createGeotrigger(config) {
    return new GeotriggerClient(config);
}
export * from "./types";
//# sourceMappingURL=index.js.map