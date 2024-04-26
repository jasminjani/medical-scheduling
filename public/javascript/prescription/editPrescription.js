  // let id=`<%= id %>`;
  // console.log(id);

  let id=document.getElementById("id").value;

  const fetchdata=async(id)=>{
    try{
      let res=await fetch(`/doctor/prescription/update/${id}`);
      let resjson=await res.json();

      const ele = document.getElementsByClassName("A4-table-content");
      console.log(ele);
      const keys = Object.keys(resjson.result[0]);
      let i=0;

      keys.forEach((element) => {
          ele[i].value = resjson.result[0][element];
          i++;
      });
    }
    catch(error){
      console.error(error);
    }
  }

  fetchdata(id);

  const editPrescription=async(id)=>{
    try{
      const form = document.getElementById('myForm');
      const obj = new URLSearchParams(new FormData(form));
      let res=await fetch(`/doctor/prescription/update/${id}`,
              {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: "POST",
                  body: obj
              });
              alert("Prescription updated successfully");
              location.href=`/doctor/prescriptiondetails`;
    }
    catch(error){
    logger.error(error);
    }          
  }

  const back=async()=>{
    location.href=`/doctor/prescriptiondetails`;
  }
  const focus=async()=>{
    document.getElementById("data3").focus();
  }