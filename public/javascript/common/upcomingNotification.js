  const socket = io();
  socket.on("connect", () => {
    let userInfo = JSON.parse(localStorage.getItem('userinfo'));
    if(userInfo && userInfo.id){
      // console.log(socket.id); 
      socket.emit('reminder',userInfo.email);

      let timezoneOffset = new Date().getTimezoneOffset();
      socket.on(`reminder-${userInfo.email}`,(data)=>{
        // console.log(data)
        let startTime = new Date(data.end_at).getTime();
        startTime -= (timezoneOffset * 60 * 1000);
        startTime = new Date(startTime).toLocaleTimeString();
        Swal.fire({
          title:data.message + ` at ${startTime}`
        }).then(async(result)=>{
          if(result.isConfirmed){
            await fetch("/patient/notification",{
              method:"PUT",
              body:JSON.stringify({id:data.id}),
              headers:{
                "Content-Type":"application/json"
              }
            })
          }
        })
      })

    socket.on(`delete-slot-${userInfo.id}`, (msg) => {
      Swal.fire(new Date(msg.date).toLocaleString().split(",")[0] + " slot from " + msg.start_time + "-" + msg.end_time + " has been canceled");
    })

    socket.on(`cancel-slot-${userInfo.id}`, (msg) => {
      Swal.fire(new Date(msg.date).toLocaleString().split(",")[0] + " slot from " + msg.start_time + "-" + msg.end_time + " has been canceled");
    })

  }

});