const express = require('express');
const app = express();
const corse = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
//middleware
app.use(corse());
app.use(express.json());
const Port = process.env.Port || 5000;
// Check Server port on server console
app.listen(Port, () => {
    console.log('server is running on', Port)
})
// check server is running on cliend side
app.get('/', (req, res) => {
    res.send('Server is running')
})
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@users.95k0mgf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        // create a database 
        const databaseName = client.db('vector-upsell');

        // create a collection for users
        const usersCollection = databaseName.collection('users');
        // add user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        //display all users
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
        // create a collection for products
        const productsCollection = databaseName.collection('products');
        app.post('/products', async (req, res) => {
            const productData = req.body;
            const result = await productsCollection.insertOne(productData);
            res.send(result)
        })
        // send product data to client side
        app.get('/products', async (req, res) => {
            let productQuery = {};
            if (req.query.email) {
                productQuery = {
                    email: req.query.email
                }
            }
            const products = await productsCollection.find(productQuery).toArray();
            res.send(products)
        })

        // delete data from database
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteProduct = await productsCollection.deleteOne(query);
            res.send(deleteProduct);
        })
        // load single product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const filter = await productsCollection.findOne(query);
            res.send(filter);
        })
        // update product data
        app.patch('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = {
                $set: {
                    title: req.body.title,
                    price: req.body.price,
                    city: req.body.city,
                    zip: req.body.zip,
                    description: req.body.description,
                }
            }
            const query = { _id: ObjectId(id) };
            const updateProduct = await productsCollection.updateOne(query, updateData);
            res.send(updateProduct);
        })
        // update to advertis
        app.put('/product/advertis/:id', async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const updateData = {
                $set: {
                    advertis: req.body.advertis
                }
            }
            const query = { _id: ObjectId(id) };
            const advertis = await productsCollection.updateOne(query, updateData, options);
            res.send(advertis);
        })
        // advertise products
        app.get('/advertis', async (req, res) => {
            const query = { advertis: true };
            const advertis = await productsCollection.find(query).toArray();
            res.send(advertis);
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));