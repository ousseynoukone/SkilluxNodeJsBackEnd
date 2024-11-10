const db = require("../../../db/models/index");
const {  Comment, User } = db;


var notificationMessage = {
    fr: {
        votes: 'ont aimés votre publication',
        vote: 'a aimé votre publication',
        likes: 'ont aimés votre commentaire',
        like: 'a aimé votre commentaire',
        comments: 'ont commentés votre publication',
        comment: 'a commenté votre publication',
        commentsAnswer: 'ont répondu votre commentaire',
        commentAnswer: 'a répondu a votre commentaire',
        follows: 'ont suivis votre compte',
        follow: 'a suivi votre compte',
        post: 'a fait une nouvelle publication',
        and: 'et',
        others: 'autres'
    },
    en: {
        like: 'liked your comment',
        vote: 'liked your post',
        comment: 'commented on your post',
        commentAnswer: 'answered to your comment',
        follow: 'followed your account',
        post: 'made a new publication',
        and: 'and',
        others: 'others'
    }
};
async function getResource(notif)  {  
    if (notif.type === 'comment' || notif.type === 'like') {  
        let targedId = notif.ressource.targetId;

        if(targedId){
            var comment = await Comment.findByPk(notif.ressource.parentId,{
                include: [
                    {
                        model: User,
                        as: 'user', // Alias for the user who made the comment
                        attributes: ['id', 'fullName', 'username', 'profilePicture'],
                    },                  
                ],
            })
        }

        return {  
            id: notif.ressource.id,  
            parentComment : comment,
            targetId: notif.ressource.targetId,  
            postId: notif.ressource.postId,  
            text: `${notif.ressource.text}`  
        };  
    } else if(notif.type ==='follow'){
        return {  
            id: notif.ressourceId,    
        };
    }
    else {  
        return notif.ressource;  
    }  
} 
module.exports = { notificationMessage , getResource};