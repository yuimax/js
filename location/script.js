function print(id, text) {
    document.getElementById(id).innerHTML = text;
}

function init() {
	print('loc_href',     location.href);
	print('loc_protocol', location.protocol);
	print('loc_hostname', location.hostname);
	print('loc_port',     location.port);
	print('loc_pathname', location.pathname);
	print('loc_search',   location.search);
	print('loc_hash',     location.hash);
	print('loc_host',     location.host);
	print('loc_origin',   location.origin);
}
