let generate = document.getElementById("generate-token");

generate?.addEventListener("click", async (e) => {
  e.preventDefault();

  let pathname = new URLSearchParams(window.location.search);
  // console.log(pathname.get('token'))

  let data = await fetch(`/generatetoken`, {
    method: "POST",
    body: JSON.stringify({ email: pathname.get("email") }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  data = await data.json();
  console.log(data);
  if (data.success) {
    window.location.href = `/account-activation/?activationKey=${
      data.token
    }&email=${pathname.get("email")}`;
  } else {
    window.location = "/register";
  }
});