const { validationResult } = require('express-validator');
const Comment =  require("../../models/Comment")

const buildCommentNodeTree = require("./commentHelper")

// Get all comments
exports.getAllComments = async (req, res) => {
    const postId=req.params.postId
    if(!postId){
        return res.status(400).json({ error: "Please provide the post id" });
    }
    try {
        const comments = await Comment.findAll({where:{postId:postId}});
        nestedComments = buildCommentNodeTree(comments)
        return res.status(200).json(nestedComments);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Get a single comment by ID
exports.getOneComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Add a new comment
exports.addComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const comment = await Comment.create(req.body);
        return res.status(201).json({ success: "Comment added!", comment });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        var comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        comment.isModified = true;

        await comment.update(req.body);
        return res.status(200).json({ success: "Comment updated!", comment });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await comment.destroy();
        return res.status(200).json({ success: "Comment deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};
