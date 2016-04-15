/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./lib";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var DOMNodeCollection = __webpack_require__(1);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map