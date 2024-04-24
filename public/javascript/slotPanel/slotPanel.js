const form = document.getElementById("myform");
const rows = form.getElementsByClassName("row");
const today = new Date();
const currentDay = today.getDay();
const minDate = today.toISOString().substring(0, 10);

window.location.href.split("/").pop() === "addSlot"
  ? (document.getElementById("A3-add").style.backgroundColor = "#3984af")
  : "";

function checkSlotOverlap(slots) {
  let sortedSlots = slots.sort((a, b) => {
    let timeA = a.split("-")[0].trim();
    let timeB = b.split("-")[0].trim();

    return timeA.localeCompare(timeB, undefined, { numeric: true });
  });

  // console.log(slots);
  for (let i = 1; i < sortedSlots.length; i++) {
    let prevSlotEndTime = sortedSlots[i - 1].split("-")[1].trim();
    let currSlotStartTime = sortedSlots[i].split("-")[0].trim();

    if (prevSlotEndTime > currSlotStartTime) {
      return false;
    }
  }
  return true;
}

// Date validation
const sundayOffset = 7 - currentDay;
const sunday = new Date(today);
sunday.setDate(today.getDate() + sundayOffset);

for (let i = 0; i < rows.length; i++) {
  const addButton = rows[i].getElementsByClassName("A3-buttons");
  const times = rows[i].getElementsByClassName("times")[0];
  const date = rows[i].getElementsByClassName("date")[0];
  date.getElementsByTagName("input")[0].setAttribute("min", minDate);
  addButton[0].addEventListener("click", (e) => {
    const d = date.getElementsByTagName("input")[0].value;
    if (!d) return Swal.fire("Please select a date!!");
    if (new Date(d) > sunday)
      return Swal.fire("Please select date of this week only");
    if (
      times.children.length > 1 &&
      !times.children[times.children.length - 2].value
    )
      return Swal.fire("Please fill previous slot!!");
    const newNode = document.createElement("input");
    newNode.setAttribute("type", "text");
    newNode.setAttribute("name", `day${i + 1}`);
    newNode.setAttribute("class", "A3-time");
    newNode.setAttribute("placeholder", "hh:mm");
    newNode.addEventListener("mouseover", handleFocus(newNode));
    times
      .insertBefore(newNode, times.children[times.children.length - 1])
      .addEventListener("change", (e) => {
        let startTime = e.target.value;
        const slotGap = document.getElementById("slot_gap").value;
        let [hours, minutes] = startTime.split(":").map(Number);
        minutes += Number(slotGap);
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
        const endTime =
          hours.toString().padStart(2, "0") +
          ":" +
          minutes.toString().padStart(2, "0");
        e.target.value += "-" + endTime;
      });
  });
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
  console.log(isValid)
  if (isValid) {
    const response = await fetch("http://localhost:8000/slot", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: jobdata,
    });
    const { success } = await response.json();

    if (success) {
      Swal.fire({
        icon: "success",
        text: "Slots generated!",
        footer: '<a href="/upcomingSlots">See all slots</a>',
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      text: "Slots OverLapped",
    });
  }
};

const handleFocus = (input) => {
  const popUp = document.createElement("input");
  popUp.setAttribute("type", "time");
  popUp.setAttribute("id", "popup");
};
