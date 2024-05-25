function buildCommentNode(comment) { 
    return {
        id : comment.id,
        text : comment.text,
        postId:comment.postId,
        userId:comment.userId,
        parentID:comment.parentID,
        children : []
    }
 }


 function buildCommentNodeTree(comments) {
    const commentTree = {};
    const commentNodes = {};

    // Build each comment to predisposed to be nested or being the one which nest others with his children (EACH  COMMENT MIGHT BE A PARENT OR A CHILD)
    comments.forEach(comment => {
       commentNodes[comment.id] = buildCommentNode(comment);
    });

    // for each comment check if it is the top level comment (comment without parent)
    comments.forEach(comment => {
        const node = commentNodes[comment.id]

        if(!comment.parentID){

            commentTree[comment.id] = node
            
        }else{
            // If there's a parentID, add this node to the parent's children array (if u dont undertand how , u definitly gotta learn again notion of pointer and references)
            const parentNode = commentNodes[comment.parentID];
            if (parentNode) {
                parentNode.children.push(node);
            }
        }
     });
    //  We return the commentTree
    return commentTree;
 }

 module.exports = buildCommentNodeTree;