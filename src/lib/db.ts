import mongoose from "mongoose";

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: Promise<typeof mongoose>;
};

export async function connectToDatabase() {
  if (!process.env.URI) {
    throw new Error("The URI environment variable is not configured.");
  }

  if (!globalForMongoose.mongooseConnection) {
    const connection = mongoose.connect(process.env.URI);
    globalForMongoose.mongooseConnection = connection;
    void connection.catch(() => {
      if (globalForMongoose.mongooseConnection === connection) {
        globalForMongoose.mongooseConnection = undefined;
      }
    });
  }

  return globalForMongoose.mongooseConnection;
}
