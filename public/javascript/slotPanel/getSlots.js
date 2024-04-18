window.location.href.split("/").pop() === "upcomingSlots" ? document.getElementById("A3-view").style.backgroundColor = "#3984af" : "";

// Add Doctor id from cookie
const getDates = async () => {
  const response = await fetch("http://localhost:8000/dates/1", {
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
        <td><input type="button" value="View Slots" onclick=getSlots("${element.dates}",1)></td>
      </tr>
    `
  });
}

const getSlots = async (date, doctor_id) => {

  document.getElementsByClassName("A3-modal")[0].style.visibility = "visible";

  const response = await fetch(`http://localhost:8000/slots/${doctor_id}/${date}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const { message } = await response.json();

  console.log(message);

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
        <td><input type="button" value="Delete" onclick=openDeleteModal(${doctor_id},${element.id}) /></td>
      </tr>
    `
  });
}

const openDeleteModal = async (doctor_id, slot_id) => {
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
          window.location.href = `/${doctor_id}/delete/${slot_id}`;
        }
      })
    }
  });
}

const handleClose = () => {
  document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
}



