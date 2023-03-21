import "./style.css";
import { Viewer, ImagePanorama } from "@enra-gmbh/panolens";

export const displayPanorama = (path) => {
	const pan = document.querySelector("#pano_img");
	pan.innerHTML = "";
	console.log(path);

	const panorama = new ImagePanorama(path);
	const viewer = new Viewer({
		container: pan,
		controlBar: false,
	});

	const viewerCamera = viewer.getCamera();

	viewerCamera.position.set(Math.PI, 0, 0);
	viewerCamera.fov = 120;
	viewerCamera.updateProjectionMatrix();

	viewer.add(panorama);
};
