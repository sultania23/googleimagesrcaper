var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var cheerio = require("cheerio");
var request = require('request');
var db = mongoose.connection;
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});
router.post('/submit',function (req,res) {
   var query_text = req.body.textquery;

    var url = "https://www.google.com/search?tbm=isch&q=";
    url = url+query_text;


    var data =[];
    request(url, function (error, response, html) {
        var $ = cheerio.load(html);
        var cnt =0;
        db.collection('title').insert({
            title: query_text
        });

        $('img').each(function(i, element) {
            var src = $(element).attr('src');
            if(cnt>=16)
            {
               // res.render('index', { title: 'Main Page' });
                return ;
            }
            if(src===undefined) {
                //do nothing
            }
            else
            {
                cnt = cnt +1;
                db.collection(query_text).insert({
                    title: src
                });
            }
            //console.log(cnt);
        });
        res.render('index');
    });
});

router.get('/retrieve',function (req,res) {
    var arr=[];
    db.collection('title').find().toArray(function(err, docs) {
        //console.log("Printing docs from Array");
        docs.forEach(function(doc) {
            //console.log("Doc from array");
            arr.push(doc);
            //console.log(doc);
        });
        //console.log(json);
        //JSON.stringify(json);

        res.render('search',{arr: arr});
    });
    //console.log(json);
});
router.get('/images',function (req,res) {

    console.log(req.query.title);

    var arr=[];
    db.collection(req.query.title).find().toArray(function(err, docs) {
        //console.log("Printing docs from Array");
        docs.forEach(function(doc) {
            //console.log("Doc from array");
            arr.push(doc);
        });
        res.render('images',{arr: arr});
    });

})
module.exports = router;
