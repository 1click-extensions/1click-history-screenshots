firstTime = 0;
bindMove = function(event) { 
    var sendEvent = function(){
        var nowTime = new Date().getTime();
        //fire event on first move or after 2 seconds
        if(!firstTime || nowTime - 2000 >= firstTime){
            chrome.runtime.sendMessage({action: "curserMoved"});     
        }
        //set first time
        if(!firstTime){
            firstTime = nowTime;  
        }
        //after two seconds remove event
        else if(nowTime - 2000 >= firstTime){
            document.body.removeEventListener('mousemove', sendEvent);
            return;
        }
      
    }
    document.body.addEventListener('mousemove', sendEvent);
};

if('loading' != document.readyState){
    bindMove();
}
else{
    document.addEventListener("DOMContentLoaded",bindMove);
}