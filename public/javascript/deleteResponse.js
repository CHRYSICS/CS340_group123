function deleteResponse(postID, resumeID){
    $.ajax({
        url: '/responses/delete/' + postID + '/' + resumeID,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/responses");
        }
    });
}