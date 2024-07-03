const db = require("../../../db/models/index");
const { validationResult } = require('express-validator');

const {Tag} = db;

// Create Tag
exports.setTags = async (req, res) => {
    try {

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
        const tags = await Tag.findAll();
        return res.status(200).json(tags);
    } catch (error) {
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
