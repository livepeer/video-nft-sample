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
    console.log("files: ", files);
    const file = files[0]
    window.livepeer = window.livepeer || {}
    window.livepeer.files = files;

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


