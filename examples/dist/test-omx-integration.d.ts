/**
 * OMX SDK Integration Test
 * Tests the unified SDK with real authentication and geotrigger functionality
 */
import OMX from '../packages/omx-sdk/src/index.js';
/**
 * Test OMX SDK initialization and authentication
 */
declare function testOMXInitialization(): Promise<OMX>;
/**
 * Test Geotrigger functionality
 */
declare function testGeotrigger(sdk: any): Promise<any>;
/**
 * Test Email functionality
 */
declare function testEmail(sdk: any): Promise<any>;
/**
 * Test Webhook functionality
 */
declare function testWebhook(sdk: any): Promise<any>;
export { testEmail, testGeotrigger, testOMXInitialization, testWebhook };
//# sourceMappingURL=test-omx-integration.d.ts.map