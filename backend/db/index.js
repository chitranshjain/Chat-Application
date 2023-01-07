const mongoose = require("mongoose");

let db;

const connectDB = () => {
  mongoose.set("strictQuery", false);
  const dbPromise = new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB)
      .then((_db) => {
        db = _db;
        console.log("Connected to DB");
        resolve();
      })
      .catch((error) => {
        reject(error.message);
      });
  });

  return dbPromise;
};

module.exports = { db, connectDB };
