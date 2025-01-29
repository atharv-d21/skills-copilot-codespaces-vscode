// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;

    if (pathname === '/') {
        fs.readFile('comments.html', 'utf-8', function(err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    } else if (pathname === '/comment') {
        var postData = '';
        request.setEncoding('utf-8');
        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener('end', function() {
            var params = qs.parse(postData);
            fs.readFile('comments.json', 'utf-8', function(err, data) {
                var comments = JSON.parse(data);
                comments.push(params);
                fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write('Thanks for your comment');
                    response.end();
                });
            });
        });
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('Page not found');
        response.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');