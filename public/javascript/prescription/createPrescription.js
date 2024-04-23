const showDetails = async () => {

  let patient_id = window.location.href.split('/').pop();

  let res = await fetch(`/createprescription/${patient_id}`);
  const resjson = await res.json();
  console.log(resjson)
  const ele = document.getElementsByClassName("A4-table-content");
  const keys = Object.keys(resjson.result[0]);
  let i = 0;
  keys.forEach((element) => {
    if (element != "id") {
      ele[i].innerText = resjson.result[0][element];
      i++;
    }
  });
  document.getElementById("id").value = resjson.result[0].id;
};

showDetails();

const removeError = async (id) => {
  document.getElementById(id).innerHTML = "";
};

document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display ="none";
document.getElementById("A4-generatePdf").style.display = "none";

let insert_id;

const submitPrescription = async () => {
  if (!validate()) {
    return false;
  } else {
    document.getElementsByClassName("A4-addPrescription")[0].style.display =
      "none";
    document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display =
      "none";
    document.getElementById("A4-generatePdf").style.display = "block";

    const form = document.getElementById("myForm");
    const obj = new URLSearchParams(new FormData(form));
    let res = await fetch(window.location.origin + `/createprescription`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: obj,
    });
    let resjson=await res.json();
    alert(resjson.msg)
    insert_id = resjson.insert_id;
  }
};

const addprescreption = async () => {
  document.getElementsByClassName("A4-addPrescription")[0].style.display ="none";
  document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display ="block";
};


const validate = async () => {
  
  const diagnosisval = document.getElementById("diagnosis").value;
  const prescriptionval = document.getElementById("prescription").value;
  
  if (diagnosisval.trim().length <= 0 || prescriptionval.trim().length <= 0) {
    document.getElementById("prescriptionerror").innerHTML ="both field must be filled out";
    return false;
  } else {
    return true;
  }
};

const generatePDF = async () => {
  location.href = `/generatePDFofprescripton/${insert_id}`;
};

const back = async () => {

  const diagnosisval = document.getElementById("diagnosis").value;
  const prescriptionval = document.getElementById("prescription").value;
  console.log(!diagnosisval || !prescriptionval);

  // if(!diagnosisval || !prescriptionval){
  //   alert("you've not added the prescription!are you sure you want to exit?")
  // }
  if(!diagnosisval || !prescriptionval){
    if(confirm("you've not added the prescription!are you sure you want to exit?")){
      location.href = location.origin+`/doctorDashboard/`;
    }
  }
  
};
