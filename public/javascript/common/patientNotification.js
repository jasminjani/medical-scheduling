const socket = io();



  let user = JSON.parse(localStorage.getItem("userinfo"));

  if (user.profile.trim()) {
    document
      .querySelector(".user-img")
      .setAttribute("src", `/imgs/${user.profile}`);
  }

  document.querySelector(".name").innerHTML = `${user.fname}`;

  let a7showBtn = document.getElementById("notification");
  let a7showChat = document.querySelector(".show-notification");
  a7showChat.classList.add("a7-hide-card");

  a7showBtn.addEventListener("click", () => {
    a7showChat.classList.toggle("a7-hide-card");
  });

  let logoBtn = document.getElementById("logoBtn");
  let viewMenu = document.getElementById("viewMenu");

  viewMenu.classList.add("a7-hide-card");
  logoBtn.addEventListener("click", () => {
    viewMenu.classList.toggle("a7-hide-card");
  });



socket.on("connect", () => {
  let user = JSON.parse(localStorage.getItem("userinfo"));

  if (user && user.id) {
    socket.emit("notification", {email:user.email,id:user.id});

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

