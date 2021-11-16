import express, { response } from 'express';
import pg from 'pg';
import methodOverride from 'method-override';

// Saved as branch "3-pce-5"

// Initialise express
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Initialise DB connection
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'bryluke000',
  host: 'localhost',
  database: 'birding',
  port: 5432,
};
const pool = new Pool(pgConnectionConfigs);

// Do stuff here:
app.get('/note', (req, res) => {
  console.log('get request came in, "/note"');

  res.render('note-form');
});
app.post('/note', (req, res) => {
  console.log('post request coming in, "/note"');
  const inputFormObj = req.body;
  const inputArr = [
    inputFormObj.habitat,
    inputFormObj.date,
    inputFormObj.appearance,
    inputFormObj.behaviour,
    inputFormObj.vocalisation,
    inputFormObj.flock_size,
  ];

  console.log(inputArr);

  const sqlQuery = 'INSERT INTO notes (habitat, date, appearance, behaviour, vocalisation, flock_size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  pool.query(sqlQuery, inputArr, (error, result) => {
    if (error) {
      console.log('error', error);
    }
    console.log(result.rows);
    const redirectId = result.rows[0].id;
    console.log(redirectId);
    res.redirect(`/note/${redirectId - 1}`);
  });
});

app.get('/note/:id', (req, res) => {
  console.log('get request came in, "/note/:id"');
  const databaseId = Number(req.params.id) + 1;
  const sqlQuery = `SELECT * FROM notes WHERE id=${databaseId}`;
  pool.query(sqlQuery, (error, result) => {
    if (error) {
      console.log('select id error', error);
    }
    console.log(result.rows);
    const ejsObject = result.rows[0];
    res.render('note', ejsObject);
  });
});

app.get('/', (req, res) => {
  console.log('request came in, "/"');

  const sqlQuery = 'SELECT * FROM notes';
  pool.query(sqlQuery, (error, result) => {
    if (error) {
      console.log('select all error', error);
    }
    console.log(result.rows);
    const ejsObject = { notes: result.rows };

    res.render('index', ejsObject);
  });
});

app.get('/note/:id/edit', (req, res) => {
  console.log('request came in, "/note/:id/edit"')
  const databaseId = Number(req.params.id) + 1;
  const sqlQuery = `SELECT * FROM notes WHERE id=${databaseId}`;

  pool.query(sqlQuery, (error, result) => {
    if (error) {
      console.log('select id error', error);
    }

    console.log(result.rows[0]);
    const ejsObject = result.rows[0];
    ejsObject.index = req.params.id;
    res.render('edit', ejsObject);
  });
  
});

app.put('/note/:id', (req, res) => {
  console.log('put request coming in, "/note/:id"');

  const databaseId = Number(req.params.id) + 1;
  const inputFormObj = req.body;

  const inputArr = [
    inputFormObj.habitat,
    inputFormObj.date,
    inputFormObj.appearance,
    inputFormObj.behaviour,
    inputFormObj.vocalisation,
    inputFormObj.flock_size,
  ];

  console.log(inputArr);

  const sqlQuery = `UPDATE notes 
  SET habitat = $1, date = $2, appearance = $3, behaviour = $4, vocalisation = $5, flock_size = $6
  WHERE id=${databaseId} RETURNING *`;

  pool.query(sqlQuery, inputArr, (error, result) => {
    if (error) {
      console.log('error', error);
    }

    console.log(result.rows);
    res.redirect(`/note/${req.params.id}`);
  });
});

// Listening port
app.listen(3004);