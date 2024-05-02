window.location.href.split("/").pop() === "upcomingSlots"
  ? (document.getElementById("A3-upcoming").style.backgroundColor = "#3984af")
  : "";

let page = 1;

let limit = 6;

let totalPage;

const getUpcomingSlots = async () => {
  let user = JSON.parse(localStorage.getItem("userinfo"));
  const response = await fetch(`/patient/bookings/${user.id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const { success, data } = await response.json();

  totalPage = Math.ceil(data.length / limit);

  if (totalPage <= 1)
    document.getElementsByClassName(
      "A4-Pagination-component"
    )[0].style.visibility = "hidden";

  const table = document.getElementById("date-body");

  table.innerHTML = "";

  if (data.length == 0) {
    return (table.innerHTML = "<tr><td colspan='5'>No Data Found !</td></tr>");
  }

  let timezoneoffset = new Date().getTimezoneOffset();
  data.slice((page - 1) * limit, page * limit).forEach((element) => {
    element.start_time = new Date(element.start_time).getTime();
    element.start_time -= (timezoneoffset * 60 * 1000);
    const checkStartTime = ((element.start_time - new Date().getTime()) / (1000 * 60 * 60))
    element.start_time = new Date(element.start_time).toLocaleTimeString('en-US')
    // console.log(element.start_time)

    element.end_time = new Date(element.end_time).getTime();
    element.end_time -= (timezoneoffset * 60 * 1000);
    element.end_time = new Date(element.end_time).toLocaleTimeString('en-US')
    table.innerHTML += `
      <tr>
        <td>${element.date}</td>
        <td>${element.day}</td>
        <td>${element.start_time}-${element.end_time}</td>
        <td><input type="button" value="Details" onclick='getDetails(${JSON.stringify(element)})'/></td>
        <td><input type="button" value="Cancel" onclick='cancelSlot(${JSON.stringify(element)},${checkStartTime})'></td>
      </tr>
    `;
  });
};

const home = () => {
  if (page > 1) {
    page = 1;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
};

const previous = () => {
  if (page > 1) {
    page--;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
};

const next = () => {
  if (page < totalPage) {
    page++;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
};

const end = () => {
  if (page < totalPage) {
    page = totalPage;
    document.getElementById("pageno").innerHTML = page;
    getUpcomingSlots();
  }
};

const cancelSlot = async (element,time) => {
  if(time <= 2) return Swal.fire("You can not cancel slot before 2 hours");
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Canceled!",
        text: "Fees refunded successfully!!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit('cancel-slot', element);
          // window.location = `/patient/cancel/${element.id}`;
        }
      });
    }
  });
};

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
  `;
};

const handleClose = () => {
  document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
};
