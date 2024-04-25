

const fetchData = async () => {
  let fetchdata = await fetch(`/updateDoctorData/`)
  let data = await fetchdata.json()

  let key = Object.keys(data[0])

  key.forEach(element => {

    if (element == 'gender' || element == 'profile_picture' || element == "email") {
      let radio = document.getElementsByName('gender')
      radio.forEach(ele => {
        if (ele.value == data[0][element]) {
          ele.checked = true;
        }
      });
      document.getElementById('updateImage').innerHTML = `<img src="/imgs/${data[0][element]}" alt="" height="200px" width="200px">
    <span onclick="profileFun()">cancel</span>`
    
    }
    else {
      document.getElementsByName(element)[0].value = data[0][element]
    }
  });
}
fetchData()

const profileFun = () => {
  document.getElementById("file").style.display = "block"
  document.getElementById("updateImage").style.display = "none"
}
