import axios from "axios";
import fs from "fs/promises";

async function runLoadTest(
  url: string,
  endpoint: string,
  count: number,
  label: string
) {
  console.time(`${label}-load`);
  const start = Date.now();
  const requests = Array(count)
    .fill(null)
    .map(() => axios.get(`${url}${endpoint}`).catch(() => null)); // Ignore individual failures
  const results = await Promise.all(requests);
  const duration = Date.now() - start;
  console.timeEnd(`${label}-load`);
  const successCount = results.filter((r) => r !== null).length;
  return {
    label,
    duration,
    success: successCount,
    failed: count - successCount,
  };
}

async function main() {
  console.log("Starting load tests...");

  // Test PostgreSQL API (local database, local API)
  const postgresResult = await runLoadTest(
    "http://localhost:3001",
    "/tasks",
    1000,
    "postgres"
  );

  // Test MongoDB API (Atlas database, local API)
  const mongoResult = await runLoadTest(
    "http://localhost:3002",
    "/tasks",
    1000,
    "mongo"
  );

  // Save results
  const results = [postgresResult, mongoResult];
  await fs.writeFile("results.json", JSON.stringify(results, null, 2));
  console.log("Results saved to results.json");

  // Log summary
  console.log("\n=== Summary ===");
  results.forEach((r) => {
    console.log(`${r.label}:`);
    console.log(`- Duration: ${r.duration}ms`);
    console.log(`- Successful Requests: ${r.success}`);
    console.log(`- Failed Requests: ${r.failed}`);
  });
}

main().catch((err) => console.error("Load test failed:", err));
