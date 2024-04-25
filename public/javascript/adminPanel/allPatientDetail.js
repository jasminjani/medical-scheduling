
async function searchPatient() {
  try {

    const searchedName = document.getElementById('a5-searchPatient').value;

    const url = `/admin/display-search-patient/${searchedName}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.allPatient.length < 1) {
      document.getElementById('a5-tbody').innerHTML = `<tr><td colspan="5">No data found!!</td></tr>`;
    } else {

      let html = `<tr>
                <th>Sr no.</th>
                <th>First name</th>
                <th>Last name</th>
                <th>email</th>
                <th>Details</th>
              </tr>`;

      document.getElementById('a5-tbody').innerHTML = html;
      let index = 1;

      result.allPatient.forEach(element => {
        let html2 = `<tr>
                <td>${index++}</td>
                <td>${element.fname}</td>
                <td>${element.lname}</td>
                <td>${element.email}</td>
                <td><p class="a5-btn" onclick="window.location.href='/admin/patient-appointment/${element.id}'">Detail</p></td>
              </tr>`

        document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;

      });
    }
  } catch (error) {
    console.log(error);
  }
}

// let searchBtn = document.getElementById('a5-btn-search');

// searchBtn.addEventListener('keyup', function (event) {
//   try {
//     if (event.key === 'Enter') {
//       searchPatient();
//     }
//   } catch (e) { console.log(e); }
// });


let tbody = document.getElementById('a5-tbody');

async function getAllPatient() {
  try {

    let resp = await fetch('/admin/get-all-patient');

    let data = await resp.json();
    let index = 1;

    if (data.length < 1) {
      tbody.innerHTML = `<tr><td colspan="5">No data found!!</td></tr>`;
    } else {

      // console.log(data);
      data.forEach(patient => {

        let str = `<tr>
          <td>${index++}</td>
          <td>${patient.fname}</td>
          <td>${patient.lname}</td>
          <td>${patient.email}</td>
          <td>
            <p class="a5-btn" onclick="window.location.href='/admin/patient-appointment/${patient.id}'">
              Detail</p>
          </td>
        </tr>`;

        tbody.innerHTML += str;

      });
    }

  } catch (error) {
    console.log(error);
  }
}

getAllPatient()