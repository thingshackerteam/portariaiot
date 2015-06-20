var express 	= require("express"),
	router 		= express.Router(),
	bodyParser 	= require('body-parser');

var tokenqrcode = 'CAAJFXsNRQm4BAESR8yqONZAl2Of6fhgviVdgZCqw88rFV4EyZABZACZA7t4u43RCsZAq9pPT268JmXV2hVVkCrt1NZAFECYXNk2xpoNkj5ksAvLLxrWIEEEt8eUogTv6sz95GepXw856ZCuNmbsASt5RDOZCOlk0cJqSZBOlhOS0YMbEyfiEgGbLthqVLbkgoZALljZBioj0mY7FxrzQL3P5vZBZBI';

router.post("/", function(req, res) {
	/*if(config.use_database==='true') {
	    connection.query("SELECT * from Usuario where IDUSUARIO=" + profile.id,function(err,rows,fields){
	    if(err) throw err;
	    if(rows.length === 0)
	      {
	        var name = profile.name.givenName + ' ' + profile.name.familyName;
	        connection.query("INSERT into Usuario(IDUSUARIO,NOME) VALUES('"+profile.id+"','"+name+"')");
	      }
	    });
  	}*/
  	res.send("Body " + JSON.stringify(req.body, null, 2));
});

router.get("/acesso/:token", function(req, res) {
	if(tokenqrcode === req.params.token) {
		res.send("1");
	} else {
		res.send("0");
	}
  	console.log(req.params.token);
  
  //console.log(JSON.stringify(req.body, null, 2));
  //res.send("Body " + JSON.stringify(req.body, null, 2));
});

module.exports = router;