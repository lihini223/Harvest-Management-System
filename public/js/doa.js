google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCategoryChart);
google.charts.setOnLoadCallback(drawTransactionsChart);

function drawCategoryChart() {
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

  const chart = new google.visualization.PieChart(document.getElementById('piechart-categories'));

  chart.draw(data, options);
}

function drawTransactionsChart() {
  const data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Successful',     20],
      ['Wasted',      20],
      ['Not Checked',  10]
  ]);

  const options = {
      title: 'Statistics',
      colors: ['red', 'blue', 'green']
  };

  const chart = new google.visualization.PieChart(document.getElementById('piechart-transactions'));

  chart.draw(data, options);
}