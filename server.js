const express = require('express');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const res = require('express/lib/response');

//const conn = require('./config/db')
//const  user = require('./route/user')

const db = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'olusoga',
      database : 'acct_db'
    }
  });
  console.log('connected to Database');


//conn()
const app = express();

app.use(express.json())

const database = {
    users:[]
};
app.post('/register', (req, res)=>{
    const {email, username, password} = req.body;
    const hash =  bcrypt.hashSync(password,10);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        
        .then(loginEmail =>{
            return db('users')
            
            .insert({
                email:email, 
                username:username, 
                password:hash, 
                
                joined: new Date()
            }).then(response=>{
              res.status(201).json(response)
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
   .catch(err=> res.status(400).json('unable to register'))
})

app.post('/login', (req, res)=>{
    
        db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(user=>{
            const validPassword = bcrypt.compareSync(req.body.password, user[0].hash)
            if(validPassword){
                db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user=>{
                    res.json(user[0])
                })
                .catch(err=>res.status(400).json('unable to get user'))
            }
            else{
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err=>{
            res.status(400).json('wrong credentials')
        })
    })

    app.post('/acct_reg', (req, res)=>{
        const {acctnum, acctype, opening_balance, userid} = req.body;
     // const hash = bcrypt.hashSync(password, 10);
       return db('account')
      .insert({
          acctnum: acctnum,
          //password:hash,
           acctype:acctype,
           opening_balance:opening_balance,
           
           userid:userid,
           AoD: new Date()
      }).then(response=>{
          return res.status(201).json('account created successfully')
      }).catch(err=>res.status(400).json('unable to register account'))

   })

app.post('/transact', (req, res)=>{
const {tnumber, acctnum, dot, medium_of_transaction, transaction_type, transaction_amount,opening_balance } = req.body
const result =(parseInt(opening_balance) + parseInt(transaction_amount))

if(transaction_type=='withdraw' && tnumber==acctnum){
    db.transaction(trx=>{
        trx.insert({
            opening_balance:result,
            acctnum:acctnum
        })
        .into('account').then(trans=>{
            
            return db('trandetails')
            .insert({
                acctnum:acctnum,
                tnumber:tnumber,
                dot:Date(),
                medium_of_transfer:medium_of_transaction,
                transaction_type:transaction_type,
                transaction_amount:transaction_amount
               
             
            }).then(response=>{
                console.log(result)
                res.status(200).json(response)
            })
        }).catch(trx.commit)
        .catch(trx.rollback)
    }).catch(err=>res.status(400).json('unable to transact'))
}else{
    res.status(400).json('error')
}
})

    

const port = 3000;

const server = app.listen(3000, console.log('connected to port 3000'));