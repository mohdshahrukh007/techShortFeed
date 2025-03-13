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
  videos: any[] = [{id:'I5_Gx3JNho8'}];
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
  private observer!: IntersectionObserver;
  constructor(
    private sanitizer: DomSanitizer,
    private shortService: ShortService,
    private feedService: FeedserviceService,
    private http: HttpClient
  ) {}

  setIframeHeight() {
    const footerHeight = 40; // Adjust based on your footer's height in pixels
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
        if (filter) {
          this.applyFilters(filter);
          this.fetchShorts(filter);
        }
      });
  }
  ngAfterViewInit(): void {
    this.setupSwipeGestures();
  }
  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = entry.target.querySelector("iframe");
          if (iframe) {
            if (entry.isIntersecting) {
              // ✅ Start video when it comes into view
              const videoId = iframe.getAttribute("data-id");
              iframe.src =`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
            } else {
              // ✅ Stop video when it leaves the view
              iframe.src = "";
            }
          }
        });
      },
      {
        threshold: 0.5, // Play only if 50% of the video is visible
      }
    );
  
    this.videoItems.forEach((video) => {
      this.observer.observe(video.nativeElement);
    });
  }
  ngAfterViewChecked(): void {
    // this.setupIntersectionObserver()
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
    return searchQuery;
  }
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);
    this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
     
    }, (error) => {
      this.videos = [
        {
          title: 'JavaScript in 100 Seconds',
          videoId: 'DHjqpvDnNGE',
          thumbnail: 'https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg'
        },
        {
          title: 'JavaScript for the Haters',
          videoId: 'aXOChLn5ZdQ',
          thumbnail: 'https://i.ytimg.com/vi/aXOChLn5ZdQ/hqdefault.jpg'
        },
        {
          title: 'Best Programming Languages #programming #coding #javascript',
          videoId: '5-oiLKEWIEw',
          thumbnail: 'https://i.ytimg.com/vi/5-oiLKEWIEw/hqdefault.jpg'
        },
        {
          title: 'How To Master JavaScript',
          videoId: 'I5_Gx3JNho8',
          thumbnail: 'https://i.ytimg.com/vi/I5_Gx3JNho8/hqdefault.jpg'
        },
        {
          title: 'Pikachu | HTML CSS JavaScript',
          videoId: 'y2OHIr_CZ4s',
          thumbnail: 'https://i.ytimg.com/vi/y2OHIr_CZ4s/hqdefault.jpg'
        },
        {
          title: 'What is the difference between JavaScript and TypeScript ?! #tech #coding #stem',
          videoId: 'IfrJfGowmj0',
          thumbnail: 'https://i.ytimg.com/vi/IfrJfGowmj0/hqdefault.jpg'
        },
        {
          title: 'The best thing you can do with JavaScript #javascript #programming',
          videoId: 'zO6CHvTErxE',
          thumbnail: 'https://i.ytimg.com/vi/zO6CHvTErxE/hqdefault.jpg'
        },
        {
          title: 'Maps Are A Game Changer For JavaScript',
          videoId: '4PZeIwXx1hc',
          thumbnail: 'https://i.ytimg.com/vi/4PZeIwXx1hc/hqdefault.jpg'
        },
        {
          title: 'Playwright TypeScript #5 Playwright Architecture | Playwright Testing Tutorial',
          videoId: '0mn6zKjiMGg',
          thumbnail: 'https://i.ytimg.com/vi/0mn6zKjiMGg/hqdefault.jpg'
        },
        {
          title: 'Let’s play… Does your code suck? JavaScript Variables Edition',
          videoId: 'ZRjmGq1gAEQ',
          thumbnail: 'https://i.ytimg.com/vi/ZRjmGq1gAEQ/hqdefault.jpg'
        }
      ].filter((short: any) => short.videoId) // ✅ Only include videos with a valid ID
        .map((short: any) => ({
          title: short.title,
          url: short.url || [],
          thumbnail: short.url,
          views: short.views,
          id: short.videoId,
          safeUrl: this.getSafeURL(short.videoId), // ✅ Cache Safe URL here
        }));
    });
  }
  
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
    this.videos = this.videos?.filter((video: any) => {
      // Filter by technology
      return (
        !filters.category || video?.title?.includes(filters.category)
        // &&
        // (!filters.skillLevel || video.title === filters.skillLevel) &&
        // (!filters.contentType || video.title.includes(filters.contentType)) &&
        // (!filters.maxDuration || video.title <= filters.maxDuration)
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
  getSafeURL(id: string  ): SafeResourceUrl {
    let url = this.sanitizer.bypassSecurityTrustResourceUrl(id);
    if (id) {
      url = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
      );
    }
    return url;
  }
}
