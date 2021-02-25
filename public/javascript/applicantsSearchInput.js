// This retrieves the correct input type for search filter
function getInputType(){
    // retrieve filter type from search filter form
    var filterForm = document.querySelector('#filterApplicants');
    var selectOp = filterForm.querySelector('select');
    var filterType = selectOp.options[selectOp.selectedIndex].value;
    
    // retrieve input type from add Applicant form that matches filterType
    var addForm = document.querySelector('#addApplicant');
    var input = addForm.querySelector('input[name="' + filterType + '"]');
    
    // clone the input element
    var InputCopy = input.cloneNode(false);
    InputCopy.setAttribute("name", "input");

    // retrieve current input element for filter form
    var oldInput = filterForm.querySelector('input[name="input"]');
    filterForm.replaceChild(InputCopy, oldInput);
}

