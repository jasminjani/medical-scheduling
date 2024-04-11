let submit = document.getElementById('submit'); 
        
submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (validate()) {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if(email && password){
            let data = await fetch('/media/login', {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
    
            data = await data.json();
            console.log(data);
            
            if (data.success) {
                window.location = "/media"
            }
            else{
                document.querySelector('.link').innerHTML = `<p>${data.message}</p>`;
                document.querySelector('.link').style.color = "red";
            }
        }

    }
});

let forgotPass = document.getElementById('forgot-password');
