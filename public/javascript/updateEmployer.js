function updateEmployer(employerID){
    $.ajax({
        url: '/Employers/' + employerID,
        type: 'PUT',
        data: $('#update-employer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
