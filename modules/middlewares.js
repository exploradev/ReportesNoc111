var mysql = require('mysql');
var connection = require('./db');



module.exports = {
    requireLogin: function(req,res,next){
        if (!req.sessiondsc.user) {
            res.redirect('/');
        } else {
            next();
        }
    },
//**************************************************************** */
//**************************************************************** */
//**************************************************************** */
    login_iniciated: function(req, res, next) {
        if (req.sessiondsc.user) {
            res.redirect('/asesor');
        } else {
            next();
        }
    },
}