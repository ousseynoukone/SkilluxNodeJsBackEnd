const User = require("../../models/User");

const updateUserTagsPreferences = async () => {
    const userId = req.body.userId;
    const tags = req.body.tags;
    try {
        const user = await User.findByPk(userId);
        user.preferredTags = tags;
        await user.save();
        return res.status(200).json({ success: "User Preference  updated!", post });

    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }

  };