
async function searchPatient() {

  const searchedName = document.getElementById('a5-searchPatient').value;

  const url = `http://localhost:8000/admin/display-search-patient/${searchedName}`;
  const response = await fetch(url);
  const result = await response.json();

  let html = `<tr>
                <th>First name</th>
                <th>Last name</th>
                <th>email</th>
                <th>Details</th>
              </tr>`;

  document.getElementById('a5-tbody').innerHTML = html;

  result.allPatient.forEach(element => {
    let html2 = `<tr>
                <td>${element.fname}</td>
                <td>${element.lname}</td>
                <td>${element.email}</td>
                <td><p class="a5-btn" onclick="window.location.href='/admin/patient-appointment/${element.id}'">Detail</p></td>
              </tr>`

    document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;

  });

}

let searchBtn = document.getElementById('a5-btn-search');

searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPatient();
    }
  } catch (e) { console.log(e); }
});


let tbody = document.getElementById('a5-tbody');

async function getAllPatient() {
  let resp = await fetch('/admin/get-all-patient');

  let data = await resp.json();
  // console.log(data);
  data.forEach(patient => {

    let str = `<tr>
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

getAllPatient()