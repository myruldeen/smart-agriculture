
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ToastService } from '../services/toast.service';

@Injectable()
export class FileService {
    private fileTransfer: FileTransferObject;  
    constructor(private transfer: FileTransfer, 
                private file: File, 
                private androidPermissions: AndroidPermissions, 
                private toastCtrl: ToastService) {}  

    download(fileName, filePath) {  
        let url = encodeURI(filePath);  
        this.fileTransfer = this.transfer.create();  
        this.fileTransfer.download(url, this.file.dataDirectory + fileName, true).then((entry) => {  
        
            console.log('download completed: ' + entry.toURL());  
            this.toastCtrl.toggleToast('Download Completed' + entry.toURL());

        }, (error) => {  
            console.log('download failed: ' + error);  
            this.toastCtrl.toggleToast('Download Fail' + error, 2000);
        });  
    } 
  
    testDownload(url) {
      this.getPermission(url);
    }
  
    getPermission(url) {
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            this.download(Date.now() + '-mongodb_fs.csv', url);
          } 
          else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
              .then(status => {
                if(status.hasPermission) {
                  this.download(Date.now() + '-mongodb_fs.csv', url);
                }
              });
          }
        });
    }

}
