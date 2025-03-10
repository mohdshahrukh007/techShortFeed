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
  videos: any[] = [];
  searchQuery: string = "javascript";
  apiKey = "AIzaSyDwRdSOdeXHLNJZszerfYGfgQmS0NwVnqg"; //"AIzaSyBpC_1cf5IWYzDBHGuPocjzKvA-wIGAsZA";
  @ViewChildren("videoItem") videoItems!: QueryList<ElementRef>;
  // baseUrl = "https://www.googleapis.com/youtube/v3/search";
  iframeHeight: string = "";
  filterSubscription!: Subscription;
  private currentIndex = 0;
  private touchStartY = 0;
  private touchEndY = 0;
  private minSwipeDistance = 30; // Minimum swipe distance to trigger
  filterSearch: string = "AI";
  defaultFilter = {
    category:
      "technology|programming|software|coding|AI|machine%20learning|web%20development",
    skillLevel: "beginner",
    contentType: "Tutorials",
    maxDuration: 90,
  };

  constructor(
    private sanitizer: DomSanitizer,
    private shortService: ShortService,
    private feedService: FeedserviceService,
    private http: HttpClient
  ) {}

  setIframeHeight() {
    const footerHeight = 100; // Adjust based on your footer's height in pixels
    const viewportHeight = window.innerHeight;
    this.iframeHeight = `${viewportHeight - footerHeight}px`;
  }
  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    window.removeEventListener("resize", this.setIframeHeight.bind(this));
  }
  ngOnInit(): void {
    this.setIframeHeight();
    window.addEventListener("resize", this.setIframeHeight.bind(this));
    this.feedService.setFilter(this.defaultFilter);
    this.filterSubscription = this.feedService
      .getFilter()
      .subscribe((filter) => {
        this.applyFilters(filter);
        this.fetchShorts(filter);
      });
  }
  ngAfterViewInit(): void {
    this.setupSwipeGestures();
  }

  // ✅ Fetch YouTube Shorts
  buildQueryUrl(filterSearch: any) {
    let searchQuery = `${filterSearch.category} ${filterSearch.contentType} ${filterSearch.skillLevel}`;
    // Convert maxDuration to PT (ISO 8601) format for YouTube API
    let duration = "";
    if (filterSearch.maxDuration <= 60) {
      duration = "short";
    } else if (filterSearch.maxDuration <= 240) {
      duration = "medium";
    } else {
      duration = "long";
    }
    //  const url =
    //   `https://www.googleapis.com/youtube/v3/search?part=snippet` +
    //   `&q=${encodeURIComponent(searchQuery)}` +
    //   `&type=video` +
    //   `&videoDuration=short` + // ✅ Filter for Shorts
    //   `&maxResults=10` +
    //   `&videoDefinition=high` +
    //   `&order=relevance` +
    //   `&safeSearch=moderate` +
    //   `&relevanceLanguage=en` +
    //   `&regionCode=US` +
    //   `&videoEmbeddable=true` +
    //   `&key=${this.apiKey}`;
    return searchQuery;
  }
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);
    this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
      this.videos = res.videos.map((short: any) => ({
        title: short.title,
        url: short.url || [],
        thumbnail: short.url,
        views: short.views,
        id: short.videoId,
        safeUrl: this.getSafeURL(short.videoId) // Cache Safe URL here
      }));
    });
  }
  
  // fetchShorts(filterSearch?: any): void {
  //   const searchUrl = this.buildQueryUrl(filterSearch);
  //   // "snippet&q=technology|programming|software|coding|AI|machine%20learning|web%20development";
  //   this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
  //     this.videos = res.videos.map((short: any) => ({
  //       title: short.title,
  //       url: short.url || [],
  //       thumbnail: short.url,
  //       views: short.views,
  //       id: short.videoId
  //     }));
  //   });
    // this.videos = videoId.map((item: any) => ({
    //   id: item.id.videoId,
    //   title: item.snippet?.title,
    //   tags: item.snippet?.tags || [],
    //   thumbnail: item.snippet?.thumbnails.medium.url,
    // }));
  // }

  // ✅ Handle Swipe Gestures on Mobile
  setupSwipeGestures(): void {
    const container = document.querySelector(
      ".shorts-container"
    ) as HTMLElement;
    container?.addEventListener("touchstart", (event) => {
      this.touchStartY = event.touches[0].clientY;
    });
    container?.addEventListener("touchend", (event) => {
      this.touchEndY = event.changedTouches[0].clientY;
      this.handleSwipeGesture();
    });
  }
  trackByFn(index: number, video: any): string {
    return video.id;
  }
  applyFilters(filters: any): void {
    this.videos = this.videoItems?.filter((video: any) => {
      // Filter by technology
      return (
        (!filters.category || video.techTags.includes(filters.category)) &&
        (!filters.skillLevel || video.skillLevel === filters.skillLevel) &&
        (!filters.contentType || video.title.includes(filters.contentType)) &&
        (!filters.maxDuration || video.duration <= filters.maxDuration)
      );
      // Filter by skill level
      // if (video.skillLevel !== filterObj?.selectedSkillLevel) {
      //   return false;
      // }

      // // In a real app, we would also filter by content type and duration

      // return true;
    });
  }
  // ✅ Handle swipe direction and movement
  handleSwipeGesture(): void {
    const distance = this.touchEndY - this.touchStartY;
    if (Math.abs(distance) > this.minSwipeDistance) {
      if (distance < 0) {
        this.nextVideo(); // Swipe up → next video
      } else {
        this.previousVideo(); // Swipe down → previous video
      }
    }
  }

  // ✅ Go to next video
  nextVideo(): void {
    if (this.currentIndex < this.videoItems.length - 1) {
      this.currentIndex++;
      this.scrollToVideo(this.currentIndex);
    }
  }

  // ✅ Go to previous video
  previousVideo(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToVideo(this.currentIndex);
    }
  }

  // ✅ Scroll to target video smoothly
  scrollToVideo(index: number): void {
    const targetVideo = this.videoItems.toArray()[index].nativeElement;
    targetVideo.scrollIntoView({ behavior: "smooth" });
  }

  // ✅ Get Safe YouTube URL
  getSafeURL(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
    );
  }
}
