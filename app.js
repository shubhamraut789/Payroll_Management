const express=require('express');
const app=express();
const hbs=require('hbs');
const mysql=require('mysql');
const path=require('path');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser = require('body-parser');
const port=process.env.port||1010;
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));  
app.use(express.static('public'));
app.use("/css", express.static("css"));
app.use(express.urlencoded());
app.set('view engine','hbs');
app.set('views','views');
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(session({
    secret:'cat is dead',
    cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'akash1045',
    database : 'payroll'
});
connection.connect((err)=>{
        if(!err)
        console.log("Database is connected!!");
        else
        console.log(`Database connection is failed : ` + JSON.stringify(err,undefined,2));
    });
    
    app.use(function(req, res, next){
        //res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });


    app.listen(port,function(){
        console.log("application running on port: "+ port);
    });
 

    app.post('/admin', function(req, res){

        var admin_id = '100';
        var admin_pass = '123';

        if(admin_id == req.body.admin_id & admin_pass == req.body.pass){

            res.redirect('/admin-login')
        } 
        // res.redirect('/admin-login')
    })

    app.get('/',function(req,res){
        res.render('index');
    });

    app.get('/admin',function(req,res){
        res.render('admin'); 
    });
    app.get('/about',function(req,res){
        res.render('about');
    });
    app.get('/admin-login',function(req,res){
        res.render('admin-login');
    });
    app.get('/register',function(req,res){
        res.render('register');
    });
    app.get('/salary-report',function(req,res){
        res.render('salary-report',{
            // E_name :req.session.emp_name ,
            // E_mail:req.session.email ,
            // Date_of_join :req.session.dateofjoin =inputData.Date_of_join,
            // E_Dept:req.session.role 
        });
    });
    app.get('/admin-about',function(req,res){
        res.render('admin-about');
    });
    app.get('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
      });
    app.get('/empinfo', function(req, res) {
        res.render('empinfo')
      });





    app.post("/register", function (req, res, next) {
        inputData = {
            E_name : req.body.emp_name,
          gender: req.body.gender,
          E_DOB: req.body.dateofbirth,
          E_email: req.body.email,
          Date_of_join: req.body.dateofjoin,
          E_Dept: req.body.role,
          E_address: req.body.address,
          E_phno: req.body.phone,
          Password: req.body.password,
          Confirm_Pass: req.body.confirm_password,
        };
        
        // check 

        var sql = "INSERT INTO registration SET ?";
        connection.query(sql, inputData, function (err, data) {
          if (err) throw err;
          else{
            
            req.session.emp_name =inputData.E_name,

            req.session.email =inputData.E_mail,
            req.session.dateofjoin =inputData.Date_of_join,
            req.session.role =inputData.E_Dept,

              res.redirect('/salary-report')
          }
        });
        

      });
      
      

      app.get('/showregi',function (req, res, next){
        var sql = "SELECT * FROM registration " ;
        connection.query(sql,function (err, data, fields) {
            if(err) throw err;
    
            else{
               
                res.send(data)
               
            }
    
        })
    
      });


      app.post('/delete' , function(req,res){
        
        var id = req.body.c_id;
        
        var sql = "DELETE FROM registration Where E_id =?" ;
        connection.query(sql,[req.body.c_id],function (err, data, fields) {
                if(err) throw err;
                else{
                    console.log("deleted")
                    res.redirect('/empinfo')
                }
    
        });
    })

