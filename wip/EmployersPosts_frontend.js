/* EmployersPosts Draft
   Name: Kenny Seng
   Date: 2/1/21
   Class: CS 340 
*/

// Generate table
function displayTable(newData){
    if(document.getElementById("employersTable")){
        document.getElementById("postTable").removeChild(document.getElementById("employersTable"));
    }

    // Table generated from database; new table needs to be made

    var listTable = document.createElement("table");
    listTable.id = "employersTable";
    listTable.style.border= "solid";
    listTable.style.borderWidth = "2px";

    // create header row and appropriate header cells
    var hRow = document.createElement("tr");

    var hEmployerID = document.createElement("th");
    var hBusinessName = document.createElement("th");
    var hEmail = document.createElement("th");
    var hPhone = document.createElement("th");
    var hAddress = document.createElement("th");
    var hCity = document.createElement("th");
    var hState = document.createElement("th");
    var hCountry = document.createElement("th");
    var hZipCode = document.createElement("th");

    var hList = [hEmployerID, hBusinessName, hEmail, hPhone, hAddress, hCity, hState, hCountry, hZipCode]

  
    // fill cells with appropriate names
    hEmployerID.textContent = "Employer ID";
    hBusinessName.textContent = "Business Name";
    hEmail.textContent = "Email";
    hPhone.textContent = "Phone";
    hAddress.textContent = "Address";
    hCity.textContent = "City";
    hState.textContent = "State";
    hCountry.textContent = "Country";
    hZipCode.textContent = "Zip Code";

    hList.forEach(self.style.border = "solid");
    hList.forEach(self.style.borderWidth = "2px");
    hList.forEach(self.style.textAlign = "center");
    hList.forEach(hRow.appendChild(self));

    //append header row to table
    listTable.appendChild(hRow);

    // fill in table with database values
    for(var i = 0; i < newData.length; i++){
        var newRow = document.createElement("tr");

        var employersID_cell = document.createElement("td");
        var businessName_cell = document.createElement("td");
        var email_cell = document.createElement("td");
        var phone_cell = document.createElement("td");
        var address_cell = document.createElement("td");
        var city_cell = document.createElement("td");
        var state_cell = document.createElement("td");
        var country_cell = document.createElement("td");
        var zipCode_cell = document.createElement("td");
        var cell_list = [employersID_cell, businessName_cell, email_cell, phone_cell, address_cell, city_cell, state_cell, country_cell, zipCode_cell]

        employersID_cell.textContent = employersData[i].employerID;
        businessName_cell.textContent = employersData[i].businessName;
        email_cell.textContent = employersData[i].email;
        phone_cell.textContent = employersData[i].phone;
        address_cell.textContent = employersData[i].address;
        city_cell.textContent = employersData[i].city;
        state_cell.textContent = employersData[i].state;
        country_cell.textContent = employersData[i].country;
        zipCode_cell.textContent = employersData[i].country;

        cell_list.forEach(self.style.border = "solid");
        cell_list.forEach(self.borderWidth = "2px");
        cell_list.forEach(self.style.textAlign = "center");
        cell_list.forEach(newRow.appendChild(self));

        var delete_cell = document.createElement("td");
        var deleteForm = document.createElement("form");
        deleteForm.method = "post";
        deleteForm.action = "";

        var hidden_id_delete = document.createElement("input");
        hidden_id_delete.type = "hidden";
        hidden_id_delete.className = "hidden_id_delete";
        hidden_id_delete.name = "id";
        hidden_id_delete.value = newData[i].id;
        deleteForm.appendChild(hidden_id_delete);


        // delete button
        var deleteButton = document.createElement("input");
        deleteButton.type = "submit";
        deleteButton.className = "deleteButton";
        deleteButton.name = "deleteButton";
        deleteButton.value = "Delete";
        deleteForm.appendChild(deleteButton);
        delete_cell.appendChild(deleteForm);
        newRow.appendChild(delete_cell);

        var update_cell = document.createElement("td");
        var updateForm = document.createElement("form");
        updateForm.method = "post";
        updateForm.action = "";

        var hidden_id_update = document.createElement("input");
        hidden_id_update.type = "hidden";
        hidden_id_update.className = "hidden_id_update";
        hidden_id_update.name = "id";
        hidden_id_update.value = newData[i].id;
        updateForm.appendChild(hidden_id_update);

        // update button
        var updateButton = document.createElement("input");
        updateButton.type = "submit";
        updateButton.className = "updateButton";
        updateButton.name = "updateButton";
        updateButton.value = "Edit";
        updateForm.appendChild(updateButton);
        update_cell.appendChild(updateForm);
        newRow.appendChild(update_cell);

        //append each new row to the table
        listTable.appendChild(newRow);
    }
    //attach table
    document.getElementById("postTable").appendChild(listTable);

}


// on load, get table generated from database
document.addEventListener("DOMContentLoaded", function(){
    var req = new XMLHttpRequest();
    req.open("GET", "http://flip2.engr.oregonstate.edu:9714/?generateTable=1", true);
    req.addEventListener("load", function(){
        if (req.status >= 200 && req.status < 400) {
            var employersTable = JSON.parse(req.responseText);
            displayTable(employersTable);
            deleteAll();
        }
        else {
            console.log("GET Request Failed!");
        }
  });
});

// add values to database via post
var el = document.getElementById('addButton');
if(el){
    el.addEventListener("click", function(event){
        var req = new XMLHttpRequest();
        var addData = {};
        addData.employerID = document.getElementById('employerID').value;
        addData.businessName = document.getElementById('businessName').value;
        addData.email = document.getElementById('email').value;
        addData.phone = document.getElementById('phone').value;
        addData.address = document.getElementById('address').value;
        addData.city = document.getElementById('city').value;
        addData.state = document.getElementById('state').value;
        addData.country = document.getElementById('country').value;
        addData.zipCode = document.getElementById('zipCode').value;
        
        addData.addButton = document.getElementById('addButton').value;

        req.open("POST", "http://flip2.engr.oregonstate.edu:9714/", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400) {
                var listTable = JSON.parse(req.responseText);
                if(listTable.badInput){
                    alert("Cannot add post without name.");
                }
                else{
                    displayTable(listTable);
                    deleteAll();
                }
            }
            else {
                console.log("POST Request Failed");
            }
      });
      req.send(JSON.stringify(addData));
      event.preventDefault();
    });
}

//remove row; wrapper prevents from re-directing to new page.
function deleteAll(){
    var deleteButtonList = document.getElementsByClassName("deleteButton");
    var hidden_id_delete_list = document.getElementsByClassName("hidden_id_delete")

    for (var i = 0; i < deleteButtonList.length; i++){
        function deleteWrapper(i) {
            deleteButtonList[i].addEventListener("click", function(event){
                var req = new XMLHttpRequest();
                var delData = {};

                req.open("POST", "http://flip2.engr.oregonstate.edu:9714/", true);
                req.setRequestHeader('Content-Type', 'application/json');

                delData.id = hidden_id_delete_list[i].value;
                delData.deleteButton = "Delete";

                req.addEventListener('load', function(){
                    if(req.status >= 200 && req.status < 400){
                        var newData = JSON.parse(req.responseText);
                        displayTable(newData);
                        deleteAll();
                    }
                    else {
                        console.log("Network Error: " + req.statusText);
                    }
                });
        req.send(JSON.stringify(delData));
        event.preventDefault();
      });
    }
    deleteWrapper(i);
  };
}


