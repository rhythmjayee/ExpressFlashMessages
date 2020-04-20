const express=require('express');
const ejs=require("ejs");
const cookieParser=require('cookie-parser');
const session=require('express-session');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");
const app=express();




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser('secert'));
app.use(session({cookie:{maxAge:null}}));

app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message
    next()
});
mongoose.connect('mongodb+srv://admin-RhythmJayee:test123@cluster0-zvjdt.mongodb.net/userDataBase',{ useUnifiedTopology: true,useNewUrlParser: true });
// mongoose.connect('mongodb://localhost:27017/userDataBase',{ useUnifiedTopology: true,useNewUrlParser: true });


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:[true,"Email address is required"],
        validate:[validateEmail,"please filla valid email address"],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    pincode:{
        type:Number,
        required:true
    }
});

const User=new mongoose.model("User",userSchema);






app.get('/',function(req,res){
    res.render('register');
});

app.post('/',function(req,res){
    const newUser=new User({
        name:req.body.username,
        email:req.body.emailId,
        pincode:req.body.pincode
    });
    if(newUser.name.length==0 ||newUser.email==''){
        req.session.message={
            type:'danger',
            intro:"Empty fields",
            message:'please insert the required info'
        }
        res.redirect('/');
    }
    else if(req.body.pincode.length!=6){
        req.session.message={
            type:'danger',
            intro:"Invalid Pincode",
            message:'please insert the valid Pincode'
        }
        res.redirect('/');
    }

    else{
        const Email=newUser.email;

        User.findOne({email:Email},function(err,foundUser){
            if(err){
                console.log(err);
                req.session.message={
                    type:'danger',
                    intro:"OPPS!!!",
                    message:'Something went wrong'
                }
                res.redirect('/')
            }
            else{
                if(foundUser){
                    req.session.message={
                        type:'danger',
                        intro:"User already exist",
                        message:'please enter different email'
                    }
    
                    res.redirect('/');
                }
                else{
                    newUser.save(function(err){
                        if(err){
                            console.log(err);
                            req.session.message={
                                type:'danger',
                                intro:"OPPS!!!",
                                message:'Something went wrong'
                            }
                            res.redirect('/')
                        }
                        else{
                            console.log('user added');
                            req.session.message={
                                type:'success',
                                intro:"Done!!!",
                                message:'User added successfully'
                            }
                            res.redirect('/');
                        }
                    });
                  }
                }   
        });
    }
   
});





















let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// app.listen(port);











app.listen(port,function(){
    console.log('sever started');
    });