const Short = require("../models/shorts"); // Adjust the path if necessary

// Function to search for Shorts by title or other fields
async function searchShorts(searchQuery) {
    try {
        const results = await Short.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in title
                { description: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in description
            ]
        });
        return results;
    } catch (error) {
        console.error("Error searching for shorts:", error);
        throw error;
    }
}
module.exports = { searchShorts };
