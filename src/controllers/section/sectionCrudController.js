const { validationResult } = require('express-validator');
const Section = require('../../models/Section');

exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.findAll();
        return res.status(200).json(sections);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

exports.getOneSection = async (req, res) => {
    try {
        const section = await Section.findByPk(req.params.id);
        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }
        return res.status(200).json(section);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

exports.addSection = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const section = await Section.create(req.body);
        return res.status(201).json({ success: "Section added!", section });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const section = await Section.findByPk(req.params.id);
        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }

        await section.update(req.body);
        return res.status(200).json({ success: "Section updated!", section });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findByPk(req.params.id);
        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }

        await section.destroy();
        return res.status(200).json({ success: "Section deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};
