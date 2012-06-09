
(function($) {

	"use strict";
	
	var server = window.location.protocol + '//' + window.location.host;

	var socket = io.connect(server);

	socket.on('result', function (data) {
	  
	  if(! $('#q-'+data.id).length ) {
	    // xss cleaning
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

	var app_url = window.location.protocol + '//' + window.location.host + '/mobile',
		url = "https://www.googleapis.com/urlshortener/v1/url",
  		params = JSON.stringify({ "longUrl": app_url, "key": "AIzaSyBdhX1T_3kNk8WFXNzTpnBshi6vg3GKlWU" });

	var jqxhr = $.ajax(url, { type:"POST", contentType: "application/json", data: params });

	jqxhr.done( function(data, textStatus, jqXHR) { 
		// set URL for user
		$('.url').text(data.id);

		// generate QR Code
		// https://developers.google.com/chart/infographics/docs/qr_codes
		$('<img/>', {
		    src: 'https://chart.googleapis.com/chart?&cht=qr&chs=250x250&chld=Q|2&chl='+data.id,
		    alt: 'QR Code',
		}).appendTo('.qrcode');
	});

    jqxhr.fail( function(jqXHR, textStatus, errorThrown) { alert("error loading url from goo.gl"); })

	// --- google charts part

	google.load("visualization", "1", {packages:["corechart"]});

	function drawChart(obj) {

	  var obj = obj || {};

	  var data = google.visualization.arrayToDataTable([
	    ['Vastaus', 'Kylla tai Ei'],
	    ['Kylla', obj.y],
	    ['Ei', obj.n]
	  ]);

	  var options = { colors:['green','red'], width: 340, height: 400, legend: { position: 'top' } };

	  var chart = new google.visualization.PieChart(document.getElementById('q-'+obj.id));
	  chart.draw(data, options);
	}

})(jQuery);
