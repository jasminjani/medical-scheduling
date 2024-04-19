let data=[];

const fetchData=async()=>{
  let res = await fetch(window.location.origin + `/getprescriptionofdoctor`);
  let resjson=await res.json()
  data=resjson.result[0];
}

const main=async()=>{
  await fetchData();
  pagination();
}

main();    

const editPrescription= async (id) =>{
  location.href = `/editprescription/${id}`;
}

const generatePDF = async (id) => {
  location.href = `/generatePDFofprescripton/${id}`;
};




  // const fetchData = async () => {
          //   res = await fetch(
            //     window.location.origin + `/getprescriptionofdoctor`
            //   );
            //   resjson = await res.json();
            
            //   console.log(resjson.message[0]);
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
        
        // fetchData();
      
