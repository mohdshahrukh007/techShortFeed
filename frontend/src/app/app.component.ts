import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  videoURL: string = '';
  videoLoaded: boolean = false;
  videoSrc!: SafeResourceUrl;
  iframeHeight: string = '400px'; // Set default height

  constructor(private sanitizer: DomSanitizer) {}

  loadVideo() {
    const url = 'https://www.youtube.com/embed/qKRsgLm_jys?controls=0&iv_load_policy=3&showinfo=0&autoplay=1&modestbranding=1&rel=0'; // Example URL
    // ✅ Sanitize the URL to avoid security errors
    this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.videoLoaded = true;

    // ✅ Adjust iframe height dynamically based on window size
    this.iframeHeight = window.innerWidth > 768 ? '500px' : '639px';

    // ✅ Handle window resizing
    window.addEventListener('resize', () => {
      this.iframeHeight = window.innerWidth > 768 ? '500px' : '639px';
    });
  }
  ngOnInit(): void {
    // You can modify iframe height based on window size;
    this.adjustIframeHeight();
    this.loadVideo()
  }

  getYouTubeVideoId(url: string): string {
    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/?(\S+)))|(?:youtu\.be\/(\S+))/;
    const match = url.match(regex);
    if (match) {
      videoId = match[1] || match[2];
    }
    return videoId;
  }

  // Adjust iframe height based on the window size
  adjustIframeHeight(): void {
    if (window.innerWidth < 600) {
      this.iframeHeight ='300px' // Smaller height for mobile screens
    } else {
      this.iframeHeight = '5100rem'  // Larger height for desktop screens
    }
  }
}
