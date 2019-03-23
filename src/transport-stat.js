import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 55;

export default class TransportStat {
  constructor(data) {
    this._element = null;
    this._transportCtx = document.querySelector(`.statistic__transport`);
    this._numPoints = data.length;
    this._transportCtx.height = BAR_HEIGHT * this._numPoints;
    this._arrPoints = this.getPoints(data);
    this._transportStatData = {
      labels: this._arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
      data: this._arrPoints.data
    };
  }

  getPoints(arr) {
    const arrType = [];
    const arrNum = [];
    arr.forEach((elem) => {
      let item = arrType.indexOf(elem.type);
      if ((item === -1) && (elem.type[2] === `to`)) {
        arrType.push(elem.type);
        arrNum.push(1);
      } else {
        arrNum[item] += 1;
      }
    });
    return {
      labels: arrType,
      data: arrNum
    };
  }

  update(data) {
    this.unrender();
    this._arrPoints = this.getPoints(data);
    this._transportStatData = {
      labels: this._arrPoints.labels.map((elem) => `${elem[1]} ${elem[0].toUpperCase()}`),
      data: this._arrPoints.data
    };
    this.render();
  }

  unrender() {
    this._element = null;
  }

  render() {
    this._element = new Chart(this._transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._transportStatData.labels,
        datasets: [{
          data: this._transportStatData.data,
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
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
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
              drawBorder: false
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
              drawBorder: false
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
