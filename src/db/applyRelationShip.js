//APPLY RELATIONSHIP 
const Post = require("../models/Post");
const Section = require("../models/Section");
const Category = require("../models/Catergory");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Moderation = require("../models/Moderation");
const UserFollowing = require("../models/UserFollowing");

function applyRelationShip() { 
    // One to many Category / Post (POST HAS ONE CATEGORY AND CATEGORY BELONG TO MANY POST)
    Category.hasMany(Post);
    Post.belongsTo(Category);

    // One to Many Section / Post (Post HAS MANY SECTION)
    Post.hasMany(Section);
    Section.belongsTo(Post);

    // One post has many comments and one comments belongs to one post
    Post.hasMany(Comment)
    Comment.belongsTo(Post)

    // One Comment belong to one user and one user has many comment
    User.hasMany(Comment)
    Comment.belongsTo(User)

    // Self-referencing relationship for Comment (one comment can have many child comments)
    Comment.hasMany(Comment, { as: 'childComments', foreignKey: 'parentID' });
    Comment.belongsTo(Comment, { as: 'parentComment', foreignKey: 'parentID' });


    // A user (admin) can make many moderation but a moderation can be made by only one user (admin)
    User.hasMany(Moderation)
    Moderation.belongsTo(User)


    //One post can have many moderation but one moberation can belong to only one Post
    Post.hasMany(Moderation)
    Moderation.belongsTo(Post)


    // User can follow many users
    User.belongsToMany(User, {
        through: UserFollowing,
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followingId'
    });

    // User can be followed by many users
    User.belongsToMany(User, {
        through: UserFollowing,
        as: 'followers',
        foreignKey: 'followingId',
        otherKey: 'followerId'
    });



}

module.exports = applyRelationShip;
