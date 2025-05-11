const { Short } = require("../models/shorts"); // Ensure this path is correct

const searchShorts = async (query) => {
  try {
    // Use Mongoose's `find` method to search for shorts in the database
    console.log("Searching for shorts with query:", query);

    const results = await Short.find({ searchQuery: { $regex: query, $options: "i" } })
      .sort({ updatedAt: -1 }) // Sort by `updatedAt` in descending order (most recent first)
      .exec(); // Execute the query

    return results;
  } catch (error) {
    console.error("Error searching for shorts:", error.message);
    throw error;
  }
};

module.exports = searchShorts;