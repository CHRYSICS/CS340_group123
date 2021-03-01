function updateApplicant(applicantID){
    $.ajax({
        url: '/applicantInfo/' + applicantID + '/update',
        type: 'PUT',
        data: $('#update-applicant').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    });
}
