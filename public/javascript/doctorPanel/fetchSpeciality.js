   let otherSpeciality_id;

   const specialityFetch = async () => {
        const fetchData = await fetch("/specialities")
        const data = await fetchData.json()
        let key = Object.keys(data)
        key.forEach(element => {
          let dtkey = Object.keys(data[element])
          let option = document.createElement("option")
          option.value = data[element][dtkey[0]]
          option.textContent = data[element][dtkey[1]]
          document.getElementById(dtkey[1]).appendChild(option)
          if(data[element][dtkey[1]].toLowerCase() == "other") {
            otherSpeciality_id = data[element][dtkey[0]];
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
  