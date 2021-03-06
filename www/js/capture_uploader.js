function getBrowser(target, dataDir) {
  dataDir = dataDir || 'temp_chrome_user_data_dir_for_cordova';
  var chromeArgs = ' --user-data-dir=/tmp/' + dataDir + ' --disable-web-security';
}

var r = new Resumable({
    target:ruta_generica+'/api/v1/video_upload',
    chunkSize:1*1024*1024,
    simultaneousUploads:4,
    testChunks:false,
    throttleProgressCallbacks:1
});
var inspection_id;
var catalogo_id;
function captureVideo(inspection_id, catalogo_id){
  inspection_id = inspection_id;
  catalogo_id = catalogo_id;
  try{
      navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
  }catch(e){
      console.log(e);
  }
}

function captureSuccess(file)
{
  var tmp_video = "<video width='50%' controls='controls'>";
  tmp_video += "<source src='" + file[0].fullPath + "' type='video/mp4'>";
  tmp_video += "</video>";
  $("#"inspection_id+catalogo_id).append(tmp_video);

  r.addFile(file);
}

function captureError(error) {
  var msg = "capture error: "+JSON.stringify(error);
  navigator.notification.alert(msg, null, 'Take a video, try again.');
  loadUrl();
}

// Resumable.js isn't supported, fall back on a different method
if(!r.support) {
  $('.resumable-error').show();
} else {
  // Show a place for dropping/selecting files
  $('.resumable-drop').show();
  r.assignDrop($('.resumable-drop')[0]);
  r.assignBrowse($('.resumable-browse')[0]);
  console.log(r);
  // Handle file add event
  r.on('fileAdded', function(file){
    console.log("r.on('fileAdded', function(file");
          // Show progress pabr
      $('.resumable-progress, .resumable-list').show();
      // Show pause, hide resume
      $('.resumable-progress .progress-resume-link').hide();
      $('.resumable-progress .progress-pause-link').show();
      // Add the file to the list
      $('.resumable-list').append('<li class="resumable-file-'+file.uniqueIdentifier+'">Uploading <span class="resumable-file-name"></span> <span class="resumable-file-progress"></span>');
      $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-name').html(file.fileName);
      // Actually start the upload
      r.upload();
    });
  r.on('pause', function(){
    console.log("r.on('pause', function(");
    // Show resume, hide pause
      $('.resumable-progress .progress-resume-link').show();
      $('.resumable-progress .progress-pause-link').hide();
    });
  r.on('complete', function(){
    console.log("r.on('complete', function(");
    // Hide pause/resume when the upload has completed
      $('.resumable-progress .progress-resume-link, .resumable-progress .progress-pause-link').hide();
    });
  r.on('fileSuccess', function(file,message){
    console.log("r.on('fileSuccess', function(file,message");
    // Reflect that the file upload has completed
      $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(completed)');
    });
  r.on('fileError', function(file, message){
    console.log("r.on('fileError', function(file, message");
    // Reflect that the file upload has resulted in error
      $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html('(file could not be uploaded: '+message+')');
    });
  r.on('fileProgress', function(file){
    console.log("r.on('fileProgress', function(file");
    // Handle progress for both the file and the overall upload
      $('.resumable-file-'+file.uniqueIdentifier+' .resumable-file-progress').html(Math.floor(file.progress()*100) + '%');
      $('.progress-bar').css({width:Math.floor(r.progress()*100) + '%'});
    });
  r.on('cancel', function(){
    console.log("r.on('cancel', function(");

    $('.resumable-file-progress').html('canceled');
  });
  r.on('uploadStart', function(){
    console.log("r.on('uploadStart', function(");
    // Show pause, hide resume
      $('.resumable-progress .progress-resume-link').hide();
      $('.resumable-progress .progress-pause-link').show();
  });
}
