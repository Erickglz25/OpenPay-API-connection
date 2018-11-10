var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var mainctrl = require('../controllers/maincontrollers.js');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/',mainctrl._render_root);

router.get('/users',mainctrl._render_userlist);

router.get('/signup',mainctrl._render_signup);

router.post('/signup',mainctrl._process_signup);


module.exports = router;
