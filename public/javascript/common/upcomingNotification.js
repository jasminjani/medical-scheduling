  const socket = io();
  socket.on("connect", () => {
    let userInfo = JSON.parse(localStorage.getItem('userinfo'));
    if(userInfo && userInfo.id){
      console.log(socket.id); 
      socket.emit('reminder',userInfo.email);

      let timezoneOffset = new Date().getTimezoneOffset();
      socket.on(`reminder-${userInfo.email}`,(data)=>{
        data.startTime = new Date(data.startTime).getTime();
        data.startTime -= (timezoneOffset * 60 * 1000);
        data.startTime = new Date(data.startTime).toLocaleTimeString();

        data.endTime = new Date(data.endTime).getTime();
        data.endTime -= (timezoneOffset * 60 * 1000);
        data.endTime = new Date(data.endTime).toLocaleTimeString();
        Swal.fire({
          title:data.message + ` at ${data.startTime} to ${data.endTime}`
        })
      })
    }

});