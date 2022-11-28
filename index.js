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
            let query = {};
            if (req.query.role) {
                query = { userRole: req.query.role }
            }
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = usersCollection.deleteOne(query);
            res.send(result)
        })
        //find user role
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const users = await usersCollection.findOne(query);
            res.send(users)
        })
        //Make admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const adminData = req.body;
            const updateData = {
                $set: {
                    userRole: adminData.userRole
                }
            }
            const result = await usersCollection.updateOne(query, updateData);
            res.send(result)
        })
        //verify users
        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const verifyData = req.body;
            const query = { _id: ObjectId(id) };
            options = {
                upsert: true
            }
            const updateData = {
                $set: {
                    verified: verifyData.verified
                }
            }
            const result = await usersCollection.updateOne(query, updateData, options);
            res.send(result)
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
        // load category products
        app.get('/category/:name', async (req, res) => {
            const category = req.params.name;
            const query = { category: category };
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })
        // create a collection for booking
        const bookingCollection = databaseName.collection('booking');
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })
        // get booking
        app.get('/booking', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email };
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        // blog collection        
        const blogCollection = databaseName.collection('blogs');
        // add blog
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result)
        })
        // get all blogs
        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogCollection.find(query).toArray();
            res.send(result)
        })
        //delete blog
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err));