
async function isLoggedIn(){
  let user = await fetch('/current-user',{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    }
  })

  user = await user.json();
console.log(user)
  if(user.success){
    window.location = "/"
  }
}

isLoggedIn();