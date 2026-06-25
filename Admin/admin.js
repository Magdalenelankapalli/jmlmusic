function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if(username === "admin" && password === "1234"){
        window.location.href = "dashboard.html";
    }
    else{
        alert("Invalid Login");
    }
}
async function uploadSong() {
    const formData = new FormData();

    formData.append("songName", document.getElementById("songName").value);
    formData.append("artistName", document.getElementById("artistName").value);
    formData.append("albumName", document.getElementById("albumName").value);

    formData.append("song", document.getElementById("songFile").files[0]);
    formData.append("cover", document.getElementById("coverFile").files[0]);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        alert("Song Uploaded Successfully!");
        console.log(data);

    } catch (error) {
        console.error(error);
        alert("Upload Failed");
    }
}