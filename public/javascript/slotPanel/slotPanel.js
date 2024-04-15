let form = document.getElementById("myform");
let rows = form.getElementsByClassName("row");


for (let i = 0; i < rows.length; i++) {
  const addButton = rows[i].getElementsByClassName("A3-buttons");
  const times = rows[i].getElementsByClassName("times")[0];
  const error = rows[i].getElementsByClassName("error")[0];
  const date = rows[i].getElementsByClassName("date")[0];
  addButton[0].addEventListener("click", (e) => {
    error.innerHTML = "";
    const d = date.getElementsByTagName("input")[0].value;
    if (!d) return error.innerHTML = "please select valid date";
    if (new Date(d) < new Date()) return error.innerHTML = "please select upcoming dates";
    if (times.children.length > 1 && !times.children[times.children.length - 2].value) return error.innerHTML = "please fill previous slot";
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
  console.log(jobdata);
  const response = await fetch("http://localhost:8000/slot/1", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: jobdata
  });
}
