var http = require("http");
var parse = require("url").parse;
var path = require("path");
var fs = require("fs");
var join = path.join;
var normalize = path.normalize;
var root = __dirname;

var server = http.createServer(function(req, res){
  var url = parse(req.url);
  var reqPath = parsedReqPath(url);
  
  if (pathIsValid(reqPath)) {
    sendResponse(reqPath, res);
  } else {
    invalidRequest(res);
  }
});

function parsedReqPath(url) {
  if (url.pathname == "/") {
    return normalize(join(root, '/index.html'));
  } else {
    return normalize(join(root, url.pathname));
  }
}

function pathIsValid(reqPath) {
  return (reqPath.indexOf("..") == -1);
}

function sendResponse(reqPath, res) {
  fs.stat(reqPath, function(err, stats){
    if (err) {
      if ("ENOENT" == err.code) {
        notFound(res);
      } else {
        serverError(res);
      }
    } else {
      var stream = fs.createReadStream(reqPath);
      stream.pipe(res);
      stream.on("error", function(err){
        serverError(res);
      });
    }
  });
}

function invalidRequest(res) {
  res.statusCode = 400;
  res.end("Invalid Request");
}

function notFound(res) {
  res.statusCode = 404;
  res.end("Page not found");
}

function serverError(res) {
  res.statusCode = 500;
  res.end("Internal Server Error");
}

var port = 4567;
server.listen(port);
console.log("Server started on port " + port);