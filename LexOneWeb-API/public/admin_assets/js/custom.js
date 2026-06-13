 // profile upload start
 $(document).ready(function(){
    // Prepare the preview for profile picture
    $("#wizard-picture").change(function(){
      readURL(this);
    });
  });

 function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$(document).ready(function(){
    // Prepare the preview for profile picture
    $("#wizard-picture-add").change(function(){
      readURLADD(this);
    });
  });


$(document).ready(function(){
  $("#cityChange").hide();
  $("#CountryChange").hide();
  $("#countryId").click(function(){
    $("#CountryEdit").hide();
    $("#CountryChange").show();
  });
  $("#countryId").change(function(){
    $("#cityEdit").attr('disabled', true).trigger("liszt:updated");
    $("#cityEdit").hide();
    $("#cityChange").show();
  });
});


function readURLADD(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#wizardPicturePreviewAdd').attr('src', e.target.result).fadeIn('slow');
    }
    reader.readAsDataURL(input.files[0]);
  }
}
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});

// Booking status
$("select[name='status']").change(function(){
  var statusId = $(this).val();
  var token = $("input[name='_token']").val();
  var ajaxURL = $("#ajax_url").attr('url');
  $("#element").hide();
  if(statusId){
    $.ajax({
      url: ajaxURL,
      method: 'GET',
      data: {statusId:statusId, _token:token},
      success: function(data) {
        $(".status_sorting").html('');
        $(".status_sorting").html(data.html);
      }
    }); 
  }
});

// add service
$("select[name='service_category_parent']").change(function(){
  var categoryId = $(this).val();
  var token = $("input[name='_token']").val();
  var ajaxURL = $("#ajax_url").attr('url');
  $("#element").hide();
  if(categoryId){
    $.ajax({
      url: ajaxURL,
      method: 'POST',
      data: {category_id:categoryId, _token:token},
      success: function(data) {
        $(".advanced_service_sec").html('');
        $(".advanced_service_sec").html(data.html);
      }
    }); 
  }
});

$(document).on('click', '.toggle-password', function() {
  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $(".pass_log_id");
  input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
});


// category document details
$(document).ready(function () {
  $("#details").hide();
  $("#more").click(function(){
    $("#details").slideToggle(250);
  });
});
$(document).ready(function () {
  // $("#morecategories").hide();
  $("#RTL").click(function(){
    $("#morecategories").slideToggle(250);
  });
});


  // image validations
  $( "#wizard-picture").change(function() {
    var fileInput =  
    document.getElementById('wizard-picture'); 
    var filePath = fileInput.value; 
    // Allowing file type 
    var allowedExtensions =  
    /(\.jpg|\.jpeg|\.png)$/i; 
    if (!allowedExtensions.exec(filePath)) { 
      alert('Please upload an Image');  
      fileInput.value = ''; 
      return false; 
    }  
  });

// switch language
$( "#language-selector" ).change(function() {
  var lang = $("#language-selector").val();
  window.location = baseURL + "/switchlang/" + lang;
});

$(document).ready(function() {
  $("input[type=number]").on("focus", function() {
    $(this).on("keydown", function(event) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        event.preventDefault();
      }
    });
  });
});

// ck multiple editors
if( $('#editor1').length )  {

  ClassicEditor
  .create(document.querySelector('#editor1'), {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
  })
  .then(editor => {
    window.editor = editor;
  })
  .catch(err => {
      // console.error(err.stack);
    });
}

if($('#editor2').length )  {

  ClassicEditor
  .create(document.querySelector('#editor2'), {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
  })
  .then(editor => {
    window.editor = editor;
  })
  .catch(err => {
      // console.error(err.stack);
    });

}

if($('#editor3').length )  {

  ClassicEditor
  .create(document.querySelector('#editor3'), {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
  })
  .then(editor => {
    window.editor = editor;
  })
  .catch(err => {
      // console.error(err.stack);
    });
}


function updateCurrencyCode(){
  var countryDetails = $('#currency-currencydetails').val();
  var details = countryDetails.split("-");
  $('#currency-currencysymbol').val(details[0]);
  $('#currency-currencyname').val(details[1]);
  $('#currency-currencycode').val(details[2]);
  var autoUdt=$('#autoUdt').val();
  var ajaxURL = $("#ajax_url").attr('url');
  var token = $("input[name='_token']").val();
  //if(autoUdt==1){
    var currencyCode=details[2];
    if(currencyCode!=""){
       $.ajax({
        type : 'POST',
        url : ajaxURL,
           async: false,
        data : { currency : currencyCode, _token: token },
      success : function(data) 
        { 
          if(data=="") { $("#currency-price").removeAttr("readonly"); }
          else { $("#currency-price").attr("readonly", "readonly"); }
          $('#currency-price').val(data);
        }
      });
     }
  // }
}



$('#role_name').keypress(function(e) {
  var tval = $('#role_name').val(),
      tlength = tval.length,
      set = 30,
      remain = parseInt(set - tlength);
  $('p').text(remain);
  if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
      $('#role_name').val((tval).substring(0, tlength - 1));
      return false;
  }
})

$('#appVersion').keypress(function(e) {
  var tval = $('#appVersion').val(),
      tlength = tval.length,
      set = 6,
      remain = parseInt(set - tlength);
  $('p').text(remain);
  if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
      $('#appVersion').val((tval).substring(0, tlength - 1));
      return false;
  }
});

//Add categories form validations.
$(document).ready(function () {
  $('#form_categories').on('submit', function() {

    let arabicName = $("input[name=arabicName]").val(), frenchName = $("input[name=frenchName]").val();
    if( arabicName == '' || frenchName == '' ){
      $('<p class="text-danger">Please enter categories for french and arabic languages.</p>').insertBefore('#morecategories').show().delay(5000).fadeOut();
      return false;
    }

    let count = new Array();
    $('div.ck-content').each(function (index, item) {
      let htmlcontent = $(item).html();
      if( htmlcontent == '<p><br data-cke-filler="true"></p>'){
        count[index] = index;
      }
    });

    if(count.length > 0){
      $('<p class="text-danger">Please enter contents for french and arabic languages.</p>').insertBefore('#collapsear').show().delay(5000).fadeOut();
      return false;
    }
    
    });
  });

  //Stripe cards keypress events
  $(document).ready(function () {
    //called when key is pressed in textbox
    $("#stripe_year, #stripe_card, #stripe_cvc").keypress(function (e) {
       //if the letter is not digit then display error and don't type anything
       if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
          return false;
      }
     });
    $("#stripe_month").keypress(function (e) {
       //if the letter is not digit then display error and don't type anything
     if (this.value.length == 0 && e.which == 48 ){
        return false;
     }
      else if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
          return false;
      }
     });
  });

  //Payout days validations.
  $(document).ready(function () {
    $("#payout_date").keypress(function (e) {
      if(5 < this.value.length) {
        return false;
      }
    });
  });

