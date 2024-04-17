let form = document.getElementById("myform");
let rows = form.getElementsByClassName("row");
let today = new Date();
let minDate = today.toISOString().substring(0, 10);

window.location.href.split("/").pop() === "addSlot" ? document.getElementById("A3-add").style.backgroundColor = "#3984af" : "";

// const inputDate = "2022-06-29 15:16:21";
// const newInputDate = inputDate.replace(" ", "T");

// const timeStamp = new Date(newInputDate).getTime();
// console.log(new Date(timeStamp));

for (let i = 0; i < rows.length; i++) {
  const addButton = rows[i].getElementsByClassName("A3-buttons");
  const times = rows[i].getElementsByClassName("times")[0];
  const error = rows[i].getElementsByClassName("error")[0];
  const date = rows[i].getElementsByClassName("date")[0];
  date.getElementsByTagName("input")[0].setAttribute("min", minDate);
  addButton[0].addEventListener("click", (e) => {
    const d = date.getElementsByTagName("input")[0].value;
    if (!d) return Swal.fire("Please select a date!!");
    if (times.children.length > 1 && !times.children[times.children.length - 2].value) return Swal.fire("Please fill previous slot!!");
    const newNode = document.createElement("input");
    newNode.setAttribute("type", "text");
    newNode.setAttribute("name", `day${i + 1}`);
    newNode.setAttribute("class", "A3-time")
    times.insertBefore(newNode, times.children[times.children.length - 1])
      .addEventListener("change", (e) => {
        let startTime = e.target.value;
        const slotGap = document.getElementById("slot_gap").value;
        let [hours, minutes] = startTime.split(":").map(Number);
        minutes += Number(slotGap);
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
        const endTime = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
        e.target.value += "-" + endTime;
      })
  })
}

const handleGenerate = async () => {
  let formdata = document.getElementById('myform')
  const details = new FormData(formdata);
  const params = new URLSearchParams(details);
  const jobdata = await new Response(params).text();
  const response = await fetch("http://localhost:8000/slot/1", {
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
