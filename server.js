var http = require("http");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");

var root = __dirname

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var path = join(root, url.pathname);
  
  fs.stat(path, function(err, stats){
    if (err) {
      if ("ENOENT" == err.code) {
        res.statusCode = 404;
        res.end("Page not found")
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } else {
      var stream = fs.createReadStream(path);
      stream.pipe(res);
      stream.on("error", function(err){
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    }
  })
  
});

var port = 4567
server.listen(port);
console.log("Static server started on port " + port)