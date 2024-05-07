const express = require("express");
const expressFileUpload = require("express-fileupload");
const app = express();
const fs = require("fs").promises;


app.listen(3000, () => console.log("Your app listening on port 3000"));
app.use(express.static("public"));

app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "El tamano del archivo que intentas subir supera el limite",
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/formulario.html");
});

app.get("/collage", (req, res) => {
  res.sendFile(__dirname + "/public/collage.html");
});

app.post("/imagen", (req, res) => {
  try {
    const { target_file } = req.files
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, (err) => {
      if (err) res.status(500).send(err)
      res.redirect("/collage");
    });
  } catch (error) {
    res.status(500).send("Algo salió mal en la carga de la imagen...")
  }
});

app.get("/deleteImg/:imgName", async (req, res) => {
  try {
    const { imgName } = req.params;
    await fs.unlink(`./public/imgs/${imgName}`);
    res.sendFile(__dirname + "/public/collage.html");
  } catch (error) {
    res.status(500).send(error)
  }
});
