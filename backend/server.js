/*https://www.arangodb.com/docs/stable/drivers/js.html
https://www.arangodb.com/docs/stable/drivers/js-getting-started.html#basic-usage-example
https://www.arangodb.com/tutorials/tutorial-node-js/
https://arangodb.github.io/arangojs/latest/ */

const express = require("express");
const { Database, aql } = require("arangojs");
require("dotenv").config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const db = new Database({
  url: `http://${DB_HOST}:${DB_PORT}`,
  databaseName: DB_NAME,
  auth: {
    username: DB_USER,
    password: DB_PASS,
  },
});

const app = express();

//parse the body of the post
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//https://www.freecodecamp.org/news/access-control-allow-origin-header-explained/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//https://stackoverflow.com/a/67999119
app.get("/", async (req, res) => {
  const nodecards = db.collection("nodecards");
  const cursor = await db.query(aql`
  FOR card in ${nodecards}
  RETURN card
  `);
  res.json(await cursor.all());
  //use cursor.next() to go through items one by one
});

app.post("/createNodecard", function (req, res) {
  const collection = db.collection("nodecards");
  (async () => {
    try {
      // don't confuse body with req.body
      const cursor = await db.query(aql`
      INSERT {    
        nodecardId: ${req.body.nodecardId},
        body: ""
      } IN ${collection}
      RETURN NEW`);
      let data = await cursor.all();
      res.json({ success: true, msg: "the post was successful", data });
      //without this res.json call, fetch will have no response and the fetch callbacks will not fire.
    } catch (err) {
      res.json({ success: false, msg: `${err}` });
    }
  })();
});

app.put("/updateNodecard/:key", function (req, res) {
  const collection = db.collection("nodecards");
  const key = req.params.key;
  (async () => {
    try {
      const cursor = await db.query(aql`
        UPDATE { _key: ${req.params.key},
          body: ${req.body.textBody}
        } IN ${collection}
        RETURN NEW`);

      let data = await cursor.all();
      res.json({ success: true, msg: "the update was successful", data });
    } catch (err) {
      res.json({ success: false, msg: `${err}` });
    }
  })();
});

// retrieve a nodecard with the specified key.
// currently unused. created while debugging the updateNodecard function.
app.get("/nodecard/:key", async (req, res) => {
  const nodecards = db.collection("nodecards");
  console.log(`collection and keys:`);
  console.log(nodecards);
  console.log(req.params.key);
  try {
    const cursor = await db.query(aql`
      FOR n in ${nodecards}
      FILTER n._key == ${req.params.key}
      RETURN n
    `);
    res.json(await cursor.all());
  } catch (err) {
    res.json({ sucess: false, msg: `${err}` });
  }
});

app.post("/createLink", async function (req, res) {
  const collection = db.collection("links");
  (async () => {
    try {
      const cursor = await db.query(aql`
      INSERT {    
        linkId: ${req.body.linkId},
        _from: ${req.body.source},
        _to: ${req.body.target}
      } IN ${collection}
      RETURN NEW`);
      let data = await cursor.all();
      res.json({ success: true, msg: "the post was successful", data });
    } catch (err) {
      res.json({ success: false, msg: `${err}` });
    }
  })();
});

//list all collections.
//https://www.arangodb.com/docs/stable/drivers/js-getting-started.html
//https://arangodb.github.io/arangojs/latest/classes/_database_.database.html#listcollections
app.get("/collections", async function (req, res) {
  await db.listCollections().then((colls) => {
    res.json(colls.map((coll) => ({ name: coll.name, id: coll.id })));
  });
});

//get all docs from a single collection
app.get("/collection/:name", async (req, res) => {
  //res.send(req.params.name);
  //const coll = db.collection(res.params.name);
  try {
    const cursor = await db.query(`
      FOR doc IN ${req.params.name}
      RETURN doc
    `);
    res.json(await cursor.all());
  } catch (err) {
    res.json({ msg: err });
  }
});

app.listen(3000);
