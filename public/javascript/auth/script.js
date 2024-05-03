
async function isLoggedIn(){
  let user = await fetch('/current-user',{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    }
  })
  if(user.headers.get("content-type").split(";")[0] == "text/html"){
    return;
  }
  user = await user.json();
  if(user.success){
    window.location = "/"
  }
}

isLoggedIn();