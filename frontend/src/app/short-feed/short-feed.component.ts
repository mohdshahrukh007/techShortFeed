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
    this.filterSubscription = this.feedService.getFilter().subscribe((filter) => {
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

  // Play Video
  playVideo(iframe: HTMLIFrameElement) {
    if (this.activeVideo && this.activeVideo !== iframe) {
      this.pauseVideo(this.activeVideo);
    }
    this.activeVideo = iframe;
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
  }

  // Pause Video
  pauseVideo(iframe: HTMLIFrameElement) {
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }

  // Build the YouTube query URL based on filters
  buildQueryUrl(filterSearch: any) {
    let searchQuery = `${filterSearch.category} ${filterSearch.contentType} ${filterSearch.skillLevel}`;
    return searchQuery;
  }

  // Fetch YouTube Shorts
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);
    this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
      this.videos = res.videos
        .filter((short: any) => short.videoId)
        .map((short: any) => ({
          title: short.title,
          url: short.url || [],
          thumbnail: short.url,
          views: short.views,
          id: short.videoId,
          safeUrl: this.getSafeURL(short.videoId),
        }));
      // Reinitialize the IntersectionObserver after fetching new videos
      setTimeout(() => this.setupIntersectionObserver(), 100);
    });
  }

  // Handle Swipe Gestures
  setupSwipeGestures(): void {
    const container = document.querySelector(".shorts-container") as HTMLElement;
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

  getSafeURL(id: string = "I5_Gx3JNho8"): SafeResourceUrl {
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
