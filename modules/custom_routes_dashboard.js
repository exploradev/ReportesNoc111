middleware = require('./middlewares');
var mysql = require('mysql');
var connection = require('./db');
var moment = require('moment');


module.exports = function(app,io){

    

    app.post('/shametopten', middleware.requireLogin, function (req, res) {

        var shamearray = [];
        var current_month = (moment().month()) + 1;
        var activadores = "SELECT        CONCAT(user.lastname, ' ', user.name) AS vendedor,            SUM(CASE WHEN request.status != 'borrador' and month(request.created) = month(now()) THEN 1 ELSE 0 END) AS capturas FROM request LEFT JOIN user ON request.iduser = user.iduser        WHERE user.active = 1  GROUP BY vendedor   ORDER BY capturas ASC LIMIT 10";
        var inserts = [current_month];
        var query_activadores = mysql.format(activadores, inserts);
        connection.query(query_activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'vendedor': element.vendedor,
                    'capturas': element.capturas,
                }
                shamearray.push(row);
            });
            res.send(shamearray);
        });
    }); //fin del /shametopten

    app.post('/getCapturasBlackdashboard', middleware.requireLogin, function (req, res) {

        var blackdashboard = [];
        var current_month = (moment().month()) + 1;
        var activadores = "SELECT day(request.created) as dia, count(*) as capturas from request where request.status != 'borrador'  AND month(request.created) = ? group by day(request.created) order by day(request.created) ASC";
        var inserts = [current_month];
        var query_activadores = mysql.format(activadores, inserts);
        connection.query(query_activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'dia': element.dia,
                    'capturas': element.capturas,
                }
                blackdashboard.push(row);
            });
            res.send(blackdashboard);
        });
    }); //fin del /getCapturasBlackdashboard

    app.post('/getActivasBlackdashboard', middleware.requireLogin, function (req, res) {

        var blackdashboard = [];
        var current_month = (moment().month()) + 1;
        var activadores = "SELECT day(request.activated) as dia, count(*) as activas from request where month(request.activated) = ? group by day(request.activated) order by day(request.activated) ASC";
        var inserts = [current_month];
        var query_activadores = mysql.format(activadores, inserts);
        connection.query(query_activadores, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'dia': element.dia,
                    'activas': element.activas,
                }
                blackdashboard.push(row);
            });
            res.send(blackdashboard);
        });
    }); //fin del /getActivasBlackdashboard

    app.post('/countercampaign', middleware.requireLogin, function (req, res) {


        //1 excelentes
        //2 estrena

        var statistics_data = [];
        var current_month = (moment().month() + 1);
        var activadores = "SELECT SUM(CASE WHEN request.status = 'activa' AND MONTH(request.activated) = ? AND user.idcampaign = 1 THEN 1 ELSE 0 END) AS excelentes, SUM(CASE WHEN request.status = 'activa' AND MONTH(request.activated) = ? AND user.idcampaign = 2 THEN 1 ELSE 0 END) AS estrena FROM request LEFT JOIN user ON request.iduser = user.iduser";
        var inserts = [current_month, current_month];
        var query_statistics = mysql.format(activadores, inserts);
        connection.query(query_statistics, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'excelentes': element.excelentes,
                    'estrena': element.estrena
                }
                statistics_data.push(row);
            });
            res.send(statistics_data);
        });

    }); //fin del /shametopten

    app.post('/getDailyCreatedByCampaign', middleware.requireLogin, function (req, res) {

        var responsearray = [];
        
        var query = "SELECT SUM(CASE WHEN request.status != 'borrador' AND date(request.created) = date(now()) AND campaign.idcampaign = 1 THEN 1 ELSE 0 END) AS cdexcelentes,        SUM(CASE WHEN request.status != 'borrador' AND date(request.created) = date(now()) AND campaign.idcampaign = 2 THEN 1 ELSE 0 END) AS cdestrena        FROM request LEFT JOIN user ON request.iduser = user.iduser LEFT JOIN campaign on user.idcampaign = campaign.idcampaign;";
        
        
        connection.query(query, function (error, results, field) {
            if (error) throw error;
            results.forEach(element => {
                var row = {
                    'estrena': element.cdestrena,
                    'excelentes': element.cdexcelentes,
                }
                responsearray.push(row);
            });
            res.send(responsearray);
        });
    }); //fin del /getDailyCreatedByCampaign

}// fin del archivo