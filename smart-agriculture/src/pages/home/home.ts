import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SocketService } from '../../services/socket.service';
import { FileService } from '../../services/file.service';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import * as HighCharts from 'highcharts';
declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public data: Array<any>;
  private subData: any;
  public lastRecord: any;
  isData: boolean = false;
  public relayA: String = "OFF";
  public relayB: String = "OFF";


  temp: any = 0;
  // Gauge Chart
  public canvasWidth = 130
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
    arcColors: ['rgb(255,84,84)', 'rgb(239,214,19)', 'rgb(61,204,91)'],
    arcDelimiters: [40, 70],
    rangeLabel: ['0', '100'],
    needleStartValue: 50,
  }
  // Gauge 2
  public options2 = {
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
    // animation duration after a resize
    responsive: true,
    animation: {
      duration: 0, // general animation time
    },
    responsiveAnimationDuration: 0,
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

  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];

  public lineChartColors: Array<any> = [];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  // Pie Chart
  public pieChartOptions: any = {
    responsive: true,
    legend: {
      position: 'bottom'
    }
  }
  public pieChartLabels: string[] = ['Nitrogen', 'Phosphorus', 'Potassium'];
  public pieChartData: number[] = [30, 118, 108];
  public pieChartType: string = 'pie';

  constructor(public navCtrl: NavController,
    public socket: SocketService,
    public toastCtrl: ToastService,
    private fileService: FileService,
    private dataService: DataService,
    private platform: Platform) {

    // if (this.platform.is('cordova')) {
    //   window.location.href = url;
    // }else{
    //       window.open(url,'_blank');
    // }

  }

  ionViewDidEnter() {
    // this.plotDynamicSplineChart();

    // if (this.platform.is('cordova')) {
    //   cordova.plugins.notification.local.schedule({
    //     title: 'My first ntification',
    //     text: 'Thats pretty easy...',
    //     foreground: true
    //   });
    // } else {
    //   console.log('in browser');
    // }
  }

  ionViewDidLoad() {

    this.getData();
    this.socketInit();
    this.dataSocket();
  }

  ionViewDidUnload() {
    this.subData ? this.subData.unsubscribe() : '';
  }

  getData() {
    this.dataService.get().subscribe((response) => {
      this.data = response.json();
      this.genChart();
      this.lastRecord = this.data[0]; // descending order data

    });
  }

  dataSocket() {
    this.socket.getMessage().subscribe((data) => {
      // this.temp = data;
      this.soil1 = data.data.Soil1;
      this.soil2 = data.data.Soil2;
      this.soilTemp1 = data.data.SoilTemp1;
      this.soilTemp2 = data.data.SoilTemp2;
      this.light = data.data.Light;
      this.temperature = data.data.Temp;
      this.humidity = data.data.Humd;

      this.bottomSoil1 = data.data.Soil1 + ' %';
      this.bottomSoil2 = data.data.Soil2 + ' %';
      this.bottomSoilTemp1 = data.data.SoilTemp1.toFixed(2) + ' C';
      this.bottomSoilTemp2 = data.data.SoilTemp2.toFixed(2) + ' C';
      this.bottomLight = data.data.Light + ' lux';
      this.bottomTemp = data.data.Temp.toFixed(2) + ' C';
      this.bottomHumd = data.data.Humd + ' %';

      (this.soil1 < 20) ? this.relayA = "ON" : this.relayA = "OFF";
      (this.soil2 < 20) ? this.relayB = "ON" : this.relayB = "OFF";

      if (this.soil1 < 20) {
        if (this.platform.is('cordova')) {

          cordova.plugins.notification.local.schedule({
            title: 'Soil Status',
            text: 'Please water your plant 1!',
            foreground: true
          });

        } else {
          // console.log('in browser');
        }
        console.log('plant bendi need water');
      }

      if (this.soil2 < 20) {
        if (this.platform.is('cordova')) {

          cordova.plugins.notification.local.schedule({
            title: 'Soil Status',
            text: 'Please water your plant 2!',
            foreground: true
          });

        } else {
          // console.log('in browser');
        }
        console.log('plant chilli need water');
      } else {

      }
      // this.lineChartData.push(data);
      // console.log(data);

    });
  }

  socketInit() {
    this.subData = this.socket.getData().subscribe((data) => {
      if (this.data.length <= 0) return;
      this.data.splice(this.data.length - 1, 1); // remove the last record
      this.data.push(data); // add the new one
      this.lastRecord = data;
    }, (err) => console.error(err));
  }

  genChart() {
    let data = this.data;
    let _dtArr: Array<any> = [];
    let _lblArr: Array<any> = [];

    let soil1: Array<any> = [];
    let soil2: Array<any> = [];
    let light: Array<any> = [];
    let temp: Array<any> = [];
    let humd: Array<any> = [];
    let soilTemp1: Array<any> = [];
    let soilTemp2: Array<any> = [];


    for (var i = 0; i < data.length; i++) {
      let _d = data[i];
      soil1.push(_d.data.Soil1);
      soil2.push(_d.data.Soil2);
      light.push(_d.data.Light);
      temp.push(_d.data.Temp);
      humd.push(_d.data.Humd);
      soilTemp1.push(_d.data.SoilTemp1);
      soilTemp2.push(_d.data.SoilTemp2);
      _lblArr.push(this.formatDate(_d.createdAt));
    }
    // reverse data to show the latest on the right side
    soil1.reverse(); light.reverse(); soil2.reverse(); temp.reverse(); humd.reverse(); soilTemp1.reverse(); soilTemp2.reverse(); _lblArr.reverse();
    _dtArr = [
      {
        data: soil1,
        label: 'Soil 1',
        fill: false,
        borderColor: 'rgb(112,128,144)',
        tension: 0.1
      },
      {
        data: soil2,
        label: 'Soil 2',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: light,
        label: 'Light',
        fill: false,
        borderColor: 'rgb(255,255,0)',
        tension: 0.1
      },
      {
        data: temp,
        label: 'Temperature',
        fill: false,
        borderColor: 'rgb(255,1,255)',
        tension: 0.1
      },
      {
        data: humd,
        label: 'Humidity',
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        data: soilTemp1,
        label: 'Soil Temp 1',
        fill: false,
        borderColor: 'rgb(139,69,19)',
        tension: 0.1
      },
      {
        data: soilTemp2,
        label: 'Soil Temp 2',
        fill: false,
        // borderColor: 'rgb(210,105,30)',
        tension: 0.1
      }
    ];

    // this.lineChartData = _dtArr.slice(0, 10);
    // this.lineChartLabels = _lblArr.slice(0, 10);
    this.lineChartData = _dtArr;
    this.lineChartLabels = _lblArr;
    this.isData = true;
  }

  getLatest() {
    // this.isData = false;
    this.dataService.get().subscribe((response) => {
      this.data = response.json();

      // this.isData = true;
      setTimeout(() => {
        this.genChart();
        this.toastCtrl.toggleToast('Graph updated!');
      }, 1000);
    });


  }

  download() {
    this.dataService.saveFileCSV().subscribe((response) => {
      let msg = response.json();
      this.toastCtrl.toggleToast(msg.msg);
    });
  }

  private formatDate(originalTime) {
    var d = new Date(originalTime);
    var datestring =
      d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
    return datestring;
  }

  public plotDynamicSplineChart() {
    let myChart = HighCharts.chart('dynamicSpline', {
      chart: {
        type: 'spline',
        animation: true, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {

            // set up the updating of the chart each second
            var series1 = this.series[0];
            var series2 = this.series[1];
            setInterval(function () {
              var x = (new Date()).getTime(), // current time
                y = Math.floor((Math.random() * 10) + 15),
                z = Math.floor((Math.random() * 20) + 15);
            }, 1000);
          }
        }
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Live data'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },
      legend: {
        enabled: true
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Temperature',
        type: undefined,
        data: (function () {
          // generate an array of random data
          var data = [],
            time = (new Date()).getTime(),
            i;

          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          return data;
        }())
      }, {
        name: 'Humidity',
        type: undefined,
        data: (function () {
          // generate an array of random data
          var data = [],
            time = (new Date()).getTime(),
            i;

          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          return data;
        }())
      }]

    });
  }

}
