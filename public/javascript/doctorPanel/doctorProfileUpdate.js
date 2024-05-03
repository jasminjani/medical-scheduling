
const fetchData = async () => {
  let fetchdata = await fetch(`/doctor/updateDoctorData/`)
  let data = await fetchdata.json()

  data.forEach(element => {
  
    document.getElementById("id").value = element["id"]
    document.getElementById("doctor_id").value = element["doctor_id"]
    document.getElementById("hospital_id").value = element["hospital_id"]
    document.getElementById("firstname").value = element["fname"]
    document.getElementById("lastname").value = element["lname"]
    document.getElementById("dob").value = element["dob"]
    document.getElementById("phone").value = element["phone"]
    document.getElementById("address").value = element["address"]
    document.getElementById('updateImage').innerHTML = `<img src="/imgs/${element["profile_picture"]}" alt="" height="200px" width="200px">
    <span onclick="profileFun()">cancel</span>`
    document.getElementById("qualification").value = element["qualification"] 
    document.getElementById("consultancyfee").value = element["consultancy_fees"]
    document.getElementById("hospitalname").value = element["name"]
    document.getElementById("gstno").value = element["gst_no"]
    document.getElementById("location").value = element["location"]
    document.getElementById("pincode").value = element["pincode"]

    if(element["gender"] == "male")   
    {
      document.getElementById("male").checked = true
    }
    else{
       document.getElementById("female").checked = true
    }

    let city = document.getElementById("city") 
    for (const iterator of city) {
      if(element["city"] == iterator.value )
      {
          city.value = iterator.value
      }
    }  
    let speciality = document.getElementById("speciality")
    
    for (const iterator of speciality) {
        if(element["speciality"] == iterator.value)
        {
          speciality.value = iterator.value
        }
      }
  });
}

fetchData()

const profileFun = () => {
  document.getElementById("file").style.display = "block"
  document.getElementById("updateImage").style.display = "none"
}









//   key.forEach(element => {

//     if (element == 'gender' || element == 'profile_picture' || element == "email") {
//       let radio = document.getElementsByName('gender')
//       radio.forEach(ele => {
//         if (ele.value == data[0][element]) {
//           ele.checked = true;
//         }
//       });
//       document.getElementById('updateImage').innerHTML = `<img src="/imgs/${data[0][element]}" alt="" height="200px" width="200px">
//     <span onclick="profileFun()">cancel</span>`
    
//     }
//     else {
//       document.getElementsByName(element)[0].value = data[0][element]
//     }
//   });
// }
