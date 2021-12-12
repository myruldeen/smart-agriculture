import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  temp: any = 0;
  // Gauge Chart
  public canvasWidth = 160
  public soil1 = 0
  public soil2 = 0
  public soilTemp1 = 0
  public soilTemp2 = 0
  public light = 0
  public temperature = 0
  public humidity = 0

  public centralLabel = ''
  public name = 'Garbage Level'
  public bottomSoil1 = '0 %'
  public bottomSoil2 = '0 %'
  public bottomSoilTemp1 = '0 C'
  public bottomSoilTemp2 = '0 C'
  public bottomLight = '0 lux'
  public bottomTemp = '0 C'
  public bottomHumd = '0 %'
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(61,204,91)', 'rgb(239,214,19)', 'rgb(255,84,84)'],
    arcDelimiters: [40, 70],
    rangeLabel: ['0', '100'],
    needleStartValue: 50,
  }

  // Needle Value

  // Line Chart
  public lineChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            steps: 10,
            stepValue: 5,
            max: 100
          }
        }
      ]
    },
    title: {
      display: true,
      text: 'Soil level, light & Temp vs. Time'
    }
  };

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public lineChartData: Array<any> = [{
    label: 'Soil 1',
    data: [16, 16, 18, 18.9, 19, 18.1, 17.7],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Soil 2',
    data: [65, 59, 80, 81, 56, 55, 40].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Soil Temp 1',
    data: [65, 59, 80, 81, 56, 55, 40].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Soil Temp 2',
    data: [65, 59, 80, 81, 56, 55, 40].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Light',
    data: [2, , 1, 7, 10, 10, 6],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Temp',
    data: [30, 32, 36, 38, 35, 32, 39].reverse(),
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  {
    label: 'Humidity',
    data: [50, 60, 60, 70, 70, 80, 74],
    fill: false,
    // borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }

  ];
  public lineChartLabels: Array<any> = [1, 2, 3, 4, 5, 6, 7];

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(public navCtrl: NavController, public socket: SocketService, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.socketInit();
  }

  socketInit() {
    this.socket.getData().subscribe((data) => {
      this.temp = data;
      this.soil1 = data.solarV;
      this.soil2 = data.solarV;
      this.soilTemp1 = data.tempLM35;
      this.soilTemp2 = data.tempLM35;
      this.light = data.lightSensor;
      this.temperature = data.temp;
      this.humidity = data.humd;

      this.bottomSoil1 = data.solarV + ' %';
      this.bottomSoil2 = data.solarV + ' %';
      this.bottomSoilTemp1 = data.tempLM35 + ' C';
      this.bottomSoilTemp2 = data.tempLM35 + ' C';
      this.bottomLight = data.lightSensor + ' lux';
      this.bottomTemp = data.temp + ' C';
      this.bottomHumd = data.humd + ' %';

      // this.lineChartData.push(data);
      // console.log(data);
    });
  }
  getLatest() {
    let toast = this.toastCtrl.create({
			position: 'bottom',
			message: 'Hi',
			duration: 3000,
			dismissOnPageChange: true
		});
		toast.present();
  }

}
