/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/
"use strict";

//handles the DOM for the page
document.addEventListener('DOMContentLoaded', function() {

	var signup = document.getElementById('signup')
	var stateSelector = signup.elements['state'];
	var option, state;

	for(var idx = 0; idx < usStates.length; idx++) { 
        option = document.createElement('option');
        state = usStates[idx];
        option.value = state.code;
        option.innerHTML = state.name;
        stateSelector.appendChild(option);
    }

    
    signup.addEventListener('change', function(){
        var occupationSelected = signup.elements['occupation'];
        var otherOccupation = signup.elements['occupationOther'];
    	if(occupationSelected.value == 'other'){
    		otherOccupation.style.display = 'block';
    	} else {
    		otherOccupation.style.display = 'none';
    	}
    });
    
    var cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', function(){
    	if (window.confirm('Are you sure?')){
            window.location = 'http://www.google.com';
        }
    });

    signup.addEventListener('submit', onSubmit);

});//end DOMLoaded/onReady

//onSubmit attempts to post the data from the form and calls 
//the validateForm function
function onSubmit(evt) {
    var valid = true;
    try{ valid = validateForm(this); }
    catch(err){ console.log(err); }

    if (!valid) {
        var errMsg = document.getElementById('error-message');
        errMsg.innerHTML = 'Please provide values for the fields outlined in red!';
        errMsg.style.display = 'block';
    }

    if (!valid && evt.preventDefault) {
        evt.preventDefault();
    }

    evt.returnValue = valid;
    return valid;
};//end onSubmit

//validateForm collects all the fields from the form that need to be checked. 
//Each field's data is checked in validateRequiredFields
function validateForm(form) {

    var requiredFields = ['firstName','lastName','address1','city','state','zip','birthdate'];
    var valid = true;
    var occ = form.elements['occupation'];
    if(occ.value == 'other'){
        requiredFields.push('occupationOther');
    }

    for(var idx = 0; idx < requiredFields.length; idx++) {
        valid &= validateRequiredField(form.elements[requiredFields[idx]]);
    }
    
    return valid;
};//end validateForm

//validateRequiredField takes each field's data and checks to make sure the data
//is valid and fits with the described rules
function validateRequiredField(field) {
    var fieldValue = field.value;
    fieldValue = fieldValue.trim();
    var isValid = fieldValue.length > 0;
    if(isValid) {
        field.className = 'form-control';
    } else {
        field.className = 'form-control invalid';
    }
    
    //extra validation for zip field
    if(field.name === 'zip'){
        var zipRegExp = new RegExp('^\\d{5}$');
        if(!zipRegExp.test(fieldValue)){
            isValid = !isValid;
            field.className = 'form-control invalid';
        }
    }

    //extra validation for birthdate field
    if(field.name === 'birthdate'){
        var bdayError = document.getElementById('birthdateMessage');
        var age = calculateAge(fieldValue);
        if(age < 13){
            isValid = !isValid;
            field.className = 'form-control invalid';
            bdayError.style.display = 'block';
            bdayError.innerHTML = "I am so sorry, but you must be at least 13 years old to signup."
        } else {
            bdayError.style.display = 'none';
        }
    }
    return isValid;
};//end validateRequiredForm

//calculateAge takes the date provided in the birthdate field and finds how old a person
//with that birthdate would be on the current day.
function calculateAge(birthDate) {
    birthDate = new Date(birthDate);  
    var today = new Date();

    var yearsDiff = today.getFullYear() - birthDate.getUTCFullYear();
    var monthsDiff = today.getMonth() - birthDate.getUTCMonth();
    var daysDiff = today.getDate() - birthDate.getUTCDate();
    
    if (monthsDiff < 0 || (0 == monthsDiff && daysDiff < 0)) {
        yearsDiff--;
    }
    
    return yearsDiff;
};//end calculateAge