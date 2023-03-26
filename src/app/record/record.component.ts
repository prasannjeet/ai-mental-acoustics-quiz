import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import * as Recorder from 'recorder-js';
import {NbOverlayService, NbToastrService} from "@nebular/theme";

declare var MediaRecorder: any;

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  mediaRecorder:any;
  chunks: any[] = [];
  audioFiles: SafeUrl[] = [];
  recording: boolean = false;
  constructor(private cd: ChangeDetectorRef, private dom: DomSanitizer, private toastrService: NbToastrService, private overlayService: NbOverlayService) {}
  pressed: boolean = false;
  ngOnInit() {
    navigator.mediaDevices.getUserMedia({
      audio: true,
    }).then((stream: MediaStream) => {
      console.log(stream);
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onstop = (e: any) => {
        console.log('data available after MediaRecorder.stop() called.');

        var clipName = prompt('Enter a name for your sound clip');

        var clipContainer = document.createElement('article');
        var clipLabel = document.createElement('p');
        var audio = document.createElement('audio');
        var deleteButton = document.createElement('button');

        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        deleteButton.innerHTML = 'Delete';
        if (clipName) {
          clipLabel.innerHTML = clipName;
        }

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        // soundClips.appendChild(clipContainer);

        var thatDiv = document.getElementById('someItem');
        thatDiv?.appendChild(clipContainer);

        audio.controls = true;


        var blob = new Blob(this.chunks, {type: 'audio/ogg; codecs=opus'});
        this.chunks = [];
        var audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;
        let items: SafeUrl = this.dom.bypassSecurityTrustUrl(audioURL);
        this.audioFiles.push(items);
        console.log(audioURL);
        console.log('recorder stopped');
        this.cd.detectChanges();
      };
      this.mediaRecorder.ondataavailable = (e: { data: any; }) => {
        let items: any = e.data;
        this.chunks.push(items);
      };
    }).catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
  }
  startRecording() {
    this.pressed = true;
    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);
    console.log('recorder started');
  }
  stopRecording() {
    this.pressed = false;
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);
    console.log('recorder stopped');
  }

  onMouseLeave() {
    if (this.pressed) {
      document.removeEventListener('mouseup', this.stopRecording);
      this.stopRecording();
      this.toastrService.info('Pointer outside the button. Recording is stopped. You can continue if that\'s okay, or try again.', 'Stopped Recording', {duration: 10000});
    }
  }
}
