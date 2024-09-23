// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/db.js');
const userRoute = require('./routes/user.routes.js');
const thumbnailRoute = require('./routes/thumbnail.routes.js');
const collectionRoute = require('./routes/collection.routes.js') ;
const path = require('path')
dotenv.config({});


const _dirname = path.resolve() ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: 'https://youtube-thumbnail-generator.onrender.com',
    credentials: true, // Enable credentials (cookies)
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/generate-thumbnail", thumbnailRoute);
app.use("/api/v1/collections",collectionRoute)
// Proxy route for fetching YouTube images (to bypass CORS)
app.get('/api/proxy-thumbnail', async (req, res) => {
    try {
        const { url } = req.query;
        const response = await axios.get(url, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Error fetching the image');
    }
});

app.use(express.static(path.join(_dirname , "/frontend/dist")))
app.get('*' ,(_,res) => {
    res.sendFile(path.resolve(_dirname ,"frontend" , "dist" ,"index.html"));
});

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server connected at port ${PORT}`);
});
