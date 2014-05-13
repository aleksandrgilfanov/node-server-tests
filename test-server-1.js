/*
  listen server
  wait for client
  get full request + content

  do nothing....
*/

var net = require('net');

var port = 8080;

var server = net.createServer(function(c) {
  console.log('client connected ' + c.remoteAddress + ':' + c.remotePort);

  c.on('end', function() {
    console.log('client disconnected');
  });

  var packet = "";

  c.on('data', function(piece) {
    packet += piece;
    var header_end = packet.indexOf("\r\n\r\n");
    if ( header_end != -1)
    {
    	/* we got headers... */
    	var content_length = 0;
    	var done = false;
    	var result = packet.match(/Content-Length: (\d+)/);
    	if (result != null)
    	{
    		content_length = parseInt(result[1]) ;
    	}
    	console.log('content length is ' + content_length);
    	/* do we have content? */
    	if ( content_length > 0 ) {
    		var content = packet.slice(header_end + "\r\n\r\n".length);
    		console.log('received content: ' + content.length);
    		if (content_length == content.length) {
    			done = true;
    		}
    	}
      else if ( content_length == 0) {
        done = true;
      }

    	/* request recieved */
    	if ( done == true ) {
    		console.log('request received...');
    		console.log(packet);
    	}

     }
  });

});


server.listen(port, function() {
  var serverAddress = server.address();
  console.log( 'server is listening at port ' + serverAddress.address + ':' + serverAddress.port );
});