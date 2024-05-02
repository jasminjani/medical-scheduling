
  let contactTbody = document.getElementById('contact-tbl-body');


  async function getMessage() {
      const resp = await fetch('/admin/get-message');
  let allMessage = await resp.json();

  return allMessage;
    }

  async function getAllMessageTable() {

    let allMessage = await getMessage();
      allMessage.forEach((msg, i) => {

    let data = msg.message.trim().replace(/'|"|\n/gi, ``);
  let str = `<tr>
    <td>${++i}</td>
    <td>${msg.name}</td>
    <td>${msg.email}</td>
    <td>${msg.mobile_no}</td>
    <td>${msg.city}</td>
    <td>${msg.role}</td>
    <td class="a2-btn" onclick="viewMessage('${msg.id}')">View</td>
  </tr>`;

  contactTbody.innerHTML += str;
      });


    }

  getAllMessageTable();

  async function viewMessage(id) {
    let allMessage = await getMessage();
      let data = allMessage.filter((m) => {

        if (m.id == id) {
          return m.message;
        }

      });

  Swal.fire(data[0].message);
    }


