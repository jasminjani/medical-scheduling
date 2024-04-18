window.location.href.split("/").pop() === "patientUpcomingSlots" ? document.getElementById("A3-upcoming").style.backgroundColor = "#3984af" : "";

// Add Doctor id from cookie
const getUpcomingSlots = async () => {
  const response = await fetch("http://localhost:8000/bookings/2", {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { message } = await response.json();

  console.log(message);

  const table = document.getElementById("date-body");

  message.forEach(element => {
    table.innerHTML += `
      <tr>
        <td>${element.date}</td>
        <td>${element.day}</td>
        <td>${element.start_time.slice(0, -3)}-${element.end_time.slice(0, -3)}</td>
        <td><input type="button" value="Details" onclick=getDetails(${JSON.stringify(element)})></td>
        <td><input type="button" value="Cancel"></td>
      </tr>
    `
  });
}

const getDetails = async (data) => {
  const modal = document.getElementsByClassName("A3-modal")[0];

  modal.style.visibility = "visible";

  modal.innerHTML = `
      <div class="A3-row-3">
        <h3 id="A3-modal-date">Booking : ${data.booking_date}</h3>
        <input type="button" value="Close" onclick="handleClose()">
      </div>
      <h4>Doctor Details</h4>
      <div class="card">
          <div class="col">
    <p><i class="fa-solid fa-user-doctor"></i>${data.fname} ${data.lname}<img src="/assets/tick.png" alt="tick"/></p>
            <p><i class="fa-regular fa-envelope"></i>${data.email}</p>
            <p><i class="fa-solid fa-phone"></i>${data.phone}</p>
            <p><i class="fa-solid fa-book"></i>${data.qualification}</p>
          </div>
          <div class="col">
            <p><i class="fa-solid fa-indian-rupee-sign"></i>${data.consultancy_fees}</p>
            <p><i class="fa-regular fa-hospital"></i>${data.name}</p>
            <p><i class="fa-solid fa-location-dot"></i>${data.location}</p>
            <p><i class="fa-solid fa-pen"></i>${data.pincode}</p>
        </div>
      </div>
  `
}

const handleClose = () => {
  document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
}
