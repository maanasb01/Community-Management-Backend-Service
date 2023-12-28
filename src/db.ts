import mongoose from "mongoose";

const dbConnectionLink = process.env.DB_CONNECTION_STRING;

export function connectToDB() {
  if (!dbConnectionLink) {
    throw new Error("DB_CONNECTION_STRING is not set");
  }
  mongoose.connect(dbConnectionLink).then(
    () => {console.log("Connected to the DB")},
    (err) => {
      console.log("Error connecting with DB: ", err);
    }
  );
}
