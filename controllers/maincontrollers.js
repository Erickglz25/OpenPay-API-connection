var Openpay = require('openpay');
var openpay = new Openpay(process.env.MERCHANT_ID,process.env.P_KEY);

exports._render_root = function(req, res) {
  res.render('index');
};

exports._render_userlist = function(req, res) {
  openpay.customers.list(function(error, list) {
    if(error){ res.send(500,error.message);}
    res.render('user/users',{
      users:list
    });
  });
};

exports._render_signup = function(req, res) {

  var messages = req.flash('error');
  res.render('user/signup',{
    messages:messages,
    noError:!messages.length > 0,
    csrfToken: req.csrfToken()
  });
};

exports._process_signup = function(req,res){

    /*Basic serverside validation*/

    req.checkBody('fname', 'Name required').notEmpty();
    req.checkBody('lname', 'Name required').notEmpty();
    req.checkBody('email', 'Email can not be empty').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('address','Address required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function(error){
        messages.push(error.msg);
      });
        req.flash('error',messages)
        return res.redirect('back');
    }

    var newCustomer = {
      "name":req.body.fname,
      "email":req.body.email,
      "last_name":req.body.lname,
      "address":{
        "city":req.body.city,
        "state":req.body.state,
        "line1":req.body.address,
        "line2":req.body.address,
        "postal_code":req.body.zip,
        "country_code":'MX'
      },
      "phone_number":req.body.phone
    };

    openpay.customers.create(newCustomer, function(error, body) {
        if(error){
          req.flash('error','error creating customer');
          res.send(500,error.message);
          res.redirect('back');
        }else{
          res.redirect('/users');
        }
    });
}
