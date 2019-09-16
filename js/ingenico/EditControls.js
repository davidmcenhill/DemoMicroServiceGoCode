/* 
 * Javascript class to create controls.
 * Requires jquery > 1.9.1
 */


/**
 * Javascript class to Add Edit Controls as follows:
 * - Find the class DMCONT that btn is contained in.
 * - Create a tickbox for each elements of class DMBOOL
 * - Create a input box for each elements of class DMTEXT
 * - Create a select for each elements of class DMSELECT. Use Ajax to get the options.
 * @param {type} btn
 * @returns none.
 */
var EditControls = function(btn) // Define EditControls class and constructor
{
   var jq = jQuery.noConflict();
   var jqEdtBtn = jq(btn);
   // Change all children of this container with class DMBOOL into tickboxes
   var cont = jqEdtBtn.parents(".DMCONT");
   cont.find(".DMBOOL").each(
               function()
               {
                  var inputBox = jq('<input>', {'type': 'checkbox', 'class': 'TMPCTRL'});
                  var el = jq(this);
                  inputBox.attr('name', el.attr('data-field_name'));
                  if (el.text() === "Y")
                  {
                     inputBox.attr('checked', '');
                  }
                  el.before(inputBox);
                  jq(this).css('visibility', 'hidden');
               }
   );	// end DMBOOL

   // Change all children of this container with class DMTEXT to input boxes
   cont.find(".DMTEXT").each(
               function()
               {
                  var inputBox = jq('<input>', {'type': 'text', 'class': 'TMPCTRL'});
                  var el = jq(this);
                  inputBox.attr('name', el.attr('data-field_name'));
                  inputBox.attr('size', el.attr('data-field_size'));
                  inputBox.attr('maxlength', el.attr('data-field_size'));
                  el.before(inputBox.val(el.text()));
                  el.css('visibility', 'hidden');
               }
   );	// end DMTEXT

   // Change all children of this container with class DMSELECT to select boxes
   cont.find(".DMSELECT").each(
               function()
               {
                  var selectBox = jq('<select>', {'class': 'TMPCTRL'});
                  var el = jq(this);
                  selectBox.attr('name', el.attr('data-field_name'));
                  jq('<option />', {value: "NUL", text: ''}).appendTo(selectBox);
                  // Get the options from the server for this select		
                  document.FORM1.I_RequestId.value = el.attr('data-field_name');
                  document.FORM1.I_ModuleScript.value = '_aidassrules.php';
                  jq.ajax(
                              {
                                 url: '_module.php',
                                 type: 'post',
                                 data: jq('form[name=FORM1]').serialize(),
                                 dataType: 'json',
                                 success: function(data)
                                 {
                                    jq.each(data, function(id, val)
                                    {
                                       jq('<option />', {value: id, text: val}).appendTo(selectBox);
                                    }); // end each
                                    console.log("val:" + el.attr('data-field-value'));
                                    selectBox.val(el.attr('data-field-value'));

                                 } // end success()
                              } // end ajax			
                  ); // end ajax
                  // NB : Caution: success function callback above is asynchronous and probably has not completed yet!
                  document.FORM1.I_ModuleScript.value = '';
                  el.before(selectBox);
                  el.css('visibility', 'hidden');
               }
   ); // end DMSELECT
   // 
   // Change all children of this container with class DMFILEUPLOAD to file upload boxes
   cont.find(".DMFILEUPLOAD").each(
               function()
               {
                  //NB: for IE8 compatibility ensure keys in JSON are quoted else JS reserved words throw an error!
                  var inputFile = jq('<input>', {'class':'TEXTBOX', 'type':'file', 'class':'TMPCTRL' });
                  var el = jq(this);

                  inputFile.attr('name', el.attr('data-field_name'));
                  inputFile.attr('size', el.attr('data-field_size'));
                  inputFile.attr('maxlength', el.attr('data-field_size'));

                  // Add the file selection textbox at the file location
                  el.before(inputFile);
                  el.css('visibility', 'hidden');
               }
   ); // end DMFILEUPLOAD
   
   // Change all children of this container with class DMID to hidden text boxes
   cont.find(".DMID").each(
               function()
               {
                  var inputBox = jq('<input>', {'type': 'hidden', 'class': 'TMPCTRL'});
                  var el = jq(this);
                  inputBox.attr('name', el.attr('data-field_name'));
                  inputBox.attr('size', el.attr('data-field_size'));
                  inputBox.attr('maxlength', el.attr('data-field_size'));
                  el.before(inputBox.val(el.text()));
               }
   ); // end DMID

}; // end constructor function EditControls
   
/**
 * Javascript class to Delete Controls created by the EditControls class
 * @param {type} btn - starting element : looks from here to parent .DMCONT and deletes in there.
 * @returns none.
 */
var DeleteControls = function(btn)
{
   var jq = jQuery.noConflict();
   var jqEdtBtn = jq(btn);
   var cont = jqEdtBtn.parents(".DMCONT");
    console.log(cont);
  cont.find(".TMPCTRL").remove(); 
   
   // Unhide the data hidden in EditControls
   cont.find(".DMTEXT, .DMBOOL, DMSELECT, DMFILEUPLOAD").css('visibility', 'visible');
}; // end constructor function DeleteControls

/**
 * Javascript class to Update data in a container.
 * Parameter values identifies each field and it's new value. In the DOM the fields are searched for
 * using the attribute data-field_name.
 * @param {type} btn - starting element : looks from here to parent .DMCONT and updates in there.
 * @param {type} values - Object containing the tag-value pairs where tag is the field name.
 * @returns none.
 */
var UpdateContainer = function(btn,values)
{
   var jq = jQuery.noConflict();
   var jqBtn = jq(btn);
   var cont = jqBtn.parents(".DMCONT");
   console.log(values);
   console.log(cont);
   jq.each(values,function(field,value)
   {
       console.log("field:" + field + " value:" + value);
       cont.find("[data-field_name='"+field+"']").text(value);
   });
 
}; // end constructor function UpdateContainer

/******** High level functions that use the classes above ********************************************/

/**
 * Edit the fields.
 * @param DOM element - Button pressed identifies fields to be edited.
 * @returns false if cancel, else submits form.
 */
function editFields(btn)
{
    var jq = jQuery.noConflict();
    var jqEdtBtn = jq(btn);
    var updateButton = jq('<button>', {'class': 'BUTTON TMPCTRL', 'type': "button"}).text('Save');
    var cancelButton = jq('<button>', {'class': 'BUTTON TMPCTRL', 'type': 'button'}).text("Cancel");
    var cont = jqEdtBtn.parents(".DMCONT");
    var ajax_script = cont.attr('data-ajax_script');
    var save_function = cont.attr('data-save_function');

    // IE8 ignores the onclick above:
    if (typeof(ajax_script) !== "undefined")
    {
        updateButton.on("click", ecUpdateFields);
    }
    else
    {
        // Use window(function name) to convert to function object:
        updateButton.on("click", window[save_function]);  
    }
    cancelButton.on("click", ecCancel);

    // Hide all buttons and checkboxes
    jq('input[type="button"]').css('visibility', 'hidden');
    jq('button').css('visibility', 'hidden');
    jq('.btn').css('visibility', 'hidden');	// Bootstrap looks like a button but actually a link
    jq('.checkbox').prop('disabled', true);


    // Add the new butons under the same parent as the Edit button:
    jqEdtBtn.parent().append(updateButton);
    jqEdtBtn.parent().append(cancelButton);

    // Create the edit controls:
    var controls = new EditControls(btn);

    return false;
}

// Cancel pressed hence remove the edit controls...
function ecCancel()
{
    var jq = jQuery.noConflict();
    var controls = new DeleteControls(this);

    // Restore the buttons hidden above
    jq('input[type="button"]').css('visibility', 'visible');
    jq('button').css('visibility', 'visible');
    jq('.btn').css('visibility', 'visible');	// Bootstrap looks like a button but actually a link
    jq('.checkbox').prop('disabled', true);
}

/**
 * Submits the changes via an Ajax call.
 */
function ecUpdateFields()
{
    var jq = jQuery.noConflict();
    var jBtn = jq(this);
    var cont = jBtn.parents(".DMCONT");
    var action_name = cont.attr('data-action_name');
    var action = cont.attr('data-action');
    var p1_name = cont.attr('data-p1_name');
    var p1_val = cont.attr('data-p1_val');
    var p2_name = cont.attr('data-p2_name');
    var p2_val = cont.attr('data-p2_val');
    var ajax_script = cont.attr('data-ajax_script');
    var params = {};
    params[action_name] = action;
    
    if ((typeof(p1_name) !== "undefined") && (typeof(p1_val) !== "undefined"))
    {
        params[p1_name] = p1_val;
    }
    if ((typeof(p2_name) !== "undefined") && (typeof(p2_val) !== "undefined"))
    {
        params[p2_name] = p2_val;
    }
    
    cont.find(".DMTEXT").each(
            function ()
            {
                var el = jq(this);
                var name = el.attr('data-field_name');
                var value = jq('input[name="' + name + '"]').val();
                params[name] = value;
            }
    );	// end DMTEXT
    //console.log(JSON.stringify(params));

    jq.ajax(
            {
                url: ajax_script, // relative to this URL
                type: 'POST',
                data: {'data': JSON.stringify(params)},
                dataType: 'json', // Of the response
                headers: {
                    'X-XSRF-TOKEN': jq('meta[name="csrf_token"]').attr('content')
                },
                success: function (data)
                {
                    // TODO - this is where you would handle the response
                    // Update row or show error message, highlight error values!
                    // Just doing this for debug:

                    jq.each(data, function (id, val)
                    {
                        //console.log("val:" + id + ':' + val);
                        if (id === 'input')
                        {
                            //console.log(jq.parseJSON(val));
                            new UpdateContainer(jBtn, jq.parseJSON(val));
                        }
                    }); // end each

                    if (action == 3)
                    {
                        // New - Need to reload the page to see the changes.
                        window.location.href = window.location.href; // GET the page again
                    }
                    else
                    {
                        // Restore the buttons hidden above
                        console.log("Restoring buttons...");
                        var controls = new DeleteControls(jBtn);
                        jq('button').css('visibility', 'visible');
                        jq('.btn').css('visibility', 'visible');	// Bootstrap looks like a button but actually a link
                        jq('.checkbox').prop('disabled', true);
                    }

                } // end success()
            } // end json			
    ); // end ajax
    // NB : Caution: success function callback above is asynchronous and probably has not completed yet!

}


