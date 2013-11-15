var http = require("http");
var parse = require("url").parse;
var path = require("path");
var fs = require("fs");
var join = path.join;
var normalize = path.normalize;
var root = __dirname;

// add root url support, caching

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var reqPath = false;
  
  if (url.pathname == "/") {
    reqPath = normalize(join(root, '/index.html'));
  } else {
    reqPath = normalize(join(root, url.pathname));
  }

  if (pathIsValid(reqPath)) {
    fs.stat(reqPath, function(err, stats){
      if (err) {
        if ("ENOENT" == err.code) {
          res.statusCode = 404;
          res.end("Page not found");
        } else {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      } else {
        // if reqPath is "/" then change it to index.html
        var stream = fs.createReadStream(reqPath);
        stream.pipe(res);
        stream.on("error", function(err){
          res.statusCode = 500;
          res.end("Internal Server Error");
        });
      }
    });
  } else {
    res.statusCode = 400;
    res.end("Invalid Request");
  }
});

function pathIsValid(reqPath) {
  return (reqPath.indexOf("..") == -1);
}

var port = 4567
server.listen(port);
console.log("Static server started on port " + port)