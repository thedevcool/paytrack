// Run this script to reset the programs collection
// WARNING: This will delete all existing programs!

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

async function resetProgramsCollection() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    // Drop the programs collection to remove old schema constraints
    await db.collection("programs").drop();
    console.log("Programs collection dropped successfully");

    // The collection will be recreated automatically with the new schema
    console.log("Collection will be recreated with new schema on next insert");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

resetProgramsCollection();
