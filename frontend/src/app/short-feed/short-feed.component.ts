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
import { Subscription } from "rxjs";
import { ShortService } from "../short.service";

@Component({
  selector: "app-short-feed",
  templateUrl: "./short-feed.component.html",
  styleUrls: ["./short-feed.component.scss"],
})
export class ShortFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  videos: any[] = [{ id: "I5_Gx3JNho8" }];
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

  constructor(
    private sanitizer: DomSanitizer,
    private shortService: ShortService,
    private feedService: FeedserviceService,
    private http: HttpClient
  ) {}
  setIframeHeight() {
    const footerHeight = 40;
    const viewportHeight = window.innerHeight;
    this.iframeHeight = `${viewportHeight - footerHeight}px`;
    this.overlayClass=`${viewportHeight - 120}px`;
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
    this.filterSubscription = this.feedService
      .getFilter()
      .subscribe((filter) => {
        if (filter) {
          this.applyFilters(filter);
          if (this.videos.length === 0) {
            this.fetchShorts(filter);
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.setupSwipeGestures();
    this.setupIntersectionObserver();
    if (this.activeVideo) {
      this.playVideo(this.activeVideo);
    }
  }

  // Setup Intersection Observer
  setupIntersectionObserver(): void {
    // Disconnect any previous observer to avoid duplicate observations
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = entry.target as HTMLIFrameElement;
          if (entry.isIntersecting) {
            this.playVideo(iframe);
          } else {
            this.pauseVideo(iframe);
          }
        });
      },
      { threshold: 0.7 } // Trigger when 70% of the video is visible
    );

    this.videoItems.forEach((item) => {
      const iframe = item.nativeElement.querySelector("iframe");
      if (iframe) {
        
        this.observer.observe(iframe);
      }
    });
  }
  // Pause all videos initially, then play only the video in view
  pauseVideo(x?:any) {
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

  // Modified playVideo: first pause every video, then play the target video
  playVideo(iframe: HTMLIFrameElement) {
    this.pauseVideo();
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
    this.activeVideo = iframe;
  }

  // Build the YouTube query URL based on filters
  buildQueryUrl(filterSearch: any) {
    let searchQuery = `${filterSearch.category} ${filterSearch.contentType} ${filterSearch.skillLevel}`;
    return searchQuery;
  }
overlayClass:any;
  // Fetch YouTube Shorts
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);
    // this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
      this.videos =  [
       
        {
            "kind": "youtube#searchResult",
            "videoId": "4pNmCWeNjp8",
            "title": "The Top 5 MOST POPULAR JavaScript packages👩‍💻 #programming #software #javascript #code #technology",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/4pNmCWeNjp8/hqdefault.jpg",
            "channelTitle": "Coding with Lewis",
            "publishedAt": "2024-11-28T18:43:05Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "b4TpO9pYpqk",
            "title": "Top 5 API Performance Tips #javascript #python #web #coding #programming",
            "description": "Get our 158-page System Design PDF for free by subscribing to our weekly newsletter: https://bit.ly/bytebytegoYTshorts Animation ...",
            "thumbnail": "https://i.ytimg.com/vi/b4TpO9pYpqk/hqdefault.jpg",
            "channelTitle": "ByteByteGo",
            "publishedAt": "2024-01-22T16:35:00Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "FyyJtupBR7Q",
            "title": "Why I&#39;m Finally Trying The Webstorm JavaScript IDE...",
            "description": "Give Webstorm a try: https://jb.gg/Check-Out-WebStorm Prepping for your frontend interviews? Use code \"conner\" for a discount ...",
            "thumbnail": "https://i.ytimg.com/vi/FyyJtupBR7Q/hqdefault.jpg",
            "channelTitle": "Conner Ardman",
            "publishedAt": "2024-11-15T14:30:15Z",
            "liveBroadcastContent": "none"
        }
    ]
    
        .filter((short: any) => short.videoId)
        .map((short: any) => ({
          title: short.title,
          thumbnail: short.thumbnail,
          id: short.videoId,
          safeUrl: this.getSafeURL(short.videoId),
        }));
      // Reinitialize the IntersectionObserver after fetching new videos
      setTimeout(() => {
        this.pauseVideo();
        this.setupIntersectionObserver();
      }, 100);
    // });
  }
  getHashtags(title: string): string[] {
    return title?.match(/#[\w]+/g) || []; // Match hashtags like #Angular #JavaScript
  }
  
  getTitleWithoutHashtags(title: string): string {
    return title?.replace(/#[\w]+/g, '').trim(); // Remove hashtags from the title
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
  }

  nextVideo(): void {
    if (this.currentIndex < this.videoItems.length - 1) {
      this.currentIndex++;
      this.scrollToVideo(this.currentIndex);
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
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
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
