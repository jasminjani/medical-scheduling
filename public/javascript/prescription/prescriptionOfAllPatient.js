

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

// document.getElementById("download-Btn").style.display='none';
// document.getElementById("cross").style.display='none';

// const generatePDF = async (id) => {
//   // location.href = `/doctor/generate/${id}`;
//  const socket = io();

//  socket.emit('generatePDF',`${id}`);

//  socket.on('pdfready',async(filename)=>{

//     let timerInterval;
//      await Swal.fire({
//       title: "Please wait...",
//       html: "your pdf will be generated in <b></b>",
//       timer: 2000,
//       timerProgressBar: true,
//       didOpen: () => {
//         Swal.showLoading();
//         const timer = Swal.getPopup().querySelector("b");
//         timerInterval = setInterval(() => {
//           timer.textContent = `${Swal.getTimerLeft()}`;
//         }, 100);
//       },
//       willClose: () => {
//         clearInterval(timerInterval);
//       }
//     }).then((result) => {
//       /* Read more about handling dismissals below */
//       if (result.dismiss === Swal.DismissReason.timer) {
//         console.log("I was closed by the timer");
//       }
//     });
//     document.getElementById("pdfViewer").innerHTML=`<embed src="/pdfs/${filename}" width="800px" height="1050px" />`;
//  })

 
//  document.getElementById("download-Btn").addEventListener('click',async()=>{
//   const filename=document.getElementById("pdfViewer").querySelector('embed').src.split('/').pop();
//   await socket.emit('downloadPDF',filename);
//   socket.emit('deletePDF',filename);
//  })

//  document.getElementById("cross").addEventListener('click',async()=>{
//   const filename=document.getElementById("pdfViewer").querySelector('embed').src.split('/').pop();
//   socket.emit('deletePDF',filename);
//   window.location.href=`/doctor/prescriptiondetails`;
//  })

//  socket.on('pdfFile',({filename,file})=>{
//   const blob=new Blob([file],{type:'application/pdf'});
//   const link=document.createElement('a');
//   link.href=URL.createObjectURL(blob);
//   link.download=filename;
//   link.click();
//  });

//  document.getElementById('pdfViewer').style.display='block';
//  document.getElementById('fade').style.display='block';
//  document.getElementById("download-Btn").style.display='block';
//  document.getElementById("cross").style.display='block';


// };

const searchPatient=async()=>{
    const input=document.getElementById("a5-searchPatient").value;
    let res=await fetch(`/search/${input}`);
    let resjson=await res.json();
    data=resjson;
    pagination();
    home();

}
        
      
