    const requestH2 = document.querySelector(".a2-approve-h2");
    const allDoctorsH2 = document.querySelector(".a2-all-doctors-panel");
    const rejectedDoctorsH2 = document.querySelector(".a2-reject-doc-panel");

    const requestDiv = document.querySelector(".pending-doctors");
    const allDoctorsDiv = document.querySelector(".all-doctors");
    const rejectedDoctorsDiv = document.querySelector(".a2-rejected-doctors");

    allDoctorsDiv.style.display = "none";
    rejectedDoctorsDiv.style.display = "none";

    requestH2.addEventListener("click", () => {
      allDoctorsDiv.style.display = "none";
      rejectedDoctorsDiv.style.display = "none";
      requestDiv.style.display = "block";
    });

    allDoctorsH2.addEventListener("click", () => {
      requestDiv.style.display = "none";
      rejectedDoctorsDiv.style.display = "none";
      allDoctorsDiv.style.display = "block";
    });

    rejectedDoctorsH2.addEventListener("click", () => {
      requestDiv.style.display = "none";
      allDoctorsDiv.style.display = "none";
      rejectedDoctorsDiv.style.display = "block";
    });

    async function getAllDoctors() {
        const resp = await fetch("/admin/allDoctor");

        const data = await resp.json();

        // console.log(data);
        let allPendingDoctors = data.filter((e) => {
          return e.approved === 0 ? e : false;
        });

        let allDoctors = data.filter((e) => {
          return e.approved === 1 ? e : false;
        });

        let rejectedDoctors = data.filter((e) => {
          return e.approved === -1 ? e : false;
        });

        document.getElementById(
          "total-pending-doc"
        ).innerHTML = `(${allPendingDoctors.length})`;
        document.getElementById(
          "all-doctors-count"
        ).innerHTML = ` (${allDoctors.length})`;
        document.getElementById(
          "total-rejected-doc"
        ).innerHTML = ` (${rejectedDoctors.length})`;

        const approveTbody = document.getElementById("approve-tbl-body");
        const allDoctorsTbody = document.getElementById("get-all-doctors");
        const rejectedTbody = document.getElementById(
          "a2-rejected-doctors-tbody"
        );
        // console.log(allPendingDoctors);
        allPendingDoctors.forEach((doc, i) => {
          let str = `<tr>
            <td>${++i}</td>
            <td>${doc.fname} ${doc.lname}</td>
            <td>${doc.email}</td>
            <td>${doc.qualification}</td>
            <td class="a2-btn" onclick="approveDoc(${doc.doctor_id})">Approve</td>
          </tr>`;

          approveTbody.innerHTML += str;
        });

        allDoctors.forEach((doc, i) => {
          let tds = `<tr>
          <td>${++i}</td>
          <td>${doc.fname} ${doc.lname}</td>
          <td>${doc.email}</td>
          <td>${doc.qualification}</td>
          <td><p class="a2-btn" onclick="showDoctorDeatil(${doc.doctor_id})">View</p> <p class="a2-btn" onclick="deleteDoctor(${doc.doctor_id})">Delete</p></td>
          </tr>`;
          allDoctorsTbody.innerHTML += tds;
        });

        rejectedDoctors.forEach((doc, i) => {
          let tds = `<tr>
          <td>${++i}</td>
          <td>${doc.fname} ${doc.lname}</td>
          <td>${doc.email}</td>
          <td>${doc.qualification}</td>
          <td><p class="a2-btn" onclick="approveDoc(${doc.doctor_id})">Approve</p></td>
          </tr>`;
          rejectedTbody.innerHTML += tds;
        });
      }
      getAllDoctors();

      async function deleteDoctor(id) {

        await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0969da",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            let resp = await fetch(`/admin/doctors/delete/${id}`);
            await Swal.fire({
              title: "Deleted!",
              text: "Doctor has been deleted.",
              icon: "success"
            });   
            location.reload();
          }
        });

      }

      async function approveDoc(id) {
        location.href = `/admin/doctor/${id}`;
      }

      async function showDoctorDeatil(id) {
        location.href = `/admin/show/doctorDetail/${id}`
      }
  