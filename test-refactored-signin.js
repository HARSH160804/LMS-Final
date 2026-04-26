/**
 * Test the refactored signin controller
 */

const BACKEND_URL = "https://lms-final-5lj2.onrender.com";

async function testMissingFields() {
  console.log("\n🔍 TEST: Missing password field");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com" })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(`Expected: 400 with validation error`);
    console.log(`Result: ${response.status === 400 ? "✅ PASS" : "❌ FAIL"}`);
  } catch (error) {
    console.error(`❌ FAIL - Error: ${error.message}`);
  }
}

async function testInvalidEmail() {
  console.log("\n🔍 TEST: Invalid email format");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "notanemail", password: "test123" })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(`Expected: 400 with email format error`);
    console.log(`Result: ${response.status === 400 ? "✅ PASS" : "❌ FAIL"}`);
  } catch (error) {
    console.error(`❌ FAIL - Error: ${error.message}`);
  }
}

async function testInvalidCredentials() {
  console.log("\n🔍 TEST: Invalid credentials");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "wrongpassword" })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(`Expected: 401 with invalid credentials error`);
    console.log(`Result: ${response.status === 401 ? "✅ PASS" : "❌ FAIL"}`);
  } catch (error) {
    console.error(`❌ FAIL - Error: ${error.message}`);
  }
}

async function testEmptyBody() {
  console.log("\n🔍 TEST: Empty request body");
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/user/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log(`Expected: 400 with required fields error`);
    console.log(`Result: ${response.status === 400 ? "✅ PASS" : "❌ FAIL"}`);
  } catch (error) {
    console.error(`❌ FAIL - Error: ${error.message}`);
  }
}

async function runTests() {
  console.log("=" .repeat(60));
  console.log("🧪 TESTING REFACTORED SIGNIN CONTROLLER");
  console.log("=" .repeat(60));
  
  await testEmptyBody();
  await testMissingFields();
  await testInvalidEmail();
  await testInvalidCredentials();
  
  console.log("\n" + "=" .repeat(60));
  console.log("✅ All validation tests completed");
  console.log("=" .repeat(60));
}

runTests().catch(console.error);
