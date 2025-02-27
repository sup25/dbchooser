import fs from "fs/promises";

// Define the shape of the results from load-test.ts
interface TestResult {
  label: string;
  duration: number;
  success: number;
  failed: number;
}

async function generateReport() {
  try {
    // Read the results from load-test.ts
    const rawData = await fs.readFile("results.json", "utf-8");
    const results: TestResult[] = JSON.parse(rawData);

    // Extract Postgres and Mongo results
    const postgres = results.find((r) => r.label === "postgres");
    const mongo = results.find((r) => r.label === "mongo");

    if (!postgres || !mongo) {
      throw new Error("Missing results for Postgres or Mongo in results.json");
    }

    // Calculate average time per successful request
    const postgresAvgPerRequest = (
      postgres.duration / postgres.success
    ).toFixed(2);
    const mongoAvgPerRequest = (mongo.duration / mongo.success).toFixed(2);

    // Build the summary
    console.log("=== Database Performance Report ===");
    console.log("\nPostgreSQL (Local):");
    console.log(`- Total Duration: ${postgres.duration}ms`);
    console.log(`- Successful Requests: ${postgres.success}`);
    console.log(`- Failed Requests: ${postgres.failed}`);
    console.log(`- Avg Time per Request: ${postgresAvgPerRequest}ms`);

    console.log("\nMongoDB (Local):");
    console.log(`- Total Duration: ${mongo.duration}ms`);
    console.log(`- Successful Requests: ${mongo.success}`);
    console.log(`- Failed Requests: ${mongo.failed}`);
    console.log(`- Avg Time per Request: ${mongoAvgPerRequest}ms`);

    // Compare and recommend
    console.log("\n=== Comparison ===");
    const faster =
      postgres.duration < mongo.duration ? "PostgreSQL" : "MongoDB";
    console.log(`- Faster Total Duration: ${faster}`);
    const fasterPerRequest =
      parseFloat(postgresAvgPerRequest) < parseFloat(mongoAvgPerRequest)
        ? "PostgreSQL"
        : "MongoDB";
    console.log(`- Faster Avg per Request: ${fasterPerRequest}`);

    console.log("\n=== Recommendation ===");
    if (faster === "PostgreSQL" && fasterPerRequest === "PostgreSQL") {
      console.log(
        "PostgreSQL performed better overall in this test (faster total time and per request). " +
          "Both databases are local, so this reflects raw performance differences."
      );
    } else if (faster === "MongoDB" && fasterPerRequest === "MongoDB") {
      console.log(
        "MongoDB performed better overall in this test (faster total time and per request). " +
          "Both databases are local, so this highlights MongoDB's efficiency for this workload."
      );
    } else {
      console.log(
        "Mixed results! " +
          `${faster} had the faster total duration, but ${fasterPerRequest} was quicker per request. ` +
          "Both are local, so consider your app’s specific needs (e.g., reads vs. writes)."
      );
    }

    // Save the report to a file
    const reportText = `
Database Performance Report
==========================
PostgreSQL (Local):
- Total Duration: ${postgres.duration}ms
- Successful Requests: ${postgres.success}
- Failed Requests: ${postgres.failed}
- Avg Time per Request: ${postgresAvgPerRequest}ms

MongoDB (Local):  // Changed from "MongoDB (Atlas)"
- Total Duration: ${mongo.duration}ms
- Successful Requests: ${mongo.success}
- Failed Requests: ${mongo.failed}
- Avg Time per Request: ${mongoAvgPerRequest}ms

Comparison:
- Faster Total Duration: ${faster}
- Faster Avg per Request: ${fasterPerRequest}

Recommendation:
${
  faster === fasterPerRequest
    ? `${faster} performed better overall in this local test.`
    : "Mixed results—consider your use case (e.g., query patterns, data size)."
}
`;
    await fs.writeFile("report.txt", reportText);
    console.log("\nReport saved to report.txt");
  } catch (err) {
    console.error("Failed to generate report:", err);
  }
}

generateReport();
