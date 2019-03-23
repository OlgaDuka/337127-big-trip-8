import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

export default class MoneyStat {
  constructor(data) {
    this._element = null;
    this._moneyCtx = document.querySelector(`.statistic__money`);
    this._numPoints = data.length;
    this._moneyCtx.height = BAR_HEIGHT * this._numPoints;
    this._arrPoints = this.getPoints(data);
    this._moneyStatData = {
      labels: this._arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
      data: this._arrPoints.data
    };
  }

  getPriceOffers(arr, item) {
    let price = 0;
    arr[item].offers.forEach((elem) => {
      if (elem[2]) {
        price += parseInt(elem[1], 10);
      }
    });
    return price;
  }

  getPoints(arr) {
    const arrType = [];
    const arrPrice = [];
    arr.forEach((elem, i) => {
      let item = arrType.indexOf(elem.type);
      if (item === -1) {
        arrType.push(elem.type);
        arrPrice.push(elem.price + this.getPriceOffers(arr, i));
      } else {
        arrPrice[item] += (elem.price + this.getPriceOffers(arr, i));
      }
    });
    return {
      labels: arrType,
      data: arrPrice
    };
  }

  update(data) {
    this.unrender();
    this._arrPoints = this.getPoints(data);
    this._moneyStatData = {
      labels: this._arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
      data: this._arrPoints.data
    };
    this.render();
  }

  unrender() {
    this._element = null;
  }

  render() {
    this._element = new Chart(this._moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._moneyStatData.labels,
        datasets: [{
          data: this._moneyStatData.data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: true
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: true
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    return this._element;
  }
}
