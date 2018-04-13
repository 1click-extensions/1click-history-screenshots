function byteCount(s) {
  return encodeURI(s).split(/%..|./).length - 1;
}
function resizeImg(dataUrl, callback){
  var /*canvas = document.createElement("canvas"),*/
      img = new Image();
  img.onload = function(){
    imgOnLoad(img, callback);
  }
  img.src = dataUrl;
}

imgOnLoad = function( img, callback){
    // set size proportional to image
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
            // set size proportional to image
    canvas.height = canvas.width * (img.height / img.width);
    var newWidth = 600,
        resizeBy = newWidth/img.width;
    // step 1 - resize to 50%
    var oc = document.createElement('canvas'),
        octx = oc.getContext('2d');

    oc.width = img.width * resizeBy;
    oc.height = img.height * resizeBy;
    console.log(img);
    octx.drawImage(img, 0, 0, oc.width, oc.height);

    // step 2
    octx.drawImage(oc, 0, 0, oc.width * resizeBy, oc.height * resizeBy);

    // step 3, resize to final size
    ctx.drawImage(oc, 0, 0, oc.width * resizeBy, oc.height * resizeBy,
    0, 0, canvas.width, canvas.height);
    callback(canvas.toDataURL());
    img.remove();
    canvas.remove();
    oc.remove();
  }

function setDataPerUrl( url, imgData){
  chrome.storage.local.get('history', function(data){
    if( !data.history ){
      data = {};
    }
    else{
      data = data.history;
    }
    urlTrimmed = url.split('?')[0];
    data[urlTrimmed] = imgData;
    chrome.storage.local.set({'history': data});
    console.log(data);
  });
}




chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if( tab.active){
    //do not add this page;
    if(chrome.runtime.getURL('pages/history.html') == tab.url){
      return;
    }
    chrome.tabs.captureVisibleTab(null, {
      format : 'jpeg',
      quality : 10
      }, 
      function (data) {
        
        setDataPerUrl( tab.url,data);
        //console.log(data, tab.url);
        //var uniuqe = new Date().getTime();
        //console.log(byteCount(data),uniuqe);
        //resizeImg(data, function(newData){
        //  console.log(byteCount(newData),uniuqe);
        //});
    });

  }
  console.log(tab);
});

chrome.browserAction.onClicked.addListener(function(tab){
  console.log('clicke');
  chrome.tabs.create({"url" : chrome.runtime.getURL('pages/history.html')});  
 });


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.action){
        switch(request.action){
          case 'getHistory':
            chrome.tabs.create({"url" : request.url});  
            break;
        }
    }
});