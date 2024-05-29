//APPLY RELATIONSHIP 
const Post = require("../models/Post");
const Section = require("../models/Section");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Moderation = require("../models/Moderation");

function applyRelationShip() { 


    // One to Many Section / Post (Post HAS MANY SECTION)
    Post.hasMany(Section, {
        foreignKey: {
            allowNull: false, // Ensures a section cannot exist without a post
        },
        onDelete: 'CASCADE', // Deletes associated sections when a post is deleted
        onUpdate: 'CASCADE'
    });
    Section.belongsTo(Post);

    


    // One to Many Section / Post (User HAS MANY Post)
    User.hasMany(Post);
    Post.belongsTo(User);

    // One post has many comments and one comments belongs to one post
    Post.hasMany(Comment, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
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
        through: 'user_followings',
        as: 'following',
        foreignKey: 'followerId',
        otherKey: 'followingId'
    });

    // User can be followed by many users
    User.belongsToMany(User, {
        through: 'user_followings',
        as: 'followers',
        foreignKey: 'followingId',
        otherKey: 'followerId'
    });


    // HAS : Hand his primary key to one or many

    // BelongTo : Receive one or many Others key 

}

module.exports = applyRelationShip;
