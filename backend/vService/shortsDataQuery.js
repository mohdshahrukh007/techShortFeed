const { Short } = require("../models/shorts"); // Ensure this path is correct

const searchShorts = async (query) => {
  try {
    // Use Mongoose's `find` method to search for shorts in the database
    const results = await Short.find({ title: { $regex: query, $options: "i" } });
    return results;
  } catch (error) {
    console.error("Error searching for shorts:", error.message);
    throw error;
  }
};

module.exports = searchShorts;
