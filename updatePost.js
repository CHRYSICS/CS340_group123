function updatePost(postID){
    $.ajax({
        url: '/Posts/' + postID,
        type: 'PUT',
        data: $('#update-post').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
