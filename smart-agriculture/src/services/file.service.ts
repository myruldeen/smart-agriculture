
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';

@Injectable()
export class FileService {
    private fileTransfer: FileTransferObject;  
    constructor(private transfer: FileTransfer, 
                private file: File, 
                private androidPermissions: AndroidPermissions, 
                private toastCtrl: ToastController) {}  

    download(fileName, filePath) {  
        let url = encodeURI(filePath);  
        this.fileTransfer = this.transfer.create();  
        this.fileTransfer.download(url, this.file.externalDataDirectory + fileName, true).then((entry) => {  
        
            console.log('download completed: ' + entry.toURL());  
            let toast = this.toastCtrl.create({
              position: 'bottom',
              message: 'Download Completed' + entry.toURL(),
              duration: 3000,
              dismissOnPageChange: true
            });
            toast.present();
        }, (error) => {  
            console.log('download failed: ' + error);  
            let toast = this.toastCtrl.create({
              position: 'bottom',
              message: 'Download Fail' + error,
              duration: 3000,
              dismissOnPageChange: true
            });
            toast.present();
        });  
    } 
  
    testDownload() {
      this.getPermission();
    }
  
    getPermission() {
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            this.download("pdf-test.pdf","https://www.orimi.com/pdf-test.pdf");
          } 
          else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
              .then(status => {
                if(status.hasPermission) {
                  this.download("pdf-test.pdf","https://www.orimi.com/pdf-test.pdf");
                }
              });
          }
        });
    }

}
