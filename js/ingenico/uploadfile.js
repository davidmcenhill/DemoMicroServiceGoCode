/* 
 * Javascript used in the UploadedFileController (generic class for a file upload page).
 */


/**
 * Function to edit the description.
 * @param {type} editButton - button pressed identifies the condition to edit.
 * @returns {Boolean} true if okay
 */
function editDescription(editButton)
{
   var jq = jQuery.noConflict();
   var updateButton = jq('<button>', {'class': 'BUTTON TMPCTRL', 'type': "button"}).text('Update');
   var cancelButton = jq('<button>', {'class': 'BUTTON TMPCTRL', 'type': 'button'}).text("Cancel");
   var jqEdtBtn = jq(editButton);
   var cont = jqEdtBtn.parents(".DMCONT");
   var ajax_script = cont.attr('data-ajax_script');
   
   cancelButton.on("click", dmCancel);
   
    if (typeof ajax_script !== typeof undefined && ajax_script !== false) 
    {
        // Using Ajax:
        updateButton.on("click", ecUpdateFields);
    }
    else
    {
        // IE8 ignores the onclick above:
        updateButton.on("click", updateDescription);
    }

   // Hide all buttons and checkboxes
   jq('button').css('visibility', 'hidden');
   jq('.checkbox').prop('disabled', true);
   jq('.btn').css('visibility', 'hidden');	// Bootstrap looks like a button but actually a link


   // Add the new butons under the same parent as the Edit button:
   jqEdtBtn.parent().append(updateButton);
   jqEdtBtn.parent().append(cancelButton);

   // Create the edit controls:
   var controls = new EditControls(editButton);

   // Set the action and ID field
    if (typeof ajax_script === typeof undefined || ajax_script === false) 
    {
        var id = cont.find(".DMID").text();
        var inputId = jq("<input>", {'class': "textbox1", 'type': "hidden", 'name': "I_FILE_ID", 'size': "3", 'maxlength': "3"});
        jqEdtBtn.before(inputId.val(id));
    }
    
   return false;
}

/**
 * Wrapper for string trim()
 * @param {type} s
 * @returns trimmed strin
 */
function JS_Trim(s)
{
    return s.trim();
}

/**
 * Check that a string is aplpanumeric.
 * @param {string} s  string to be checked
 * @param {int} min minimum length
 * @param {int} max
 * @param {string} msg Name of the field
 * @returns {Boolean} true if s only conatains alphanumeric characters or a space.
 */
function isStringAlphaNumeric(s,min,max,msg)
{
    if ((s.length < min) || (s.length > max))
    {
        alert("Field " + msg + "must be between " + min + " and " + max + "characters long.");
        return false;
    }
    var regex = /^[a-z\d ]+$/i;
    if ( !regex.test(s))
    {
        alert("Field " + msg + "conains invalid characters.");
        return false;
    }
    return true;
}
/**
 * Submits the changes made in editDescription()
 */
function updateDescription()
{
   var jq = jQuery.noConflict();
   var i_description = jq('input[name="I_DESCRIPTION"]').val();
   if (!isStringAlphaNumeric(JS_Trim(i_description), 1, 32, "Description"))
      return false;
   document.FORM1.I_EditAction.value = 1;
   jq('.checkbox').prop('disabled', false);
   refreshPage();
}

function dmCancel()
{
   refreshPage();
}

function uploadSubmit()
{
   if (document.FORM1.I_Upload.value.length === 0)
   {
      alert("You haven't selected a file !");
      return;
   }

   document.FORM1.I_EditAction.value = 1;
   refreshPage();
}

function refreshPage()
{
    document.FORM1.submit( );
   // JS_ModuleScript(getModuleScript());
}

/**
 * Delete a file.
 * @param DOM element - Button pressed identifies file to be deleted.
 * @returns false if cancel, else submits form.
 */
function deleteFile(btn)
{
   var jq = jQuery.noConflict();
   var inputFileId = jq("<input>", {'class': "textbox1 DMID", 'type': "hidden", 'name': "I_FILE_ID", 'size': "4", 'maxlength': "4"});
   var jqBtn = jq(btn);
   var cont = jqBtn.parents(".DMCONT");
   var fid = cont.find(".DMID").text(); // Get BIN ID
   var filename = cont.find(".DMFILENAME").text(); // Get filename
   if (!confirm("This will delete " + filename + "\nConfirm ?"))
      return;
   inputFileId.val(fid);
   jqBtn.before(inputFileId);   // append would put it inside the button!
   document.FORM1.I_EditAction.value = 2;
   refreshPage();
}

/**
 * Present controls to create a new file on TMS : upload and description.
 * @param {type} newButton
 * @returns {Boolean}
 */
function newFile(newButton)
{
   var jq = jQuery.noConflict();
   var updateButton = jq('<button>', {'class': 'BUTTON', 'type': "button"}).text('Upload');
   var cancelButton = jq('<button>', {'class': 'BUTTON', 'type': 'button'}).text("Cancel");

   // IE8 ignores the onclick if you add it on creation.
   updateButton.on("click", submitNewFile);
   cancelButton.on("click", dmCancel);

   // Hide all buttons and checkboxes
   jq('button').css('visibility', 'hidden');
   jq('.checkbox').prop('disabled', true);

   // Add the new butons under the same parent as the Edit button:
   var jqEdtBtn = jq(newButton);

   // Add the new butons under the same parent as the Edit button:
   jqEdtBtn.parent().append(updateButton);
   jqEdtBtn.parent().append(cancelButton);

   // Create the edit controls:
   var controls = new EditControls(newButton);

   return false;
}

/**im
 * Submits the data from the controls created in newFile.
 * @returns {undefined}
 */
function submitNewFile()
{
   var jq = jQuery.noConflict();
   var i_description = jq('input[name="I_DESCRIPTION"]').val();
   if (!isStringAlphaNumeric(JS_Trim(i_description), 1, 32, "Description"))
      return false;

   var i_upload = jq('input[name="I_UPLOAD"]').val();
   if (i_upload.length == 0)
   {
      alert("You haven't selected a file !");
      return;      
   }
   
   document.FORM1.I_EditAction.value = 3;
   refreshPage();
}


