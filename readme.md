# DBChooser: MongoDB vs PostgreSQL Performance Comparison

This mini project compares the performance of MongoDB and PostgreSQL for a simple task management API. It includes Express.js APIs for both databases, a load testing script to simulate 1000 GET requests, and a report generator to analyze and summarize the results.

## Project Structure

- MongoDB API

  - mongo/index.ts: Express server for MongoDB (port 3002)
  - mongo/db.ts: MongoDB connection and Task model (Mongoose)

- PostgreSQL API

  - postgres/index.ts: Express server for PostgreSQL (port 3001)
  - postgres/db.ts: PostgreSQL connection and Task model (Sequelize)

- Load Testing
  - load-test.ts: Script to run 1000 GET requests against both APIs
- Reporting
  - report.ts: Generates a performance report from load test results

## Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local instance running on mongodb://localhost:27017)
- PostgreSQL (local instance running on postgres://localhost:5432)
- npm for package management

## Setup

Clone the repository:

```bash
git clone https://github.com/sup25/dbchooser.git
cd dbchooser
```

## Install dependencies:

```bash
npm install
```

## Configure databases:

- Ensure MongoDB is running locally (mongod).
- Set up PostgreSQL with a database named testdb and update
- postgres/db.ts with your credentials (default: user:pass).

## Run the APIs:

- MongoDB API:

```bash
 npm run start:mongo

```

- PostgreSQL API:

```bash
 npm run start:postgres

```

- Run the load test:

```bash
 npm run test:load
```

- Generate the report:

```bash
 npm run report
```

## Results

A sample run with 1000 GET requests to `/tasks` on both APIs (local databases) produced the following:

## Database Performance Report

PostgreSQL (Local):

- Total Duration: 1662ms
- Successful Requests: 1000
- Failed Requests: 0
- Avg Time per Request: 1.66ms

MongoDB (Local):

- Total Duration: 1787ms
- Successful Requests: 1000
- Failed Requests: 0
- Avg Time per Request: 1.79ms

## Comparison

- Faster Total Duration: PostgreSQL
- Faster Avg per Request: PostgreSQL

## Recommendation

PostgreSQL performed better overall in this test (faster total time and per request). Both databases are local, so this reflects raw performance differences.

## Methodology

- APIs: Both use Express.js with identical endpoints (POST /tasks, GET /tasks).
- Data: Each database is seeded with 100 tasks before testing.
- Load Test: 1000 concurrent GET requests to /tasks using Axios.
- Metrics: Total duration, successful/failed requests, and average time per request.

## Notes

- This test focuses on read performance (GET /tasks) after seeding a small dataset.
- Results may vary with larger datasets, different query types (e.g., writes), or remote databases (e.g., MongoDB Atlas).
- Adjust database configurations in mongo/db.ts and postgres/db.ts as needed.
