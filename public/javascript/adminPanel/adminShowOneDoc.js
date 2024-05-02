
  function showClinicDetails() {
    let div = document.querySelector(".A4-clinic-details-content");
  div.style.display === "block"
  ? (div.style.display = "none")
  : (div.style.display = "block");
    }

  async function fetchData(id){
    let res=await fetch(`/admin/show/doctorDetails/${id}`);
  let resjson=await res.json();
  let tabledata=document.getElementsByClassName("A4-table-content");
  let keys=Object.keys(resjson.result[0]);
  let i=0;
        keys.forEach(element => {
    tabledata[i].innerText = resjson.result[0][element];
  i++
        });
      }

  fetchData(`<%=docID %>`);

