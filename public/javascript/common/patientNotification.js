const socket = io();

socket.on("connect", () => {
  let user = JSON.parse(localStorage.getItem("userinfo"));

  if (user && user.id) {
    socket.emit("notification", user.email);

    socket.on(`notification-${user.email}`, (data) => {
      let totalNotification = document.querySelector(".no-notification");
      let notifications = document.querySelector(".a7-notification-pd");
      totalNotification.innerHTML = `<span style="color: white;">${data.length}</span>`;
      if(data.length == 0){
        return notifications.innerHTML = `<p>No Notification Found</p>`
      }
      notifications.innerHTML = "";
      if (data.length > 0) {
        let timezoneOffset = new Date().getTimezoneOffset();
        data.forEach((notification) => {
          let startTime = new Date(notification.end_at).getTime();
          startTime -= timezoneOffset * 60 * 1000;
          startTime = new Date(startTime).toLocaleTimeString();

          let div = document.createElement("div");
          div.classList.add("notification-hover");
          div.innerHTML = `<p>${notification.message} at ${startTime}</p>`;

          notifications.appendChild(div);
        });
      }
    });
  }
});
