import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NbOverlayService, NbToastrService} from "@nebular/theme";

declare var MediaRecorder: any;
declare var lamejs: any;

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  @Input() onRecorderStopped: Function = () => {};
  @Input() fileName: string = 'recording';
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
        // console.log('data available after MediaRecorder.stop() called.');

        // var clipName = prompt('Enter a name for your sound clip');
        var clipName = `recording-${this.fileName}`;

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

        // Extract the number of channels and sample rate from the mediaRecorder instance
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(this.mediaRecorder.stream);

        // Convert the blob to mp3 format
        this.convertToMp3(blob, clipName || 'recording', (mp3Blob: Blob, mp3FileName: string) => {
          // Save the mp3 file
          this.saveBlobAsFile(mp3Blob, mp3FileName);
        });
      };
      this.mediaRecorder.ondataavailable = (e: { data: any; }) => {
        let items: any = e.data;
        this.chunks.push(items);
      };
    }).then(() => {
      this.startRecording();
    }).catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
  }
  startRecording() {
    this.pressed = true;
    this.mediaRecorder.start();
  }
  stopRecording() {
    this.pressed = false;
    this.mediaRecorder.stop();
    // console.log(this.mediaRecorder.state);
    // console.log('recorder stopped');
    this.onRecorderStopped();
  }

  onMouseLeave() {
    if (this.pressed) {
      document.removeEventListener('mouseup', this.stopRecording);
      this.stopRecording();
      this.toastrService.info('Pointer outside the button. Recording is stopped. You can continue if that\'s okay, or try again.', 'Stopped Recording', {duration: 10000});
    }
  }

  convertFloat32ArrayToWav(audioData: Float32Array, numChannels: number, sampleRate: number) {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const floatTo16BitPCM = (output: DataView, offset: number, input: number) => {
      const s = Math.max(-1, Math.min(1, input));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + audioData.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, audioData.length * 2, true);

    for (let i = 0; i < audioData.length; i++) {
      floatTo16BitPCM(view, 44 + i * 2, audioData[i]);
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  encodeWavToMp3(wavBlob: Blob, callback: (mp3Blob: Blob) => void) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const audioData = event.target?.result as ArrayBuffer;
      const wav = lamejs.WavHeader.readHeader(new DataView(audioData));
      const samples = new Int16Array(audioData, wav.dataOffset, wav.dataLen / 2);
      const mp3enc = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
      const mp3Data = [];
      const blockSize = 1152;

      for (let i = 0; i < samples.length; i += blockSize) {
        const sampleChunk = samples.subarray(i, i + blockSize);
        const mp3buf = mp3enc.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }

      const endMp3buf = mp3enc.flush();

      if (endMp3buf.length > 0) {
        mp3Data.push(endMp3buf);
      }

      const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
      callback(mp3Blob);
    };

    reader.readAsArrayBuffer(wavBlob);
  }


  convertToMp3(blob: Blob, fileName: string, callback: (mp3Blob: Blob, mp3FileName: string) => void) {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const audioBuffer = await audioContext.decodeAudioData(buffer);

      const numChannels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const audioData = audioBuffer.getChannelData(0);
      const wavData = this.convertFloat32ArrayToWav(audioData, numChannels, sampleRate);

      this.encodeWavToMp3(wavData, (mp3Blob: Blob) => {
        callback(mp3Blob, `${fileName}.mp3`);
      });
    };

    fileReader.readAsArrayBuffer(blob);
  }

  saveBlobAsFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}
