  async function makeSpecialtiesTable() {
    let response = await fetch("/admin/specialties");

  let allSpecialties = await response.json();
  // console.log(allSpecialties);
  const tbody = document.getElementById("a2-tbody");

      allSpecialties.forEach((specialties, i) => {
    let strTD = `<tr>
    <td>${++i}</td>
    <td>${specialties.speciality}</td>
  </tr>`;
  tbody.innerHTML += strTD;
      });
    }


  makeSpecialtiesTable();


  async function getNewSpecialty() {
    let response = await fetch("/admin/specialities/new");

  let newSpecialty = await response.json();
  // console.log(newSpecialty);
  const tbody = document.getElementById("pending-speciality");

  if (newSpecialty.length) {
    let reqTable = document.querySelector('.a2-no-data');
  reqTable.style.display = 'none';
      } else {
    let reqTable = document.querySelector('.a2-no-data');
  reqTable.style.display = 'block';
      }
      newSpecialty.forEach((specialties, i) => {
    let strTD = `<tr>
    <td>${++i}</td>
    <td>${specialties.speciality}</td>
    <td class="a2-btn" onclick=addSpecialty(${specialties.id})>Add</td>
</tr>`;
        tbody.innerHTML += strTD;
      });
    }

    getNewSpecialty();

    async function addSpecialty(id) {

      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0969da",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add it!"
        }).then(async (result) => {
          if (result.isConfirmed) {

            let response = await fetch("/admin/specialities/add", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: id }),
            });

            await Swal.fire({
              title: "Added!",
            text: "Specialty added successfully.",
            icon: "success"
            });   
            if (response.ok) {
              // alert("Specialty added successfully ");
              location.reload();
            }
          }
        });
    }
