async function logout(e){
      e.preventDefault();
      localStorage.removeItem('userinfo')
      let data = await fetch("/logout", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      })

      data = await data.json();
     
      if (data.success) {
          window.location = "/"
      }
}