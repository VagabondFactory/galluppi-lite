
(function($) {

	var server = window.location.origin;

	var socket = io.connect(server);

	socket.on('question', function (data) {

	  var data = data || {};

	  var $question = $('.answer');
	  $question.attr('id', data.id);
	  $question.find('p').text(data.q);

	  $('.message').fadeOut(function() {
	    $question.fadeIn();
	  });

	});

	socket.on('connect', function (data) {
	  $('.message p').text('Odotetaan kysymystä...');
	});

	socket.on('disconnect', function (data) {
	  $('.message p').text('Virhe! Yhteys Galluppi palveluun katkesi');
	  $('.hero-unit').fadeOut(function() { 
	    $('.message').fadeIn();
	  });
	});

	$('.btn').on('click tap', function(event) {
	  event.preventDefault();

	  var $tgt = $(event.target);

	  var val = $tgt.attr('id'),
	    a = val == 'yes' ? 1 : 0;
	  
	  var $question = $('.answer'),
	    id = $question.attr('id');

	  var answer = { 'id': id, 'a': a };

	  socket.emit('answer', answer);

	  $('.hero-unit').fadeOut(function() { 
	  $('.message p').text('Kiitos vastauksestasi!')
	  $('.message').fadeIn();
	  setTimeout(function() {
	    $('.message p').text('Odotetaan kysymystä...');
	  }, 4000);

	});

	});

})(jQuery);
