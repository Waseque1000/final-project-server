// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = process.env.PORT || 5000;
// const jwt = require("jsonwebtoken");

// // middle ware
// app.use(cors());
// app.use(express.json());
// require("dotenv").config();

// // ? jot er function || Middle ware
// const verifyJwt = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return res.status(401).send({ error: true, message: " unauthorize" });
//   }
//   const token = authorization.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res.send(403).send({ error: true, message: "prb " });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

// //? mongoo db

// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esfshrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     // ?

//     const menuCollection = client.db("bistroDb").collection("menu");
//     const usersCollection = client.db("bistroDb").collection("users");
//     const reviewCollection = client.db("bistroDb").collection("reviews");
//     const cartCollection = client.db("bistroDb").collection("carts");

//     //?  users api

//     app.post("/users", async (req, res) => {
//       const user = req.body;
//       console.log(user);
//       const query = { email: user.email };
//       const existingUser = await usersCollection.findOne(query);
//       if (existingUser) {
//         return res.send({ message: "User Already Exists" });
//       }
//       const result = await usersCollection.insertOne(user);
//       res.send(result);
//     });

//     // ! user get korer jonno
//     app.get("/users", async (req, res) => {
//       const result = await usersCollection.find().toArray();
//       res.send(result);
//     });

//     // ! jot token
//     app.post("/jwt", (req, res) => {
//       const user = req.body;
//       const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "1h",
//       });
//       res.send(token);
//     });

//     // admin creat
//     app.patch("/users/admin/:id", async (req, res) => {
//       const id = req.params.id;
//       console.log(id);
//       const filter = { _id: new ObjectId(id) };
//       const updateDoc = {
//         $set: {
//           role: "admin",
//         },
//       };
//       const result = await usersCollection.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     // ? admin check
//     // ? jwt
//     app.get("/users/admin/:email", verifyJwt, async (req, res) => {
//       const email = req.params.email;

//       if (req.decoded.email !== email) {
//         res.send({ admin: false });
//       }
//       const query = { email: email };
//       const user = await usersCollection.findOne(query);
//       const result = { admin: user?.role === "admin" };
//       res.send(result);
//     });

//     /// menu get

//     app.get("/menu", async (req, res) => {
//       const result = await menuCollection.find().toArray();
//       res.send(result);
//     });
//     app.get("/review", async (req, res) => {
//       const result = await reviewCollection.find().toArray();
//       res.send(result);
//     });

//     // ! cart colection

//     app.post("/carts", async (req, res) => {
//       const item = req.body;
//       // console.log(item);
//       const result = await cartCollection.insertOne(item);
//       res.send(result);
//     });

//     // ? cart collection get

//     // app.get("/carts", async (req, res) => {
//     //   const email = req.query.email;
//     //   console.log(email);

//     //   if (!email) {
//     //     res.send([]);
//     //   } else {
//     //     const query = { email: email };
//     //     const result = await cartCollection.find(query).toArray();
//     //     res.send(result);
//     //   }
//     // });

//     app.get("/carts", verifyJwt, async (req, res) => {
//       const email = req.query.email;

//       if (!email) {
//         res.send([]);
//       }
//       // TODO: jwt
//       const decodedEmail = req.decoded.email;
//       if (email !== decodedEmail) {
//         res.status(403).send({ error: true, message: " frobiden " });
//       }

//       const query = { email: email };
//       const result = await cartCollection.find(query).toArray();
//       res.send(result);
//     });

//     //  ? delete

//     app.delete("/carts/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await cartCollection.deleteOne(query);
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("server ok");
// });

// app.listen(port, () => {
//   console.log("server ok");
// });

// TODO:

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//
// middlewares
const verifyToken = (req, res, next) => {
  // console.log("inside verify token", req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esfshrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("bistroDb").collection("users");
    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewCollection = client.db("bistroDb").collection("reviews");
    const cartCollection = client.db("bistroDb").collection("carts");

    // jwt related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // ! use verify admin after verifyToken
    // ----------------------------

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // users related api
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // !
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // insert email if user doesnt exists:
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      }
    );

    app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // menu related apis
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    // carts collection
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("boss is running");
});

app.listen(port, () => {
  console.log(`server ok `);
});

/**
 * --------------------------------
 *      NAMING CONVENTION
 * --------------------------------
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.put('/users/:id')
 * app.patch('/users/:id')
 * app.delete('/users/:id')
 *
 */
