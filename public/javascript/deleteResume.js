function deleteResume(id){
    $.ajax({
        url: '/resumes/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/resumes");
        }
    });
}

function deleteResumeForApplicant(resumeID, applicantID){
    $.ajax({
        url: '/resumes/' + resumeID,
        type: 'DELETE',
        success: function(result){
            window.location.replace('/applicantInfo/' + applicantID);
        }
    });
}