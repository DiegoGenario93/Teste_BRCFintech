const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3001;

//Configuração do banco de dados /usuario root e não coloquei senha
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Cadastro Usuario'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem sucedida ao banco de dados!');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});


app.post('/register', (req, res) => {
  const { nome } = req.body;


  const query = 'SELECT * FROM usuarios WHERE nome = ?';
  connection.query(query, [nome], (err, results) => {
    if (err) {
      console.error('Erro ao verificar o nome de usuário:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }

    if (results.length > 0) {
      res.status(400).send('Nome de usuário já existe');
      return;
    }

   
    const insertQuery = 'INSERT INTO usuarios (nome) VALUES (?)';
    connection.query(insertQuery, [nome], (err, results) => {
      if (err) {
        console.error('Erro ao inserir usuário no banco de dados:', err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      res.status(200).send('Usuário registrado com sucesso!');
    });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});



