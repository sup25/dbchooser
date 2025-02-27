import mongoose from "mongoose";

// Connect to MongoDB
const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testdb", {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
};

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export async function initDb() {
  await connectMongo();
  await Task.deleteMany({});
  console.log("MongoDB initialized");
}

export { Task };
