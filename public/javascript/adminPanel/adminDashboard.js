  async function fetchStatus() {
      try {

        const url = `/admin/analytics`;
  const response = await fetch(url);
  const result = await response.json();


  document.getElementById('doctors-count').innerHTML = result.totalDoctor[0].total_doctor + "+";
  document.getElementById('patients-count').innerHTML = result.totalPatient[0].total_patient + "+";
  document.getElementById('appointments-count').innerHTML = result.todayAppointment[0].today_appointment + "+";
  document.getElementById('revenue-count').innerHTML = result.totalRevenue[0].total_revenue + "+";

      } catch (error) {
    console.log(error);
      }
    }
  fetchStatus();
