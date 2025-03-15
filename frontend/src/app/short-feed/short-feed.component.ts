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
            setTimeout(() => {
              if (entry.isIntersecting) this.playVideo(iframe);
            }, 50);
          } else {
            this.pauseVideo(iframe);
          }
        });
      },
      { threshold: 0.7 }
    );
    
    this.videoItems.forEach((item) => {
      const iframe = item.nativeElement.querySelector("iframe");
      if (iframe) {
        this.observer.observe(iframe);
      }
    });
  }
  // Pause all videos initially, then play only the video in view
  pauseVideo(x?: any) {
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

  playVideo(iframe: HTMLIFrameElement) {
    if (this.activeVideo && this.activeVideo !== iframe) {
      this.pauseVideo(this.activeVideo);
    }
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
    setTimeout(() => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "unMute",
          args: []
        }),
        "*"
      );
    }, 100);
    this.activeVideo = iframe;
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
        this.videos = this.mapVideoData(res);
        this.reinitializeObserver();
      },
      (error) => {
        console.error("Error fetching videos:", error); // Improved error logging
        this.videos = this.getFallbackVideos(); // Load dummy data on failure
        this.reinitializeObserver();
      }
    );
  }

  mapVideoData(data: any[]): any[] {
    return (data || [])
      .filter((short: any) => short.videoId)
      .map((short: any) => ({
        title: short?.title,
        thumbnail: short?.thumbnail,
        id: short?.videoId,
        safeUrl: this.getSafeURL(short?.videoId),
      }));
  }

  getFallbackVideos(): any[] {
    return [
      {
        videoId: "DHjqpvDnNGE",
        title: "JavaScript in 100 Seconds",
        thumbnail: "https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg",
      },
      {
        videoId: "aXOChLn5ZdQ",
        title: "JavaScript for the Haters",
        thumbnail: "https://i.ytimg.com/vi/aXOChLn5ZdQ/hqdefault.jpg",
      },
      {
        videoId: "5-oiLKEWIEw",
        title: "Best Programming Languages #programming #coding #javascript",
        thumbnail: "https://i.ytimg.com/vi/5-oiLKEWIEw/hqdefault.jpg",
      },
      {
        videoId: "I5_Gx3JNho8",
        title: "How To Master JavaScript",
        thumbnail: "https://i.ytimg.com/vi/I5_Gx3JNho8/hqdefault.jpg",
      },
      {
        videoId: "gT0Lh1eYk78",
        title: "HTML, CSS, JavaScript Explained [in 4 minutes for beginners]",
        thumbnail: "https://i.ytimg.com/vi/gT0Lh1eYk78/hqdefault.jpg",
      },
    ].map((short: any) => ({
      ...short,
      safeUrl: this.getSafeURL(short.videoId),
    }));
  }

  reinitializeObserver(): void {
    setTimeout(() => {
      this.pauseVideo();
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
