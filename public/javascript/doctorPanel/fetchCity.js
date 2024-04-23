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
fetchCity()