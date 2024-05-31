const Post = require("../../models/Post");
const {sequelize} =  require("../../db/db")



// Vote a post
exports.votePost = async (req, res) => {
    const postId = req.params.id;

    if(!postId){
        return res.status(404).json({ error: 'Post not found' });

    }
  
    try {
        // Using a transaction to ensure atomicity
        const result = await sequelize.transaction(async (transaction) => {
            // Increment the votesNumber by 1
            const [affectedRows, updatedPost] = await Post.update(
            { votesNumber: sequelize.literal('"votesNumber" + 1') },
            {
                where: { id: postId },
                returning: true,
                plain: true,
                transaction, // Ensure this update is part of the transaction
            }
            );

            if (affectedRows === 0) {
            throw new Error('Post not found');
            }

            return updatedPost.votesNumber;
        });

        // Send the updated votesNumber as response
        return res.status(200).json({ votesNumber: result });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.toString() });
    }
  };