var Client = require('ftp');

function ComlogFTPWatcher(options) {
	require('comlog-event-handler')(this);

	var	_self = this;
	this.satus = null; // null = start, true = off, false = on
	this.debug = false;
	this.interval = 60000; // 1 Minute

	// Private funktionen
	var _running = false, _timer = null;
	if (!options) options = {};
	options.host = options.host || options.name || 'localhost';
	options.port = options.port || 21;
	options.user = options.user || 'anonymous';
	options.password = options.password || options.pass || 'anonymous@';

	// Extracting local options
	for(var i in options) {
		if (typeof this[i] != 'undefined') {
			this[i] = options[i];
			delete options[i];
		}
	}

	function _watch() {
		if (_running) return;
		_running = true;

		var c = new Client();
		var __event = function(err) {
			if (err !== null) {
				if (_self.debug) console.error(err.stack || err);
				_self.emit('error', [new Error("Connection to \""+options.user+'@'+options.host+"\" filed \n"+err.message)]);
				if (_self.satus === true) _self.emit('down');
				_self.satus = false;
			}
			else {
				var new_status = true, msg = "Connection to \""+options.user+'@'+options.host+"\" check ok \n";

				// check result
				if (_self.debug) console.info(msg);
				if (_self.satus !== null && _self.satus !== new_status) _self.emit(new_status ? 'up' : 'down');
				_self.satus = new_status;

				// End connection
				c.end();
			}

			// Destroy connection
			try { c.destroy(); } catch (e) {}

			_running = false;
			_timer = setTimeout(_watch, _self.interval);
		}

		c.on('ready', function() { __event(null); });
		c.on('error', __event);
		c.connect(options);
	}

	/**
	 * Überwachung starten
	 */
	this.start = function() {
		_watch();
	};

	/**
	 * Überwachung stoppen
	 */
	this.stop = function() {
		if (_timer !== null) clearInterval(_timer);
	};

	for(var i in options) this[i] = options[i];
}

module.exports = ComlogFTPWatcher;