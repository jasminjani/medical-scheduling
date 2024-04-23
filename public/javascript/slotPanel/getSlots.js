window.location.href.split("/").pop() === "upcomingSlots" ? document.getElementById("A3-view").style.backgroundColor = "#3984af" : "";

// Add Doctor id from cookie
const getDates = async () => {
  const response = await fetch("http://localhost:8000/dates", {
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

const getSlots = async (date) => {

  document.getElementsByClassName("A3-modal")[0].style.visibility = "visible";

  const response = await fetch(`http://localhost:8000/slots/${date}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { message } = await response.json();

  // console.log(message);

  document.getElementById("A3-modal-date").innerHTML = date;

  const table = document.getElementById("slot-body");

  table.innerHTML = "";

  message.forEach(element => {
    table.innerHTML += `
      <tr>
        <td>${element.start_time}</td>
        <td>${element.end_time}</td>
        <td>${element.patient_name ? element.patient_name : "-"}</td>
        <td>${element.phone ? element.phone : "-"}</td>
        <td>${!element.is_canceled ? `<input type="button" value="Delete" onclick=openDeleteModal(${element.id}) />` : `<i class="fa-solid fa-xmark"></i>`}</td>
      </tr>
    `
  });
}

const openDeleteModal = async (slot_id) => {
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
          window.location.href = `/delete/${slot_id}`;
        }
      })
    }
  });
}

const handleClose = () => {
  document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
}
