window.location.href.split("/").pop() === "pastSlots" ? document.getElementById("A3-past").style.backgroundColor = "#3984af" : "";

let page = 1;

let limit = 6;

let totalPage;

const getPastSlots = async () => {
  let user = JSON.parse(localStorage.getItem('userinfo'));
  const response = await fetch(`/patient/pastbookings/${user.id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { success, message } = await response.json();
  // console.log(message)
  totalPage = Math.ceil(message.length / limit);

  if (totalPage <= 1) document.getElementsByClassName("A4-Pagination-component")[0].style.visibility = "hidden";

  const table = document.getElementById("date-body");

  table.innerHTML = "";

  if (message.length == 0 || !success) {
    return table.innerHTML = "<tr><td colspan='5'>No Data Found !</td></tr>"
  }

  let timezoneoffset = new Date().getTimezoneOffset();
  message.slice((page - 1) * limit, page * limit).forEach(element => {
    element.start_time = new Date(element.start_time).getTime();
    element.start_time -= (timezoneoffset * 60 * 1000);
    element.start_time = new Date(element.start_time).toLocaleTimeString('en-US')
    // console.log(element.start_time)

    element.end_time = new Date(element.end_time).getTime();
    element.end_time -= (timezoneoffset * 60 * 1000);
    element.end_time = new Date(element.end_time).toLocaleTimeString('en-US')
    if (element.prescription_id) {
      table.innerHTML += `
      <tr>
        <td>${element.date}</td>
        <td>${element.day}</td>
        <td>${element.start_time}-${element.end_time}</td>
        <td><input type="button" value="Details" onclick='getDetails(${JSON.stringify(element)})'></td>
        <td>${element.prescription_id !== null ? `<input type="button" value="Get PDF" onclick="generatePDF(${element.prescription_id})">` : `-`}</td>
      </tr>`;
    }
  });
}

const home = () => {
  if (page > 1) {
    page = 1;
    document.getElementById("pageno").innerHTML = page;
    getPastSlots();
  }
}

const previous = () => {
  if (page > 1) {
    page--;
    document.getElementById("pageno").innerHTML = page;
    getPastSlots();
  }
}

const next = () => {
  if (page < totalPage) {
    page++;
    document.getElementById("pageno").innerHTML = page;
    getPastSlots();
  }
}

const end = () => {
  if (page < totalPage) {
    page = totalPage;
    document.getElementById("pageno").innerHTML = page;
    getPastSlots();
  }
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