
const url = "https://api.thingspeak.com/channels/2868525/feeds.json?api_key=50PTAOADPFIITF1R&results=5";
let chart;

function fetchDataAndRender() {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const feeds = data.feeds;
      const latestFeed = feeds[feeds.length - 1];

      const dt = new Date(latestFeed.created_at);
      const dateStr = dt.toLocaleDateString();
      const timeStr = dt.toLocaleTimeString();

      const latestDiv = document.getElementById('latest');
      latestDiv.innerHTML = `
        <h2>📡 Latest Sensor Data</h2>
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Time:</strong> ${timeStr}</p>
        <p><strong>Humidity:</strong> ${latestFeed.field1 || 'N/A'} %</p>
        <p><strong>Temperature:</strong> ${latestFeed.field2 || 'N/A'} °C</p>
      `;

      const labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
      const humidityData = feeds.map(f => parseFloat(f.field1) || 0);
      const temperatureData = feeds.map(f => parseFloat(f.field2) || 0);

      if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = humidityData;
        chart.data.datasets[1].data = temperatureData;
        chart.update();
      } else {
        const ctx = document.getElementById('sensorChart').getContext('2d');
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Humidity (%)',
                data: humidityData,
                backgroundColor: 'rgba(72, 219, 251, 0.6)',
                borderColor: '#48dbfb',
                borderWidth: 2,
                type: 'bar'
              },
              {
                label: 'Temperature (°C)',
                data: temperatureData,
                borderColor: '#ff9f43',
                backgroundColor: 'rgba(255, 159, 67, 0.2)',
                fill: true,
                tension: 0.4,
                type: 'line'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#fff',
                  font: { size: 14 }
                }
              },
              title: {
                display: true,
                text: '📈 Sensor Readings: Humidity & Temperature',
                color: '#fff',
                font: { size: 18 }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255,255,255,0.1)'
                }
              },
              y: {
                ticks: {
                  color: '#fff'
                },
                grid: {
                  color: 'rgba(255,255,255,0.1)'
                }
              }
            }
          }
        });
      }
    })
    .catch(err => console.error("Error fetching data:", err));
}

fetchDataAndRender();
setInterval(fetchDataAndRender, 10000);