const express = require('express');
const app = express();
const corse = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // create a collection for products
        const productsCollection = databaseName.collection('products');
        app.post('/products', async (req, res) => {
            const productData = req.body;
            const result = await productsCollection.insertOne(productData);
            res.send(result)
        })
        // send product data to client side
        app.get('/products', async (req, res) => {
            const productQuery = {};
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
    }
    finally {

    }
}
run().catch(err => console.error(err));