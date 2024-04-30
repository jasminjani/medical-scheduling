const fetchCity = async () => {

  const fetchdata = await fetch("/cityCombo")
  const data = await fetchdata.json()

    data.forEach(element => {
          document.getElementById("city").innerHTML += `
          <option value='${element["city"]}'>${element["city"]}</option>`    
     });
}
fetchCity()