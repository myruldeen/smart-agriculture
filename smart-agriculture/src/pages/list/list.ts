import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { FileService } from '../../services/file.service';
import { Globals } from '../../app/app.globals';
import { PopoverComponent } from '../../components/popover/popover';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  fileList: Array<any> = [];
  fileList2: Array<any> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private dataService: DataService,
    private fileService: FileService,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastService) {
  }

  ionViewDidLoad() {
    this.dataService.csvList().subscribe((response) => {

      let x = [];
      this.fileList = response.json().fileList;
      for (let i = 0; i < this.fileList.length; i++) {
        x.push({
          id: i,
          file_name: this.fileList[i].split('.').slice(0, -1).join('.'),
          fileExt: this.fileList[i],
          dateCreated: new Date(+this.fileList[i].split('.').slice(0, -1).join('.')).toISOString()
        });
      }

      this.fileList2 = x;
    
      console.log(x);
    })
  }

  delete(item) {
    console.log(item);
  }

  download(item) {
    this.fileService.testDownload(Globals.BASE_API_URL + item.fileExt);
    console.log(Globals.BASE_API_URL + item.fileExt);
  }

  showOptions(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss((x) => {
      console.log(x);
    });
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sort List',
      buttons: [
        {
          text: 'Ascending',
          role: 'ascending',
          handler: () => {
            this.fileList2.sort(function (a, b) {
              let dateA = new Date(a.dateCreated);
              let dateB = new Date(b.dateCreated);
              return +dateA - +dateB;
            });

            console.log(this.fileList2);
          }
        },
        {
          text: 'Descending',
          role: 'descending',
          handler: () => {
            // this.toastCtrl.showToast('Descending..');
            this.fileList2.sort(function (a, b) {
              let dateA = new Date(a.dateCreated);
              let dateB = new Date(b.dateCreated);
              return +dateB - +dateA;
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


}
