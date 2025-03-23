const { Short } = require("../models/shorts"); // Ensure this path is correct

const searchShorts = async (query) => {
  try {

    // Split query into hashtags or words
    const queryWords = query.split(' ').filter(word => word.startsWith('#') && word.length > 1);
    if (queryWords.length < 1) {
      throw new Error('At least two hashtags are required for a match.');
    }

    // Create regex patterns for each hashtag
    const regexPatterns = queryWords.map(word => new RegExp(word, "i"));
    // Build an $and query to require at least two hashtag matches
    const conditions = regexPatterns.map(pattern => ({
      $or: [
        { title: pattern },
        { description: pattern }
      ]
    }));

    // Require at least two matches using $and
    const results = await Short.find({ $and: conditions.slice(0, 3) }); // Match at least two or three hashtags
    console.log('Matched results:', results); // Log the matched results
    return results;

  } catch (error) {
    console.error("Error searching for shorts:", error.message);
    throw error;
  }
};

module.exports = searchShorts;
