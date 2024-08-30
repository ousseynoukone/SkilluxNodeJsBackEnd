const { attribute } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");
const db = require("../../../db/models/index");
const { UserLike } = db;

exports.getUserLikesIds = async (req, res) => {
  const userId = req.user.id;
  const ressourceType = req.params.ressourceType;

  // Check if userId and ressourceType are provided
  if (!userId || !ressourceType) {
    return res.status(400).json({ error: 'User ID and resource type are required!' });
  }

  try {
    // Find UserLikes with specified userId and ressourceType
    const userLikes = await UserLike.findAll({
        attributes: ['ressourceId'], 
        where: {
            userId: userId,
            ressourceType: ressourceType
        }
    });

    // Check if any user likes were found
    if (userLikes.length === 0) {
      return res.status(404).json({ error: 'No user likes found!' });
    }
    

    // Extract ressourceIds into an array
    const ressourceIds = userLikes.map(like => like.ressourceId);

    // Respond with the list of user likes
    res.status(200).json(ressourceIds);
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error(error);
    return res.status(500).json({ error: error.toString() });
  }
};
