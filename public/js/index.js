var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');
var files = [];

function DropName()
{
  url = '/'+$('#drop').val();
  alert(url);
  $('#myForm').attr("action",url);
}

$fileInput.on('change', function() {
  var $textContainer = $(this).prev('.js-set-number');
  
  var tmp_files = new Array();
  tmp_files.push($(this)[0].files);
  i=0;
  while(tmp_files[0][i])
    files.push(tmp_files[0][i++]);
  var filesCount = files.length;

  if (filesCount === 1) {
    $textContainer.text($(this).val().split('\\').pop());
  } else {
    $textContainer.text(filesCount + ' files selected (Add more Files)');
  }
  //console.log(files);
});

// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});