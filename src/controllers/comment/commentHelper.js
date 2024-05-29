function buildCommentNode(comment) {
    return {
      id: comment.id,
      text: comment.text,
      postId: comment.postId,
      userId: comment.userId,
      parentID: comment.parentID,
      children: []
    };
  }
  
  function countChildren(node) {
    let count = node.children.length;
    for (const child of node.children) {
      count += countChildren(child);
    }
    return count;
  }
  
  function buildCommentNodeTree(comments) {
    const commentTree = {};
    const commentNodes = {};
  
    // Build each comment node
    comments.forEach(comment => {
      commentNodes[comment.id] = buildCommentNode(comment);
    });
  
    // For each comment, check if it is a top-level comment
    comments.forEach(comment => {
      const node = commentNodes[comment.id];
      if (!comment.parentID) {
        commentTree[comment.id] = node;
      } else {
        // If there's a parentID, add this node to the parent's children array
        const parentNode = commentNodes[comment.parentID];
        if (parentNode) {
          parentNode.children.push(node);
        }
      }
    });
  
    return commentTree;
  }


  function buildParentNodeWithChildrenNumber(comments) {
    const commentTree = buildCommentNodeTree(comments);
    const parentNodes = {};
  
    // Iterate over the top-level comments
    for (const topLevelComment of Object.values(commentTree)) {
      const parentNode = {
        id: topLevelComment.id,
        text: topLevelComment.text,
        postId: topLevelComment.postId,
        userId: topLevelComment.userId,
        childrenCount: countChildren(topLevelComment)
      };
      parentNodes[topLevelComment.id] = parentNode;
    }
  
    return parentNodes;
  }

 function buildChildNode(){

 }
 
  
  module.exports = {buildCommentNodeTree,buildParentNodeWithChildrenNumber};