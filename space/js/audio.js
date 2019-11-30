/*
// Browser detection required (guess which browsers are at faul =P)
var isSafari = navigator.userAgent.indexOf("Safari") != -1;
var isIe = navigator.userAgent.indexOf("MSIE") != -1;
var isFireFox = navigator.userAgent.indexOf("Firefox") != -1; // not this one ^^


// We need to check if this system has the webAudioContext defined.
// As of right now chrome will, but firefox won't because they just started implimenting
if (typeof(webkitAudioContext) == "undefined" && typeof(mozAudioContext) == "undefined") {
	window.webkitAudioContext = function(){throw "Web Audio API not supported in this browser";};
}

function initializeNewWebAudioContext() {
	return initializeNewWebAudioContext(false);
}

// You can initialize with the parameter true to actually enable the audio fallback on
// IE.  This is not recommended and is subject to change if a later version of this framework is written
function initializeNewWebAudioContext(enableIe) {
	var context; // this is our web audio context, our way of
							 // controlling and keeping track all of our sounds.
	try {
		if (typeof(mozAudioContext) != "undefined") {
			context = new mozAudioContext();
		}
		else{
			context = new webkitAudioContext();
		}
	}
	catch(e) {
		// alert('Web Audio API is not supported in this browser.  HTML 5 Audio Elements will be used instead.');
		if (isIe && !enableIe){
			disableSoundFallback();
		}

		context = new fallbackAudioContext();
	}
	return context;
}



// this is useful for IE...
function disableSoundFallback(){
	if(isIe){
		//("Relevant audio is being disabled for your browser, probably because your browser (IE) is not capable of playing back sound at a reasonable latency.  \n\nEven though you are using Microsoft Windows as an Operating system, you are still able to access the web the way the rest of the world can by downloading an alternative browser.  \n\nConsider web searching for:  Opera, Firefox or Chrome.");
	}

	fallbackAudioContext.prototype.playSound = function(strBufferName){return;}
}

// this is a very strange function which asks that you name
// the buffer that you plan to store the sound data in...
// It's almost meta, but still javascript
//
// The function is complicated by Safari which is a default browser on an OS that
// has legitamate power, yet doesn't support .ogg for audio.
webkitAudioContext.prototype.loadSound = function (url, strNameOfSoundBufferVariable) {
	var request;
	if (url instanceof Array){
		url = webkitAudioContext.orderUrl(url);
		this.prepareRequest(url[0], strNameOfSoundBufferVariable);
		for (var i = 1; i < url.length; i++){
			this.prepareFallbackRequestForSafari(url[i], strNameOfSoundBufferVariable);
		}
	}
	else{
		this.prepareRequest(url, strNameOfSoundBufferVariable);
	}
}


// private
// This method ensures that the .ogg is set to the primary audioContext.buffers[] slot and
// not the audioContext.fallbackBuffers[] slot
webkitAudioContext.orderUrl = function (url) {
	if (url[0].indexOf(".mp3") == -1){
		return url;
	}
	return [url[1], url[0]];  // reverse order of url.
}


// Private, plz don't call this directly as that it might change over time
webkitAudioContext.prototype.prepareRequest = function(url, strNameOfSoundBufferVariable) {
	var context = this;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			context.buffers[strNameOfSoundBufferVariable] = buffer; // when finished, put the PCM audio data in the buffer we named
		}, onError);
	}
	request.send();
}

// Private... Safari...
// the more I right code for this, the more I hate corporations...
webkitAudioContext.prototype.prepareFallbackRequestForSafari = function(url, strNameOfSoundBufferVariable) {
	var context = this;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			context.fallbackBuffers[strNameOfSoundBufferVariable] = buffer; // when finished, put the PCM audio data in the buffer we named
		}, onError);
	}
	request.send();
}


// I almost want to mark this method as private because it's so rediculous that Apple would
// try to kill .ogg format.  Their decision is reckless and harmful to the web.
webkitAudioContext.prototype.loadFallbackSound = function (url, strNameOfSoundBufferVariable) {
	var context = this;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			context.fallbackBuffers[strNameOfSoundBufferVariable] = buffer;
		}, onError);

	}
	request.send();
}



function onError() {
	//alert("something suboptimal happened while attempting to decode some audioData.  \nYou're probably using Safari, and Apple has some kind of a shady plan going on to stop the .ogg format from easing the development burden on the web.  Perhaps setting a fallback audio file (an mp3) will function properly after this first attempt to decode audio will work.");
}

webkitAudioContext.prototype.playSound = function(strBuffer, toggle) {
	if(toggle){
		var context = this;
		buffer = this.buffers[strBuffer];            // get the audio buffer by it's name
		if (navigator.vendor.indexOf("Apple") != -1){
		buffer = this.fallbackBuffers[strBuffer];  // use the fallbackBuffer if the user is trying to support Safari
		}

		var source = context.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // Give the Source some PCM data to be played
		source.connect(context.destination);       // connect the audio source the speakers
		source.noteOn(0);                          // play the audio source zero seconds from now
	}
}



// We need a place to store our audio buffers.
// May as well pin them here, directly to the context
webkitAudioContext.prototype.buffers = {};

// Specially for Safari, use this workaround to create a good experience for
// users who wound up using Safari today.
webkitAudioContext.prototype.fallbackBuffers = {};

// The fallback context is used on browsers that don't use webkitAudioContext.
// In the case of a fallback, html5 audio will be used instead
function fallbackAudioContext() {
	this.buffers = {};
}

function fallbackAudioEntity(url) {
	this.audioElement = new Audio(url);  // Place the audio element here
	//this.audioElement = document.createElement('audio');   // oh my god... Safari 5 doesn't even support Audio tags in the first place...
	//this.audioElement.setAttribute('src', url);

	this.tracks = {};  // .play() multiple audio elements simultaniously in this tracks collection.  It's gc friendly
	this.audioBufferIndex = 0;  // these help us keep track of the new Audio() elements we create so
	this.maxSoundsAtOnce = 32;  // they garbage collect a tiny bit easier
}

fallbackAudioEntity.prototype.playNew = function() {
	var i = this.audioBufferIndex;

	if (typeof(this.tracks[i]) != 'undefined' && !isFireFox)
		this.tracks[i].src = '';  // minimize memory usage... and smoothness too???
	this.tracks[i] = this.audioElement.cloneNode(true);
	if (isIe) { this.tracks[i].src = 'audio/beep.mp3'; } //  lol, IE9s performance is ridiculous, what a waste of time
	this.tracks[i].play();

	// this stuff is done to prevent "memory leaking" in browsers, which causes a
	// stall when it does it's garbage collection after spawning off too many Audio objects
	this.audioBufferIndex++;
	if (this.audioBufferIndex >= this.maxSoundsAtOnce)
		this.audioBufferIndex = 0;
}

fallbackAudioContext.prototype.loadSound = function(url, strNameOfSoundBufferVariable) {
	if (url instanceof Array){
		url = webkitAudioContext.orderUrl(url);
		if (isSafari || isIe){
			url[0] = url[1];  // make the mp3 the one chosen... since this isn't firefox...
		}

		this.buffers[strNameOfSoundBufferVariable] = new fallbackAudioEntity(url[0]);
	}
	else{
		this.buffers[strNameOfSoundBufferVariable] = new fallbackAudioEntity(url);
	}
}

// this was needed due to Safari.
fallbackAudioContext.prototype.loadFallbackSound = function(url, strNameOfSoundBufferVariable) {
	return;
}

fallbackAudioContext.prototype.playSound = function(strBufferName, toggle){
	if(toggle){
	this.buffers[strBufferName].playNew();
	}
}






var audio = initializeNewWebAudioContext();
var audioMax = {
	hit: 0,
	coin: 0,
	powerup: 0,
	start: 0,
	click: 0,
	hover: 0,
	upgrade: 0,
	error: 0,
	endLine: 0,
	success: 0,
	failure: 0
}

// hits
audio.loadSound('audio/hit-1.ogg', 'hit-1');
audioMax.hit++;
audio.loadSound('audio/hit-2.ogg', 'hit-2');
audioMax.hit++;
audio.loadSound('audio/hit-3.ogg', 'hit-3');
audioMax.hit++;
audio.loadSound('audio/hit-4.ogg', 'hit-4');
audioMax.hit++;
audio.loadSound('audio/hit-5.ogg', 'hit-5');
audioMax.hit++;
audio.loadSound('audio/hit-6.ogg', 'hit-6');
audioMax.hit++;
audio.loadSound('audio/hit-7.ogg', 'hit-7');
audioMax.hit++;
audio.loadSound('audio/hit-8.ogg', 'hit-8');
audioMax.hit++;
audio.loadSound('audio/hit-9.ogg', 'hit-9');
audioMax.hit++;
audio.loadSound('audio/hit-10.ogg', 'hit-10');
audioMax.hit++;
audio.loadSound('audio/hit-11.ogg', 'hit-11');
audioMax.hit++;
audio.loadSound('audio/hit-12.ogg', 'hit-12');
audioMax.hit++;

// coins
audio.loadSound('audio/coin-1.ogg', 'coin-1');
audioMax.coin++;
audio.loadSound('audio/coin-2.ogg', 'coin-2');
audioMax.coin++;
audio.loadSound('audio/coin-3.ogg', 'coin-3');
audioMax.coin++;
audio.loadSound('audio/coin-4.ogg', 'coin-4');
audioMax.coin++;

// powerups
audio.loadSound('audio/powerup-1.ogg', 'powerup-1');
audioMax.powerup++;

// level start
audio.loadSound('audio/start-1.ogg', 'start-1');
audioMax.start++;

// clicks
audio.loadSound('audio/click-1.ogg', 'click-1');
audioMax.click++;

// hovers
audio.loadSound('audio/hover-1.ogg', 'hover-1');
audioMax.hover++;

// upgrades
audio.loadSound('audio/upgrade-1.ogg', 'upgrade-1');
audioMax.upgrade++;

// errors
audio.loadSound('audio/error-1.ogg', 'error-1');
audioMax.error++;

// end line
audio.loadSound('audio/endline-1.ogg', 'endLine-1');
audioMax.endLine++;
audio.loadSound('audio/endline-2.ogg', 'endLine-2');
audioMax.endLine++;
audio.loadSound('audio/endline-3.ogg', 'endLine-3');
audioMax.endLine++;
audio.loadSound('audio/endline-4.ogg', 'endLine-4');
audioMax.endLine++;

// success
audio.loadSound('audio/success-1.ogg', 'success-1');
audioMax.success++;

// failure
audio.loadSound('audio/failure-1.ogg', 'failure-1');
audioMax.failure++;
*/

/*==============================================================================

Audio

==============================================================================*/

var audio = {};

audio.sounds = {};

audio.add = function( key, count, settings ) {
    audio.sounds[ key ] = [];
    settings.forEach( function( elem, index ) {
        var amount = count;
        audio.sounds[ key ].push( {
            tick: 0,
            count: amount,
            pool: []
        } );
        while( amount-- ) {
            var audiofile = new Audio();
            audiofile.src = elem;
            audio.sounds[ key ][ index ].pool.push( audiofile );
        }
    }, this );
};

audio.play = function( key, muted ) {
    if( muted ) {
        var sound = audio.sounds[ key ];
        var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
        soundData.pool[ soundData.tick ].play();
        if( soundData.tick < soundData.count - 1 ) {
            soundData.tick++;
        } else {
            soundData.tick = 0;
        }
    }
};

audio.add( 'hit', 20,
    [
        'audio/hit-1.ogg',
        'audio/hit-2.ogg',
        'audio/hit-3.ogg',
        'audio/hit-4.ogg',
        'audio/hit-5.ogg',
        'audio/hit-6.ogg',
        'audio/hit-7.ogg',
        'audio/hit-8.ogg',
        'audio/hit-9.ogg',
        'audio/hit-10.ogg',
        'audio/hit-11.ogg',
        'audio/hit-12.ogg'
    ]
);

audio.add( 'coin', 20,
    [
        'audio/coin-1.ogg',
        'audio/coin-2.ogg',
        'audio/coin-3.ogg',
        'audio/coin-4.ogg'
    ]
);

audio.add( 'endLine', 10,
    [
        'audio/endline-1.ogg',
        'audio/endline-2.ogg',
        'audio/endline-3.ogg',
        'audio/endline-4.ogg'
    ]
);

audio.add( 'powerup', 5,
    [
        'audio/powerup-1.ogg'
    ]
);

audio.add( 'start', 2,
    [
        'audio/start-1.ogg'
    ]
);

audio.add( 'click', 10,
    [
        'audio/click-1.ogg'
    ]
);

audio.add( 'hover', 10,
    [
        'audio/hover-1.ogg'
    ]
);

audio.add( 'upgrade', 5,
    [
        'audio/upgrade-1.ogg'
    ]
);

audio.add( 'error', 10,
    [
        'audio/error-1.ogg'
    ]
);

audio.add( 'success', 2,
    [
        'audio/success-1.ogg'
    ]
);

audio.add( 'failure', 2,
    [
        'audio/failure-1.ogg'
    ]
);