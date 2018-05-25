$('#btn-addFiles').click(()=>{
	$('#addFiles').toggle();
	$('#shareFiles').hide();
});

$('#btn-shareFiles').click(()=>{
	$('#addFiles').hide();
	$('#shareFiles').toggle();
});

$().ready(function(){
  $('.tab-title>a').click(function(e){
    e.preventDefault();
    var index = $(this).parent().index();
    $(this).parent().addClass('active')
         .siblings().removeClass('active')
         .parent('ul.tabs').siblings('.tabs-content').children('.content').removeClass('active')
         .eq(index).addClass('active');
  });
  $('#btn-addFiles').hide();
  $('#btn-shareFiles').hide();
  getFiles();
});

function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (25+o.scrollHeight)+"px";
}

var drop,dropName;
var files, view;
var notes, links;
var guests = [];

function getFiles()
{
	dropName = (window.location.pathname).split('/')[2];
	$.getJSON('/getFiles/'+dropName, function(result){
		drop = result;
		files = drop.files;
		notes = drop.notes;
		links = drop.links;
		guests = drop.guests;
		setViews();
	});
}

function setViews()
{
	$('.dfiles').html('');
	Media();
}

function showFiles(files, title)
{
	if(!files.length) return;

	var div = '<div class="fileList col-md-12"><div class="filesType col-md-12"><i class="fa fa-picture-o fa-2x" aria-hidden="true"></i>&nbsp;<span><b>'+title+'</b></span></div><div class="row rfiles col-md-12">';
	for(var i=0; i<files.length; i++)
	{
		var div2;
		var arr = files[i].split('.');
		var ext = (arr[arr.length-1]).toLowerCase();
		if(ext == 'jpg' || ext == '.png' || ext == 'jpeg' || ext == 'bmp' || ext == 'gif')
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><img src="/uploads/'+dropName+'/'+files[i]+'" width="200px" height="150px"></div></div>';
		
		else if(ext == 'mp3' || ext=="ogg" || ext=="wav")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-volume-up fa-4x" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-volume-up" style="font-size:20px;"aria-hidden="true"></i>&nbsp;&nbsp;'+files[i]+'</div></div></div>';
		
		else if(ext == "mp4" || ext == "webm" || ext == "mkv")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal"  data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-video-camera" aria-hidden="true" style="font-size:64px;color:red"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-video-camera" style="font-size:20px; " aria-hidden="true"></i>&nbsp;&nbsp;'+files[i]+'</div></div></div>';		
		
		else if(ext == 'pdf' || ext == 'odf')
			div2 = '<div id="pdf_'+i+'" class="fileBody" data-toggle="modal"  data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size:64px;color:red"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size:20px; color:red"></i>&nbsp;&nbsp;'+files[i]+'</div></div></div>';
		
		else if(ext== 'doc' || ext == 'docx' || ext =="txt" || ext == "html" || ext=="xml" || ext == "rtf")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-file-text"  fa-4x style="font-size:64px;color:blue;" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-file-text" style="font-size:20px; color:blue;" aria-hidden="true"></i>&nbsp;&nbsp;'+files[i]+'</div></div></div>';
		
		else
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i]+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-files-o"  fa-4x style="font-size:64px;color:blue;" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-files-o" style="font-size:20px; color:blue;" aria-hidden="true"></i>&nbsp;&nbsp;'+files[i]+'</div></div></div>';			
		div = div + div2;
	}
	div = div + '</div></div><div style="clear:both;"></div><br>';
	$('.dfiles').append(div);
}

var images = [];
var docs   = [];
var audio  = [];
var video  = [];
var others = [];
var pdf    = [];

function Media()
{
	images = [];
	docs   = [];
	audio  = [];
	video  = [];
	others = [];
	asort('fname');
	
	for(var i=0; i<files.length; i++)
	{
		arr = files[i].fname.split('.');

		switch(arr[arr.length-1].toLowerCase())
		{
			case 'jpg':
			case 'png':
			case 'jpeg':
			case 'bmp':
			case 'gif': 	images.push(files[i].fname); break;

			case 'mp3':
			case 'ogg':
			case 'wav': 	audio.push(files[i].fname); break;

			case 'mp4':
			case 'webm':
			case 'mkv': 	video.push(files[i].fname); break;

			case 'pdf':
			case 'odf': 	pdf.push(files[i].fname); break;

			case 'doc':
			case 'docx':
			case 'rtf':
			case 'txt':
			case 'html':
			case 'xml': 	docs.push(files[i].fname); break;

			default : others.push(files[i].fname); break;
		}	
	}
	var len = pdf.length;
	for(var i=0; i<docs.length; i++)
		pdf.push(docs[i]);
	showFiles(images,'Images');
	// showNotes(notes,'Notes');
	showFiles(audio, 'Audio');
	showFiles(video, 'Video');
	showFiles(pdf, 'Documents');
	showFiles(others, 'Others');
	guestOptions();
}

function guestOptions()
{
	for(var i=0; i<guests.length; i++)
	{
		switch(guests[i])
		{
			case 'addFiles':  $('#btn-addFiles').show(); break;
			case 'comments':  $('.comments').show(); break;
			case 'downloads': $('.downloads').show(); break;
			case 'share':     $('#btn-shareFiles').show(); break;
			case 'delete':    
		}
	}
}

function asort(prop)
{
	files.sort(function(a,b) {
	  if (isNaN(a[prop]) || isNaN(b[prop])) {
	    return a[prop] > b[prop] ? 1 : -1;
	  }
	  return a[prop] - b[prop];
	});
}

function dsort(prop)
{
	files.sort(function(b,a) {
	  if (isNaN(a[prop]) || isNaN(b[prop])) {
	    return a[prop] > b[prop] ? 1 : -1;
	  }
	  return a[prop] - b[prop];
	});
}

$(document).on("mouseenter", ".fileview", function() {
    var vid = "#"+this.id;
    var hid = vid.replace("fileview","fileHover");
    $(vid).hide();
    $(hid).show();
});

$(document).on("mouseleave", ".fileHover", function() {
    var hid = "#"+this.id;
    var vid = hid.replace("fileHover","fileview");
    $(vid).show();
    $(hid).hide();
});

$(document).on("click", ".download", function(event) {
	event.stopPropagation();
	alert("Oops!! haha!! lol!!\nNo download option")
});


$(document).on("click", ".fileBody", function() {
    if(this.id.search("Images")==0)
    {
    	$('.image').show();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').hide();
    	$('.modal-content').css('width','500px');
    	$('#imgsrc').attr('src','/uploads/'+dropName+'/'+images[(this.id).split('Images_')[1]]);
    }
    else if(this.id.search("Video_")==0)
    {
    	$('.image').hide();
    	$('.video').show();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').hide();
    	$('.modal-content').css('width','800px');
    	var src = '/uploads/'+dropName+'/'+video[((this.id).split('Video_'))[1]]
    	var playme = document.getElementById('playvideo');
    	playme.src=src;
    	playme.load();
    }
    else if(this.id.search("Audio_")==0)
    {
    	$('.image').hide();
    	$('.video').hide();
    	$('.audio').show();
    	$('.pdf').hide();
    	$('.doc').hide();
    	var src = '/uploads/'+dropName+'/'+audio[((this.id).split('Audio_'))[1]]
    	var playme = document.getElementById('playaudio');
    	$('.modal-content').css('width','400px');
    	playme.src=src;
    	playme.load();
    }
    else if(this.id.search("pdf")==0)
    {
    	$('.image').hide();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').show();
    	$('.doc').hide();
    	var src = '/pdfjs/web/viewer.html?file=../../../uploads/';
    	src = src + dropName+'/'+pdf[(this.id).split('pdf_')[1]];
    	$('#pdfsrc').attr('src',src);
    	$('.modal-content').css('width','840px');
    }
    else if(this.id.search("Documents")==0)
    {
    	$('.image').hide();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').show();
    	$('.modal-content').css('width','600px');
    	var fname;
		if(this.id.search("Documents")==0)
			fname = pdf[(this.id).split('Documents_')[1]];
		else
			fname = pdf[(this.id).split('Others_')[1]];
		var text = "File Name : " + fname;
    	$(".doc h4").html(text);


    }

});

$('#fileviewModal').on('hide.bs.modal', function (e) {
    $("#playvideo").attr('src','');
    $("#playaudio").attr('src','');
});

// $(document).bind("contextmenu",function(e) { 
// 	e.preventDefault();
// });

// $(document).keydown(function(e){
//     if(e.which === 123){
 
//        return false;
 
//     }
 
// });


var $fileInput = $('.file-input');
var $droparea = $('.file-drop-area');

// highlight drag area
$fileInput.on('dragenter focus click', function() {
  $droparea.addClass('is-active');
});

// back to normal state
$fileInput.on('dragleave blur drop', function() {
  $droparea.removeClass('is-active');
});

// change inner text
$fileInput.on('change', function() {
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev();

  if (filesCount === 1) {
    // if single file is selected, show file name
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
  }
});