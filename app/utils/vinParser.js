import request from 'request';

const j = request.jar();
const req = request.defaults({jar: j});

req({
  url: 'http://dealer.vin-check.com.ua/',
  method: 'POST',
  form: {
    username: 'dedvitalik',
    password: 'Cg8h2eck',
    rememberme: '0',
    cmdweblogin: 'Войти',
  },
}, (error, response, body) => {
  req({
    url: 'http://dealer.vin-check.com.ua/window-sticker',
    method: 'GET',
  }, function(error, response, body) {
    console.log(body);
  });
});

// curl --data "rememberme=0&username=dedvitalik&password=Cg8h2eck&cmdweblogin=Войти" --request
// POST --header "Content-Type:application/x-w
// ww-form-urlencoded" http://dealer.vin-check.com.ua/
