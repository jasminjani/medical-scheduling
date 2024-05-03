const patientProfileFetchData = async () => {
  const fetchData = await fetch('/patient/update/profileData')
  const data = await fetchData.json()
  const key = Object.keys(data[0])
  key.forEach(element => {
    if (element == "gender" || element == "profile_picture") {
      let radio = document.getElementsByName('gender')
      radio.forEach(item => {
        if (item.value == data[0][element]) {

          item.checked = true
        }
      });
      let profile = document.createElement("img")
      profile.src = `/imgs/${data[0][element]}`
      document.getElementById("updateImage").innerHTML = `<img src="/imgs/${data[0][element]}" alt="" height="200px" width="200px" /> <span onclick='profileFun()'>Cancel</span>`
    }
    else {
     
      document.getElementsByName(element)[0].value = data[0][element]

    }
  });
}


patientProfileFetchData()

const profileFun = () => {
  document.getElementById("file").style.display = "block"
  document.getElementById("updateImage").style.display = "none"
}
  
  const postPatientData = async () =>{
    if(validate()){
    let profile_picture = document.getElementById("profile_picture")
  let fname = document.getElementById("firstname").value
  let lname = document.getElementById("lastname").value
  let dob = document.getElementById("dob").value
  let phone = document.getElementById("phone").value
  let address = document.getElementById("address").value
  let city = document.getElementById("city").value
  let male = document.getElementById("male")
  let female = document.getElementById("female")
  let gender = male.checked ? male.value : female.value
  let formData = new FormData()
  formData.append("profile_picture",profile_picture.files[0])
  formData.append("fname",fname)
  formData.append("lname",lname)
  formData.append("dob",dob)
  formData.append("phone",phone)
  formData.append("address",address)
  formData.append("city",city)
  formData.append("gender",gender)

  let fetchData = await fetch('/patient/profile/update',{
    method:"POST",
  body:formData
      })
  const data = await fetchData.json();
// console.log(data)
  if (data.success) {
    localStorage.setItem('userinfo',JSON.stringify(data.data[0]))
    Swal.fire({
      title: "Good job!",
      text: "Update Successfully!",
      icon: "success"
    });
      }
  }
  }
