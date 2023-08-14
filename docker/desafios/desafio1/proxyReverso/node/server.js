const express = require('express');
const app = express();
const port = 3000;
const config =  {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

connection.connect(function(err) {
    if (err) throw err
    else {
        console.log('connected to MySql');
        const sql = `CREATE TABLE IF NOT EXISTS people (id int NOT NULL AUTO_INCREMENT, name varchar(255), PRIMARY KEY(id));`;
        connection.query(sql);
    }

});



app.get('/', (req, res) => {
    const sql = `INSERT INTO people(name) values ('Rodrigo'), ('Leila')`;
    connection.query(sql, function (errInsert, result, fields) {
        if (errInsert) {
            res.send(`<h1>Hello Pereira</h1><div>Error when try to insert new data. ${errInsert}</div>`);
            return;
        }

        connection.query(`SELECT * FROM people;`, function (errQuery, result, fields) {
            if (errQuery) {
                res.send(`<h1>Hello Pereira</h1><div>no names. ${errQuery}</div>`);
                return;
            }
            let data = '';
            Object.keys(result).forEach(function(key) {
                const row = result[key];
                data += `<li>${row.id} - ${row.name}</li>`;
              });            
            res.send(`<h1>Hello Pereira</h1><div><ul>${data}</ul></div>`);
          });

    });        

});

app.listen(port, () => {
    console.log('running on port: ' + port);
})