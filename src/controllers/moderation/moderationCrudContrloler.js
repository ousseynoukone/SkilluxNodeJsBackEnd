// controllers/moderationController.js
const db = require("../../../db/models/index");

const {Moderation} = db;
const {Post} =  db;
const {User} =  db;

// Get all moderations
exports.getAllModerations = async (req, res) => {
    const postId=req.params.postId
    if(!postId){
        return res.status(400).json({ error: "Please provide the post id" });
    }

    try {
        const moderations = await Moderation.findAll({where:{postId:postId}});
        return res.status(200).json(moderations);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Get one moderation by ID
exports.getOneModeration = async (req, res) => {
    try {
        const moderation = await Moderation.findByPk(req.params.id);
        if (!moderation) {
            return res.status(404).json({ error: "Moderation not found" });
        }
        return res.status(200).json(moderation);
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Add a new moderation
exports.addModeration = async (req, res) => {
    try {
        var post = await Post.findByPk(req.body.postId)

        if(!post){
            return res.status(400).json({ error: "Post not found" });
        }
        var user = await User.findByPk(req.user.id)

        if(!user){
            return res.status(400).json({ error: "User not found" });
        }

        post.isPublished = false;
        post.save()
        const moderation = await Moderation.create(req.body);

        return res.status(201).json({ success: "Moderation added!", moderation });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Update a moderation by ID
exports.updateModeration = async (req, res) => {
    try {
        const moderation = await Moderation.findByPk(req.params.id);
        
        if (!moderation) {
            return res.status(404).json({ error: "Moderation not found" });
        }


        if(req.body.decision!=undefined){

            var post = Post.findByPk(req.body.postId)

            if(!post){
                return res.status(400).json({ error: "Post not found" });
            }

            post.decision = req.body.decision

        }

        await moderation.update(req.body);
        return res.status(200).json({ success: "Moderation updated!", moderation });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Delete a moderation by ID
exports.deleteModeration = async (req, res) => {
    try {
        const moderation = await Moderation.findByPk(req.params.id);
        if (!moderation) {
            return res.status(404).json({ error: "Moderation not found" });
        }

        await moderation.destroy();
        return res.status(200).json({ success: "Moderation deleted!" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};
