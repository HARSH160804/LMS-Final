/**
 * Command-line version of the debug fetch tests
 * Simulates browser fetch behavior to diagnose issues
 */

const BACKEND_URL = "https://lms-final-5lj2.onrender.com";

// Test 1: Health Check
async function testHealthCheck() {
  console.log("\n🔍 TEST 1: Health Check");
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 2: API Health Check
async function testApiHealthCheck() {
  console.log("\n🔍 TEST 2: API /api/health");
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: "GET",
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 3: OPTIONS Preflight
async function testOptionsPreflight() {
  console.log("\n🔍 TEST 3: OPTIONS Preflight");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`CORS Headers:`, {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
    });
    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 4: Signin (No Credentials)
async function testSigninNoCredentials() {
  console.log("\n🔍 TEST 4: Signin (No Credentials)");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "test"
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 5: Signin (With Credentials)
async function testSigninWithCredentials() {
  console.log("\n🔍 TEST 5: Signin (With Credentials)");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        email: "test@test.com",
        password: "test"
      })
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(`Set-Cookie header:`, response.headers.get('set-cookie'));
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runAllTests() {
  console.log("=" .repeat(60));
  console.log("🚀 RUNNING DIAGNOSTIC TESTS");
  console.log("=" .repeat(60));
  
  const results = {
    health: await testHealthCheck(),
    apiHealth: await testApiHealthCheck(),
    options: await testOptionsPreflight(),
    signinNoCredentials: await testSigninNoCredentials(),
    signinWithCredentials: await testSigninWithCredentials(),
  };
  
  console.log("\n" + "=" .repeat(60));
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("=" .repeat(60));
  console.log(`Health check: ${results.health.success ? "PASS" : "FAIL"}`);
  if (!results.health.success) {
    console.log(`  Error: ${results.health.error}`);
  }
  
  console.log(`API /api/health: ${results.apiHealth.success ? "PASS" : "FAIL"}`);
  if (!results.apiHealth.success) {
    console.log(`  Error: ${results.apiHealth.error}`);
  }
  
  console.log(`OPTIONS preflight: ${results.options.success ? "PASS" : "FAIL"}`);
  if (!results.options.success) {
    console.log(`  Error: ${results.options.error}`);
  }
  
  console.log(`Signin (no credentials): ${results.signinNoCredentials.success ? "PASS" : "FAIL"}`);
  if (!results.signinNoCredentials.success) {
    console.log(`  Error: ${results.signinNoCredentials.error}`);
  }
  
  console.log(`Signin (with credentials): ${results.signinWithCredentials.success ? "PASS" : "FAIL"}`);
  if (!results.signinWithCredentials.success) {
    console.log(`  Error: ${results.signinWithCredentials.error}`);
  }
  
  console.log("=" .repeat(60));
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
