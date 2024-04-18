const showDetails = async () => {
  let res = await fetch(window.location.origin + `/createprescription`);
  const resjson = await res.json();
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

document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display =
  "none";
document.getElementById("A4-generatePdf").style.display = "none";
document.getElementById("A4-home").style.display = "none";

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
    document.getElementById("A4-home").style.display = "block";

    const form = document.getElementById("myForm");
    const obj = new URLSearchParams(new FormData(form));
    console.log(obj);
    let res1 = await fetch(window.location.origin + `/createprescription`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: obj,
    });
    const result = await res1.json();
    insert_id = result.insert_id;
    // console.log("inserted successfully");
  }
};

const addprescreption = async () => {
  document.getElementsByClassName("A4-addPrescription")[0].style.display =
    "none";

  document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display =
    "block";
};

const validate = async () => {
  const diagnosisval = document.getElementById("diagnosis").value;
  const prescriptionval = document.getElementById("prescription").value;
  console.log(diagnosisval.trim().length);
  console.log(prescriptionval);

  if (diagnosisval.trim().length <= 0 || prescriptionval.trim().length <= 0) {
    document.getElementById("prescriptionerror").innerHTML =
      "both field must be filled out";
    return false;
  } else {
    return true;
  }
};

const generatePDF = async () => {
  location.href = `/generatePDFofprescripton/${insert_id}`;
};

const goToHome = async () => {
  location.href = `/prescription`;
};
