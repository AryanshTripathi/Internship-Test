import "./style.css";
import { Map, View } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { displayPanorama } from "./panorama";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

const view = new View({
	center: [0, 0],
	zoom: 15,
});

const map = new Map({
	target: "map",
	layers: [
		new TileLayer({
			source: new OSM(),
		}),
	],
	view: view,
});

// Just in case you are getting too many alerts, you can use this to check the workability of the code
const imgArray = [
	"./HMTpano_000001_000000.jpg",
	"./HMTpano_000001_000001.jpg",
	"./HMTpano_000001_000002.jpg",
	"./HMTpano_000001_000003.jpg",
	"./HMTpano_000001_000004.jpg",
	"./HMTpano_000001_000005.jpg",
	"./HMTpano_000001_000006.jpg",
	"./HMTpano_000001_000007.jpg",
	"./HMTpano_000001_000008.jpg",
	"./HMTpano_000001_000009.jpg",
];

const isValidPath = (path) => {
	return imgArray.includes(path);
};

let features = [];

let vectorLayer;

const fetchPoints = async () => {
	await fetch("./coordinates.txt")
		.then((res) => res.text())
		.then((data) => {
			// Parse the txt file
			const lines = data.split(/\r?\n/);
			const lineData = lines.map((line) => line.split(" "));
			lineData.shift();

			lineData.forEach((details) => {
				// Create features(point geometries)
				const feature = new Feature({
					geometry: new Point(fromLonLat([details[2], details[3]])),
				});

				// Add the image path as key to the feature for future use
				feature.set("panorama_img", details[0].slice(1, -1));

				// Listen for "select" event on the feature to call the displayPanorama function
				feature.on("select", () => {
					// console.log("clicked");
					console.log(feature);
					if (isValidPath(feature.values_.panorama_img))
						displayPanorama(feature.values_.panorama_img);
					else alert("No image for this coordinate");
				});
				features.push(feature);
			});

			// Create a vector layer with features and add it to the map
			var vectorSource = new VectorSource({
				features: features,
			});
			vectorLayer = new VectorLayer({
				source: vectorSource,
			});
			map.addLayer(vectorLayer);

			// Set the initial view of the map
			const feature = vectorSource.getFeatures()[1100];
			const point = feature.getGeometry();
			view.fit(point, { padding: [170, 50, 30, 150], minResolution: 1 });

			// Listen for click event on the map and call the forEachFeatureAtPixel function to check if the click is on a feature
			map.on("click", (e) => {
				map.forEachFeatureAtPixel(e.pixel, (feature) => {
					feature.dispatchEvent("select");
				});
			});
		});
};

fetchPoints();
