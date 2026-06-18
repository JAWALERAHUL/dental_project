var express=require('express');
var router=express.Router();
var query1=require('../db.js');
var path=require('path');
var fs = require('fs');
var path = require('path');




 router.get('/',async(req,res)=>{
    //  var sql='select * from login';
    //  var data=await q(sql);
    //  //res.send(data);
     res.render('admin/login.ejs');
 })

 router.post('/login_check',async(req,res)=>{
    //res.send(req.body);
    var {username,password}=req.body;
    var sql='select * from login where username=? and password=?';
    var data=await query1(sql,[username,password]);
    //res.send(data);
    if(data[0]){
        req.session.lid=data[0].lid;
        req.session.admin_name=data[0].admin_name;
        res.redirect('/admin/index');
}else{
    res.redirect('/admin/');
}
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/');
})


router.get('/forgot',(req,res)=>{
    res.render('admin/forgot.ejs');
})


router.get('/index',(req,res)=>{
    res.render('admin/index.ejs');
})

router.get('/DentalSolutions',async(req,res)=>{
    var sql='select * from dentalSolutions';
    var data=await query1(sql);
     res.render('admin/DentalSolutions', {
        data: data
    });
})
router.post('/DentalSolutions_save',async(req,res)=>{
    var{title,desc}=req.body;
var sql='insert into dentalSolutions(title,description)value(?,?)';
var data=await query1(sql,[title,desc]);
//res.send(data);
res.redirect('/admin/DentalSolutions');
    
})

router.get('/DentalSolutions_delete/:id',async(req,res)=>{
var id =req.params.id;
var sql = "DELETE FROM dentalSolutions WHERE ds_id=?";
await query1(sql,[id]);
res.redirect('/admin/DentalSolutions');
})

router.get('/DentalSolutions_edit/:id', async (req, res) => {
    var id = req.params.id;

    var sql = "SELECT * FROM dentalSolutions WHERE ds_id=?";
    var data = await query1(sql, [id]);

    res.render('admin/DentalSolutions_edit.ejs', {
        data: data[0]
    });
});

router.post('/DentalSolutions_edit_save/:id', async (req, res) => {

    var id = req.params.id;
    var { title, desc } = req.body;

    var sql = 'UPDATE dentalSolutions SET title=?, description=? WHERE ds_id=?';

    await query1(sql, [title, desc, id]);

    res.redirect('/admin/DentalSolutions');

});


router.get('/team',async(req,res)=>{
    var sql='select * from team';
    var data=await query1(sql);
     res.render('admin/team.ejs', {
        data: data
    });
})


router.post('/team_save',async(req,res)=>{
    var{title,desc}=req.body;
var sql='insert into team(title,description)value(?,?)';
var data=await query1(sql,[title,desc]);
//res.send(data);
res.redirect('/admin/team');
    
})

router.get('/team_delete/:id',async(req,res)=>{
var id =req.params.id;
var sql = "DELETE FROM team WHERE ds_id=?";
await query1(sql,[id]);
res.redirect('/admin/team');
})

router.get('/team_edit/:id', async (req, res) => {
    var id = req.params.id;

    var sql = "SELECT * FROM team WHERE ds_id=?";
    var data = await query1(sql, [id]);

    res.render('admin/team_edit.ejs', {
        data: data[0]
    });
});

router.post('/team_edit_save/:id', async (req, res) => {

    var id = req.params.id;
    var { title, desc } = req.body;

    var sql = 'UPDATE team SET title=?, description=? WHERE ds_id=?';

    await query1(sql, [title, desc, id]);

    res.redirect('/admin/team');

});


router.get('/blog', async (req, res) => {
    var sql = 'SELECT * FROM blogs';
    var data = await query1(sql);
     res.render('admin/blog.ejs', {data: data});
});
router.post('/blog_save',async(req,res)=>{
   
    var {bdate,btitle,bdesc}=req.body;
    var fname=Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../','public/images/',fname);
    req.files.bphoto.mv(uploadpath);
    var sql="insert into blog (bdate,btitle,bdesc,bphoto)values(?,?,?,?)"; 
    var data=await query1(sql,[bdate,btitle,bdesc,fname]);
    res.redirect('/admin/blog');
});

router.get('/blog_delete/:id/:img', async (req, res) => {
    var id = req.params.id;
    var img = req.params.img;

    var imgpath = path.join(__dirname, '../public/images', img);

    fs.unlink(imgpath, (err) => {
        if (err) console.log(err);
    });

    var sql = 'delete from blog where blog_id=?';
    await query1(sql, [id]);

    res.redirect('/admin/blog');
});



router.get('/blog_edit/:id',async(req,res)=>{
    var id=req.params.id;
   var sql = 'SELECT * FROM blog WHERE blog_id=?';
    var data=await query1(sql,[id]);
    res.render('admin/blog_edit_save', {
    data: data[0]
});
});

router.post('/blog_edit_save/:id/:img', async (req, res) => {

    var id = req.params.id;
    var img = req.params.img;

    var { bdate, btitle, bdescription } = req.body;

    // ✅ SAFE DATE HANDLING
    if (bdate) {
        var dateObj = new Date(bdate);

        var year = dateObj.getFullYear();
        var month = String(dateObj.getMonth() + 1).padStart(2, '0');
        var day = String(dateObj.getDate()).padStart(2, '0');

        bdate = `${year}-${month}-${day}`;
    } else {
        bdate = null;
    }

    var newimg = img;

    if (req.files && req.files.bphoto) {

        newimg = Date.now() + req.files.bphoto.name;

        var uploadpath = path.join(__dirname, '../public/images', newimg);
        await req.files.bphoto.mv(uploadpath);

        // old image delete
        var imgpath = path.join(__dirname, '../public/images', img);
        fs.unlink(imgpath, (err) => {
            if (err) console.log(err);
        });
    }

    // 🔥 FIXED QUERY (bid → blog_id, bdescription → bdesc)
    var sql = 'UPDATE blog SET bdate=?, btitle=?, bdesc=?, bphoto=? WHERE blog_id=?';

    await query1(sql, [bdate, btitle, bdescription, newimg, id]);

    res.redirect('/admin/blog');
});


router.get('/pending_appointment', async (req, res) => {

    var sql = 'SELECT * FROM appointment_enquiry WHERE status= ?';

    var data = await query1(sql,['pending']);

    res.render('admin/pending_appointment.ejs', {data: data});

});

router.get('/appointment_confirm',async(req,res)=>{
    var sql='select * from appointment_enquiry where status=?';
    var data=await query1(sql,['confirm']);
    res.render('admin/appointment_confirm.ejs',{data:data});
})

router.get('/appointment_reject',async(req,res)=>{
    var sql='select * from appointment_enquiry where status=?';
    var data=await query1(sql,['reject']);
    res.render('admin/appointment_reject.ejs',{data:data});
})

router.get('/confirm_appointment/:id', async(req,res)=>{

    var sql="update appointment_enquiry set status=? where aid=?";

    await query1(sql,['confirm',req.params.id]);

    res.redirect('/admin/appointment_confirm');

});

router.get('/reject_appointment/:id', async(req,res)=>{

    var sql="update appointment_enquiry set status=? where aid=?";

    await query1(sql,['reject',req.params.id]);

    res.redirect('/admin/appointment_reject');

});


module.exports=router;