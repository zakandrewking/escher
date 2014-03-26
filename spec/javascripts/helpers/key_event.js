
function __triggerKeyboardEvent(el, keyCode)
{
    var eventObj = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");
  
    if(eventObj.initEvent){
      eventObj.initEvent("keydown", true, true);
    }
  
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
    
    el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj); 
  
} 

function traceEvent(e){
    $(".logs").prepend(jQuery("<li>").html(
      "Key = " + e.keyCode
    ).fadeIn());
    
    console.log(e);
}

function triggerKeyboardEvent(el, keyCode){
    var keyboardEvent = document.createEvent("KeyboardEvent");
    
    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
  
  
    keyboardEvent[initMethod](
                       "keydown",
                        true,      // bubbles oOooOOo0
                        true,      // cancelable   
                        window,    // view
                        false,     // ctrlKeyArg
                        false,     // altKeyArg
                        false,     // shiftKeyArg
                        false,     // metaKeyArg
                        keyCode,  
                        0          // charCode   
    );
  
    el.dispatchEvent(keyboardEvent); 
}

$(document).ready(function(){
  
  document.addEventListener("keydown", function(e){
    traceEvent(e);
  });
  
  $("#buttons-generic").find("button").click(function(){
    __triggerKeyboardEvent(document.body, parseInt($(this).attr("data-key")));
  });

  $("#buttons-keyboard").find("button").click(function(){
    triggerKeyboardEvent(document.body, parseInt($(this).attr("data-key")));
  });
  
  /*
  setInterval(function(){
    __triggerKeyboardEvent(document.body, 13);
  }, 5000);
  */
}); 


