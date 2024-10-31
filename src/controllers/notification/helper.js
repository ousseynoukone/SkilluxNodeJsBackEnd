var notificationMessage = {
    fr: {
        votes: 'ont aimés votre publication',
        vote: 'a aimé votre publication',
        likes: 'ont aimés votre commentaire',
        like: 'a aimé votre commentaire',
        comments: 'ont commentés votre publication',
        comment: 'a commenté votre publication',
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
        follow: 'followed your account',
        post: 'made a new publication',
        and: 'and',
        others: 'others'
    }
};
function getResource(notif) {  
    if (notif.type === 'comment' || notif.type === 'like') {  
        return {  
            id: notif.ressource.id,  
            postId: notif.ressource.postId,  
            text: `${notif.ressource.text}`  
        };  
    } else if(notif.type ==='follow'){
        console.log(notif)
        return {  
            id: notif.ressourceId,    
        };
    }
    else {  
        return notif.ressource;  
    }  
} 
module.exports = { notificationMessage , getResource};