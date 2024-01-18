import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "ENTER YOUR PASSWORD HERE",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    const email = req.body.username
    const password = req.body.password

    //console.log(email);
    //console.log(password);
    try {
      const checkResult = await db.query ("SELECT * FROM users WHERE email = $1",[email]);
    
    if (checkResult.rows.length > 0) {
      res.send("Email already exist")
    } else {
      const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2)",[email,password]);
      console.log (result)
    res.render("secrets.ejs");
    }
  } catch(err) {
      console.log(err)
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  //console.log(email);
  //console.log(password);
// my original CODE 
//   try { 
//     const checkUser = await db.query ("SELECT email, password FROM users WHERE email = $1 AND password = $2", [email,password]);

//     if (checkUser.rows.length === 0) {
//       res.send("Wrong Email or Password");
//     } else {
//       res.render("secrets.ejs")
//     }
//   }catch(err) {
//     console.log(err)
//   }
  try {
    const result = await db.query ("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;
      console.log(password);
      console.log(storedPassword);

      if (password === storedPassword) {
        res.render("secrets.ejs")
      } else {
        res.send ("Wrong Password")
      }
    } else {
      res.send("User not Found")
    }
  }catch(err) {
    console.log(err)
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
