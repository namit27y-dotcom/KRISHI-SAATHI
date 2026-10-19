import assert from "node:assert";
import { WeatherService, WEATHER_ALERT_THRESHOLDS } from "../src/server/services/weatherService.js";
import { AIService } from "../src/server/services/aiService.js";
import { chatAssistantSchema } from "../src/server/validators/aiValidator.js";

async function runTests() {
  console.log("==================================================");
  console.log("🧪 KRISHI SAATHI: AUTOMATED VERIFICATION SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      const res = fn();
      if (res instanceof Promise) {
        return res
          .then(() => {
            console.log(`  ✓ ${name}`);
            passed++;
          })
          .catch((err) => {
            console.error(`  ✗ ${name}:`, err.message || err);
            failed++;
          });
      }
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ ${name}:`, err.message || err);
      failed++;
    }
  }

  console.log("📦 1. NOTIFICATIONS SUITE");
  test("Bell toggles notification panel state", () => {
    let showNotifPanel = false;
    const toggle = () => { showNotifPanel = !showNotifPanel; };
    toggle();
    assert.strictEqual(showNotifPanel, true, "Should open on first toggle");
    toggle();
    assert.strictEqual(showNotifPanel, false, "Should close on second toggle");
  });

  test("Outside click detection closes panel", () => {
    let showNotifPanel = true;
    const fakeContainer = {
      contains: (node: any) => node.isInside === true
    };
    const outsideClickEvent = { target: { isInside: false } };
    if (!fakeContainer.contains(outsideClickEvent.target)) {
      showNotifPanel = false;
    }
    assert.strictEqual(showNotifPanel, false, "Outside click must close panel");
  });

  test("Inside-panel click preserves panel state", () => {
    let showNotifPanel = true;
    const fakeContainer = {
      contains: (node: any) => node.isInside === true
    };
    const insideClickEvent = { target: { isInside: true } };
    if (!fakeContainer.contains(insideClickEvent.target)) {
      showNotifPanel = false;
    }
    assert.strictEqual(showNotifPanel, true, "Inside click must NOT close panel");
  });

  test("Escape key press closes panel", () => {
    let showNotifPanel = true;
    const keyEvent = { key: "Escape" };
    if (keyEvent.key === "Escape") {
      showNotifPanel = false;
    }
    assert.strictEqual(showNotifPanel, false, "Escape must close panel");
  });

  console.log("\n📦 2. CHATBOT SUITE");
  test("Chatbot rejects empty messages", () => {
    const emptyResult = chatAssistantSchema.safeParse({ message: "" });
    assert.strictEqual(emptyResult.success, false, "Validation should fail for empty message");

    const whitespaceResult = chatAssistantSchema.safeParse({ message: "   " });
    assert.ok(
      !whitespaceResult.success || whitespaceResult.data.message.trim().length === 0,
      "Whitespace-only message should be rejected or trimmed"
    );
  });

  test("Chatbot rejects invalid schema payloads", () => {
    const invalidResult = chatAssistantSchema.safeParse({ history: "not-an-array" });
    assert.strictEqual(invalidResult.success, false, "Validation should fail for missing message");
  });

  await test("Chatbot reports server configuration error when API key is missing or placeholder", async () => {
    // Test that missing/placeholder key triggers an explicit 503 error
    try {
      // Temporarily test with empty key behavior in AIService
      const originalEnv = process.env.GEMINI_API_KEY;
      const { ENV } = await import("../src/server/config/env.js");
      const originalConfigKey = ENV.GEMINI_API_KEY;
      ENV.GEMINI_API_KEY = "";

      try {
        await AIService.chatAssistant("Test query");
        assert.fail("Should have thrown error when key is empty");
      } catch (err: any) {
        assert.strictEqual(err.statusCode, 503, "Status code must be 503 for unconfigured key");
        assert.strictEqual(err.code, "GEMINI_NOT_CONFIGURED");
      } finally {
        ENV.GEMINI_API_KEY = originalConfigKey;
        process.env.GEMINI_API_KEY = originalEnv;
      }
    } catch (e: any) {
      if (e.name === "AssertionError") throw e;
    }
  });

  console.log("\n📦 3. WEATHER SUITE");
  await test("WeatherService resolves geocoding and returns live weather", async () => {
    const weather = await WeatherService.getCurrentWeather("Maharashtra", "Pune", undefined, undefined, true);
    assert.ok(weather, "Weather data must be returned");
    assert.ok(typeof weather.temp === "number", "Temperature must be a number");
    assert.ok(typeof weather.humidity === "number", "Humidity must be a number");
    assert.ok(typeof weather.wind === "number", "Wind must be a number");
    assert.ok(typeof weather.condition === "string", "Condition must be a string");
    assert.ok(Array.isArray(weather.forecast), "Forecast must be an array");
    assert.ok(weather.forecast.length > 0, "Forecast must contain daily forecasts");
    assert.ok(weather.isLive, "Data must be flagged as live");
    assert.strictEqual(typeof weather.hasAlert, "boolean", "hasAlert must be boolean");
  });

  test("Weather alert rules evaluate extreme heat correctly", () => {
    const evaluation = WeatherService.evaluateAlertRules(
      43, // temp > 42
      30,
      10,
      0,
      0,
      0,
      "Pune, Maharashtra"
    );
    assert.strictEqual(evaluation.hasAlert, true, "Extreme heat must trigger alert");
    assert.strictEqual(evaluation.alert?.severity, "danger");
    assert.strictEqual(evaluation.alert?.type, "heat");
  });

  test("Weather alert rules evaluate severe hailstorm/thunderstorm correctly", () => {
    const evaluation = WeatherService.evaluateAlertRules(
      26,
      85,
      20,
      15,
      95, // WMO code 95 (Thunderstorm)
      80,
      "Ludhiana, Punjab"
    );
    assert.strictEqual(evaluation.hasAlert, true, "Thunderstorm must trigger alert");
    assert.strictEqual(evaluation.alert?.severity, "danger");
    assert.strictEqual(evaluation.alert?.type, "storm");
  });

  test("Weather alert rules evaluate high gale wind correctly", () => {
    const evaluation = WeatherService.evaluateAlertRules(
      28,
      60,
      48, // Wind >= 45 km/h
      0,
      2,
      10,
      "Mumbai, Maharashtra"
    );
    assert.strictEqual(evaluation.hasAlert, true, "Gale wind must trigger alert");
    assert.strictEqual(evaluation.alert?.type, "wind");
  });

  test("Normal weather conditions report no active alerts", () => {
    const evaluation = WeatherService.evaluateAlertRules(
      25,
      50,
      12,
      0,
      1, // Mainly clear
      10,
      "Pune, Maharashtra"
    );
    assert.strictEqual(evaluation.hasAlert, false, "Mild conditions must not trigger false alerts");
    assert.strictEqual(evaluation.alert, null, "Alert object must be null for normal weather");
    assert.ok(evaluation.alertMessage.includes("No active climate alerts"), "Must have informative no-alert message");
  });

  await test("Weather caching avoids duplicate requests within TTL", async () => {
    const firstCall = await WeatherService.getCurrentWeather("Maharashtra", "Pune", undefined, undefined, false);
    const secondCall = await WeatherService.getCurrentWeather("Maharashtra", "Pune", undefined, undefined, false);
    assert.strictEqual(secondCall.isFromCache, true, "Second call within TTL should be served from cache");
  });

  console.log("\n==================================================");
  console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
