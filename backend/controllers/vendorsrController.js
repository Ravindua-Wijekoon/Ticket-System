const User = require('../models/User');

// Get all users with userType="vendor"
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({ userType: "vendor" });
        res.status(200).json(vendors);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ error: "Failed to fetch vendors" });
    }
};
