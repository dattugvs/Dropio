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

function showNotes(notes, title)
{
	if(!notes.length) return;

	var div = '<div class="fileList col-md-12"><div class="filesType col-md-12"><i class="fa fa-picture-o fa-2x" aria-hidden="true"></i>&nbsp;<span><b>'+title+'</b></span></div><div class="col rfiles col-md-12">';
	for(var i=0; i<notes.length; i++)
	{
		var div2;
		var timestamp = notes[i]._id.toString().substring(0,8);
		var date = new Date( parseInt( timestamp, 16 ) * 1000 );
		var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');	
		div2 = '<div class="dnotes" col-md-12" style="cursor:default;"><br><h5>'+notes[i].title+'</h5>'+notes[i].notes+'<br><br><div class="notesDetails">'+time+'<span style="display:inline-block; width: 20px;"></span><span class="comments fileBody hidden" style="border:none;" id="Notes_'+i+'" data-placement="bottom" title="Comment" data-toggle="modal" data-target="#fileviewModal"><i class="fa fa-commenting-o" style="font-size:25px;" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" id="notes_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-x" style="font-size:25px;" aria-hidden="true"></i></span></div></div>';
		div = div + div2+'<hr>';
	}
	div = div + '</div></div><br>';
	$('.dfiles').append(div);
}

function showFiles(files, title)
{
	if(!files.length) return;

	var div = '<div class="fileList col-md-12"><div class="filesType col-md-12"><i class="fa fa-picture-o fa-2x" aria-hidden="true"></i>&nbsp;<span><b>'+title+'</b></span></div><div class="row rfiles col-md-12">';
	for(var i=0; i<files.length; i++)
	{
		var div2;
		var arr = files[i].fname.split('.');
		var ext = (arr[arr.length-1]).toLowerCase();

		if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'bmp' || ext == 'gif')
		{
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><img src="/uploads/'+dropName+'/'+files[i].fname+'" width="200px" height="150px"></div></div>';
		}
		
		else if(ext == 'mp3' || ext=="ogg" || ext=="wav")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-volume-up fa-4x" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-volume-up" style="font-size:20px;"aria-hidden="true"></i>&nbsp;&nbsp;'+files[i].fname+'</div></div></div>';
		
		else if(ext == "mp4" || ext == "webm" || ext == "mkv")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal"  data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-film" aria-hidden="true" style="font-size:64px;color:red"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-film" style="font-size:20px; " aria-hidden="true"></i>&nbsp;&nbsp;'+files[i].fname+'</div></div></div>';		
		
		else if(ext == 'pdf' || ext == 'odf')
			div2 = '<div id="pdf_'+i+'" class="fileBody" data-toggle="modal"  data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size:64px;color:red"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size:20px; color:red"></i>&nbsp;&nbsp;'+files[i].fname+'</div></div></div>';
		
		else if(ext== 'doc' || ext == 'docx' || ext =="txt" || ext == "html" || ext=="xml" || ext == "rtf")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-file-text"  fa-4x style="font-size:64px;color:blue;" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-file-text" style="font-size:20px; color:blue;" aria-hidden="true"></i>&nbsp;&nbsp;'+files[i].fname+'</div></div></div>';
		
		else
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle">'+files[i].fname+'</div><div class="fileOptions"><center><span class="downloads hidden"  data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comments hidden"   data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete hidden" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></center></div></div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="fa fa-files-o"  fa-4x style="font-size:64px;color:blue;" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="fa fa-files-o" style="font-size:20px; color:blue;" aria-hidden="true"></i>&nbsp;&nbsp;'+files[i].fname+'</div></div></div>';			
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
			case 'gif': 	images.push(files[i]); break;

			case 'mp3':
			case 'ogg':
			case 'wav': 	audio.push(files[i]); break;

			case 'mp4':
			case 'webm':
			case 'mkv': 	video.push(files[i]); break;

			case 'pdf':
			case 'odf': 	pdf.push(files[i]); break;

			case 'doc':
			case 'docx':
			case 'rtf':
			case 'txt':
			case 'html':
			case 'xml': 	docs.push(files[i]); break;

			default : others.push(files[i]); break;
		}	
	}
	var len = pdf.length;
	for(var i=0; i<docs.length; i++)
		pdf.push(docs[i]);
	showNotes(notes,'Notes');
	showFiles(images,'Images');
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
			case 'comments':  $('.comments').show(); $('.dcomments').show(); break;
			case 'downloads': $('.downloads').show(); break;
			case 'share':     $('#btn-shareFiles').show(); break;
			case 'delete': 	  $('.delete').show();   
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

$(document).on("click", ".downloads", function(event) {
	event.stopPropagation();
	var fname = $($(this).parent().parent().prev()).text(); // this gets the file name from fileTitle class
	url = '/downloads/'+dropName+'/'+fname;
	var dwindow = window.open(url,'location=no');

});

$(document).on("click", ".delete", function(event) {
	event.stopPropagation();
	var fname, data={};
	var id = this.id;
	var arr = [];
	if(this.id)
	{
		arr = (this.id).split('_');
		if(arr.length == 4)
		{
			type = arr[0];
			typeId = arr[1];
			commid = comments[arr[3]]._id;
			data = {'type': type, 'typeId':typeId, 'commentId':commid};
		}
		else
		{
			id = notes[(this.id).split('notes_')[1]]._id;
			data = {'id':id};
		}
	}
	else
	{
		fname = $($(this).parent().parent().prev()).text();
		data  = {'fname':fname};
	}
	url = '/delete/'+dropName;
	$.ajax({
    type: "POST",
    url: url,
    data : data,
    success: function(data, textStatus) {
       if(data == "success")
       {
       		location.reload();
       }
       else if(data == "comments")
       {
       		$('#commentContent_'+arr[1]).remove();
       }
       else
       	alert("Curse Us!! not deleted due to some internal problem");
    }
	});
});

var comments = [];
$(document).on("click", ".fileBody", function() {
	var fname, id, type="files"; 
    if(this.id.search("Images")==0)
    {
    	$('.image').show();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').hide();
    	$('.modal-content').css('width','600px');
    	fname = images[(this.id).split('Images_')[1]].fname;
		comments = images[(this.id).split('Images_')[1]].comments;
		id = images[(this.id).split('Images_')[1]]._id;
		$('#imgsrc').attr('src','/uploads/'+dropName+'/'+fname);
    }
    else if(this.id.search("Video_")==0)
    {
    	$('.image').hide();
    	$('.video').show();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').hide();
    	$('.modal-content').css('width','800px');
    	fname = video[(this.id).split('Video_')[1]].fname;
		comments = video[(this.id).split('Video_')[1]].comments;
		id = video[(this.id).split('Video_')[1]]._id;
		var src = '/uploads/'+dropName+'/'+fname;
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
    	fname = audio[(this.id).split('Audio_')[1]].fname;
		comments =audio[(this.id).split('Audio_')[1]].comments;
		id =audio[(this.id).split('Audio_')[1]]._id;
		var src = '/uploads/'+dropName+'/'+fname;
    	var playme = document.getElementById('playaudio');
    	$('.modal-content').css('width','600px');
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
    	fname = pdf[(this.id).split('pdf_')[1]].fname;
		comments = pdf[(this.id).split('pdf_')[1]].comments;
		id = pdf[(this.id).split('pdf_')[1]]._id;
    	src = src + dropName+'/'+fname;
    	$('#pdfsrc').attr('src',src);
    	$('.modal-content').css('width','840px');
    }
    else
    {
    	$('.image').hide();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').hide();
    	$('.doc').show();
    	$('.modal-content').css('width','600px');
    	var text;
		if(this.id.search("Documents")==0)
		{
			fname = pdf[(this.id).split('Documents_')[1]].fname;
			comments = pdf[(this.id).split('Documents_')[1]].comments;
			id = pdf[(this.id).split('Documents_')[1]]._id;
			text = "<h4>File Name : " + fname+'</h4><br>';
		}
		else if(this.id.search("Others")==0)
		{
			fname = others[(this.id).split('Others_')[1]].fname;
			comments = others[(this.id).split('Others_')[1]].comments;
			id = others[(this.id).split('Others_')[1]]._id;
			text = "<h4>File Name : " + fname+'</h4><br>';
		}
		else
		{
			var note = notes[(this.id).split('Notes_')[1]];
			text = "Notes : <h5>"+note.title+'</h5>'+note.notes+'<br>';
			comments = note.comments;
			id 		 = note._id;
			type = "notes";
		}
		$(".doc div").html(text);
    }
   	

	addcomments(comments, id, type);

});

function addcomments(comments, id, type)
{
	$(".dcomments").html('');
	var div = '<div class="commentsList">';
	for(var i=0; i<comments.length; i++)
	{
		var timestamp = comments[i]._id.toString().substring(0,8);
		var date = new Date( parseInt( timestamp, 16 ) * 1000 );
		var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');
		comments[i].comment =  comments[i].comment.replace(/\r?\n/g, "<br>");
		var comm = '<div id="commentContent_'+id+'" class="commentContent"><hr><b>'+comments[i].name+'</b> :<br>'+comments[i].comment+'<br><div class="Time">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete" id="'+type+'_'+id+'_comment_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></div></div>';
		div = div + comm;
	}
	div = div + "</div>"
	$( ".dcomments" ).append(div);
	var newcomm = '<div class="newComment"><hr><textarea  class="form-control" id="comment_name" rows="1" placeholder="Give your Name (Optional)"></textarea><br><textarea  class="commentInput form-control" id="comment" onkeyup="textAreaAdjust(this)" rows="1" placeholder="Add a new comment" required></textarea><br><input type="hidden" id="comment_type" value="'+type+'"><input type="hidden" id="comment_id" value="'+id+'"><button type="button" onclick="submitNewComment()" class="btn btn-default">Add this Comment</button></div>';
	$( ".dcomments" ).append(newcomm);
}

function submitNewComment()
{
	var type = $("#comment_type").val();
	var name = $("#comment_name").val();
	var comment = $("#comment").val();
	var id = $("#comment_id").val();
	var url = '/comments/'+dropName+'/'+id;

	$.ajax({
    type: "POST",
    url: '/comments/'+dropName+'/'+id,
    data : {'name':name, 'type':type, 'comment':comment},
    success: function(data, textStatus) {
       if(data != "fail")
       {
       		var newComment =  {'_id':data, 'name':name, 'comment':comment};
       		comments.push(newComment);

       		var timestamp = newComment._id.toString().substring(0,8);
			var date = new Date( parseInt( timestamp, 16 ) * 1000 );
			var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');
			
			var i = comments.length-1;
			var comm = '<div id="commentContent_'+id+'" class="commentContent"><hr><b>'+comments[i].name+'</b> :<br>'+comments[i].comment+'<br><div class="Time">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete" id="'+type+'_'+id+'_comment_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></div></div>';
       		
       		$(".commentsList").append(comm);
       		$("#comment_name").val("");
       		$("#comment").val("");
       }
       else
       	alert("Curse Us!! Comment not added due to some internal problem");
    }
	});
}

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