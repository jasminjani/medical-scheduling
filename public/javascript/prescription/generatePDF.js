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
//   await socket.emit('deletePDF',filename);

//   setTimeout(()=>{
//   document.getElementById('pdfViewer').style.display='none';
//   document.getElementById('fade').style.display='none';
//   document.getElementById("download-Btn").style.display='none';
//   document.getElementById("cross").style.display='none';
//   },1000*2)
  

//  })

//  document.getElementById("cross").addEventListener('click',async()=>{
//   const filename=document.getElementById("pdfViewer").querySelector('embed').src.split('/').pop();
//   socket.emit('deletePDF',filename);
//   console.log(window.location.href.slice(21));
//   location.href=location.href.slice(21);
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


const generatePDF = async (id) => {
  // location.href = `/doctor/generate/${id}`;
 const socket = io();

 socket.emit('generatePDF',`${id}`);

  socket.on('pdfready',async(filename)=>{

    if(filename=="id is null"){
     await Swal.fire({
        icon: "error",
        title: "Sorry..",
        text: "Prescription not added for this appointment",
        allowOutsideClick:false,
        footer: '<a href="#">Why do I have this issue?</a>'
      })
    }
    else{      
      let timerInterval;
       await Swal.fire({
        title: "Please wait...",
        html: "your pdf will be generated in <b></b>",
        timer: 2000,
        timerProgressBar: true,
        allowOutsideClick:false,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector("b");
          timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
  
  
      const popcontent=`<div style="width:743px; height: 750px;">
      <embed src="/pdfs/${filename}" type="application/pdf" width="100%" height="100%" />
      </div>`
  
      Swal.fire({
        title:'PDF Viewer',
        html:popcontent,      
        closeButton: 'close-button-class',
        confirmButtonText: "Download",
        showCloseButton: true,
        allowOutsideClick:false,
        customClass:{
        container:'custom-swal-container',
        }
      }).then(async(result) => {
      if (result.isConfirmed) {
        await socket.emit('downloadPDF',filename);
        await socket.emit('deletePDF',filename);
      }
      if (result.isDismissed) {
        await socket.emit('deletePDF',filename);
      }
      });

    }

  })

 
 socket.on('pdfFile',({filename,file})=>{
  const blob=new Blob([file],{type:'application/pdf'});
  const link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download=filename;
  link.click();
 });


};