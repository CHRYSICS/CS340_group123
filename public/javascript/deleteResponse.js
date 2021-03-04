function deleteResponse(postID, resumeID){
    $.ajax({
        url: '/responses/delete/' + postID + '/' + resumeID,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/responses");
        }
    });
}

function deleteResponseForPost(postID, resumeID){
    $.ajax({
        url: '/responses/delete/' + postID + '/' + resumeID,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/postInfo/" + postID);
        }
    });
}