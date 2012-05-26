
  var express = require('express'),
    app = express.createServer(),
    _ = require('underscore')._,
    io = require('socket.io').listen(app);

  io.enable('browser client minification'); // send minified client
  io.enable('browser client etag'); // apply etag caching logic based on version number
  io.enable('browser client gzip'); // gzip the file
  io.set('log level', 0); // reduce logging

  app.use('/static', express.static(__dirname + '/static'));

  app.configure('development',
  function() {
      app.use(express.errorHandler({
          dumpExceptions: true,
          showStack: true
      }));
  });

  app.configure('production',
  function() {
      app.use(express.errorHandler());
  });

  // Routes
  app.get('/',
  function(req, res) {
      res.sendfile(__dirname + '/index.html');
  });

  app.get('/admin',
  function(req, res) {
      res.sendfile(__dirname + '/admin/index.html');
  });

  app.get('/mobile',
  function(req, res) {
      res.sendfile(__dirname + '/mobile/index.html');
  });

  app.listen(8080,
  function() {
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });

  var questions = [],
    qid = 0;

  io.sockets.on('connection',
  function(socket) {
    socket.on('answer',
    function(data) {
        var question = _.find(questions,
        function(question) {
            return question.id == data.id;
        });

        if (question) {

            if (data.a == 1) {
                question['y'] += 1;
            } else {
                question['n'] += 1;
            }

            socket.broadcast.emit('result', question);
        }
    });

    socket.on('question',
    function(data) {
        // add new question id
        data.id = qid++;
        // make question obj
        var question = { 'id': data.id, 'q': data.q, 'y': 0, 'n': 0 };
        // save obj
        questions.push(question);
        // send to mobiles
        socket.broadcast.emit('question', data);
    });

    socket.on('connect',
    function() {
        // socket.broadcast.emit('user connected');
    });

    socket.on('disconnect',
    function() {
        // socket.broadcast.emit('user disconnected');
    });

  });
