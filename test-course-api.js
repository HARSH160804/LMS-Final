/**
 * Test course API response format
 */

const BACKEND_URL = "http://localhost:8000";

async function testCourseDetails() {
  console.log("🔍 Testing Course Details API\n");
  
  // Replace with an actual course ID from your database
  const courseId = "6976fed25ad4e1cdde460503";
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/course/c/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    
    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);
    
    const data = await response.json();
    console.log("\nRaw Response Data:");
    console.log(JSON.stringify(data, null, 2));
    
    console.log("\n📊 Response Structure:");
    console.log("data.success:", data.success);
    console.log("data.data exists:", !!data.data);
    
    if (data.data) {
      console.log("\nCourse Data:");
      console.log("- Title:", data.data.title);
      console.log("- Price:", data.data.price);
      console.log("- Category:", data.data.category);
    }
    
    console.log("\n✅ Test Complete");
    
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
  }
}

testCourseDetails();
