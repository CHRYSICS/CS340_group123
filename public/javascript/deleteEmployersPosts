function deleteEmployer(employerID){
    $.ajax({
        url: '/Employers/' + employerID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePost(postID){
    $.ajax({
        url: '/Posts/' + postID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
