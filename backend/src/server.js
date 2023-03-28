// var express = require('express');
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

// const fetch = (...args) => {
//     import ('node-fetch').then(({default: fetch}) => fetch(...args));
// }

const CLIENT_ID = "a578daa362dae8069c34";
const CLIENT_SECRET = "39e4e1c518cdd6cb88ce3a8ff32b93d8eb6d1114";

const app = express();

app.use(cors());
app.use(bodyParser.json());


const getAccessToken = async(code) => {
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code;
  
    return await axios.post("https://github.com/login/oauth/access_token" + params).then((res) => {
      console.log('received from github', res);
      return res.data;
    })
}


//from frontend
app.get('/getAccessToken', async function (req, res) {
    const code = req.query.code;
    // console.log('code from frontend=', code);
    const data = await getAccessToken(code);
    console.log('data in server', data);
    res.json(data)
})

//get user data
app.get('/getUserData', async function(req, res) {
    console.log('get user data', req.get("Authorization"))
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).catch((err) => {
        throw new Error('get access token failed', err);
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log('data', data);
        res.json(data);
    })
})


const port = process.env.PORT || 4000;

app.listen(port, () =>
    console.log(`Server is up on port ${port}!`),
);
