const db = require("../../../db/models/index");


const {Tag} = db;

// Create Tag
exports.setTags = async (req, res) => {
    try {
        req.body.libelle = req.body.libelle.toLowerCase();
        // If validation passes, proceed to create the tag
        const tag = await Tag.create(req.body);
        return res.status(200).json({ success: "Tag added successfully!", tag });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};



// Read all Tags
exports.getTags = async (req, res) => {
    try {
        // Retrieve all tags, limited to 15, ordered by 'score' in descending order
        const tags = await Tag.findAll({
            limit: 15,
            order: [['score', 'DESC']]
        });
        return res.status(200).json(tags);
    } catch (error) {
        // Return a 500 status code with the error message if an error occurs
        return res.status(500).json({ error: error.toString() });
    }
};


// Read Tag by ID
exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (tag) {
            return res.status(200).json(tag);
        } else {
            return res.status(404).json({ error: "Tag not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Update Tag
exports.updateTag = async (req, res) => {
    try {

        // If validation passes, proceed to update the tag
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: "Tag not found" });
        }
        await tag.update(req.body);
        return res.status(200).json({ success: "Tag updated successfully!", tag });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete Tag
exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (tag) {
            await tag.destroy();
            return res.status(200).json({ success: "Tag deleted successfully!" });
        } else {
            return res.status(404).json({ error: "Tag not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};
