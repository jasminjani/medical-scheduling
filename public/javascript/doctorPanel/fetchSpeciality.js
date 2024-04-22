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

 
      specialityFetch()
  