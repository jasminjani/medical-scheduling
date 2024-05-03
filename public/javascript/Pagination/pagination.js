let currentpage=1;
const ItemsPerPage=3;
let length=0;
let pageno=document.getElementById("pageno");

document.getElementById("homebtn").disabled = true;
document.getElementById("previousbtn").disabled = true;

const pagination = async()=>{

  length=data.length;
  pageno.innerHTML=currentpage;

  const endIndex = currentpage* ItemsPerPage;
  const startIndex = endIndex - ItemsPerPage;
  const pageItems = data.slice(startIndex, endIndex);

  let tabledata="";
  pageItems.map((value,index)=>{
    tabledata += `<tr>
        <td>${value.created_at}</td>
        <td>${value.patient_name}</td>
        <td>${value.diagnoses}</td>
        <td id="buttons"><input type="button" value="Get PDF" onclick="generatePDF(${value.id})" id="A4-getpdf-btn"><input type="button" value="Edit Prescription" onclick="editPrescription(${value.id})" id="A4-editprescription-btn"></td>
      </tr>`
  })


  document.getElementById("tabledata").innerHTML = tabledata;
  if(Math.ceil(length/ItemsPerPage)==1){
    document.getElementById("nextbtn").disabled = true;
  document.getElementById("endbtn").disabled = true;
  }

}


const home=()=>{
  document.getElementById("homebtn").disabled = true;
  document.getElementById("previousbtn").disabled = true;
  document.getElementById("nextbtn").disabled = false;
  document.getElementById("endbtn").disabled = false;
  currentpage = 1;
  pagination();
}

const previous=()=>{
  currentpage--;
  if (currentpage <= 1) {
    document.getElementById("previousbtn").disabled = true;
    document.getElementById("homebtn").disabled = true;
    document.getElementById("nextbtn").disabled = false;
    document.getElementById("endbtn").disabled = false;
    pagination()  
  } else{
    document.getElementById("nextbtn").disabled = false;
    document.getElementById("endbtn").disabled = false;
    pagination();
  }
}

const next=()=>{
  currentpage++;
  if (currentpage== Math.ceil(length/ItemsPerPage)) {
    document.getElementById("nextbtn").disabled = true;
    document.getElementById("endbtn").disabled = true;
    document.getElementById("previousbtn").disabled = false;
    document.getElementById("homebtn").disabled = false;
    pagination();
  }
 
  else {
    document.getElementById("previousbtn").disabled = false;
    document.getElementById("homebtn").disabled = false;
    pagination();
  }
}

const end=()=>{
  document.getElementById("homebtn").disabled = false;
  document.getElementById("previousbtn").disabled = false;
  document.getElementById("nextbtn").disabled = true;
  document.getElementById("endbtn").disabled = true;
  currentpage = Math.ceil(length / ItemsPerPage);
  pagination();
}      