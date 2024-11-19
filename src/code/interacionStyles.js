function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const histogramaArrow = document.getElementById('histogramaArrow')
    console.log('haciendo clic');
    

    histogramaArrow.classList.toggle('moved')
    
    sidebar.classList.toggle('open');
  }



    const datosInundacion = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Hectáreas Afectadas',
          data: [120, 150, 90, 200, 170, 130, 180, 220, 160, 190, 250, 300], 
          backgroundColor: 'rgba(54, 162, 235, 0.6)', 
          borderColor: 'rgba(54, 162, 235, 1)', 
          borderWidth: 1
        }]
      };
  
      const config = {
        type: 'bar',
        data: datosInundacion,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hectáreas Afectadas'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Meses'
              }
            }
          }
        }
      };
  
      const ctx = document.getElementById('histogramaCanvas').getContext('2d');
      new Chart(ctx, config);