

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

const searchPatient=async()=>{
    const input=document.getElementById("a5-searchPatient").value;
    let res=await fetch(`/search/${input}`);
    let resjson=await res.json();
    data=resjson;
    pagination();
    home();

}
        
      
