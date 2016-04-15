var DOMNodeCollection = require('./dom_node_collection.js');

document.addEventListener("DOMContentLoaded", invokeCallbacks);
var callbackQueue = [];

window.$l = function(argument){

  if (argument instanceof HTMLElement){
    return new DOMNodeCollection([argument]);
  }
  else if(argument instanceof Array){
    return new DOMNodeCollection(argument);
  }else if(argument instanceof Function){
      callbackQueue.push(argument);
  }else{
    var elementList = document.querySelectorAll(argument);
    elementList = [].slice.apply(elementList);
    return new DOMNodeCollection(elementList);
  }
};

function invokeCallbacks(){
  while(callbackQueue.length > 0){
    callbackQueue.shift()();
    //What about params for individual callbacks
  }
}

window.$l.extend = function(){
  var arr = [].slice.call(arguments);
  var finalObj = arr[0];
  arr.slice(1).forEach(function(el){
    for(var property in el){
      if(el.hasOwnProperty(property)){
        finalObj[property] = el[property];
      }
    }
  });
  return finalObj;
};

window.$l.ajax = function(options){
  var defaultOptions = {
    dataType: "json",
    success: function() {},
    error: function() {},
    type: "GET",
    data: {}
  };

  var tempobj = this.extend(defaultOptions, options);
  var xhr = new XMLHttpRequest();

  xhr.open(tempobj["type"], tempobj['url']);
  xhr.onload = function (){
    if (xhr.status === 200){
      console.log(tempobj['success']());
    }else{
      console.log(tempobj['error']());
    }
    console.log(xhr.status);
    console.log(xhr.responseType);
    console.log(xhr.response);
  };
  xhr.send(tempobj);
};
