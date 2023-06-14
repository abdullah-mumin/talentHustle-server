const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/files');
    },
    filename: function (req, file, callback) {
        // You can write your own logic to define the filename here (before passing it into the callback), e.g:
        // console.log(file.originalname); // User-defined filename is available
        const fileExt = path.extname(file.originalname);
        const filename = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
        callback(null, filename + fileExt);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1048576 // Defined in bytes (1 Mb)
    },
});


app.get('/', (req, res) => {
    res.send('Node server Running ...');
});

//userID = talenthustle111
//Pass = 0MpGuv0bj8I0LhCS


const uri = "mongodb+srv://talenthustle111:0MpGuv0bj8I0LhCS@cluster0.umkuykt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const userCollection = client.db("talentHustle").collection('users');
        const jobCollection = client.db("talentHustle").collection('jobs');

        app.get('/register', async (req, res) => {
            const cursor = userCollection.find({})
            const users = await cursor.toArray();
            // console.log(query);
            // console.log(res.statusCode);
            res.send(users);
        });

        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            // console.log(user);
            user.id = result.insertedId;
            res.send(user);
        });

        app.post('/login', async (req, res) => {
            const query = {
                email: req.body.email,
                password: req.body.password,
                isCandidate: req.body.isCandidate
            }
            const user = req.body;
            const result = await userCollection.findOne(query);
            // console.log(result);
            // console.log(res.statusCode);
            if (result != null && res.statusCode === 200) {
                const message = 'Login Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Login Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Login Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
        });

        app.get('/job', async (req, res) => {
            const cursor = jobCollection.find({});
            const jobs = await cursor.toArray();
            // console.log(query);
            // console.log(res.statusCode);
            res.send(jobs);
        });

        app.post('/job', upload.any(), async (req, res) => {
            const job = req.body;
            const data = {
                companyName: req.body.companyName,
                title: req.body.title,
                email: req.body.email,
                number: req.body.number,
                jobType: req.body.jobType,
                jobCategory: req.body.jobCategory,
                experience: req.body.experience,
                location: req.body.location,
                minSalary: req.body.minSalary,
                maxSalary: req.body.maxSalary,
                skils: [req.body.skils],
                description: req.body.description,
                date: new Date()
                // image: req.files[0].filename
            };
            const result = await jobCollection.insertOne(data);
            // console.log(data);
            // console.log(req.files[0].filename);
            data.id = result.insertedId;
            res.send(data);
        });
        app.post('/application', upload.any(), async (req, res) => {
            const job = req.body;
            const data = {
                name: req.body.companyName,
                email: req.body.email,
                number: req.body.number,
                letter: req.body.description,
                question: req.body.question,
                cv: req.files[0].filename
            };
            const result = await jobCollection.insertOne(data);
            // console.log(data);
            // console.log(req.files[0].filename);
            data.id = result.insertedId;
            res.send(data);
        });
        app.post('/search', async (req, res) => {
            const query = {
                title: req.body.title,
                location: req.body.location
            }
            const result = jobCollection.find(query);
            const users = await result.toArray();
            // console.log(users);
            res.send(users);
        });
        app.get('/search/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.findOne(query);
            res.send(result);
            // console.log(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})