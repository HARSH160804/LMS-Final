/**
 * ⚠️ TEMPORARY DEBUG UTILITY - FOR DIAGNOSTIC PURPOSES ONLY
 * 
 * This file bypasses all axios wrappers, interceptors, and API services
 * to test raw browser fetch capabilities against the backend.
 * 
 * DO NOT USE IN PRODUCTION - DELETE AFTER DEBUGGING
 */

const BACKEND_URL = "https://lms-final-5lj2.onrender.com";

/**
 * Test 1: Raw Health Check (No Auth, No Credentials)
 * Tests basic connectivity to backend
 */
export const testHealthCheck = async () => {
  console.log("🔍 TEST 1: Raw Health Check (No Auth)");
  console.log("URL:", `${BACKEND_URL}/health`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
    });
    
    console.log("✅ Response Status:", response.status);
    console.log("✅ Response OK:", response.ok);
    console.log("✅ Response Headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log("✅ HEALTH CHECK SUCCESS:", data);
    return { success: true, data };
    
  } catch (error) {
    console.error("❌ HEALTH CHECK FAILED:", error);
    console.error("❌ Error Name:", error.name);
    console.error("❌ Error Message:", error.message);
    console.error("❌ Error Stack:", error.stack);
    return { success: false, error: error.message };
  }
};

/**
 * Test 2: Raw API Health Check (No Auth, No Credentials)
 * Tests /api/health endpoint
 */
export const testApiHealthCheck = async () => {
  console.log("🔍 TEST 2: Raw API Health Check (No Auth)");
  console.log("URL:", `${BACKEND_URL}/api/health`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: "GET",
    });
    
    console.log("✅ Response Status:", response.status);
    console.log("✅ Response OK:", response.ok);
    console.log("✅ Response Headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log("✅ API HEALTH CHECK SUCCESS:", data);
    return { success: true, data };
    
  } catch (error) {
    console.error("❌ API HEALTH CHECK FAILED:", error);
    console.error("❌ Error Name:", error.name);
    console.error("❌ Error Message:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test 3: Raw Signin Test (No Cookies, No Credentials)
 * Tests POST request without credentials
 */
export const testRawSignin = async (email = "test@test.com", password = "test") => {
  console.log("🔍 TEST 3: Raw Signin (No Cookies, No Credentials)");
  console.log("URL:", `${BACKEND_URL}/api/v1/user/signin`);
  console.log("Payload:", { email, password: "***" });
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    console.log("✅ Response Status:", response.status);
    console.log("✅ Response OK:", response.ok);
    console.log("✅ Response Headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log("✅ SIGNIN RESPONSE:", data);
    return { success: true, status: response.status, data };
    
  } catch (error) {
    console.error("❌ SIGNIN FAILED:", error);
    console.error("❌ Error Name:", error.name);
    console.error("❌ Error Message:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test 4: Raw Signin with Credentials
 * Tests POST request WITH credentials to verify cookie handling
 */
export const testSigninWithCredentials = async (email = "test@test.com", password = "test") => {
  console.log("🔍 TEST 4: Raw Signin (WITH Credentials)");
  console.log("URL:", `${BACKEND_URL}/api/v1/user/signin`);
  console.log("Payload:", { email, password: "***" });
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ email, password })
    });
    
    console.log("✅ Response Status:", response.status);
    console.log("✅ Response OK:", response.ok);
    console.log("✅ Response Headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log("✅ SIGNIN WITH CREDENTIALS RESPONSE:", data);
    return { success: true, status: response.status, data };
    
  } catch (error) {
    console.error("❌ SIGNIN WITH CREDENTIALS FAILED:", error);
    console.error("❌ Error Name:", error.name);
    console.error("❌ Error Message:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test 5: OPTIONS Preflight Test
 * Manually test OPTIONS request
 */
export const testOptionsPreflight = async () => {
  console.log("🔍 TEST 5: OPTIONS Preflight");
  console.log("URL:", `${BACKEND_URL}/api/v1/user/signin`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "OPTIONS",
      headers: {
        "Origin": window.location.origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
      }
    });
    
    console.log("✅ OPTIONS Response Status:", response.status);
    console.log("✅ OPTIONS Response OK:", response.ok);
    console.log("✅ OPTIONS Response Headers:", Object.fromEntries(response.headers.entries()));
    
    return { success: true, status: response.status };
    
  } catch (error) {
    console.error("❌ OPTIONS PREFLIGHT FAILED:", error);
    console.error("❌ Error Name:", error.name);
    console.error("❌ Error Message:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Run All Tests Sequentially
 */
export const runAllTests = async () => {
  console.log("🚀 STARTING DIAGNOSTIC TESTS");
  console.log("=" .repeat(60));
  
  const results = {
    health: await testHealthCheck(),
    apiHealth: await testApiHealthCheck(),
    options: await testOptionsPreflight(),
    signinNoCredentials: await testRawSignin(),
    signinWithCredentials: await testSigninWithCredentials(),
  };
  
  console.log("=" .repeat(60));
  console.log("📊 TEST RESULTS SUMMARY:");
  console.log("Health Check:", results.health.success ? "✅ PASS" : "❌ FAIL");
  console.log("API Health Check:", results.apiHealth.success ? "✅ PASS" : "❌ FAIL");
  console.log("OPTIONS Preflight:", results.options.success ? "✅ PASS" : "❌ FAIL");
  console.log("Signin (No Credentials):", results.signinNoCredentials.success ? "✅ PASS" : "❌ FAIL");
  console.log("Signin (With Credentials):", results.signinWithCredentials.success ? "✅ PASS" : "❌ FAIL");
  console.log("=" .repeat(60));
  
  return results;
};

/**
 * Make tests available in browser console
 */
if (typeof window !== "undefined") {
  window.debugFetch = {
    testHealthCheck,
    testApiHealthCheck,
    testRawSignin,
    testSigninWithCredentials,
    testOptionsPreflight,
    runAllTests,
  };
  
  console.log("🔧 Debug Fetch Utility Loaded");
  console.log("Available commands:");
  console.log("  window.debugFetch.runAllTests() - Run all tests");
  console.log("  window.debugFetch.testHealthCheck() - Test health endpoint");
  console.log("  window.debugFetch.testApiHealthCheck() - Test /api/health");
  console.log("  window.debugFetch.testRawSignin() - Test signin without credentials");
  console.log("  window.debugFetch.testSigninWithCredentials() - Test signin with credentials");
  console.log("  window.debugFetch.testOptionsPreflight() - Test OPTIONS request");
}

export default {
  testHealthCheck,
  testApiHealthCheck,
  testRawSignin,
  testSigninWithCredentials,
  testOptionsPreflight,
  runAllTests,
};
