const { validationResult } = require('express-validator');
const Category = require('../../models/Catergory');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.getOneCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.addCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const category = await Category.create(req.body);
        return res.status(201).json({ success: "Category added!", category });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        await category.update(req.body);
        return res.status(200).json({ success: "Category updated!", category });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        await category.destroy();
        return res.status(200).json({ success: "Category deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
}
