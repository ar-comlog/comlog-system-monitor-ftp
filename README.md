# Watch a FTP Server

Installation via
```sh
$ npm install -s comlog-system-monitor-ftp
```

# Usage
```javascript
var Service = require('comlog-system-monitor-ftp');

var csmf = new Service({
	host: 'ftp.mydomain.org', // Required if not localhost
	user: 'myuser', // Required if not localhost
	password: 'mypassword', // Required if not localhost
	port: 21, // Optional
	interval: 60000 // Optional 1 Minute
});

csmf.on('error', function(err) {
    console.error(err);
});

// bind event
csmf.on('down', function() {
    console.info('FTP Server is donw');
});

// bind event
csmf.on('up', function() {
    console.info('FTP Server is up');
});

csmf.start()
```
