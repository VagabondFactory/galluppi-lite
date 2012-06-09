
(function($) {

	"use strict";

	var server = window.location.protocol + '//' + window.location.host;

	var socket = io.connect(server);

	socket.on('connect', function (data) {
	  $('.question').text('Esitä kysymys');
	});

	socket.on('disconnect', function (data) {
	  $('.question').text('Virhe! Yhteys Galluppi palveluun katkesi');
	});

	$('.btn').on('click tap', function(event) {
	  event.preventDefault();

	  var $text = $('input[type="text"]'),
	    txt = $text.val().trim();

	  if(txt.length) {

	    txt = txt.match(/\?$/) ? txt : txt + '?';

	    socket.emit('question', { 'q' : txt });

	    $text.val('').focus();
	  }

	});

})(jQuery);
