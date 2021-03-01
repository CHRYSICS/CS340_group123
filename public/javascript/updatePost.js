function updatePost(postID){
    $.ajax({
        url: '/posts/' + postID,
        type: 'PUT',
        data: $('#update-post').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
