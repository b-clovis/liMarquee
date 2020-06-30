/*
* jQuery liMarquee v 6.5.0
*
* Copyright 2013, Linnik Yura | LI MASS CODE | http://masscode.ru
*
* Last Update 27.10.2017
*/
(function ($) {
"use strict";
var methods = {

/* === Default Settings === */
init: function (options) {

var p = {
width:'auto', //Sets width of the Marquee.
height:'auto', //Sets height of the Marquee.
direction:'left', //Sets the direction of the Marquee.
//It may take the values: "left", "right", "top", "bottom"
scrollDelay:85, //Sets the interval between each scroll movement in milliseconds.
//The default value is 85.
//Note that any value smaller than 60 is ignored and the value 60 is used instead, unless truespeed is specified.
scrollAmount:6, //Sets the amount of scrolling at each interval in pixels.
//The default value is 6.
circular:false, //Creates the effect of an infinite line.
//It may take the values: true, false
dragAndDrop:true, //Enable the opportunity to drag the Marquee by the mouse.
//It may take the values: true, false
hoverStop:true, //Enable the opportunity to pause the Marquee when mouse hover.
//It may take the values: true, false
scrollStop:true, //Enable the opportunity to pause the Marquee when scroll page.
//It may take the values: true, false
startShow:false, //If it is true - the content of marquee appears immediately if the lie - gradually
xml:false, //Path to XML file or false
touchEvent:true, //This parameter determines if the ticker responds to touch events or not
//It may take the values: true or false
stopOutScreen: true, //This parameter specifies, the ticker will stop outside the screen or not
//It may take the values: true or false

create:function(){}, //Triggered when the liMarquee is created.

moveStart:function(){}, //Triggered when motion starts.
moveStop:function(){}, //Triggered when motion stops.

drag:function(){}, //Triggered while the string is moved during the dragging.
dragStart:function(){}, //Triggered when dragging starts.
dragStop:function(){}, //Triggered when dragging stops.
wayEnd:function(){}, //Triggered when way ended.
removeContentFadeDuration:300 //The duration of fading when removing the content of marquee

};

if (options) {
$.extend(p, options);
}




return this.each(function () {
var mEl = $(this).addClass('mwrap');

var mElIndex = $('*').index($(this));
mEl.data().mElIndex = mElIndex;

/*== Extend Standart jQuery Method .position() ==*/
var pos = function(el,parent){
var oldObj = el.position();
var wrapper = parent || $(document);

var rightVal = (wrapper.outerWidth() - (el.position().left + el.outerWidth()));
var bottomVal = (wrapper.outerHeight() - (el.position().top + el.outerHeight()));
var newObj = {right:rightVal,bottom:bottomVal};

$.extend(newObj, oldObj);
return newObj;
};
mEl.data().style = mEl.attr('style');

/*== Combine Options ==*/
$.extend(p, mEl.data());
$.extend(mEl.data(), p);

/*== Create Moveing Container ==*/
if(!$('.mMove',mEl).length){
mEl.wrapInner('<div class="mMove"></div>');
}
var mMove = $('.mMove',mEl);

/*== Set Base Style ==*/
mEl.css({position:'relative',overflow:'hidden',maxWidth:'100%',height:mEl.data().height,width:mEl.data().width});

if(mEl.data().scrollDelay <= 0 ){
mEl.data().scrollDelay = 85;
}

/*== Creat Custom Size Function ==*/
mEl.data().outerSizeFunc = function(el){
if(mEl.data().direction === 'top' || mEl.data().direction === 'bottom'){
return el.outerHeight();
}else{
return el.outerWidth();
}
}

mMove.data().style = mMove.attr('style');
if((!mEl.data().updateCont)){
mMove.css({position:'absolute',left:'auto',right:'auto',top:'auto',bottom:'auto',float:'left'});
}
mEl.data().mMove = mMove;

var createMarquee = function (){


mEl.data().clickEventFlag = true;

if(mEl.data().outerSizeFunc(mMove) > 0){

/*== Splitting a String into Parts ==*/
var mItem = $('.mItem',mEl);
mItem.each(function(){
$(this).data().style = $(this).attr('style');
$(this).css({display:'inline', zoom:1 });
});

var splittingString = function(splitSide,mItem){
mItem.css({paddingLeft:0, paddingRight:0, paddingTop:0, paddingBottom:0});
if(mItem.length && !mEl.data().circular){
var paddingVal = {};
var paddingValFirst = {};
paddingVal['padding-'+splitSide] = mEl.data().outerSizeFunc(mEl);
paddingValFirst['padding-'+splitSide] = 0;
mItem.css(paddingVal);
mItem.eq(0).css(paddingValFirst);
}
};
mEl.data().splittingString = splittingString;



var contentString = $('<div>').addClass('cloneContent').html(mMove.html());

if(mEl.data().direction === 'left' || mEl.data().direction === 'right'){
mMove.css({whiteSpace:'nowrap'});
mEl.data().splittingString('left',mItem);
mEl.css({minHeight:mMove.outerHeight()});
contentString.css({display:'inline-block'});
mEl.data().axis = 'hor';
}else{
mMove.css({whiteSpace:'normal'});
mItem.css({display:'block'});
mEl.data().splittingString('top',mItem);
if(mEl.outerHeight() === 0) {alert('Set Height Parametr for Plugin liMarquee');}
contentString.css({display:'block'});
mEl.data().axis = 'vert';
}

/*== Unselectable for IE ==*/
var isIE = /*@cc_on!@*/false || document.documentMode;
if(isIE){
mEl.add(mEl.find('*')).attr('unselectable','on');
}

/*== Change Events ==*/
var moveEvent = 'mousemove.'+mEl.data().mElIndex;
var mousedownEvent = 'mousedown.'+mEl.data().mElIndex;
var mouseupEvent = 'mouseup.'+mEl.data().mElIndex;
var clickEvent = 'click.'+mEl.data().mElIndex;
mEl.data({
touchScreen:false,
teleport:false,
dragging:false,
pause:false
});
if('ontouchstart' in window){
moveEvent = 'touchmove.'+mEl.data().mElIndex;
mousedownEvent = 'touchstart.'+mEl.data().mElIndex;
mouseupEvent = 'touchend.'+mEl.data().mElIndex;
mEl.data().touchScreen = true;
if($(window).width() < 1000){
mEl.data().hoverStop = false;
}
}

mEl.data({
moveEvent:moveEvent,
mousedownEvent:mousedownEvent,
mouseupEvent:mouseupEvent,
clickEvent:clickEvent
});

/*== Creating Correct Amount of Contents ==*/
var cloneContent = function(mMove){
if(mEl.data().outerSizeFunc(mMove) !== 0){
if(mEl.data().outerSizeFunc(mMove) < mEl.data().outerSizeFunc(mEl) && mEl.data().circular){
contentString.clone().appendTo(mMove);
mEl.data().cloneContent(mMove);
}
}else{
console.log('The string is empty or contains invalid style');
}
};
mEl.data().cloneContent = cloneContent;
mEl.data().cloneContent(mMove);

/*== This Function Creates Motion Animation Line ==*/
var anim = function(sPos, ePos){
if(!mEl.data().pause){

if(sPos === undefined) {sPos = mEl.data().startPos;}
if(ePos === undefined) {ePos = mEl.data().endPos;}
if(ePos !== 0 && ePos !== -0){

/*Calculate the Time for Animation to the formula (t = s/v)*/
var way = (ePos - sPos);
if(way < 0) {
way = way * -1;
}
//var duration = (way/mEl.data().speed) * 1000;
var duration = (way * mEl.data().scrollDelay)/mEl.data().scrollAmount;
var directTypeStart = {};
var directTypeEnd = {};

directTypeStart = {
left:'auto',
right:'auto',
top:'auto',
bottom:'auto'
};
directTypeEnd = {
left:'auto',
right:'auto',
top:'auto',
bottom:'auto'
};

directTypeStart[mEl.data().direction] = sPos;
directTypeEnd[mEl.data().direction] = ePos;

mMove.css(directTypeStart);

mEl.addClass('mIni');

//Triggered when motion starts.
mEl.data().stopped = false;
if (mEl.data().moveStart !== undefined) {mEl.data().moveStart();}

mMove.stop(true).animate(directTypeEnd,duration,'linear',function(){
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
if (mEl.data().wayEnd !== undefined) {mEl.data().wayEnd();}
mEl.data().teleport = true;
anim();
});
}
}
};
mEl.data().anim = anim;

/*== Caching String and Creatin Clones of String ==*/
var addClone = function(){
var mMoveClone = mMove.clone().addClass('clone').css({position:'absolute', width:'100%', height:'100%',opacity:0});
if(mEl.data().direction === 'top' || mEl.data().direction === 'bottom'){mMoveClone.css({left:0});}else{mMoveClone.css({top:0});}
var value = {};
var value2 = {};
value[mEl.data().direction] = '-100%';
value2[mEl.data().direction] = '100%';
var cloneBefore = mMoveClone.clone().addClass('cloneBefore').css(value).appendTo(mMove);
var cloneAfter = mMoveClone.clone().addClass('cloneAfter').css(value2).appendTo(mMove);
if(mEl.data().circular){
cloneBefore.add(cloneAfter).css({opacity:1});
}
};
if(mEl.data().circular){
addClone();
}

//Triggered when the liMarquee is created.
if (mEl.data().create !== undefined) {mEl.data().create();}

/*== This Function Determines the Coordinate of the Moving Line ==*/
var nowPos = function(){
return pos(mMove,mEl)[mEl.data().direction];
};
mEl.data().nowPos = nowPos;

/*== This Function Determines the Coordinate of the Touch Event ==*/
var correctEvent = function(e){
var eventType = e;
if(mEl.data().touchScreen){
if (e.originalEvent.targetTouches.length === 1) {
eventType = e.originalEvent.targetTouches[0];
}
}

/*== Extend Standart jQuery Object of Event Coordinates ==*/
var newParam = {
left: eventType.pageX,
top: eventType.pageY,
right: ($(window).width() - eventType.pageX),
bottom: ($(window).height() - eventType.pageY)
};
$.extend(eventType, newParam);
return eventType;
};

if(mEl.data().hoverStop){
mEl.on('mouseenter.'+mEl.data().mElIndex,function(){
mEl.off('mouseleave.'+mEl.data().mElIndex);
if(mEl.data().dragAndDrop){
$('html').addClass('grab');
}
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}
mEl.on('mouseleave.'+mEl.data().mElIndex,function(){
$(document).off(moveEvent);
$('html').removeClass('grab');
$('html').removeClass('grabbing');
anim(mEl.data().nowPos());
});
});
}
if(!mEl.data().touchScreen && mEl.data().dragAndDrop || mEl.data().touchScreen && mEl.data().touchEvent){
mEl.on(mousedownEvent, function (e) {
$(document).off(moveEvent);
$(document).off(mouseupEvent);
mEl.off('mouseleave.'+mEl.data().mElIndex);
$('html').addClass('grabbing');

if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}

/*== Start Drag and Drop of String ==*/
var startMouseCoord = correctEvent(e)[mEl.data().direction];
var startMouseY = correctEvent(e)['top'];
var startMouseX = correctEvent(e)['left'];
var vertSum = 0;
var horSum = 0;
var dir = 1;
$(document).on(moveEvent,function(e){
mEl.data().clickEventFlag = false;
mEl.off('mouseleave.'+mEl.data().mElIndex);
$('html').addClass('grabbing');
if(!mEl.data().dragging){
//Triggered when dragging starts.
if (mEl.data().dragStart !== undefined) {mEl.data().dragStart();}
mEl.data().dragging = true;
}
var nowPosVal = mEl.data().nowPos();
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
}

var newMouseCoord = correctEvent(e)[mEl.data().direction];

var dragTrue = function(){

if(newMouseCoord > startMouseCoord) {dir = 1;}
if(newMouseCoord < startMouseCoord) {dir = -1;}

var shiftVal = (startMouseCoord - newMouseCoord);
startMouseCoord = newMouseCoord;

var value = {};
value[mEl.data().direction] = '-='+shiftVal;

/*== Calculate Drag Position ==*/
if(mEl.data().circular){
if(nowPosVal <= mEl.data().outerSizeFunc(mMove) && !mEl.data().teleport){
mEl.data().teleport = true;
}
if(nowPosVal <= (mEl.data().outerSizeFunc(mEl) - mEl.data().outerSizeFunc(mMove)) && dir < 0 && mEl.data().teleport){
if (mEl.data().wayEnd !== undefined) {mEl.data().wayEnd();}
value[mEl.data().direction] = '+='+mEl.data().outerSizeFunc(mMove);
}
if(nowPosVal >= 0 && dir > 0 && mEl.data().teleport){
if (mEl.data().wayEnd !== undefined) {mEl.data().wayEnd();}
value[mEl.data().direction] = '-='+mEl.data().outerSizeFunc(mMove);
}
}else{

if(nowPosVal <= -mEl.data().outerSizeFunc(mMove) && dir < 0){
if (mEl.data().wayEnd !== undefined) {mEl.data().wayEnd();}
value[mEl.data().direction] = '+='+(mEl.data().outerSizeFunc(mMove)+mEl.data().outerSizeFunc(mEl));
}
if(nowPosVal >= mEl.data().outerSizeFunc(mEl) && dir > 0){
if (mEl.data().wayEnd !== undefined) {mEl.data().wayEnd();}
value[mEl.data().direction] = '-='+(mEl.data().outerSizeFunc(mMove)+mEl.data().outerSizeFunc(mEl));
}

}
//Triggered while the string is dragging.
if (mEl.data().drag !== undefined) {mEl.data().drag();}

mMove.css(value);
if(mEl.data().touchEvent){
return false;
}
}

//Detecting swipe direction
if(mEl.data().axis == 'hor'){
var newMouseY = correctEvent(e)['top'];
var newMouseX = correctEvent(e)['left'];
var vertDif = Math.abs(newMouseY - startMouseY);
var horDif = Math.abs(newMouseX - startMouseX);
vertSum += vertDif;
horSum += horDif;
if(vertSum > horSum){
$(document).trigger(mouseupEvent);
}else{
dragTrue();
}
}else{
dragTrue();
}

});

$(document).on(mouseupEvent, function (e) {
if(mEl.data().dragging){
//Triggered when dragging starts.
if (mEl.data().dragStop !== undefined) {mEl.data().dragStop();}
mEl.data().dragging = false;
}
if($(e.target).is(mEl) || $(e.target).closest(mEl).length){
$(document).off(moveEvent);
$('html').removeClass('grabbing');
if(mEl.data().hoverStop){
mEl.trigger('mouseenter.'+mEl.data().mElIndex);
}else{
anim(mEl.data().nowPos());
}
}else{
$(document).off(moveEvent);
anim(mEl.data().nowPos());
$('html').removeClass('grab');
$('html').removeClass('grabbing');
}
$(document).off(mouseupEvent);
setTimeout(function(){
mEl.data().clickEventFlag = true;
},300);
});
if(!mEl.data().touchScreen/* && !mEl.data().touchEvent*/){
return false;
}
});
}

/*== Set the Starting Position of the String ==*/
var getPosition = function(mEl){
var mMove = mEl.data().mMove;
var startPos = mEl.data().outerSizeFunc(mEl);
var endPos = -mEl.data().outerSizeFunc(mMove);
mEl.data().startPos = startPos;
mEl.data().endPos = endPos;
if(mEl.data().circular){
endPos = - (mEl.data().outerSizeFunc(mMove) + (mEl.data().outerSizeFunc(mMove) - mEl.data().outerSizeFunc(mEl)));
mEl.data().endPos = endPos;
var circularPos = mEl.data().startShow ? mEl.data().outerSizeFunc(mMove) : (mEl.data().outerSizeFunc(mEl) + mEl.data().outerSizeFunc(mMove));
anim(circularPos);
}else{
var tempStartPos = mEl.data().startShow ? 0 : startPos;
anim(tempStartPos);
}
};
mEl.data().getPosition = getPosition;

var setPosition = function(mEl){
var mMove = mEl.data().mMove;
var startPos = mEl.data().outerSizeFunc(mEl);
var endPos = -mEl.data().outerSizeFunc(mMove);
mEl.data().startPos = startPos;
mEl.data().endPos = endPos;

if(mEl.data().circular){
endPos = - (mEl.data().outerSizeFunc(mMove) + (mEl.data().outerSizeFunc(mMove) - mEl.data().outerSizeFunc(mEl)));
mEl.data().endPos = endPos;
}
};

mEl.data().setPosition = setPosition;
if(!mEl.data().updateCont){
mEl.data().getPosition(mEl);
}

/*== This function stops a marquee into an inactive browser tab ==*/
var visibilityChanged = function(){
if(document.hidden){
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}
}else{
anim(mEl.data().nowPos());
}
}
$(document).on('visibilitychange',function(){
visibilityChanged();
})

/*== When you change size of the screen - recalculate animation coordinates of marquee. ==*/
var resizeId = function(){};
$(window).on('resize.'+mEl.data().mElIndex,function(){
clearTimeout(resizeId);
resizeId = setTimeout(function(){
mEl.liMarquee('resetPosition');
},300);

});

/*== If marquee outside the screen, it stops and does not use CPU ==*/
var scrollPageId = function(){};
var detectStringPos = function(){
if(mEl.data().stopOutScreen){
if((mEl.offset().top + mEl.outerHeight()) < $(window).scrollTop() || mEl.offset().top > ($(window).scrollTop() + $(window).height())){
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}
}else{
anim(mEl.data().nowPos());
}
}else{
anim(mEl.data().nowPos());
}
};
$(window).on('scroll.'+mEl.data().mElIndex,function(){
if(mEl.data().scrollStop && !mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}
clearTimeout(scrollPageId);
scrollPageId = setTimeout(function(){
detectStringPos();
},100);
});
mEl.find('a').on('click',function(){
if(!mEl.data().clickEventFlag){
return false;
}
});
detectStringPos();

}else{
mMove.text('marquee "'+mEl.attr('class')+'" elements is hidden or missing');
createMarquee();
mEl.liMarquee('stop');
mEl.liMarquee('removeContent');
}
};

/*== Loading XML Content ==*/
if (mEl.data().xml){
$.ajax({
url: mEl.data().xml,
dataType: "xml",
success: function (xml) {
var xmlItem = $(xml).find('item');
var xmlItemLength = xmlItem.length;
for(var i = 0; i < xmlItemLength; i++){
var xmlItemActive = xmlItem.eq(i);
var xmlItemContent = xmlItemActive.find('title').text();
var xmlItemLink = xmlItemActive.find('link').text();

if(xmlItemActive.find('link').length){
$('<div class="mItem"><a href="'+xmlItemLink+'">'+xmlItemContent+'</a></div>').appendTo(mMove);
}else{
$('<div class="mItem">').text(xmlItemContent).appendTo(mMove);
}
}
createMarquee();
}
});
}else{
createMarquee();
}
});
},
/*== Get Content ==*/
getContent: function () {
var mMove = $(this).data().mMove;
var content;
if(!mMove.is(':empty')){
var moveContent = mMove.html();
var tempEl = $('<div>').html(moveContent);
tempEl.find('.clone').remove();
tempEl.find('.cloneContent').remove();
content = $.trim(tempEl.html());
}else{
content = false;
}
return content;
},

/*== Add Content ==*/
addContent: function (per) {
return this.each(function () {
var mEl = $(this);
var mMove = mEl.data().mMove;
var addingFunc = function(){
if(!mEl.data().removing){
/*== Cashing Vars ==*/
var newHtml = '<div class="mItem">'+per+'</div>';

/*== Get old Content ==*/
var oldCont = mEl.liMarquee('getContent');
var newCont = oldCont;

//Correct old Content
if(!mMove.find('.mItem').length && oldCont){
oldCont = '<div class="mItem">'+oldCont+'</div>';
}

//Create Combine Content
if(per){
if(mEl.data().direction === 'left' || mEl.data().direction === 'top') {newCont = oldCont ? oldCont+newHtml : newHtml;}
if(mEl.data().direction === 'right' || mEl.data().direction === 'bottom') {newCont = oldCont ? newHtml+oldCont : newHtml;}
}

/*== Remove old Content ==*/
mEl.liMarquee('removeContent');

var addNewContFunc = function(){
if(!mEl.data().removing){

//Add New Content
mMove.html(newCont);


//Update Initialization
if(oldCont){
mEl.data().updateCont = true;
}

mEl.liMarquee(mEl.data());

//Set End Position and Start Animation
if(mEl.data().updateCont){
mEl.data().setPosition(mEl);
mEl.data().anim(mEl.data().nowPos());
}
}else{
setTimeout(function(){
addNewContFunc();
},mEl.data().removeContentFadeDuration);
}
};
addNewContFunc();

}else{
setTimeout(function(){
addingFunc();
},mEl.data().removeContentFadeDuration);
}

};
addingFunc();
});
},

/*== Remove Content ==*/
removeContent: function () {
return this.each(function () {
$(this).data().removing = true;
var mEl = $(this);
var mMove = mEl.data().mMove;

mMove.children().animate({opacity:0},mEl.data().removeContentFadeDuration);

setTimeout(function(){
mEl.data().updateCont = true;
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
}
mEl.off('mouseenter.'+mEl.data().mElIndex);
mEl.off('mouseleave.'+mEl.data().mElIndex);
mEl.off($(this).data().mousedownEvent);
$(window).off('resize.'+mEl.data().mElIndex);
$(window).off('scroll.'+mEl.data().mElIndex);
$(document).off(mEl.data().moveEvent);
$(document).off(mEl.data().mouseupEvent);
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
}
mMove.empty();
mEl.data().removing = false;
},mEl.data().removeContentFadeDuration);
});
},
changeOptions: function (options) {
return this.each(function () {
var mEl = $(this);
var mMove = mEl.data().mMove;
var resetFlag = false;
for (var par in options){
if(par != 'scrollAmount' && par != 'scrollDelay' && par != 'direction'){
resetFlag = true;
}
if(par == 'direction'){
if(options[par] == 'right' || options[par] == 'left'){
if(mEl.data().direction != 'left' && mEl.data().direction != 'right'){
resetFlag = true;
}
}
if(options[par] == 'top' || options[par] == 'bottom'){
if(mEl.data().direction != 'top' && mEl.data().direction != 'bottom'){
resetFlag = true;
}
}
}
}

$.extend(mEl.data(), options);
if(resetFlag){
mEl.liMarquee('destroy');
mEl.data().updateCont = false;
mEl.liMarquee(mEl.data());
}else{
mEl.data().setPosition(mEl);
mEl.data().anim(mEl.data().nowPos());
}
});
},

/* === Function of Destroy Marquee === */
destroy: function () {
var mEl = $(this);
var mMove = mEl.data().mMove;
mEl.removeAttr('style').attr('style',mEl.data().style);
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
}
mMove.removeAttr('style').attr('style',mMove.data().style).removeData();
$('.mItem',mEl).each(function(){
$(this).removeAttr('style').attr('style',$(this).data().style).removeData();
});
mEl.off('mouseenter.'+mEl.data().mElIndex);
mEl.off('mouseleave.'+mEl.data().mElIndex);
mEl.off(mEl.data().mousedownEvent);
$(window).off('resize.'+mEl.data().mElIndex);
$(window).off('scroll.'+mEl.data().mElIndex);
if(mEl.data().moveEvent){
$(document).off(mEl.data().moveEvent);
}
if(mEl.data().mouseupEvent){
$(document).off(mEl.data().mouseupEvent);
}
$('.clone',mEl).remove();
$('.cloneContent',mEl).remove();
var mMoveContent = mMove.html();
mMove.remove();
mEl.html(mMoveContent).removeClass('mIni').css({opacity:1});
},

/* === Function of Pause Marquee === */
stop: function(){
return this.each(function () {
var mEl = $(this);
if(mEl.is('.mIni')){
var mMove = mEl.data().mMove;
if(!mEl.data().pause){
mEl.data().pause = true;
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
//Triggered when motion stop.
if (mEl.data().moveStop !== undefined) {mEl.data().moveStop();}
}
}
}
})

},

/* === Function of Play Marquee === */
start: function(delayNew){
return this.each(function () {
var mEl = $(this);
if(mEl.data().pause){
var delayVal = delayNew? delayNew : 0;
setTimeout(function(){
mEl.data().pause = false;
mEl.data().setPosition(mEl);
mEl.data().anim(mEl.data().nowPos());
$(window).trigger('scroll.'+mEl.data().mElIndex);
},delayVal);
}
});
},

/* === Reset Position === */
resetPosition: function () {
return this.each(function () {
var mEl = $(this);
if(mEl.is(':visible')){
var mMove = mEl.data().mMove;
if(!mEl.data().stopped){
mMove.stop(true);
mEl.data().stopped = true;
}

if(mEl.data().direction === 'left' || mEl.data().direction === 'right'){
mEl.css({minHeight:mMove.outerHeight()});
}
mEl.data().setPosition(mEl);
mEl.data().anim(mEl.data().nowPos());
$(window).trigger('scroll.'+mEl.data().mElIndex);
}
});
}
};
$.fn.liMarquee = function (method) {
if (methods[method]) {
return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
} else if (typeof method === 'object' || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Метод " + method + " в jQuery.liMarquee doesn't exist");
}
};
})(jQuery);
