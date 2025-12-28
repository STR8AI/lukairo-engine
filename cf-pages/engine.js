import { startGlobe } from "./visuals/globe.js";
import { startPlatforms } from "./visuals/platforms.js";

const canvas = document.getElementById("scene");

startGlobe(canvas);
startPlatforms(canvas);
