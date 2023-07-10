const express = require('express');
const cors = require('cors');
const multer = require('multer');
var nodeBase64 = require('nodejs-base64-converter');
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
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // await client.connect();
        client.connect((error) => {
            if (error) {
                console.log(error)
                return;
            }
        });
        const userCollection = client.db("talentHustle").collection('users');
        const jobCollection = client.db("talentHustle").collection('jobs');
        const applyCollection = client.db("talentHustle").collection('apply');
        const candidateCollection = client.db("talentHustle").collection('candidate');
        const meetingCollection = client.db("talentHustle").collection('meeting');
        const contactCollection = client.db("talentHustle").collection('contact');
        const newsCollection = client.db("talentHustle").collection('news');



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
            if (result != null && res.statusCode === 200) {
                const message = 'Register Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Register Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Register Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
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
                companyEmail : req.body.companyEmail,
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
                date: new Date(),
                image: req.body.image,
            };
            const result = await jobCollection.insertOne(data);
            // console.log(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            // data.id = result.insertedId;
            // res.send(data);
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

        // app.get('/search', async (req, res, next) => {
        //     const title = req.params.title || '';
        //     const location = req.params.location || '';
        //     const query = {
        //         title: title,
        //         location: location
        //     };
        //     const result = jobCollection.filter(query);
        //     const users = await result.toArray();
        //     // console.log(req.query);
        //     res.send(users);

        //     // const filters = req.query;
        //     // // for (key in filters) {
        //     // //     console.log(key, filters[key]);
        //     // //     // user[key] == filters[key];
        //     // // }
        //     // const filteredUsers = jobCollection.find(user => {
        //     //     for (key in filters) {
        //     //         console.log(key, user[key], filters[key]);
        //     //         user[key] == filters[key];
        //     //     }
        //     // });
        //     // const users = await filteredUsers.toArray();
        //     // res.send(users);
        // });
        app.get('/search/:title&:location', async (req, res) => {
            const title = req.params.title;
            const location = req.params.location;
            const query = {
                title: title,
                location: location
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

        app.post('/apply', upload.any(), async (req, res) => {
            const data = {
                name: req.body.name,
                email: req.body.email,
                cvEmail : req.body.cvEmail,
                title : req.body.title,
                companyEmail: req.body.companyEmail,
                number: req.body.number,
                letter: req.body.letter,
                experience: req.body.experience,
                cv: req.body.cv
            };
            // const file = req.files[0];
            // console.log(req.body);
            // console.log(nodeBase64.encode(file));
            const result = await applyCollection.insertOne(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
        });
        app.get('/apply', async (req, res) => {
            const cursor = applyCollection.find({})
            const users = await cursor.toArray();
            // console.log(query);
            // console.log(res.statusCode);
            res.send(users);
        });

        app.get('/apply/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = {
                companyEmail: email
            };
            const apply = applyCollection.find(query);
            const result = await apply.toArray();
            res.send(result);
        });

        app.post('/profile', upload.single('image'), async (req, res) => {
            const data = {
                name: req.body.name,
                number: req.body.number,
                email: req.body.email,
                address: req.body.address,
                image: req.body.image
            };
            // console.log(req.body)
            // console.log(req.body.image)
            const result = await candidateCollection.insertOne(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            // res.send(result);
        });

        app.post('/meeting', async (req, res) => {
            const data = {
                email: req.body.email,
                title : req.body.title,
                meeting: req.body.meeting,
                roomId: req.body.roomId,
            }
            // console.log(data);
            const result = await meetingCollection.insertOne(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
        });

        app.get('/meeting/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = {
                email: email
            };
            const apply = meetingCollection.find(query);
            const result = await apply.toArray();
            res.send(result);
        });

        app.post('/contact', async (req, res) => {
            const data = {
                name: req.body.name,
                email: req.body.email,
                message: req.body.message,
            }
            // console.log(data);
            const result = await contactCollection.insertOne(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
        });

        app.post('/news', async (req, res) => {
            const data = {
                email: req.body.email,
            }
            // console.log(data);
            const result = await newsCollection.insertOne(data);
            if (result != null && res.statusCode === 200) {
                const message = 'Successful';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
                // console.log(info)
            }
            else if (result == null && res.statusCode === 200) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
            else if (result != null && res.statusCode === 400 || result == null && res.statusCode === 400) {
                const message = 'Failed';
                const info = {
                    data: result,
                    message: message
                }
                res.send(info);
            }
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