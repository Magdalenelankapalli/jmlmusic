const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const app = express();
//const { MongoClient } = require("mongodb");

//const uri = "mongodb+srv://lankapallimagdalene_db_user:magdalene2006DB@cluster0.rn5dam5.mongodb.net/?appName=Cluster0";

//const client = new MongoClient(uri);

//async function connectDB() {
  //try //{
    //await client.connect();
    //console.log("MongoDB Connected");
  //} catch (err) {
    //console.log(err);
  //}
//}

//connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// Get Social Links
app.get("/social", (req, res) => {
    if (!fs.existsSync("social.json")) {
        return res.json({
            youtube: "",
            instagram: "",
            facebook: ""
        });
    }

    const social = JSON.parse(fs.readFileSync("social.json"));
    res.json(social);
});

// Save Social Links
app.post("/social", (req, res) => {
    fs.writeFileSync(
        "social.json",
        JSON.stringify(req.body, null, 2)
    );

    res.json({
        success: true,
        message: "Social links updated."
    });
});
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post(
  "/upload",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  (req, res) => {

    const songData = {
      songName: req.body.songName,
      artistName: req.body.artistName,
      albumName: req.body.albumName,
      songFile: req.files.song[0].filename,
      coverFile: req.files.cover[0].filename
    };

    let songs = [];

    if (fs.existsSync("songs.json")) {
      songs = JSON.parse(fs.readFileSync("songs.json"));
    }

    songs.push(songData);

    fs.writeFileSync(
      "songs.json",
      JSON.stringify(songs, null, 2)
    );

    res.json({
      message: "Song Saved Successfully"
    });
  }
);
app.get("/artists", (req, res) => {
    const artists = JSON.parse(fs.readFileSync("artists.json"));
    res.json(artists);
});

app.post("/artists", (req, res) => {
    const artists = JSON.parse(fs.readFileSync("artists.json"));

    artists.push(req.body);

    fs.writeFileSync(
        "artists.json",
        JSON.stringify(artists, null, 2)
    );

    res.json({ success: true });
});

app.get("/albums", (req, res) => {
    const albums = JSON.parse(fs.readFileSync("albums.json"));
    res.json(albums);
});

app.post("/albums", (req, res) => {
    const albums = JSON.parse(fs.readFileSync("albums.json"));

    albums.push(req.body);

    fs.writeFileSync(
        "albums.json",
        JSON.stringify(albums, null, 2)
    );

    res.json({ success: true });
});

    app.delete("/artists/:name", (req, res) => {

    let artists = JSON.parse(
        fs.readFileSync("artists.json")
    );

    artists = artists.filter(
        artist => artist.name !== req.params.name
    );

    fs.writeFileSync(
        "artists.json",
        JSON.stringify(artists, null, 2)
    );

    res.json({
        message: "Artist Deleted"
    });

});

app.delete("/albums/:name", (req, res) => {

    let albums = JSON.parse(
        fs.readFileSync("albums.json")
    );

    albums = albums.filter(
        album => album.name !== req.params.name
    );

    fs.writeFileSync(
        "albums.json",
        JSON.stringify(albums, null, 2)
    );

    res.json({
        message: "Album Deleted"
    });

});
app.get("/test", (req, res) => {
    res.send("Server Working");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});