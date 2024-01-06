const express = require("express");
const { Pool } = require("pg");
// const books = require("./bookSeed.js");
// const librarian = require("./librarianSeed.js");
// const RequestSeed = require("./RequestSeed1.js");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");
// const IssuedSeed = require("./issuedSeed");
// const users = require("./UsersSeed.js");
const app = express();
const secretKey = "your-secret-key";
const connectionString =
  "postgresql://bilal:u8KgrpTpvpHwtOGXAAjHJg@lanky-bug-7332.8nk.cockroachlabs.cloud:26257/library_db?sslmode=verify-full";
const pool = new Pool({
  connectionString: connectionString,
});
app.use(cors({
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: '*',
  credentials: true // Allow cookies and other credentials
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());



app.use((req, res, next) => {
  req.pool = pool;
  next();
});

////////////////////////////////////////////////////////////////////////////////////

const insertLibrarianData = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((book) => [
      book.id,
      book.name,
      book.email,
      book.password,
      book.image,
      book.date,
    ]);
    const insertQuery = `
        INSERT INTO librarian (id,name,email,password,image,date)
        VALUES 
          ${values
            .map(
              (_, index) =>
                `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${
                  index * 6 + 4
                }, $${index * 6 + 5}, $${index * 6 + 6})`
            )
            .join(", ")};
      `;
    try {
      const client = await pool.connect();
      await client.query(insertQuery, values.flat());
      console.log("Data inserted into librarian table successfully");
    } catch (error) {
      console.error("Error inserting data into book table", error);
    }
  }
};

const insertRequestData = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((book) => [
      book.id,
      book.email,
      book.isbn,
      book.date,
    ]);
    const insertQuery = `
            INSERT INTO requests (id,email,isbn,date)
            VALUES 
              ${values
                .map(
                  (_, index) =>
                    `($${index * 4 + 1}, $${index * 4 + 2}, $${
                      index * 4 + 3
                    }, $${index * 4 + 4})`
                )
                .join(", ")};
          `;
    try {
      const client = await pool.connect();
      await client.query(insertQuery, values.flat());
      console.log("Data inserted into book table successfully");
    } catch (error) {
      console.error("Error inserting data into book table", error);
    }
  }
};

const insertBookData = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((book) => [
      book.isbn,
      book.title,
      book.category,
      book.author,
      book.pages,
      book.year,
      book.smalldesc,
      book.smallimage,
      book.bigimage,
    ]);
    const insertQuery = `
        INSERT INTO book (isbn, title, category, author, pages, year, smalldesc, smallimage, bigimage)
        VALUES 
          ${values
            .map(
              (_, index) =>
                `($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${
                  index * 9 + 4
                }, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${
                  index * 9 + 8
                }, $${index * 9 + 9})`
            )
            .join(", ")};
      `;
    try {
      const client = await pool.connect();
      await client.query(insertQuery, values.flat());
      console.log("Data inserted into book table successfully");
    } catch (error) {
      console.error("Error inserting data into book table", error);
    }
  }
};

const insertUsersData = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((book) => [
      book.id,
      book.name,
      book.password,
      book.role,
      book.dept,
      book.email,
      book.date,
    ]);
    const insertQuery = `
            INSERT INTO registered_users (id,name,password,role,dept,email,date)
            VALUES 
              ${values
                .map(
                  (_, index) =>
                    `($${index * 7 + 1}, $${index * 7 + 2}, $${
                      index * 7 + 3
                    }, $${index * 7 + 4}, $${index * 7 + 5}, $${
                      index * 7 + 6
                    }, $${index * 7 + 7})`
                )
                .join(", ")};
          `;
    try {
      const client = await pool.connect();
      await client.query(insertQuery, values.flat());
      console.log("Data inserted into users  table successfully");
    } catch (error) {
      console.error("Error inserting data into book table", error);
    }
  }
};

const insertIssuedData = async (data) => {
  if (Array.isArray(data)) {
    const values = data.map((book) => [
      book.id,
      book.isbn,
      book.user_email,
      book.librarian_email,
      book.date,
    ]);
    const insertQuery = `
                INSERT INTO issued (id,isbn,user_email,librarian_email,date)
                VALUES 
                  ${values
                    .map(
                      (_, index) =>
                        `($${index * 5 + 1}, $${index * 5 + 2}, $${
                          index * 5 + 3
                        }, $${index * 5 + 4}, $${index * 5 + 5})`
                    )
                    .join(", ")};
              `;
    try {
      const client = await pool.connect();
      await client.query(insertQuery, values.flat());
      console.log("Data inserted into users  table successfully");
    } catch (error) {
      console.error("Error inserting data into book table", error);
    }
  }
};

app.get("/books", async (req, res) => {
  try {
    const client = await req.pool.connect();
    const result = await client.query("SELECT * FROM book");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/librarian", async (req, res) => {
  try {
    const client = await req.pool.connect();
    const result = await client.query("SELECT * FROM librarian");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/requests", async (req, res) => {
  try {
    const client = await req.pool.connect();
    const result = await client.query("SELECT * FROM requests");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/registeredUsers", async (req, res) => {
  try {
    const client = await req.pool.connect();
    const result = await client.query("SELECT * FROM registered_users");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/issuedBooks", async (req, res) => {
  try {
    const client = await req.pool.connect();
    const result = await client.query("SELECT * FROM issued");
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////////////////////////////////////////////////////////////////////////

pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
    // insertIssuedData(IssuedSeed)
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });



///////////////////////////////////////////////////////////////////////////////////////////


  app.get("/api/v1/allBooks", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM book");
      
    
      res.json(result.rows);
    } catch (err) {
    
      console.error('Error querying the database', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//   app.post("/api/v1/bookById", (req, res) => {
//     const { isbn } = req.body;
  
//     if (!isbn) {
//       return res
//         .status(400)
//         .json({ error: "ISBN is required in the request body" });
//     }
  
//     db.query("SELECT * FROM book WHERE isbn = ?", [isbn], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
  
//       res.json(result);
//     });
//   });
  


  app.post("/api/v1/bookById", async (req, res) => {
    try {
      const { isbn } = req.body;
  
      if (!isbn) {
        return res
          .status(400)
          .json({ error: "ISBN is required in the request body" });
      }
  
      // Use the pool to query the database
      const result = await pool.query("SELECT * FROM book WHERE isbn = $1", [isbn]);  
      // Send the result as JSON response
      res.json(result.rows[0]);
    } catch (err) {
      // Handle errors
      console.error('Error querying the database', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post("/api/v1/isRequested", async (req, res) => {
    try {
      const { isbn } = req.body;
  
      if (!isbn) {
        return res
          .status(400)
          .json({ error: "ISBN is required in the request body" });
      }
  
      // Use the pool to query the database
      const result = await pool.query("SELECT * FROM requests WHERE isbn = $1", [isbn]);
  
      // Check if the result array has any entries
      const isRequested = result.rows.length > 0;
  
      // Send true if the book is requested, otherwise send false
      res.json({ isRequested });
    } catch (err) {
      // Handle errors
      console.error('Error querying the database', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  app.post("/api/v1/newRequest", async (req, res) => {
    try {
      // Destructure the request body
      const { isbn, email } = req.body;
  
      // Check if the required fields are present in the request body
      if (!isbn || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Use the pool to query the database and insert a new request
      await pool.query(
        "INSERT INTO requests (email, isbn) VALUES ($1, $2)",
        [email, isbn]
      );
  
      // Successfully inserted the new request
      return res.status(200).json({ message: "Request inserted successfully" });
    } catch (err) {
      // Handle errors
      console.error('Error inserting new request into the database', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post("/api/v1/issueBook", async (req, res) => {
    try {
      // Destructure the request body
      const { isbn, user_email, librarian_email } = req.body;
  
      // Use the pool to delete the request for the given ISBN
      await pool.query("DELETE FROM requests WHERE isbn = $1", [isbn]);
  
      // Use the pool to insert the issued book details
      await pool.query(
        "INSERT INTO issued (isbn, user_email, librarian_email) VALUES ($1, $2, $3)",
        [isbn, user_email, librarian_email]
      );
  
      // Successfully issued the book
      return res.status(200).json({ message: "Book issued successfully" });
    } catch (err) {
      // Handle errors
      console.error('Error issuing book', err);
      return res.status(500).json({ error: 'Internal Server Error while issuing book' });
    }
  });

  app.get("/api/getIssuedBooks", async (req, res) => {
    try {
      const { pageNo, postsPerPage } = req.query;
  
      if (!pageNo || !postsPerPage) {
        return res.status(400).json({ error: "Page number and posts per page are required." });
      }
  
      const offset = (pageNo - 1) * postsPerPage;
  
      const query = `
        SELECT
          book.isbn,
          book.bigimage,
          book.title,
          book.category,
          book.author,
          book.year,
          issued.date AS issuance_date,
          librarian.name AS librarian_name,
          librarian.email AS librarian_email,
          librarian.image AS librarian_image,
          registered_users.name AS user_name,
          registered_users.email AS user_email,
          registered_users.dept AS user_department,
          registered_users.role AS user_role,
          registered_users.image AS user_image
        FROM
          issued
        JOIN
          book ON book.isbn = issued.isbn
        JOIN
          registered_users ON issued.user_email = registered_users.email
        JOIN
          librarian ON librarian.email = issued.librarian_email
        ORDER BY
          issued.date DESC
        LIMIT $1 OFFSET $2;
      `;
  
      const result = await pool.query(query, [postsPerPage, offset]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error getting issued books:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get("/api/getIssuedBooksByEmail", async (req, res) => {
    try {
      const { pageNo, postsPerPage, email } = req.query;
  
      if (!pageNo || !postsPerPage || !email) {
        return res
          .status(400)
          .json({ error: "Page number, posts per page, and email are required." });
      }
  
      const offset = (pageNo - 1) * postsPerPage;
      const query = `
        SELECT
          book.isbn,
          book.bigimage,
          book.title,
          book.category,
          book.author,
          book.year,
          issued.date AS issuance_date,
          librarian.name AS librarian_name,
          librarian.email AS librarian_email,
          librarian.image AS librarian_image,
          registered_users.name AS user_name,
          registered_users.email AS user_email,
          registered_users.dept AS user_department,
          registered_users.role AS user_role,
          registered_users.image AS user_image
        FROM
          issued
        JOIN
          book ON book.isbn = issued.isbn
        JOIN
          registered_users ON issued.user_email = registered_users.email
        JOIN
          librarian ON librarian.email = issued.librarian_email
        WHERE
          registered_users.email = $1
        LIMIT $2 OFFSET $3;
      `;
      const values = [email, postsPerPage, offset];
  
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing PostgreSQL query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/requestedBooks", async (req, res) => {
    try {
      const { pageNo, postsPerPage } = req.query;
  
      if (!pageNo || !postsPerPage) {
        return res
          .status(400)
          .json({ error: "Page number and posts per page are required." });
      }
  
      const offset = (pageNo - 1) * postsPerPage;
      const query = `
        SELECT 
          book.isbn,
          book.title,
          book.category,
          book.author,
          book.pages,
          book.year,
          book.bigimage,
          registered_users.name,
          registered_users.role,
          registered_users.dept,
          registered_users.image,
          requests.date,
          requests.email AS request_email,
          registered_users.email AS user_email
        FROM 
          requests
        JOIN 
          registered_users ON requests.email = registered_users.email
        JOIN 
          book ON book.isbn = requests.isbn
        LIMIT $1 OFFSET $2;
      `;
      const values = [postsPerPage, offset];
  
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing PostgreSQL query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const { pageNo, postsPerPage } = req.query;
  
      if (!pageNo || !postsPerPage) {
        return res
          .status(400)
          .json({ error: "Page number and posts per page are required." });
      }
  
      const offset = (pageNo - 1) * postsPerPage;
      const query = 'SELECT * FROM book LIMIT $1 OFFSET $2';
      const values = [postsPerPage, offset];
  
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error("Error executing PostgreSQL query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
  app.post("/registerUser", (req, res) => {

    const profileImageLinks = [
        "https://randomuser.me/api/portraits/med/men/23.jpg",
        "https://randomuser.me/api/portraits/med/men/50.jpg",
        "https://randomuser.me/api/portraits/women/31.jpg",
        "https://randomuser.me/api/portraits/men/55.jpg",
        "https://randomuser.me/api/portraits/women/67.jpg",
        "https://randomuser.me/api/portraits/men/10.jpg",
        "https://randomuser.me/api/portraits/men/41.jpg",
        "https://randomuser.me/api/portraits/women/69.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",







      ];
      
      function getRandomImageLink() {
        const randomIndex = Math.floor(Math.random() * profileImageLinks.length);
        return profileImageLinks[randomIndex];
      }
    const {
      name,
      password,
      role,
      dept,
      email,

    } = req.body;
   
  
    const query = `
      INSERT INTO registered_users ( name, password, role, dept, email, image, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
  const newDate= "2023-12-25 16:21:37";
    const values = [ name, password, role, dept, email, getRandomImageLink(), newDate];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      return res.status(201).json({ message: "User registered successfully" });
    });
  });
  

///////////////////////////////////////////////////////////////////////////////////////////

const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Attach user information to the request object
      next();
    } catch (err) {
      return res.status(401).json({ message: "Failed to verify Unauthorized" });
    }
  };
  app.get("/api/v1/getProfile", (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(401).json({ message: "Enter email" });
    }
  
    const userQuery = `
      SELECT * FROM registered_users WHERE email = $1;
    `;
  
    const librarianQuery = `
      SELECT * FROM librarian WHERE email = $1;
    `;
  
    // Check user table first
    pool.query(userQuery, [email], (userErr, userResults) => {
      if (userErr) {
        console.error("Error executing PostgreSQL query:", userErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (userResults.rows.length > 0) {
        return res.json(userResults.rows[0]);
      } else {
        // If not found in user table, check librarian table
        pool.query(librarianQuery, [email], (librarianErr, librarianResults) => {
          if (librarianErr) {
            console.error("Error executing PostgreSQL query:", librarianErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }
  
          if (librarianResults.rows.length > 0) {
            return res.json(librarianResults.rows[0]);
          } else {
            return res.status(500).json({ error: "Internal Server Error" });
          }
        });
      }
    });
  });
  app.post("/login", (req, res) => {
    const { email, password, userType } = req.body;
  
    if (userType !== "librarian") {
      const query = "SELECT * FROM registered_users WHERE email=$1";
      pool.query(query, [email], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
  
        if (result.rows.length > 0 && result.rows[0].password === password) {
          const user = { email, userType, password };
          const token = jwt.sign(user, secretKey, { expiresIn: "15h" });
          res.cookie("token", token, { httpOnly: true }); // Adjust 'secure' based on your environment (true for HTTPS, false for HTTP)
          console.log(result.rows[0]);
          return res.json({ message: "Login successful", details: result.rows[0] });
        } else {
          return res
            .status(401)
            .json({ message: "Login failed. Invalid credentials." });
        }
      });
    } else if (userType === "librarian") {
      const query = "SELECT * FROM librarian WHERE email=$1";
      pool.query(query, [email], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
  
        if (result.rows.length > 0 && result.rows[0].password === password) {
          const user = { email, userType, password };
          const token = jwt.sign(user, secretKey, { expiresIn: "15h" });
          res.cookie("token", token, { httpOnly: true }); // Adjust 'secure' based on your environment (true for HTTPS, false for HTTP)
          console.log(result.rows[0]);
          return res.json({ message: "librarian_logged_in" });
        } else {
          return res
            .status(401)
            .json({ message: "Login failed as Librarian. Invalid credentials." });
        }
      });
    }
  });
  app.get("/profile", (req, res) => {
    const user_decoded = jwt.verify(req.cookies.token, secretKey);
    res.send(user_decoded);
  });

  app.get("/protected", authenticateUser, (req, res) => {
    // Access user information from the request object
    const { email, password, role } = req.user;
    console.log(email);
    res.json({ email, password });
  });
  
  app.post("/logout", (req, res) => {
    res.clearCookie("token");
    console.log("hey bro");
    res.json({ message: "Logout successful" });
  });
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
