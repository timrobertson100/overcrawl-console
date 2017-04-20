var http = require('http'),
    httpProxy = require('http-proxy');


var proxy = httpProxy.createProxyServer({target:'http://prodsolr05-vh.gbif.org:8983'});

proxy.on('proxyRes', function (proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

proxy.listen(8983); 