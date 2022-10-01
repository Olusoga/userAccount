const express = require('express');
//const knex = require('knex')
const knex = require('../config/db');


exports.register =  (req, res)=>{
    const{email, username, password } = req.body;
  knex('users').insert({
      email:email,
      username:username,
      joined:new Date()
  }).then(()=>{
      console.log(data)
  })
res.json({success:true});

}