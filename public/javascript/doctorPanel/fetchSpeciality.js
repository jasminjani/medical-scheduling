   let otherSpeciality_id;

   const specialityFetch = async () => {
        const fetchData = await fetch("/specialities")
        const data = await fetchData.json()
        data.forEach(element => {
          document.getElementById("speciality").innerHTML += `
          <option value=${element["speciality_id"]}>${element["speciality"]}</option>`;
          if (element["speciality"].toLowerCase() == "other") {
            otherSpeciality_id = element["speciality_id"];
          }
        });
      }
 
      specialityFetch()


function specialityChange() {

  if (document.getElementById('speciality').value == otherSpeciality_id) {
    document.getElementById('otherSpeciality').style.display = 'block'; 
  } else {
    document.getElementById('otherSpeciality').style.display = 'none'; 
    document.getElementById('otherSpeciality').value = null; 
  }
}
  