window.location.href.split("/").pop() === "upcomingSlots" ? document.getElementById("A3-view").style.backgroundColor = "#3984af" : "";

// Add Doctor id from cookie
const getDates = async () => {
  const response = await fetch("/doctor/dates", {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { message } = await response.json();

  const table = document.getElementById("date-body");

  message.forEach(element => {
    table.innerHTML += `
      <tr>
        <td>${element.dates}</td>
        <td>${element.day}</td>
        <td><input type="button" value="View Slots" onclick=getSlots("${element.dates}")></td>
      </tr>
    `
  });
}
window.onload = getDates;
const getSlots = async (date) => {

  document.getElementsByClassName("A3-modal")[0].style.visibility = "visible";

  const response = await fetch(`/doctor/slots/${date}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { message } = await response.json();

  document.getElementById("A3-modal-date").innerHTML = date;

  const table = document.getElementById("slot-body");

  table.innerHTML = "";
  message.sort((a,b)=> new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  message.forEach(element => {
    let timezoneOffset = new Date().getTimezoneOffset();
    // start time
    element.start_time = new Date(element.start_time).getTime();
    element.start_time -= (timezoneOffset * 60 * 1000);
    const checkStartTime = ((element.start_time - new Date().getTime()) / (1000 * 60 * 60))
    element.start_time = new Date(element.start_time).toLocaleTimeString();
    // end time
    element.end_time = new Date(element.end_time).getTime();
    element.end_time -= (timezoneOffset * 60 * 1000);
    const checkEndTime = ((element.end_time - new Date().getTime()) / (1000 * 60 * 60))
    // console.log(checkEndTime);
    element.end_time = new Date(element.end_time).toLocaleTimeString();
    table.innerHTML += `
      <tr style=${element.is_canceled && checkEndTime > 0 ? "background-color:#3984af;" : ""}>
        <td>${element.start_time}</td>
        <td>${element.end_time}</td>
        <td>${element.patient_name ? element.patient_name : "-"}</td>
        <td>${element.phone ? element.phone : "-"}</td>
        <td>${!element.is_canceled && checkEndTime > 0 ? `<input type="button" value="Delete" onclick='openDeleteModal(${JSON.stringify(element)},${checkStartTime})' />` : checkEndTime < 0 ? `<input type="button" value="Closed"/>` : `<input type="button" value="Delete" onclick='openDeleteModal(${JSON.stringify(element)},${checkStartTime})' />`}</td>
      </tr>
    `
  });
}

const openDeleteModal = async (element, time) => {
  if (time <= 2 && !element.is_canceled) return Swal.fire("You can not delete slot before 2 hours");
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Slot deleted successfully!!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit(`delete-slot`, element);
          window.location.href = `/doctor/delete/${element.id}`;
        }
      })
    }
  });
}

const handleClose = () => {
  document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
}
