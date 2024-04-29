let data=[];

const fetchData=async()=>{
  try{
    let res = await fetch(`/doctor/prescriptions`);
    let resjson=await res.json()
    data=resjson.result || [];
  }
  catch(error){
    console.error(error);
  }
}

const main=async()=>{
  await fetchData();
  pagination(data);
}

main();    

const editPrescription= async (id) =>{
  location.href = `/doctor/prescription/edit/${id}`;
}

const generatePDF = async (id) => {
  location.href = `/doctor/generate/${id}`;
};

const searchPatient=async()=>{
    const input=document.getElementById("a5-searchPatient").value;
    let res=await fetch(`/search/${input}`);
    let resjson=await res.json();
    data=resjson;
    pagination();
    home();

}




  // const fetchData = async () => {
          //   res = await fetch(
            //     window.location.origin + `/getprescriptionofdoctor`
            //   );
            //   resjson = await res.json();
            
            
            //   resjson.message[0].forEach(function (element, index) {
              //     let table = document.getElementById("myTable");
              //     let str = `
              //       <tr>
                //         <td>${index + 1}</td>
                //         <td>${element.created_at}</td>
                //         <td>${element.patient_name}</td>
                //         <td>${element.diagnoses}</td>
        //         <td><input type="button" value="Get PDF" onclick="generatePDF(${element.id})"><input type="button" value="Edit Prescription"></td>
        //       </tr>
        //     `;
        //     table.innerHTML += str;
        //   });
        // };
        
      
