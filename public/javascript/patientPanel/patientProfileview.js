
document.getElementById('edtbtn').href = `/patientProfileUpdate`
   const fetchPatientViewData = async()=>{

        const fetchData = await fetch('/viewPatientProfileData')
  const data = await fetchData.json()
  const key = Object.keys(data[0])
        key.forEach(element => {
    console.log(element);
  let divinfo = document.createElement("div")
  divinfo.setAttribute("class", "a7-field")
  let dlabel = document.createElement("label")
  dlabel.innerHTML = element
  let drinfo = document.createElement("span")
  drinfo.innerHTML = data[0][element]
  divinfo.append(dlabel)
  divinfo.append(drinfo)
  document.getElementById("divprofile").appendChild(divinfo)
        });
    }
  fetchPatientViewData()