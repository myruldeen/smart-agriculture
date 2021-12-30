import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { Globals } from '../../app/app.globals';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  fileList: Array<any> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private fileService: FileService) {
  }

  ionViewDidLoad() {
    this.dataService.csvList().subscribe((response) => {
      this.fileList = response.json().fileList;
      console.log(this.fileList);
    })
  }

  delete(item) {
    console.log(item);
  }

  download(item) {
    this.fileService.testDownload(Globals.BASE_API_URL + item);
    console.log(Globals.BASE_API_URL + item);
  }

}
