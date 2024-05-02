
  function showClinicDetails() {
    let div = document.querySelector(".A4-clinic-details-content");
  div.style.display === "block"
  ? (div.style.display = "none")
  : (div.style.display = "block");
      }



      
  async function fetchData(id){
    let res=await fetch(`/admin/doctorDetails/${id}`);
  let resjson=await res.json();
  // console.log(resjson.result[0]);

  let tabledata=document.getElementsByClassName("A4-table-content");
  // console.log(tabledata);
  let keys=Object.keys(resjson.result[0]);
  // console.log(keys);
  let i=0;
        keys.forEach(element => {
    tabledata[i].innerText = resjson.result[0][element];
  i++
        });
      }

  fetchData(window.location.pathname.split("/").pop());

  async function approveDoctor(id) {

    await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0969da",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log(id);
        const resp = await fetch(`/admin/doctor/approve/${id}`);
        await Swal.fire({
          title: "Approved!",
          text: "Doctor has been aprroved.",
          icon: "success"
        });
        resp.ok ? (location.href = "/admin/doctors/all") : "";
      }
    });
      }

  async function rejectDoctor(id) {

    await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0969da",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log(id);
        const resp = await fetch(`/admin/doctor/reject/${id}`);
        await Swal.fire({
          title: "Rejected!",
          text: "Doctor has been rejected.",
          icon: "success"
        });
        resp.ok ? (location.href = "/admin") : "";
      }
    });
      }
