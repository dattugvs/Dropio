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
var folderName;
var role, shared;

function getFiles()
{
	dropName = (window.location.pathname).split('/')[2];
	drop = JSON.parse($('.dropcontentList').html());
	files = drop.files;
	notes = drop.notes;
	links = drop.links;
	guests = drop.guests;
	role   = $('.userRole').html();
	folderName = drop['parentDrop'];
	if(!folderName)
		folderName = drop.drop;
	shared = drop.shared;
	Media();
}

function showNotes(notes, title)
{
	if(!notes.length) return;
	var div = '<div class="fileList col-md-12"><div class="filesType col-md-12"><span><b>'+title+'</b></span></div><div class="col rfiles col-md-12">';
	for(var i=0; i<notes.length; i++)
	{
		var div2;
		var timestamp = notes[i]._id.toString().substring(0,8);
		var date = new Date( parseInt( timestamp, 16 ) * 1000 );
		var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');	
		alert(notes[i].notes);
		div2 = '<div class="dnotes" col-md-12" style="cursor:default;"><br><h5>'+notes[i].title+'</h5>'+notes[i].notes+'<br><br><div class="notesDetails">'+time+'<span style="display:inline-block; width: 20px;"></span><span class="comments fileBody hidden" style="border:none;" id="Notes_'+i+'" data-placement="bottom" title="Comment" data-toggle="modal" data-target="#fileviewModal"><i class="fa fa-commenting-o" style="font-size:25px;" aria-hidden="true"></i></span><span style="display:inline-block; width: 30px;"></span><span class="delete hidden" id="notes_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete Notes"><i class="fa fa-trash-o fa-x" style="font-size:25px;" aria-hidden="true"></i></span></div></div>';
		div = div + div2+'<hr>';
	}
	div = div + '</div></div><br>';
	$('.dfiles').append(div);
}

function showFiles(title, files)
{
	if(!files.length) return;

	var div = '<div class="fileList col-md-12"><div class="filesType col-md-12"><i class="fa fa-picture-o fa-2x" aria-hidden="true"></i>&nbsp;<span><b>'+title+'</b></span></div><div class="row rfiles col-md-12">';
	
	for(var i=0; i<files.length; i++)
	{
		var div2;
		var checkbox = '<center><label class="checkbox"><input type="checkbox" name="fileSelect" value = "'+files[i].fname+'"><span class="checkmark"></span></label></center>';
		var sharebox = '<br><div class="shareBox hidden" id="box_'+i+'">'+checkbox+'</div><br>'; 
		var fname = files[i].fname.substring(files[i].fname.indexOf("/")+1, files[i].fname.length);
		var fileOptions = '<div class="col-md-12 fileOptions"><center><div class="row"><div class="downloads hidden col"><span data-toggle="tooltip" data-placement="bottom" title="Download"><i class="fa fa-arrow-circle-o-down fa-2x" aria-hidden="true"></i></span></div><div class="comments col"><span  data-toggle="tooltip" data-placement="bottom" title="Comment"><i class="fa fa-commenting-o fa-2x" aria-hidden="true"></i></span></div><div class="delete hidden col"><span data-toggle="tooltip" data-placement="bottom" title="Delete File"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></div></div></center></div>';
		var icon;
		switch(title)
		{
			case "Audio": 			icon = "fa fa-volume-up"; break;
			case "Video": 			icon = "fa fa-film"; break;
			case "PDF"  : 			icon = "fa fa-file-pdf-o"; break;
			case "Application" : 	icon = "fa fa-files-o"; break;
			case "Text" : 			icon = "fa fa-files-o"; break;
			case "Others": 			icon = "fa fa-files-o";
		}
		if(title == "Images")
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle hidden">'+files[i].fname+'</div>'+fileOptions+'</div><div id="fileview_'+title+'_'+i+'" class="fileview"><img src="/uploads/'+folderName+'/'+files[i].fname+'" width="200px" height="150px"></div></div>';
		else
		{
			div2 = '<div id="'+title+'_'+i+'" class="fileBody" data-toggle="modal" data-target="#fileviewModal"><div id="fileHover_'+title+'_'+i+'" class="fileHover hidden"><div class="fileTitle hidden">'+files[i].fname+'</div>'+fileOptions+'</div><div id="fileview_'+title+'_'+i+'" class="fileview"><center><br><i class="'+icon+' fa-4x" aria-hidden="true"></i></center><div class="preview">&nbsp;&nbsp;<i class="'+icon+'" style="font-size:20px;"aria-hidden="true"></i>&nbsp;&nbsp;'+fname+'</div></div></div>';
		}
		div = div +'<div class="file">'+sharebox+div2+'</div>';
	}
	div = div + '</div></div><div style="clear:both;"></div><br>';
	$('.dfiles').append(div);
}

var images = [],
	audio  = [],
	video  = [],
	others = [],
	application = [],
	text = [],
	pdf = [];

function Media()
{
	asort('fname');
	$('.dfiles').html('');
	for(var i=0; i<files.length; i++)
	{
		var type = files[i].fname.substring(0,files[i].fname.indexOf("/"))

		switch(type)
		{
			case 'image' 		: images.push(files[i]); break;
			case 'audio' 		: audio.push(files[i]); break;
			case 'video' 		: video.push(files[i]); break;
			// case 'pdf' 		: pdf.push(files[i]); break;
			case 'text' 	 	: text.push(files[i]); break;
			case 'application'  : application.push(files[i]); break; 	
			default  			: others.push(files[i]); break;
		}
	}
	showNotes(notes,'Notes'); // displays all notes
	showFiles("Images", images);
	showFiles("Audio", audio);
	showFiles("Video", video);
	showFiles("PDF", pdf);
	showFiles("Text", text);
	showFiles("Application", application);
	showFiles("Others", others);
	showSharedDrops(shared);
	//alert(role);
	checkboxList(guests);
	if(role == "guest")
		guestOptions(guests);
	else
		guestOptions(['addFiles', 'comments', 'downloads', 'share', 'delete']);
}

function checkboxList(guests)
{
	console.log(guests);
	for(var i=0; i<guests.length; i++)
	{
		$('#guest_'+guests[i]).prop('checked', true);	
	}
}

function showSharedDrops(shared)
{
	var head = "<br><h4>Shared Drops</h4>";
	$( ".shared" ).append(head);
	var ol = '<ol class="sharedList">';
	for(var i=0; i<shared.length; i++)
	{
		var li = '<li><a target="_blank" href="http://ec2-18-219-6-249.us-east-2.compute.amazonaws.com:3000/drop.io/'+shared[i]+'"><div>'+shared[i]+'</div></a></li>';
		ol = ol + li;
	}
	ol = ol + '</ol>'
	$( ".shared" ).append(ol);
}

function guestOptions(permissions)
{
	for(var i=0; i<permissions.length; i++)
	{
		switch(permissions[i])
		{
			case 'addFiles':  $('#guest_'+permissions[i]).prop('checked', true); $('#btn-addFiles').show(); $('.addFilesbox').show();  break;
			case 'comments':  $('.dcomments').show(); $('.comments').show(); $('#newComment').show(); break;
			case 'downloads': $('.downloads').show(); $('.downloadsbox').show();  break;
			case 'share':     $('#btn-shareFiles').show();  break;
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
	var fname = $($(this).parent().parent().parent().prev()).text(); // this gets the file name from fileTitle hidden class
	url = "/downloads";
	var data = {};
	alert(drop.drop);
	data['drop'] = drop.drop;
	data['file'] = folderName+'/'+fname;
	$.ajax({
    type: "POST",
    url: url,
    data : data,
    success: function(data, textStatus) {
    	console.log(data);
       if(data == "error")
       		showNotification("Error : File Not Found !!");
       else
       	window.open(data,'_blank');
	}
	});
});

$(document).on("click", ".delete", function(event) {
	event.stopPropagation();
	var fname, data={};
	var id;
	var arr = [];
	if(this.id)
	{
		alert(this.id);
		arr = (this.id).split('_');
		if(arr.length == 4)
		{
			type = arr[0];
			typeId = arr[1];
			commid = comments[arr[3]]._id;
			data = {'type': type, 'typeId':typeId, 'commentId':commid};
			//alert(arr);
		}
		else
		{
			id = notes[(this.id).split('notes_')[1]]._id;
			data = {'id':id};
		}
	}
	else
	{
		fname = $($(this).parent().parent().parent().prev()).text();
		alert(fname);
		data  = {'fname':fname}
	}
	url = '/delete/'+dropName;
	$.ajax({
    type: "POST",
    url: url,
    data : data,
    success: function(data, textStatus) {
       alert(data);
       if(data == "success" || data == "reload")
       		location.reload();
       else if(data == "comments")
       {
       		comments[arr[3]] = "";
       		alert('#commentContent_'+arr[3]);
       		$('#commentContent_'+arr[3]).remove();
       		showNotification("Comment Deleted");
       }
       else
       		alert("Curse Us!! not deleted due to some internal problem");
    }
	});
});

var comments = [];
$(document).on("click", ".fileBody", function() {
	var fname, id, type="files"; 
	alert(this.id);
	if(this.id.search("Images_")==0)
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
		$('#imgsrc').attr('src','/uploads/'+folderName+'/'+fname);
		// var url = '/uploads/'+folderName+'/'+fname;
		// $('.image').css("background-image", "url("+url+")");
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
		var src = '/uploads/'+folderName+'/'+fname;
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
		var src = '/uploads/'+folderName+'/'+fname;
    	var playme = document.getElementById('playaudio');
    	$('.modal-content').css('width','600px');
    	playme.src=src;
    	playme.load();

    }
    else if(this.id.search("PDF_")==0)
    {
    	$('.image').hide();
    	$('.video').hide();
    	$('.audio').hide();
    	$('.pdf').show();
    	$('.doc').hide();
    	var src = '/pdfjs/web/viewer.html?file=../../../uploads/';
    	fname = pdf[(this.id).split('PDF_')[1]].fname;
		comments = pdf[(this.id).split('PDF_')[1]].comments;
		id = pdf[(this.id).split('PDF_')[1]]._id;
    	src = src + dropName+'/'+fname;
    	$('#pdfsrc').attr('src',src);
    	$('.modal-content').css('width','840px');
    }
    else if(this.id.search("text_")==0)
    {
  //   	$('.image').hide();
  //   	$('.video').hide();
  //   	$('.audio').hide();
  //   	$('.pdf').show();
  //   	$('.doc').hide();
  //   	var src = '/pdfjs/web/viewer.html?file=../../../uploads/';
  //   	fname = pdf[(this.id).split('Text_')[1]].fname;
		// comments = pdf[(this.id).split('Text_')[1]].comments;
		// id = pdf[(this.id).split('Text_')[1]]._id;
  //   	src = src + dropName+'/'+fname;
  //   	$('#pdfsrc').attr('src',src);
    	$('.modal-content').css('width','400px');
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
		if(this.id.search("Application_")==0)
		{
			fname = application[(this.id).split('Documents_')[1]].fname;
			comments = application[(this.id).split('Documents_')[1]].comments;
			id = application[(this.id).split('Documents_')[1]]._id;
			text = "<h4>File Name : " + fname+'</h4><br>';
		}
		else if(this.id.search("Others_")==0)
		{
			fname = others[(this.id).split('Others_')[1]].fname;
			comments = others[(this.id).split('Others_')[1]].comments;
			id = others[(this.id).split('Others_')[1]]._id;
			text = "<h4>File Name : " + fname+'</h4><br>';
		}
		else
		{
			var note = notes[(this.id).split('Notes_')[1]];
			text     = "Notes : <h5>"+note.title+'</h5>'+note.notes+'<br>';
			comments = note.comments;
			id 		 = note._id;
			type     = "notes";
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
		if(comments[i] == "")
			continue;
		var timestamp = comments[i]._id.toString().substring(0,8);
		var date = new Date( parseInt( timestamp, 16 ) * 1000 );
		var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');
		comments[i].comment =  comments[i].comment.replace(/\r?\n/g, "<br>");
		var comm = '<div id="commentContent_'+i+'" class="commentContent"><hr><b>'+comments[i].name+'</b> :<br>'+comments[i].comment+'<br><div class="Time">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete" id="'+type+'_'+id+'_comment_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></div></div>';
		div = div + comm;
	}
	div = div + "</div>"
	$( ".dcomments" ).append(div);
	var newcomm;
	if(role == "admin")
		newcomm = '<div class="newComment"><hr><textarea  class="form-control" id="comment_name" rows="1" placeholder="Give your Name (Optional)"></textarea><br><textarea  class="commentInput form-control" id="comment" onkeyup="textAreaAdjust(this)" rows="1" placeholder="Add a new comment" required></textarea><br><input type="hidden" id="comment_type" value="'+type+'"><input type="hidden" id="comment_id" value="'+id+'"><button type="button" onclick="submitNewComment()" class="btn btn-default">Add this Comment</button></div>';
	$( ".dcomments" ).append(newcomm);
}

function submitNewComment()
{
	var type = $("#comment_type").val();
	var name = $("#comment_name").val();
	if(name.length == 0)
	{
		name = "Anonymous";
	}
	var comment = $("#comment").val();
	alert(comment);
	if(comment.length ==0)
	{
		showNotification("Please Add a Comment !!");
		$("#comment").focus();
		return false;
	}
	var id = $("#comment_id").val();
	//alert(id);
	var url = '/comments/'+dropName+'/'+id;

	$.ajax({
    type: "POST",
    url: url,
    data : {'name':name, 'type':type, 'comment':comment},
    success: function(data, textStatus) {
    	if(data == "permission")
    		showNotification("Error : Permission Denied !!");
    	if(data == "error")
    		showNotification("Oops, Internal problem !!");
       else
       {
       		var newComment =  {'_id':data, 'name':name, 'comment':comment};
       		comments.push(newComment);

       		var timestamp = newComment._id.toString().substring(0,8);
			var date = new Date( parseInt( timestamp, 16 ) * 1000 );
			var time = moment(date).format('ddd DD-MM-YYYY hh:mm A');
			
			var i = comments.length-1;
			var comm = '<div id="commentContent_'+i+'" class="commentContent"><hr><b>'+comments[i].name+'</b> :<br>'+comments[i].comment+'<br><div class="Time">'+time+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="delete" id="'+type+'_'+id+'_comment_'+i+'" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></span></div></div>';
       		
       		$(".commentsList").append(comm);
       		$("#comment_name").val("");
       		$("#comment").val("");
       		showNotification("New Comment Added !!");
       }
    }
	});

}

$('#fileviewModal').on('hide.bs.modal', function (e) {
    $("#playvideo").attr('src','');
    $("#playaudio").attr('src','');
});

$(document).on('click', '#selectFiles', function(event){ event.stopPropagation(); $('.file .shareBox').toggle()});

$(document).on('click', '#emailFiles', function(event){
	event.stopPropagation();
	var files = [];
	var guests = [];
	var data = {};
	var to = $("input[name='email']").val();
	data['to'] = to;
	data['guestsPwd'] = $('#sharepwd').val();
	$("#sharableLink").html('');
	$("input[name='fileSelect']:checked").each( function () {
		var temp = {};
		temp['fname'] = $(this).val();
		files.push(temp);
	});

	$("input[name='guests']:checked").each( function () {
		
		guests.push($(this).val());
	});

	files = JSON.stringify(files);
	guests = JSON.stringify(guests);
	data['files']=files;
	data['guests'] = guests;
	console.log(data);
	url = '/shareFiles/'+dropName;
	$.ajax({
    type: "POST",
    url: url,
    data : data,
    success: function(data, textStatus) {
    	$('.file .shareBox').hide();
    	$('.sharableLink').show();
    	$("#sharableLink").html(data);
    	var id = data.split('http://ec2-18-219-6-249.us-east-2.compute.amazonaws.com:3000/drop.io/')[1];
    	shared.push(id);
    	$('.shared .sharedList').append('<li><a target="_blank" href="'+id+'"><div>'+id+'</div></a></li>');
    }
	});
});

$(document).on('click','#sharableLink', function() {
	  $(this).select();
	  document.execCommand("copy");
	  showNotification("URL Copied");
});

$('.close').on('click', () => {
	$('.notification').hide();
});

function showNotification(msg)
{
	$('.notification').show();
	$('#notifyMsg').html(msg);
	setTimeout(function() {$('.notification').hide()}, 3000);

}

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