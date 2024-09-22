import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const config = {
    params: { appid: "46d7a12a8fad56d7fdba2aa6b3095ebd" }
  };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("intro.ejs"); 
});

app.get("/submit", async (req, res) => {
    const locationAPIKey = "c318f989-a927-4fcc-93b7-a0c9fa2539da";
    try {
        const location = await axios.get(`https://apiip.net/api/check?accessKey=${locationAPIKey}&fields=latitude,longitude`);
        const lat = location.data.latitude;
        const long = location.data.longitude;

        const weatherJSON = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`, config);
        console.log(weatherJSON.data);
        res.render("index.ejs", {
            Weather: weatherJSON.data,
        });
    } catch (error) {
        console.error(error);
        res.render("index.ejs", {
            Weather: null,
            errorMessage: "Unable to fetch weather data. Please try again later.",
        });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
