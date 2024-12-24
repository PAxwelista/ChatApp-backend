var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const Pusher = require("pusher");
const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});


router.put("/users/:username", (req, res) => {
    pusher.trigger("chat", "join", {
        username: req.params.username,
    });

    res.json({ result: true });
});


router.delete("/users/:username", (req, res) => {
    pusher.trigger("chat", "leave", {
        username: req.params.username,
    });

    res.json({ result: true });
});

router.post("/message", (req, res) => {
    pusher.trigger("chat", "message", req.body);

    res.json({ result: true });
});

router.post("/audio", async (req, res) => {
  console.log("test")
    const audioPath = `./tmp/audio.mp3`;
    console.log(req.files.audioFromFront)
    try{
    const resultMove = await req.files.audioFromFront.mv(audioPath);
    if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(audioPath , {resource_type:"raw"});
        fs.unlinkSync(audioPath);

        res.json({ result: true, url: resultCloudinary.secure_url });
    } else {
        res.json({ result: false });
    }}
    catch(err){console.log(err)}
});

module.exports = router;
