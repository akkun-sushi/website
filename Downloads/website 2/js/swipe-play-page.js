const front_div = document.getElementById("front_div");
const video_front = document.getElementById("video_front");
const video_behind = document.getElementById("video_behind");
const overlay_div_0 = document.getElementById("overlay_div_0");
const overlay_div_1 = document.getElementById("overlay_div_1");

const rect = video_front.getBoundingClientRect();
const rotation_origin = { x: rect.x + Math.round(rect.width / 2), y: rect.y - 3 * rect.height };
let pointer_start_angle = 0;

let is_clicked = false;
let swipe_direction = 0;
let during_transition = false;

const video_arr = ["stall.mp4", "mypeople.mp4", "mr.mp4", "lock.mp4", "maze.mp4", "new-partner.mp4", "zoom.mp4", "blind.mp4"];
let next_video = "stall.mp4";

function addToCart() {
	const videoName = video_front.src.replace(/^.*[\\/]/, "");
	const videoCardMatch = [["stall.mp4", "movie-3.jpg"], ["mypeople.mp4", "movie-4.jpg"], ["mr.mp4", "movie-5.jpg"], ["lock.mp4", "movie-6.jpg"], ["maze.mp4", "movie-7.jpg"], ["new-partner.mp4", "movie-8.jpg"], ["zoom.mp4", "movie-9.jpg"], ["blind.mp4", "movie-10.jpg"]];
	const card = videoCardMatch.filter(set => set[0] === videoName)[0][1];
	const cart = sessionStorage.getItem("cartItems") ? sessionStorage.getItem("cartItems").split(",") : [];

	cart.indexOf(card) === -1 ? cart.push(card) : null;

	sessionStorage.setItem("cartItems", cart.toString());
}

function pick_next_video() {
	next_video = video_arr[Math.floor(Math.random() * video_arr.length)];
	
	while (next_video === video_front.src.split("/").pop()) {
		next_video = video_arr[Math.floor(Math.random() * video_arr.length)];
	}
	
	video_behind.src = `img/${next_video}`;
}

function start_click_iframe(event) {
	front_div.style.transformOrigin = window.getComputedStyle(video_front).transformOrigin;
	
	if (!during_transition) {
		pointer_start_angle = Math.atan2(event.clientY - rotation_origin.y, event.clientX - rotation_origin.x) - Math.PI / 2;
		is_clicked = true;
		
		video_behind.src.endsWith("not_loaded") ? pick_next_video() : null;
	}
}

function end_click_iframe() {
	if (!during_transition) {
		is_clicked = false;
		
		front_div.style.transition = "all 0.2s";
		
		if (swipe_direction === 0) {
			front_div.style.transform = "rotate(0rad)";
			
			overlay_div_0.style.opacity = 0;
			overlay_div_1.style.opacity = 0;
		} else {
			front_div.style.left = swipe_direction === 1 ? "calc(100vw - 20%)" : "calc(-100vw + 10%)";
			swipe_direction === 1 ? addToCart() : null;
			
			during_transition = true;
		}
	}
}

function on_pointer_leave() {
	!during_transition && is_clicked ? end_click_iframe() : null;
}

function on_transition_end() {
	front_div.style.transition = "";
	front_div.style.left = "";
	front_div.style.transform = "rotate(0rad)";
	
	if (during_transition) {
		video_front.src = `img/${next_video}`;
		video_behind.src = "not_loaded";
	}
	
	overlay_div_0.style.opacity = 0;
	overlay_div_1.style.opacity = 0;
	
	swipe_direction = 0;
	during_transition = false;
}

function rotate_iframe(event) {
	if (!during_transition) {
		video_front.play();
		
		if (is_clicked) {
			let angle = Math.atan2(event.clientY - rotation_origin.y, event.clientX - rotation_origin.x) - Math.PI / 2 - pointer_start_angle;
			
			if ((angle > -Math.PI / 25) && (angle < Math.PI / 25)) {
				front_div.style.transition = "";
				front_div.style.transform = `rotate(${angle}rad)`;
				
				if (angle > Math.PI / 50) {
					overlay_div_0.style.opacity = 0.8 * (angle - Math.PI / 50) / (Math.PI / 50);
					overlay_div_1.style.opacity = 0;
				} else if (angle < -Math.PI / 50) {
					overlay_div_0.style.opacity = 0;
					overlay_div_1.style.opacity = 0.8 * (angle + Math.PI / 50) / (-Math.PI / 50);
				}
				
				swipe_direction = 0;
			} else {
				swipe_direction = angle > 0 ? -1 : 1;
			}
		}
	}
}

front_div.addEventListener("pointerdown", start_click_iframe, false);
front_div.addEventListener("pointerup", end_click_iframe, false);
front_div.addEventListener("pointerleave", on_pointer_leave, false);
front_div.addEventListener("pointermove", rotate_iframe, false);
front_div.addEventListener("transitionend", on_transition_end, false);