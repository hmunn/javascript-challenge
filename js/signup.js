/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/
"use strict";

//handles the DOM for the page
document.addEventListener('DOMContentLoaded', function() {
    //load states into the state selector
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

    //reveals/hides the occupation other field
    signup.addEventListener('change', function(){
        var occupationSelected = signup.elements['occupation'];
        var otherOccupation = signup.elements['occupationOther'];
    	if(occupationSelected.value == 'other'){
    		otherOccupation.style.display = 'block';
    	} else {
    		otherOccupation.style.display = 'none';
    	}
    });
    
    //handles the cancel button redirect
    var cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', function(){
    	if (window.confirm('Are you sure?')){
            window.location = 'http://www.google.com';
        }
    });

    //handles the submit button logic
    signup.addEventListener('submit', onSubmit);

});//end DOMLoaded/onReady

//onSubmit attempts to post the data from the form and calls 
//the validateForm function
function onSubmit(evt) {
    var valid = true;
    try{ valid = validateForm(this); }
    catch(err){ valid = !valid }

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
        
    //extra validation for zip field
    var zipField = form.elements['zip'];
    var zipRegExp = new RegExp('^\\d{5}$');
    if(!zipRegExp.test(zipField.value)){
        valid = false;
        zipField.className = 'form-control invalid-form';
    }
    
    //extra validation for birthdate field
    var bday = form.elements['birthdate']; 
    var bdayError = document.getElementById('birthdateMessage');
    var age = calculateAge(bday.value);
    if(age < 13){
        valid = false;
        bday.className = 'form-control invalid-form';
        bdayError.style.display = 'block';
        bdayError.innerHTML = "I am so sorry, but you must be at least 13 years old to signup."
    } else {
        bdayError.style.display = 'none';
    }

    return valid;
};//end validateForm

//validateRequiredField takes each field's data and checks to make sure the data
//is valid and fits with the described rules
function validateRequiredField(field) {
    var fieldValue = field.value;
    var isValid = true;
    fieldValue = fieldValue.trim();
    isValid = fieldValue.length > 0;
    if(isValid) {
        field.className = 'form-control';
    } else {
        field.className = 'form-control invalid-form';
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