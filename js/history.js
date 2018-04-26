$('title').text(chrome.i18n.getMessage('page_title'));
$('.h1-title').text(chrome.i18n.getMessage('h1_title'));
$('.history-explain').text(chrome.i18n.getMessage('localy'));
$('.history-go-to-text').text(chrome.i18n.getMessage('delete_text'));
$('.history-go-to-link').text(chrome.i18n.getMessage('delete_text_link'));
$('#history-all-inner').text(chrome.i18n.getMessage('no_history'));
$('.h1-title').text(chrome.i18n.getMessage('h1_title'));
function addHistoryPart(data){
    //console.log(data);
    if(!data.title){
        data.title = data.url;
        data.title = data.title.substr(0,65);
        if(data.title.length < data.url.length){
            data.title += '...';
        }
    }
    var newPart = $('<a class="link" target="_blank" href="' + data.url + '"></a>');
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

    //console.log(allUrlsImages)
    chrome.history.search({text:''}, function(history){
        console.log(history);
        var count = 0;
        
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
            count++;
            //console.log(history, allUrlsImages[history.url]);
        });
        if(count){
            $('#history-all-inner').hide();
        }
    });
    

});

$('.history-go-to-link').click(function(e){
    e.preventDefault();
    console.log('e',e)
    chrome.runtime.sendMessage({action: "openOriginHistory"});
});