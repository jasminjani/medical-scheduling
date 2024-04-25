const form = document.getElementById("myform");
const rows = form.getElementsByClassName("row");
const today = new Date();
const currentDay = today.getDay();
const minDate = today.toISOString().substring(0, 10);

window.location.href.split("/").pop() === "addSlot" ? document.getElementById("A3-add").style.backgroundColor = "#3984af" : "";

// Date validation
const sundayOffset = 7 - currentDay;
const sunday = new Date(today);
sunday.setDate(today.getDate() + sundayOffset);

const handleChange = (e) => {
  if (new Date(e.target.value) > sunday) {
    e.target.value = "";
    return Swal.fire("Please select date of this week only");
  }
}

const handleInput = (times, i) => {
  const newNode = document.createElement("input");
  newNode.setAttribute("type", "text");
  newNode.setAttribute("name", `day${i + 1}`);
  newNode.setAttribute("class", "A3-time");
  newNode.setAttribute("placeholder", "hh:mm");
  times.insertBefore(newNode, times.children[times.children.length - 1])
    .addEventListener("change", (e) => {
      if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(e.target.value)) {
        e.target.value = "";
        return Swal.fire("Please enter date in hh:mm format in 24 hour format");
      }
      let startTime = e.target.value;
      const slotGap = document.getElementById("slot_gap").value;
      let [hours, minutes] = startTime.split(":").map(Number);
      minutes += Number(slotGap);
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
      const endTime = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
      e.target.value += "-" + endTime;
    })
}

const handleButton = (addButton, date, times, i) => {
  addButton[0].addEventListener("click", (e) => {
    const d = date.getElementsByTagName("input")[0].value;
    if (!d) {
      return Swal.fire("Please select a date!!")
    }
    if (times.children.length > 1 && !times.children[times.children.length - 2].value) {
      return Swal.fire("Please fill previous slot!!");
    }
    handleInput(times, i);
  })
}


for (let i = 0; i < rows.length; i++) {
  const addButton = rows[i].getElementsByClassName("A3-buttons");
  const times = rows[i].getElementsByClassName("times")[0];
  const date = rows[i].getElementsByClassName("date")[0];
  date.getElementsByTagName("input")[0].setAttribute("min", minDate);
  handleButton(addButton, date, times, i);
}

const handleGenerate = async (e) => {
  e.preventDefault();
  let formdata = document.getElementById('myform')
  const details = new FormData(formdata);
  const params = new URLSearchParams(details);
  const jobdata = await new Response(params).text();
  const response = await fetch("http://localhost:8000/slot", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: jobdata
  });
  const { success } = await response.json();

  if (success) {
    Swal.fire({
      icon: "success",
      text: "Slots generated!",
      footer: '<a href="/upcomingSlots">See all slots</a>'
    });
  }

}

