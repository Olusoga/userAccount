

    exports.knex = require('knex')({
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
