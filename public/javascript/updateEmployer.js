function updateEmployer(employerID){
    $.ajax({
        url: '/employers/' + employerID + '/update',
        type: 'PUT',
        data: $('#update-employer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
