import { Component, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-reddit-player',
  templateUrl: './reddit-player.component.html',
  styleUrls: ['./reddit-player.component.scss']
})
export class RedditPlayerComponent implements AfterViewInit, OnChanges {
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  @Input('videoUrl') videoUrl: string = '';

  private isViewInitialized: boolean = false;

ngOnChanges(changes: SimpleChanges): void {
  if (this.videoUrl && this.videoUrl?.trim()) {
    this.loadVideo();
  }
}

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.videoUrl && this.loadVideo(); // Initial load
  }


   loadVideo(): void {
  //   const video = this.videoRef?.nativeElement;
  //   // Clean up previous instance if exists
  //   if (this.hls) {
  //     this.hls.destroy();
  //   }

  //   if (Hls.isSupported()) {
  //     this.hls = new Hls();
  //     this.hls.loadSource(this.videoUrl);
  //     this.hls.attachMedia(video);
  //     this.hls.on(Hls.Events.ERROR, (event, data) => {
  //       console.error('HLS.js error:', data);
  //     });
  //   } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //     video.src = this.videoUrl;
  //   } else {
  //     console.warn('HLS not supported in this browser');
  //   }
  }
}
