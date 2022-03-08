const express = require('express')
const app = express()
const port = 3000

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database:'nodedb'
};

const nomes = [
  'Sheldon Cooper',
  'Amy Cooper',
  'Haward Holowitz',
  'Bernadette Holowitz',
  'Raj',
  'Leonard',
  'Penny',
  'Stuart'
]

app.get('/', (req,res) => {
  
  const mysql = require('mysql')
  const connection = mysql.createConnection(config)
  
  connection.query('CREATE TABLE IF NOT EXISTS people  (id int not null auto_increment, name VARCHAR(255), PRIMARY KEY (id) );', 
    function (err, results, fields) 
  {
    if (err) throw err;
    console.log('Created if not exists people table.');

    connection.query('select count(*) as qtde from people where 1=1', function (err, total) {
      if (err) {
        console.log('erro');
        throw err;
      }
      if (total[0].qtde != nomes.length) {
        connection.query('DELETE FROM people', 
          function (err, results, fields) {
              if (err) throw err;
              else console.log('Deleted ' + results.affectedRows + ' row(s).');
        })
        for(var i = 0 ; i< nomes.length; i++) {
          connection.query('INSERT INTO people (name) VALUES (?);', [nomes[i]], 
                function (err, results, fields) {
                    if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            })
        }
      }
      const sql = "select name from people";  
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        var html = ` 
          <h1>Full Cycle Rocks!</h1>
          <h2>Lista:</h2><ul>`;
        result.forEach(item => {
          html += `<li>${item.name}</li>`
        });
        html += '<ul>';
        res.send(html);
        connection.end();
      });
    })
  })

})

app.listen(port, ()=> {
  console.log('Rodando na porta ' + port)
})