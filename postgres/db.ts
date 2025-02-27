import { Sequelize, DataTypes, Model } from "sequelize";

// Define the Sequelize instance (connection)
const sequelize = new Sequelize("postgres://user:pass@localhost:5432/testdb", {
  logging: false,
});

interface TaskAttributes {
  id?: number;
  title: string;
  completed?: boolean;
  createdAt?: Date;
}

// Define Task model
class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public completed!: boolean;
  public createdAt!: Date;
}

// Initialize the Task model
Task.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
    timestamps: true,
  }
);

// Function to sync the database (can be called externally if needed)
export async function initDb() {
  await sequelize.sync({ force: true }); // force: true drops and recreates tables
  console.log("PostgreSQL database synchronized");
}

export { sequelize, Task };
