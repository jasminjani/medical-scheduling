 document.getElementById('edtbtn').href = `/doctor/profile/update`
  document.getElementById('viewprofile').href = `/doctor/profile`
 const profileDetailData = async() =>{

    let fetchdata = await fetch(`/doctor/data`)
  let data = await fetchdata.json()


    data.forEach(element => {
      document.getElementById("divprofile").innerHTML += `<span hidden>${element["id"]}</span>
        <span hidden>${element["hospital_id"]}</span>
        <div class="a7-field"><label for="">Name</label><span>${element["Name"]}</span></div>
        <div class="a7-field"><label for="">Email</label><span>${element["Email"]}</span></div>
        <div class="a7-field"><label for="">Gender</label><span>${element["Gender"]}</span></div>
        <div class="a7-field"><label for="">Date Of Birth</label><span>${element["Date of Birth"]}</span></div>
        <div class="a7-field"><label for="">Contact</label><span>${element["Contact"]}</span></div>
        <div class="a7-field"><label for="">Address</label><span>${element["Address"]}</span></div>
        <div class="a7-field"><label for="">Hospital Name</label><span>${element["Hospital Name"]}</span></div>
        <div class="a7-field"><label for="">Hospital Address</label><span>${element["Hospital Address"]}</span></div>
        <div class="a7-field"><label for="">GST No</label><span>${element["GST No"]}</span></div>
        <div class="a7-field"><label for="">City</label><span>${element["City"]}</span></div>
        <div class="a7-field"><label for="">Pincode</label><span>${element["Pincode"]}</span></div>
        <div class="a7-field"><label for="">Speciality</label><span>${element["Speciality"]}</span></div>
        <div class="a7-field"><label for="">Qualification</label><span>${element["Qualification"]}</span></div>
        <div class="a7-field"><label for="">Consultancy Fees</label><span>${element["Consultancy Fees"]}</span></div>`
    });
  }

profileDetailData()




  // let key = Object.keys(data[0])
  //   key.forEach(item => {

  //     if(item == 'id' || item == 'hospital_id')
  // {
  //   let drinfo = document.createElement("span")
  // drinfo.innerHTML = data[0][item]
  // document.getElementById("divprofile").appendChild(drinfo)
  // drinfo.style.display= 'none'
  //     }
  // else{
  //   let divinfo = document.createElement("div")
  // divinfo.setAttribute("class", "a7-field")
  // let dlabel = document.createElement("label")
  // dlabel.innerHTML = item
  // let drinfo = document.createElement("span")
  // drinfo.innerHTML = data[0][item]
  // divinfo.append(dlabel)
  // divinfo.append(drinfo)
  // document.getElementById("divprofile").appendChild(divinfo)
  //     } 
  //   });
  // }



