
const Request=require("request")
const express=require("express")
const mongoose=require("mongoose")

var path=require("path")
var bodyParser=require("body-parser")
var store = require('store')
var JSAlert = require("js-alert");
var amount   
var outlet_bank
var account_holder_name  
var account_number
var currency 
var pay_with_wallet
var name
var phone
var address
var message='.'

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect('mongodb://localhost/GoGiftCoinPaymentData',{ useNewUrlParser: true })
.then(()=>console.log('connected to mongodb..'))
.catch(err=>console.error('could not connect'))


const Paymentdetails = mongoose.model('Pay',new mongoose.Schema({
   name:String,
   phone:String,
   address:String,
   pay_with_wallet:String,
   currency:String,
   account_number:String,
   account_holder_name:String,
   outlet_bank:String,
   amount:String

}));

app.set('view engine','ejs');

app.get('/',function(req,res){
   
    store.set('user', { name:'Payment Status' })
    message=store.get('user').name
    console.log('hii',store.get('user').name)
    res.render(path.join(__dirname+'/gogiftcoin3.ejs'),{message:message});   

  const paysort=Paymentdetails.find().sort('name') 
  res.send(paysort)
    
  });




   
  app.post('/here', function(req, res) {

      name=req.body.name
      amount  =  req.body.amount;
      outlet_bank=req.body.outlet_bank;
      account_holder_name  =  req.body.account_holder_name;
       account_number=req.body.account_number;
       currency  =  req.body.currency;
       pay_with_wallet=req.body.pay_with_wallet;
       phone=req.body.phone;
       address=req.body.address
      
     if(outlet_bank=="cebuana_lhuillier_perapadala"||outlet_bank=="palawan_pawnshop")
     {
        
         console.log('outlet'+outlet_bank)
        console.log('account-holer'+account_holder_name)
        console.log('account_holder_name'+account_holder_name)
        console.log('account_number'+account_number)
        console.log('currency'+currency)
        console.log('pay_with_wallet'+pay_with_wallet)
        console.log('phone'+phone)
        console.log('address'+address)
        console.log('name'+name)


     
         Request.post({
             "headers": { 
                 "content-type": "application/json",
                 "Authorization":"Bearer 8FJ7x86ANYbH5Dr4IUdZdQpL85QlYK"   
             },
             "url": "https://coins.ph/api/v2/sellorder",
             "body": JSON.stringify({
             
                   
      "amount":amount,
     "currency":currency,
     "payment_outlet":outlet_bank,
     "full_name":name,
     "pay_with_wallet":pay_with_wallet,
     "phone_number_recipient":phone,
     "full_address":address
                 
             })
         }, (error, response, body) => {
             if(error) {
                
                res.send(error)
                
                store.set('user', { name:'error' })
                message=store.get('user').name

                console.log(message)
             
              setTimeout(()=>{
                res.render(path.join(__dirname+'/gogiftcoin3.ejs'),{message:message });
            },2000)
     
               
             }
             else{
                
              
                if(JSON.parse(body).errors)
                {
                    store.set('user', { name:JSON.parse(body).errors })
                }
                else{
                
                    store.set('user', { name:'Payment Succesfull' })
                  
                }
                message=store.get('user').name
             console.dir(JSON.parse(body));  
             console.log(JSON.parse(body).order)
            res.render(path.join(__dirname+'/gogiftcoin3.ejs'),{message:message});
         
                var myData = new Paymentdetails(
                    {
                        name:req.body.name,
                        amount:req.body.amount,
                        outlet_bank:req.body.outlet_bank,
                        account_holder_name:null,
                         account_number:null,
                         currency: req.body.currency,
                         pay_with_wallet:req.body.pay_with_wallet,
                         phone:req.body.phone,
                         address:req.body.address
                    
                    
                    
                    }
                );   
            
                console.log(req.body.name)
             
                
            
                myData.save()
                .then(item => {
                res.send("item saved to database");
                })
                .catch(err => {
                res.status(400).send("unable to save to database");
                });


  
             }
         });
     
     }
     
     else{
         Request.post({
             "headers": { 
                 "content-type": "application/json",
                 "Authorization":"Bearer 8FJ7x86ANYbH5Dr4IUdZdQpL85QlYK"   
             },
             "url": "https://coins.ph/api/v2/sellorder",
             "body": JSON.stringify({
                 "amount":amount,
                 "payment_outlet":outlet_bank,
                 "bank_account_name":account_holder_name,
                 "bank_account_number":account_number,
                 "currency":currency,
                 "pay_with_wallet":pay_with_wallet
                 
             })
         }, (error, response, body) => {
             if(error) {
                res.send(error)
                 return console.dir(error);
                 store.set('user', { name:error})
                 message=store.get('user').name
                res.render(path.join(__dirname+'/gogiftcoin3.ejs'),{message:message});
             }
             else{
               console.dir(JSON.parse(body));
               if(JSON.parse(body).errors)
               {
                   store.set('user', { name:JSON.parse(body).errors })
               }
               else{
               
                   store.set('user', { name:'Payment Succesfull' })
                 
               }
               message=store.get('user').name
                res.render(path.join(__dirname+'/gogiftcoin3.ejs'),{message:message});
                 
             


                var myData = new Paymentdetails(
                    {name:req.body.name,
                        amount:req.body.amount,
                        outlet_bank:req.body.outlet_bank,
                        account_holder_name:req.body.account_holder_name,
                         account_number:req.body.account_number,
                         currency: req.body.currency,
                         pay_with_wallet:req.body.pay_with_wallet,
                         phone:null,
                         address:null
                    
                    
                    
                    }
                );   
            
                console.log(req.body.name)
             
                
            
                myData.save()
                .then(item => {
                res.send("item saved to database");
                })
                .catch(err => {
                res.status(400).send("unable to save to database");
                });
       }
         });
     }
   


   
  });



 


app.listen(3000);

console.log("Running at Port 3000");

