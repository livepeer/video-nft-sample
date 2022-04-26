# Video NFT Sample

## Step 0. Installations

```bash
mkdir video-nft-sample
cd video-nft-sample
npm install init
```

### npm
```bash
npm install --save dotenv express http-proxy-middleware
```

or 

### yarn 
```bash
yarn add dotenv express http-proxy-middleware
```


## Step 1. Create an index.js 

Make an index.js for an express server to run a proxy. 

* Barebone Express App forwards the calls to the Livepeer API whilst injecting an API key: 

* Make sure you have your API in your `.env` file 

Code below is express server :
```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const proxy = createProxyMiddleware({
    target: 'https://livepeer.com',
    changeOrigin: true,
    headers: {
        authorization:  `Bearer  ${process.env.LP_API_KEY}`
    }
});


app.use('/js',express.static(path.join(__dirname, 'public/js')));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
app.get('/api/asset/:id', proxy);
app.get('/api/task/:id', proxy);
app.post('/api/asset/request-upload', proxy);
app.post('/api/asset/transcode', proxy);
app.post('/api/asset/:id/export', proxy);


app.listen(PORT);
```

## Step 2. Make a **index.html** adding video-nft cdn 

* The index.html will contain ethers.js, video-nft sdk and tailwind.css

* tailwind.css to style the app 
* ether.js to connet metamask wallet 
* video-nft to mint the video being uploadedx

```html
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>
    <script src="https://unpkg.com/@livepeer/video-nft@0.3.2/dist/index.umd.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
</head>

<body>
   <!-- Code for Sample App -->
</body>

<script type="text/javascript" src="/js/ui.js"></script>
<script type="text/javascript" src="/js/sdk.js"></script>
</html>
```


## Step 3.  Adding the logic for ui.js 

The code implements the user interface in javascript this logic helps  user to drag and drop the video to the uploader displaying a progress bar.  

```javascript
let dropArea = document.getElementById("drop-area");
const videoSrc = document.querySelector("#video-source");
const videoTag = document.querySelector("#video-tag");

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});


// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {

    dropArea.classList.add('outline-[#00eb88]')
}

function unhighlight(e) {
    dropArea.classList.remove('outline-[#00eb88]')
}

dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function handleDrop(e) {
    var dt = e.dataTransfer
    var files = dt.files

    handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
    progressBar.style.width = "0%";
    uploadProgress = []

    for (let i = numFiles; i > 0; i--) {
        uploadProgress.push(0)
    }
}

function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent
    let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
    progressBar.style.width = `${total}%`;
}

function uploadFile(file, i) {
    updateProgress(i, 100)
}

async function handleFiles(files) {
    console.log(files)
    const file = files[0]

    files = [...files]
    console.log(files)
    initializeProgress(files.length)
    files.forEach(uploadFile)

    if (files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            videoSrc.src = e.target.result
            videoTag.load()
        }.bind(this)

        reader.readAsDataURL(files[0]);
    }

}
```

## Step 4. Adding the logic for  Video NFT SDK.js 

The code has a function to mint your video nft to the `polygon testnet` mint

Make sure you are in a `polygon testnet` network to mint 

```javascript
const apiOpts = {};

async function mintNft() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    let ethereum = window.ethereum;
    let chainId = window.ethereum.chainId;


    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
    console.log(ethereum)
    console.log(chainId);

    const minter = new videonft.minter.FullMinter(apiOpts, { ethereum, chainId });

    console.log(minter);
    let file = document.getElementById('file').files[0];
    let title = document.getElementById("title").value || "My NFT";
    console.log(title)
    console.log(file)
    let asset = await minter.api.createAsset(title, file);
    console.log(asset);
    // // optional, optimizes the video for the NFT
    asset = await minter.api.nftNormalize(asset);
    console.log(asset)
    const nftMetadata = {
        description: 'My NFT description',
        traits: { 'my-custom-trait': 'my-custom-value' }
    };
    console.log(nftMetadata)

    const nftInfo = await minter.createNft({
        name: title,
        file,
        nftMetadata
    });
    console.log(`minted NFT on contract ${nftInfo.contractAddress} with ID ${nftInfo.tokenId}`);
    return nftInfo;
}
```

Optional:  
if you want to deploy on vercel you will need the vercel.json file

```json
{
    "version": 2,
    "builds": [
        {
            "src": "./index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/"
        }
    ]
  }
```


🎂 Congrats! You finished building an video nft uploader! 


