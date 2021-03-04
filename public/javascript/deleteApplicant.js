function deletePerson(id){
    $.ajax({
        url: '/applicants/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("/applicants");
        }
    });
}