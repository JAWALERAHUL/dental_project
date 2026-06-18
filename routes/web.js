var express=require('express');
var router=express.Router();
var query1=require('../db.js');
 
router.get('/', async (req, res) => {

    var sql = 'SELECT * FROM blog';
    var blog=await query1(sql);
    var ser_sql='select * from service';
    var service_data=await query1(ser_sql);
    res.render('web/index.ejs',{blog:blog,service:service_data});

});

router.post('/book_appointment', async (req, res) => {

    var sql = `INSERT INTO appointment_enquiry
        (name, email, service_id, appointment_date, status)
        VALUES (?, ?, ?, ?, ?)`;
        var values = [
        req.body.name,
        req.body.email,
        req.body.service_id,
        req.body.appointment_date,
        'Pending'
    ];

    await query1(sql, values);

    res.redirect('/');
});

router.get('/Whyus',(req,res)=>{
    //res.send('welcome web panel');
    res.render('web/Whyus.ejs');
})

router.get('/service',(req,res)=>{
    //res.send('welcome web panel');
    res.render('web/service.ejs');
})

router.get('/team',async(req,res)=>{
  var sql='select * from team';
    var data=await query1(sql);
    res.render('web/team.ejs',{data:data}); 
})


router.get('/Pricing',(req,res)=>{
    //res.send('welcome web panel');
    res.render('web/Pricing.ejs');
})

router.get('/DentalSolutions',async(req,res)=>{
    var sql='select * from dentalSolutions';
    var data=await query1(sql);
    res.render('web/DentalSolutions.ejs',{data:data}); 
        });
    



module.exports=router;