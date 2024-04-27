
// To access the stars
let stars =
	document.getElementsByClassName("star");
let output =
	document.getElementById("output");

// generate stars from rating
const generateStar = async (rating) => {
	let stars = "";
	for (let i = 0; i < 5; i++) {
		if (i >= rating) {
			stars += `<i class="fa-solid fa-star"></i>`;
		} else {
			stars += `<i class="fa-solid fa-star gold"></i>`;
		}
	}
	return stars;
}

//generate reviews of doctor
const generateReviewData = async (review, id) => {
	const html = `
		<div class="A6-reviewContent card-1">
		<div class="row-1">
			<h4 class="reviewName">${review.patient_id === id ? "Your Review" : `${review.fname} ${review.lname}`}</h4>
			${review.patient_id === id ? `<i class="fa-solid fa-pen"></i>` : ""}
		</div>
		<div class="row-2">
			<h4>${await generateStar(review.rating)}</h4>
		</div>
		<p>${review.review}</p>
		</div>
	`
	return html;
}

const getReviews = async () => {
	const d_id = window.location.href.split("/").pop();

	const response = await fetch(`http://localhost:8000/patient/review/${d_id}`, {
		method: "GET",
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		},
	});

	const { myReview, patientReview, id } = await response.json();

	const reviewContainer = document.getElementsByClassName("A6-review")[0];

	myReview && patientReview ? reviewContainer.innerHTML = await generateReviewData(myReview, id) : reviewContainer.innerHTML = `<img id="dataNotFound" src="/assets/noReview.png" alt="not found"/>`;

	patientReview.map(async (review) => {
		reviewContainer.innerHTML += await generateReviewData(review, id);
	})
}

//review add
const submitRate = async () => {
	const form = document.getElementById("reviewForm");
	const formData = new FormData(form);
	const params = new URLSearchParams(formData);
	const data = await new Response(params).text();

	const response = await fetch("http://localhost:8000/patient/review", {
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