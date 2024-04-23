window.location.href.split("/").pop() === "patientUpcomingSlots" ? document.getElementById("A3-upcoming").style.backgroundColor = "#3984af" : "";

let page = 1;

let limit = 6;

let totalPage;


const getUpcomingSlots = async () => {
  let user = JSON.parse(localStorage.getItem('userinfo'));
  const response = await fetch(`/bookings/${user.id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { success, data } = await response.json();

  console.log(data);

  totalPage = Math.ceil(data.length / limit);

  if (totalPage <= 1) document.getElementsByClassName("A4-Pagination-component")[0].style.visibility = "hidden";

  const table = document.getElementById("date-body");

  table.innerHTML = "";

  if (data.length == 0) {
    return table.innerHTML = "<tr><td colspan='5'>No Data Found !</td></tr>"
  }

  data.slice((page - 1) * limit, page * limit).forEach(element => {
    table.innerHTML += `
      <tr>
        <td>${element.date}</td>
        <td>${element.day}</td>
        <td>${element.start_time.slice(0, -3)}-${element.end_time.slice(0, -3)}</td>
        <td><input type="button" value="Details" onclick="getDetails(${JSON.stringify(element)})"></td>
        <td><input type="button" value="Cancel" onclick="cancelSlot(${element.id},${element.patient_id})"></td>
      </tr>
    `
  });
}

const home = () => {
  if (page > 1) {
    page = 1;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
}

const previous = () => {
  if (page > 1) {
    page--;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
}

const next = () => {
  if (page < totalPage) {
    page++;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
}

const end = () => {
  if (page < totalPage) {
    page = totalPage;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
}

const cancelSlot = async (slot_id, patient_id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Canceled!",
        text: "Fees refunded successfully!!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = `/cancel/${slot_id}`;
        }
      })
    }
  });
}

const getDetails = async (data) => {
  const modal = document.getElementsByClassName("A3-modal")[0];
  console.log(modal)
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

