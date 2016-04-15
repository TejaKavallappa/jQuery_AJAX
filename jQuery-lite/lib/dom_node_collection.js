//var $l = require("./main.js");

function DOMNodeCollection(htmlElements) {
  this.htmlElements = htmlElements;
}
DOMNodeCollection.prototype.html = function(string){
  if (string !== undefined){
    for (var i =0; i < this.htmlElements.length; i++){
      this.htmlElements[i].innerHTML = string;
      //setter
    }
  }else{
    return this.htmlElements[0].innerHTML;
    //getter
  }
};

DOMNodeCollection.prototype.empty = function(){
  this.htmlElements.forEach(function(el){
    el.innerHTML = "";
  });
};

DOMNodeCollection.prototype.append = function(argument){
  if (argument instanceof DOMNodeCollection){
    //TEST later
    this.htmlElements.forEach(function(el){
      for(var i =0; i < argument.length; i++){
        el.innerHTML.concat(argument[i].outerHTML);
      }
    });
  }else if(argument instanceof HTMLElement){
    this.htmlElements.forEach(function(el){
      el.innerHTML.concat(argument.outerHTML);
    });
  }else{
    this.htmlElements.forEach(function(el) {
      el.innerHTML.concat(argument);
    });
  }

};

DOMNodeCollection.prototype.addClass = function(className){
  this.htmlElements.forEach(function(el) {
    var previousCN = el.getAttribute("class");
    if ( previousCN === null){
      previousCN = "";
    }
    var classNames =  previousCN + " " + className;
    el.setAttribute("class", classNames);
  });//concat header
};

DOMNodeCollection.prototype.removeClass = function(className){
  this.htmlElements.forEach(function(el) {
    el.classList.remove(className);
  });
};
DOMNodeCollection.prototype.attr = function(attrName){
  if (arguments.length > 1){
    //arguments doesn't respond to iterators
    this.htmlElements.forEach(function(el){
      el.setAttribute(arguments[0], arguments[1]);
    });
  }else{
    return this.htmlElements[0].getAttribute(attrName);
  }

};
//TRAVERSAl
DOMNodeCollection.prototype.children = function(){
  var children = [];
  this.htmlElements.forEach(function(el){
    children = children.concat(el.children);
  });
  if (children.length === 0){
    return [];
  }
  return new DOMNodeCollection(children);
};

DOMNodeCollection.prototype.parent = function(){
  var parents = [];
  this.htmlElements.forEach(function(el){
    parents = parents.concat(el.parentNode);
  });
  return new DOMNodeCollection(parents);
};

DOMNodeCollection.prototype.find = function(selector){
  var matches = [];
  var tempMatches;
  this.htmlElements.forEach(function(el) {
    tempMatches = el.querySelectorAll(selector);
    matches = matches.concat([].slice.call(tempMatches));
  });
  return new DOMNodeCollection(matches);
};

DOMNodeCollection.prototype.remove = function(){
  this.htmlElements.forEach(function(el){
    el.innerHTML = "";
    el.outerHTML = "";
  });
  this.htmlElements = [];
};

DOMNodeCollection.prototype.on = function(type, listener, userCapture){
  this.htmlElements.forEach(function(el){
    el.addEventListener(type, listener, userCapture);
  });
};

DOMNodeCollection.prototype.off = function(type, listener, userCapture){
  //Sneaky bug: Make sure that listener in off and listener in on point
  //to the exact same function!!!
  this.htmlElements.forEach(function(el){
    el.removeEventListener(type, listener, userCapture);
  });
};





module.exports = DOMNodeCollection;
