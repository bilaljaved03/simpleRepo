const express = require('express');
const { Pool } = require('pg');
const books = require('./bookSeed.js');
const librarian = require('./librarianSeed.js')
const app = express();

const connectionString = 'postgresql://bilal:u8KgrpTpvpHwtOGXAAjHJg@lanky-bug-7332.8nk.cockroachlabs.cloud:26257/library_db?sslmode=verify-full';

const pool = new Pool({
  connectionString: connectionString,
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});


const insertLibrarianData = async (data) => {
    if (Array.isArray(data)) {
        const values = data.map(book => [
          book.id,
          book.name,
          book.email,
          book.password,
          book.image,
          book.date,
           ])
        const insertQuery = `
        INSERT INTO librarian (id,name,email,password,image,date)
        VALUES 
          ${values.map((_, index) => `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`).join(', ')};
      `;
      try {
        const client = await pool.connect();
        await client.query(insertQuery, values.flat());
        console.log('Data inserted into librarian table successfully');
      } catch (error) {
        console.error('Error inserting data into book table', error);
      }
    };
    
    };




const insertBookData = async (data) => {
    if (Array.isArray(data)) {
        const values = data.map(book => [
          book.isbn,
          book.title,
          book.category,
          book.author,
          book.pages,
          book.year,
          book.smalldesc,
          book.smallimage,
          book.bigimage
        ])
        const insertQuery = `
        INSERT INTO book (isbn, title, category, author, pages, year, smalldesc, smallimage, bigimage)
        VALUES 
          ${values.map((_, index) => `($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${index * 9 + 4}, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${index * 9 + 8}, $${index * 9 + 9})`).join(', ')};
      `;
      try {
        const client = await pool.connect();
        await client.query(insertQuery, values.flat());
        console.log('Data inserted into book table successfully');
      } catch (error) {
        console.error('Error inserting data into book table', error);
      }
    };
    
    };

    app.get('/books', async (req, res) => {
        try {
          const client = await req.pool.connect();
          const result = await client.query('SELECT * FROM book');
          res.json(result.rows);
          client.release();
        } catch (error) {
          console.error('Error executing query', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });  

      app.get('/librarian', async (req, res) => {
        try {
          const client = await req.pool.connect();
          const result = await client.query('SELECT * FROM librarian');
          res.json(result.rows);
          client.release();
        } catch (error) {
          console.error('Error executing query', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });  




  

// Your books array containing book data


// Initial connection to the database and data insertion
pool.connect()
  .then(() => {
    console.log('Connected to the database');
//    insertLibrarianData(librarian)
    // insertData(books); // Call the function to insert data into the book table
  })
  .catch(err => {
    console.error('Error connecting to the database', err);
  });

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
