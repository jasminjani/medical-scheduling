
// To access the stars
let stars =
	document.getElementsByClassName("star");
let output =
	document.getElementById("output");

const getReviews = async () => {
	const id = window.location.href.split("/").pop();

	const response = await fetch(`http://localhost:8000/review/${id}`, {
		method: "GET",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		},
	});

	const {message} = await response.json();

	console.log(message);
}

//review add
const submitRate = async () => {
	const form = document.getElementById("reviewForm");
	const formData = new FormData(form);
	const params = new URLSearchParams(formData);
	const data = await new Response(params).text();

	const response = await fetch("http://localhost:8000/review", {
		method: "POST",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		},
		body: data
	});

	const result = await response.json();

	Swal.fire(result.message);

	gfg(0);
	console.log(document.getElementById("rev"));
	document.getElementById("rev").value = ""
}

function closeThanks() {
	document.getElementById('thanksText').style.display = "none"
	document.getElementById('A6-body').style.opacity = "100%"
}



function gfg(n) {
	remove();
	for (let i = 0; i < n; i++) {
		if (n == 1) cls = "one";
		else if (n == 2) cls = "two";
		else if (n == 3) cls = "three";
		else if (n == 4) cls = "four";
		else if (n == 5) cls = "five";
		stars[i].className = "star " + cls;
	}

	document.getElementById("output").value = n
}

// To remove the pre-applied styling
function remove() {
	let i = 0;
	while (i < 5) {
		stars[i].className = "star";
		i++;
	}
}

getReviews();