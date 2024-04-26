 document.getElementById('edtbtn').href = `/updatedoctorProfile/`
  document.getElementById('viewprofile').href = `/doctorProfile/`
 const profileDetailData = async() =>{

    let fetchdata = await fetch(`/doctorData`)
  let data = await fetchdata.json()

  let key = Object.keys(data[0])
    key.forEach(item => {

      if(item == 'id' || item == 'hospital_id')
  {
    let drinfo = document.createElement("span")
  drinfo.innerHTML = data[0][item]
  document.getElementById("divprofile").appendChild(drinfo)
  drinfo.style.display= 'none'
      }
  else{
    let divinfo = document.createElement("div")
  divinfo.setAttribute("class", "a7-field")
  let dlabel = document.createElement("label")
  dlabel.innerHTML = item
  let drinfo = document.createElement("span")
  drinfo.innerHTML = data[0][item]
  divinfo.append(dlabel)
  divinfo.append(drinfo)
  document.getElementById("divprofile").appendChild(divinfo)
      } 
    });
  }

  profileDetailData()

