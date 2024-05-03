const form = document.getElementById("myform");
const rows = form.getElementsByClassName("row");
const today = new Date();
const currentDay = today.getDay();

// Date validation
const sundayOffset = 7 - currentDay;
const sunday = new Date(today);
sunday.setDate(today.getDate() + sundayOffset);

const minDate = today.toISOString().substring(0, 10);
const maxDate = sunday.toISOString().substring(0, 10);

window.location.href.split("/").pop() === "addSlot"
  ? (document.getElementById("A3-add").style.backgroundColor = "#3984af")
  : "";

function checkSlotOverlap(slots) {
  let sortedSlots = slots.sort((a, b) => {
    let timeA = a.split("-")[0].trim();
    let timeB = b.split("-")[0].trim();

    return timeA.localeCompare(timeB, undefined, { numeric: true });
});


for (let i = 1; i < sortedSlots.length; i++) {
    let prevSlotEndTime = sortedSlots[i - 1].split("-")[1].trim();
    let currSlotStartTime = sortedSlots[i].split("-")[0].trim();

    if (prevSlotEndTime > currSlotStartTime) {
      return false;
    }
  }
  return true;
}

const handleChange = (e) => {
  if (new Date(e.target.value) > sunday || new Date(e.target.value) < today + 1) {
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
      hours = hours % 24;
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
  date.getElementsByTagName("input")[0].setAttribute("max", maxDate);
  handleButton(addButton, date, times, i);
}

const handleGenerate = async (e) => {
  e.preventDefault();
  let formdata = document.getElementById("myform");
  const details = new FormData(formdata);
  const params = new URLSearchParams(details);
  const jobdata = await new Response(params).text();

  let rows = document.querySelectorAll("#myform .row");

  const dates = document.querySelectorAll('input[type="date"]')
  
  let datesValue = [];
  dates.forEach((date)=>{
    datesValue.push(date.value.trim());    
  })

  datesValue = datesValue.filter((value)=> value !== "");

  if(datesValue.length == 0){
    return Swal.fire({
      title:"Please Select Any Date",
      icon:'warning',
    })
  }

  const slotData = [];
  for (let i = 0; i < rows.length; i++) {
    let times = rows[i].getElementsByClassName("times")[0];
    let slots = times.getElementsByClassName("A3-time");
    let slotValues = Array.from(slots).map((slot) => slot.value.trim());
    slotData.push(slotValues.filter((value) => value !== ""));
  }
  
  let data = slotData.filter((slot)=>slot.length>0)

  if(data.length == 0){
    return Swal.fire({
      title:"Please generate slot according to selected date",
      icon:'warning',
    })
  }
  
  const isValid = slotData.every((daySlot) => checkSlotOverlap(daySlot));

  if (isValid) {
    const response = await fetch("/doctor/slot", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: jobdata,
    });
    const { success } = await response.json();

    if (success) {
      formdata.reset();
      Swal.fire({
        icon: "success",
        text: "Slots generated!",
      }).then((result)=>{
        if(result.isConfirmed){
          window.location.href = "/doctor/upcomingSlots";
        }
      })
    }
  } else {
    Swal.fire({
      icon: "error",
      text: "Slots OverLapped",
    });
  }
};

