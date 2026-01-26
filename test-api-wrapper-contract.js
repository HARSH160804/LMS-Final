/**
 * Test API Wrapper Contract
 * Verifies that the API wrapper ALWAYS returns a structured response object
 * and NEVER returns undefined
 */

// Mock the API wrapper behavior
async function mockApiRequest(shouldFail = false) {
    try {
        if (shouldFail) {
            throw new Error('Network error');
        }
        
        const response = { ok: true, status: 200 };
        const data = { success: true, message: 'OK' };
        
        return {
            ok: response.ok,
            status: response.status,
            data
        };
        
    } catch (error) {
        // CRITICAL: Never return console.error()
        console.error('❌ API Request Failed:', error);
        
        // CRITICAL: Always return structured response
        return {
            ok: false,
            status: 0,
            data: {
                message: error.message || 'Network error or request blocked by browser',
                error: error.name || 'NetworkError'
            }
        };
    }
}

// Test function
async function testApiWrapperContract() {
    console.log('🧪 Testing API Wrapper Contract\n');
    
    // Test 1: Success case
    console.log('Test 1: Success case');
    const successResponse = await mockApiRequest(false);
    console.log('Response:', successResponse);
    console.log('Is undefined?', successResponse === undefined);
    console.log('Has ok property?', 'ok' in successResponse);
    console.log('Has status property?', 'status' in successResponse);
    console.log('Has data property?', 'data' in successResponse);
    console.log('Result:', successResponse !== undefined && 'ok' in successResponse ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n---\n');
    
    // Test 2: Error case
    console.log('Test 2: Error case (network error)');
    const errorResponse = await mockApiRequest(true);
    console.log('Response:', errorResponse);
    console.log('Is undefined?', errorResponse === undefined);
    console.log('Has ok property?', 'ok' in errorResponse);
    console.log('Has status property?', 'status' in errorResponse);
    console.log('Has data property?', 'data' in errorResponse);
    console.log('Result:', errorResponse !== undefined && 'ok' in errorResponse ? '✅ PASS' : '❌ FAIL');
    
    console.log('\n---\n');
    
    // Test 3: Verify calling code pattern works
    console.log('Test 3: Verify calling code pattern');
    const response = await mockApiRequest(true);
    
    try {
        // This is how calling code uses the response
        if (response.ok) {
            console.log('Success:', response.data);
        } else {
            console.log('Error:', response.data.message);
        }
        console.log('Result: ✅ PASS - No crash on response.ok check');
    } catch (err) {
        console.log('Result: ❌ FAIL - Crashed on response.ok check');
        console.log('Error:', err.message);
    }
    
    console.log('\n---\n');
    
    // Test 4: What happens if we return console.error() (BAD)
    console.log('Test 4: Demonstrating the BUG (returning console.error)');
    
    async function buggyApiRequest() {
        try {
            throw new Error('Network error');
        } catch (error) {
            // BUG: Returning console.error() which returns undefined
            return console.error('❌ Error:', error);
        }
    }
    
    const buggyResponse = await buggyApiRequest();
    console.log('Buggy response:', buggyResponse);
    console.log('Is undefined?', buggyResponse === undefined);
    
    try {
        if (buggyResponse.ok) {
            console.log('Success');
        } else {
            console.log('Error');
        }
        console.log('Result: ✅ No crash (unexpected)');
    } catch (err) {
        console.log('Result: ❌ CRASH - Cannot read property "ok" of undefined');
        console.log('Error:', err.message);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ Correct implementation: Always returns { ok, status, data }');
    console.log('❌ Buggy implementation: Returns undefined (console.error return value)');
    console.log('🎯 Fix: Never return console.error(), always return response object');
}

// Run tests
testApiWrapperContract().catch(console.error);
