let submit = document.getElementById("submit");

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (validate()) {
        //TODO : get data and 

       //TODO : make registration request
        if (data.success) {
            let activelink = document.getElementsByClassName('active-link');
            for (let i = 0; i < activelink.length; i++) {
                activelink[i].remove()
            }
            let p = document.createElement('p');
            p.classList.add('active-link');
            p.innerHTML = `<a href="/media/token/?token=${data.user.verification_token}&email=${data.user.email}" target="_blank">Click Here</a> to Activate Account!`;
            document.querySelector('.link').innerHTML = p.innerHTML;
            document.querySelector('.link').style.color = "black";
        } else {
            document.querySelector('.link').innerHTML = `<p>${data.message}</p>`;
            document.querySelector('.link').style.color = "red";
        }
    }
})

