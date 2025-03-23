const { Short } = require("../models/shorts");

const searchShorts = async (query) => {
  try {
    let searchTerms;

    if (query.startsWith("#")) {
        // Treat it as a single search term (hashtag)
        searchTerms = [new RegExp(`\\${query}`, 'i')]; // Escape `#` for regex
    } else {
        // Split query into terms and create regex for each term (case-insensitive)
        searchTerms = query
            .split(' ')
            .filter(term => term.trim() !== '')
            .map(term => new RegExp(term, 'i'));
    }

    // Search using $or for partial matches across multiple fields
    const results = await Short.aggregate([
      {
        $match: {
          $or: searchTerms.flatMap(term => [
            { title: { $regex: term } },
            { description: { $regex: term } },
            { channelTitle: { $regex: term } },
            { tags: { $in: [term.source] } } // Match terms in tags
          ])
        }
      },
      {
        $addFields: {
          matchCount: {
            $size: {
              $filter: {
                input: searchTerms.map(term => ({
                  $or: [
                    { $regexMatch: { input: "$title", regex: term } },
                    { $regexMatch: { input: "$description", regex: term } },
                    { $regexMatch: { input: "$channelTitle", regex: term } },
                    { $in: [term.source, "$tags"] }
                  ]
                })),
                as: "match",
                cond: { $eq: ["$$match", true] }
              }
            }
          }
        }
      },
      {
        $sort: { matchCount: -1, publishedAt: -1 } // Sort by match count and date
      },
      {
        $limit: 20 // Limit results to 20
      }
    ]);

    return results;
  } catch (error) {
    console.error("Error searching for shorts:", error.message);
    throw error;
  }
};

module.exports = searchShorts;
