const specialityFetch = async () => {
  const fetchData = await fetch("http://localhost:8000/specialities")
  const data = await fetchData.json()
  let key = Object.keys(data)

  key.forEach(element => {
    let dtkey = Object.keys(data[element])
      let option = document.createElement("option")
      option.value = data[element][dtkey[0]]
      option.textContent = data[element][dtkey[1]]
      document.getElementById(dtkey[1]).appendChild(option)
  });

}





const fetchCity = async () => {

  const fetchdata = await fetch("http://localhost:8000/cityCombo")
  const data = await fetchdata.json()
  let key = Object.keys(data)
  key.forEach(element => {
    let dtkey = Object.keys(data[element])
    let option = document.createElement("option")
    option.value = data[element][dtkey[2]]
    option.textContent = data[element][dtkey[2]]
    document.getElementById("city").appendChild(option)
    
  });
}


const fetchdoctorCity = async () => {

  const fetchdata = await fetch("http://localhost:8000/cityCombo")
  const data = await fetchdata.json()
  let key = Object.keys(data)
  key.forEach(element => {
    let dtkey = Object.keys(data[element])
    let option = document.createElement("option")
    option.value = data[element][dtkey[2]]
    option.textContent = data[element][dtkey[2]]
    document.getElementById("dcity").appendChild(option)

  });
}
fetchCity()
specialityFetch()
fetchdoctorCity()