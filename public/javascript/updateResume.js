function updateResume(resumeID){
    $.ajax({
        url: '/resumes/' + resumeID + '/update',
        type: 'PUT',
        data: $('#update-resumes').serialize(),
        success: function(result){
            window.location.replace("../");
        }
    });
}