const express = require("express");
const core = require("cors");
const app = express();
const Port = process.env.PORT || 3000;
const { Client } = require("pg");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// mdlwares
app.use(core());
app.use(express.json());

// init pg c
const client = new Client({
  database: process.env.DBname,
  host: process.env.DBhost,
  user: process.env.DBuser,
  password: process.env.DBPass,
  port: 44087,
});

client
  .connect()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("err in connectiong to pgbd", err));

// routes
// send
app.get("/data", async (req, res) => {
  let data = [];
  client.query("select * from smtc", (err, resault) => {
    if (err) {
      console.log("err in query", err);
      res.status(500).send("Error executing query");
    } else {
      console.log("res", resault.rows);
      data = data.push(resault.rows);
      res.status(200).json(resault.rows);
    }
  });
});

// save data
app.post("/data", async (req, res) => {
  const { direction } = req.body;
  console.log(req.body);
  const id = uuidv4();

  const query = `insert into smtc (id, direction) values ('${id}', '${direction}')`;

  client.query(query, (err, resault) => {
    if (err) {
      console.log("err in query", err);
      res.status(500).send("Error executing query");
    } else {
      console.log("iserted: ", direction);
      res.status(200).json(resault.rows);
    }
  });
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
