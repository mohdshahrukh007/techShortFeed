import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { FeedserviceService } from "../feedservice.service";
import { ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ShortService } from "../short.service";

@Component({
  selector: "app-short-feed",
  templateUrl: "./short-feed.component.html",
  styleUrls: ["./short-feed.component.scss"],
})
export class ShortFeedComponent implements OnInit, AfterViewInit,OnDestroy {
  videos: any[] = [];
  defaultFilter = {
    category:
      "technology|programming|software|coding|AI|machine%20learning|web%20development",
    skillLevel: "beginner",
    contentType: "Tutorials",
    maxDuration: 90,
  };
  searchQuery: string = "javascript";
  apiKey = "AIzaSyDwRdSOdeXHLNJZszerfYGfgQmS0NwVnqg";
  @ViewChildren("videoItem") videoItems!: QueryList<ElementRef>;
  iframeHeight: string = "";
  filterSubscription!: Subscription;
  private currentIndex = 0;
  private observer!: IntersectionObserver;
  private activeVideo: HTMLIFrameElement | null = null;
  touchStartY: number | undefined;
  touchEndY!: number;
  // Initialize minSwipeDistance with a default value (in pixels)
  minSwipeDistance: number = 30;
  dups: Array<any>=[];

  constructor(
    private sanitizer: DomSanitizer,
    private shortService: ShortService,
    private cdr: ChangeDetectorRef,
    private feedserviceService: FeedserviceService
  ) {}
  
  setIframeHeight() {
    const footerHeight = 4.375; // 70px in rem (assuming 1rem = 16px)
    const viewportHeight = window.innerHeight / 16; // Convert px to rem
    this.iframeHeight = `${viewportHeight - footerHeight}rem`;
    this.overlayClass = `${viewportHeight - 7.5}rem`; // 120px in rem
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    window.removeEventListener("resize", this.setIframeHeight.bind(this));
  }
  ngOnInit(): void {
    this.setIframeHeight();
    window.addEventListener("resize", this.setIframeHeight.bind(this));
    this.filterSubscription = this.feedserviceService
      .getFilter()
      .subscribe((filter: any) => {
        if (filter.category) {
          if (this.videos.length === 0) {
            this.fetchShorts(filter);
          }
        }
      });
  }  

  ngAfterViewInit(): void {
    this.pauseAllVideos(); 
    this.setupIntersectionObserver();
  
    // // Start autoplay on the first video
    // const firstVideo = this.videoItems.first?.nativeElement.querySelector("iframe");
    // if (firstVideo) {
    //   this.playVideo(firstVideo);
    // }
  
    // Enable swipe gestures
    this.setupSwipeGestures(); 
  }
  setupIntersectionObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  
    const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const threshold = isiOS ? 0.7 : 0.8;
    const rootMargin = isiOS ? "0px 0px -20% 0px" : "0px 0px -10% 0px";
  
    this.observer = new IntersectionObserver(
      (entries) => {
        let nextActiveVideo: HTMLIFrameElement | null = null;
  
        entries.forEach((entry) => {
          const iframe = entry.target as HTMLIFrameElement;
  
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            nextActiveVideo = iframe;
          }
        });
  
        if (nextActiveVideo) {
          // If the next active video is different from the current one
          if (this.activeVideo && this.activeVideo !== nextActiveVideo) {
            this.pauseVideo(this.activeVideo);
          }
  
          // Assign and play the next video
          if (this.activeVideo !== nextActiveVideo) {
            this.activeVideo = nextActiveVideo;
            this.playVideo(nextActiveVideo);
            try {
              let x :HTMLIFrameElement = nextActiveVideo;
                 if(x?.nextSibling && x?.nextElementSibling && (x?.nextElementSibling as HTMLElement).offsetParent?.id =='loadMore'){
                  this.loadMoreVideos();
                }
            } catch (err) {
              
            }
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: rootMargin,
      }
    );
  
    // Observe all video iframes
    this.videoItems.forEach((item) => {
      const iframe = item.nativeElement.querySelector("iframe");
      if (iframe) {
        this.observer.observe(iframe);
      }
    });
  }
  
  playVideo(iframe: HTMLIFrameElement): void {
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    );
  }
  
  pauseVideo(iframe: HTMLIFrameElement): void {
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );
  }
  
  pauseAllVideos() {
    this.videoItems.forEach((item) => {
      const iframe = item.nativeElement.querySelector("iframe");
      if (iframe) {
        iframe.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      }
    });
  }
  
  enableAudio() {
    if (this.activeVideo) {
      setTimeout(() => {
        this.activeVideo?.contentWindow?.postMessage(
          '{"event":"command","func":"unMute","args":""}',
          '*'
        );
      }, 100);
    }
  }
  // Build the YouTube query URL based on filters
  buildQueryUrl(filterSearch: any) {
    let searchQuery = `${filterSearch.category} ${filterSearch.contentType} ${filterSearch.skillLevel}`;
    return searchQuery;
  }
  overlayClass: any;
  // Fetch YouTube Shorts
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);

    this.shortService.getYoutubeShort(searchUrl).subscribe(
      (res: any) => {
            if (res.status = 200) {
              this.dups =[
                {
                    "kind": "youtube#searchResult",
                    "videoId": "DHjqpvDnNGE",
                    "title": "JavaScript in 100 Seconds",
                    "description": "JavaScript is the the programming language that built the web. Learn how it evolved into a powerful tool for building websites, ...",
                    "thumbnail": "https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg",
                    "channelTitle": "Fireship",
                    "publishedAt": "2022-01-13T17:56:13Z",
                    "liveBroadcastContent": "none"
                }] //this.mapVideoData(res.body)
              this.videos = this.getFallbackVideos()//this.mapVideoData(this.dups); 
            this.reinitializeObserver();
            // Load dummy data on failure
            }
      },
      
    );
  }

  

  mapVideoData(data: any[]): any[] {
    return (data || [])
      .filter((short: any) => short.videoId)
      .map((short: any) => ({
        title: short?.title,
        thumbnail: short?.thumbnail,
        id: short?.videoId,
      
      }));
  }
  getFallbackVideos(): any[] {
    // Shuffle the dups array
    this.dups = this.dups.sort(() => Math.random() - 0.5);
    return this.dups.slice(0, 5).map((short: any) => ({
      ...short,
      safeUrl: this.getSafeURL(short.videoId),
    }));
  }

  reinitializeObserver(): void {
    setTimeout(() => {
      // this.pauseVideo();
      this.pauseAllVideos();
      this.setupIntersectionObserver();
    }, 100);
  }

  getHashtags(title: string): string[] {
    return title?.match(/#[\w]+/g) || []; // Match hashtags like #Angular #JavaScript
  }

  getTitleWithoutHashtags(title: string): string {
    return title?.replace(/#[\w]+/g, "").trim(); // Remove hashtags from the title
  }
  // Handle Swipe Gestures
  setupSwipeGestures(): void {
    const container = document.querySelector(
      ".shorts-container"
    ) as HTMLElement;
    if (container) {
      container.addEventListener("touchstart", (event) => {
        this.touchStartY = event.touches[0].clientY;
      });
      container.addEventListener("touchend", (event) => {
        this.touchEndY = event.changedTouches[0].clientY;
        this.handleSwipeGesture();
      });
    }
  }

  handleSwipeGesture(): void {
    const distance = this.touchEndY - (this.touchStartY ?? 0);
    if (Math.abs(distance) > this.minSwipeDistance) {
      if (distance < 0) {
        this.nextVideo();
      } else {
        this.previousVideo();
      }
    }
    // Ensure video doesn't auto-resume during swipe
    setTimeout(() => {
      const targetVideo = this.videoItems.toArray()[this.currentIndex]
        ?.nativeElement;
      const iframe = targetVideo?.querySelector("iframe");

      if (iframe && this.observer) {
        const isIntersecting = this.observer
          .takeRecords()
          .some((entry) => entry.target === iframe && entry.isIntersecting);
        if (!isIntersecting) {
          this.pauseVideo(iframe);
        }
      }
    }, 100);
  }

  nextVideo(): void {
    if (this.currentIndex < this.videoItems.length - 1) {
      this.currentIndex++;
      this.scrollToVideo(this.currentIndex);
    }
  }
  loadMoreVideos(): void {
    console.log('called');
    if (this.dups?.length > this.videos.length) {
      const start = this.videos.length;
      const end = start + 5;
      this.videos.push(...this.getFallbackVideos());
      this.cdr.detectChanges();
      // Trigger re-initialization to update IntersectionObserver
      setTimeout(() => this.setupIntersectionObserver(), 100);
    }
  }
  previousVideo(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToVideo(this.currentIndex);
    }
  }

  scrollToVideo(index: number): void {
    const targetVideo = this.videoItems.toArray()[index].nativeElement;
    targetVideo.scrollIntoView({ behavior: "smooth" });
  }

  getSafeURL(id: string): SafeResourceUrl {
    console.log(' safe url');
    
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
      );
   
  }

  trackByFn(index: number, video: any): string {
    return video.id;
  }

  applyFilters(filters: any): void {
    this.videos = this.videos?.filter((video: any) => {
      return !filters.category || video?.title?.includes(filters.category);
    });
  }
}
