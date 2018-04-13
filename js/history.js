$('title').text(chrome.i18n.getMessage('page_title'));
$('.h1-title').text(chrome.i18n.getMessage('h1_title'));
function addHistoryPart(data){
    //console.log(data);
    var newPart = $('<a class="link" href="' + data.url + '"></a>');
    newPart.append('<div class="title">'+ data.title + '</div>');
    url = data.screenshot ? data.screenshot : chrome.runtime.getURL('images/example.png')
    if(url){
        newPart.append('<img class="screenshot" src="' + url + '">');
        
    }
    //newPart.append('<a class="link" href="' + data.url + '">' + data.title + '</a>');
    $('#history-all').append(newPart);
}
var added = [];
chrome.storage.local.get('history', function(data){
    allUrlsImages = data.history;

    console.log(allUrlsImages)
    chrome.history.search({text:''}, function(history){

        $.each(history, function(id,historyPart){
            urlTrimmed = historyPart.url.split('?')[0];
            if(chrome.runtime.getURL('pages/history.html') == urlTrimmed){
                return;
            }
            if(added.indexOf(urlTrimmed) > -1){
                return;
            }
            else{
                //console.log(added)
            }
            if(allUrlsImages[urlTrimmed]){
                historyPart.screenshot = allUrlsImages[urlTrimmed];
            }
            added.push(urlTrimmed);
            //historyPart.url = urlTrimmed;
            addHistoryPart(historyPart);
            //console.log(history, allUrlsImages[history.url]);
        });
    });

});