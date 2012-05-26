
(function($) {

	var server = window.location.origin;

	var socket = io.connect(server);

	socket.on('result', function (data) {
	  
	  if(! $('#q-'+data.id).length ) {
	    // xss escape
	    var question = $('<div/>').text(data.q).html(),
	      id = $('<div/>').text(data.id).html();

	    var row = '<div class="row"><div class="span12"><h3>'+question+'</h3><div id="q-'+id+'"></div></div></div>';

	    $('.results').prepend(row);

	    drawChart(data);
	  } else {
	    drawChart(data);
	  }

	});

	socket.on('connect', function (data) {
	  // todo
	});

	socket.on('disconnect', function (data) {
	  // todo
	});

	var app_url = window.location.origin + '/mobile',
	  enc_url = encodeURI(app_url);

	// set URL for user
	$('.url').text(app_url);

	// generate QR Code
	$('<img/>', {
	    src: 'https://chart.googleapis.com/chart?&cht=qr&chs=250x250&chld=L|2&ch1='+enc_url,
	    alt: 'QR Code',
	}).appendTo('.qrcode');

	// --- google charts part

	google.load("visualization", "1", {packages:["corechart"]});

	function drawChart(obj) {

	  var obj = obj || {};

	  var data = google.visualization.arrayToDataTable([
	    ['Vastaus', 'Kylla tai Ei'],
	    ['Kylla', obj.y],
	    ['Ei', obj.n]
	  ]);

	  var options = { colors:['green','red'], width: 340, height: 340, legend: { position: 'none' } };

	  var chart = new google.visualization.PieChart(document.getElementById('q-'+obj.id));
	  chart.draw(data, options);
	}

})(jQuery);
