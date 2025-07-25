import OMX from 'omx-sdk';
/**
 * Test the OMX SDK initialization function
 * Function signature: OMX.initialize(config: { clientId: string; secretKey: string; }): Promise<OMXSDK>
 *
 * Expected behavior:
 * 1. Makes POST request to https://blhilidnsybhfdmwqsrx.supabase.co/functions/v1/create-jwt-token
 * 2. Sends { clientId, secretKey } in request body
 * 3. Receives JWT token in response: { token: "..." }
 * 4. Returns SDK instance with token stored internally
 */
declare function testOMXInitialization(): Promise<OMX>;
/**
 * Test different authentication scenarios
 */
declare function testDifferentScenarios(): Promise<OMX | null>;
/**
 * Main test function
 */
declare function main(): Promise<void>;
declare function directAuthTest(): Promise<OMX>;
export { directAuthTest, testDifferentScenarios, testOMXInitialization };
export default main;
//# sourceMappingURL=auth-test.d.ts.map