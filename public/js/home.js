google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    const data = google.visualization.arrayToDataTable([
        ['Task', 'Hours per Day'],
        ['Fruits',     20],
        ['Vegetables',      20],
        ['Spices',  10]
    ]);

    const options = {
        title: 'Statistics',
        colors: ['red', 'blue', 'green']
    };

    const chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}

function initMap(){
    const center = { lat: 6.8454, lng: 80.1038 };
    const zoom = 10;

    const map = new google.maps.Map(document.getElementById("map"), { center, zoom });

    let marker = new google.maps.Marker({
      position: center,
      title: "Your Location"
    });
}