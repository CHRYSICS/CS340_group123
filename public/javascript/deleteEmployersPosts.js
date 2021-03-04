function deleteEmployer(employerID){
    $.ajax({
        url: '/employers/' + employerID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePost(postID){
    $.ajax({
        url: '/posts/' + postID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
