var express           =     require('express')
  , passport          =     require('passport')
  , util              =     require('util')
  , FacebookStrategy  =     require('passport-facebook').Strategy
  , session           =     require('express-session')
  , cookieParser      =     require('cookie-parser')
  , bodyParser        =     require('body-parser')
  , config            =     require('./configuration/config')
  , cadastro          =     require('./user/cadastro')
  , mysql             =     require('mysql')
  , usuario           =     require('./routes/usuario')
  , facebook          =     require('./routes/facebook.js')
  , app               =     express();


//Cors
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database,
  port: config.port
});

//Connect to Database only if Config.js parameter is set.
if(config.use_database==='true')
{
  connection.connect();
}

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //console.log('token : ' + accessToken);
      /*if(config.use_database==='true')
      {
        connection.query("SELECT * from Usuario where IDUSUARIO=" + profile.id,function(err,rows,fields){
        if(err) throw err;
        if(rows.length === 0)
          {
            var name = profile.name.givenName + ' ' + profile.name.familyName;
            connection.query("INSERT into Usuario(IDUSUARIO,NOME) VALUES('"+profile.id+"','"+name+"')");
          }
        });
      }*/
      return done(null, profile);
    });
  }
));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope: ['user_friends', 'email', 'read_stream', 'public_profile', 'user_birthday', 'user_hometown', 'user_likes', 'user_location']}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/list', function(req, res) {
  facebook.getFbData('CAAJFXsNRQm4BAFjVyr3hfeutD1j72kDeqtHFavFXUwPWtSHuvGKeBAaUM4fwPaSvfoFx3h3bCzZBYcst0higxMZACIyyOA2cARtEMTUSLW2NDFcO2ibY0GeSDmQ27qzGE0ezK1Df64605J3SWRHpBYG0gMGXvI7YJSkGCVeZAJ3TSGYSvMrJ1WJ4L9hru6niSd9cRiENLqvJZA6zD7kX', '/me/friends', function(data){
    res.send(data);
  });
});

/*app.get('/testebd', function(req, res){
  if(config.use_database==='true')
  {
    //connection.query("SELECT * from user_info where user_id="+profile.id,function(err,rows,fields){
    connection.query("SELECT * from Usuario",function(err,rows,fields){
    if(err) throw err;
    res.send(rows);
  });
  }
});*/

app.post('/cadastro', function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(cadastro.novoCadastro(req)));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.use('/usuario', usuario);

app.listen(3000);

console.log("Servidor iniciado na porta 3000");