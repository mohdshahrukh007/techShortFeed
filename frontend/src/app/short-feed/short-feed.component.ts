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
import { FeedserviceService } from "../feedservice.service";
import { ChangeDetectorRef } from "@angular/core";
import { map, Observable, Subscription } from "rxjs";
import { ShortService } from "../short.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-short-feed",
  templateUrl: "./short-feed.component.html",
  styleUrls: ["./short-feed.component.scss"],
})
export class ShortFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  videos: any[] = [];
  searchQuery: string = "javascript";
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
  dups: Array<any> = [];
  redditShorts: Array<any> = [];
  redditVideos: any;

  constructor(
    private sanitizer: DomSanitizer,
    private shortService: ShortService,
    private cdr: ChangeDetectorRef,
    private feedserviceService: FeedserviceService,
    private router: Router
  ) {}

  setIframeHeight() {
    const footerHeight = 4.375; // 70px in rem (assuming 1rem = 16px)
    const viewportHeight = window.innerHeight / 16; // Convert px to rem
    this.iframeHeight = `${viewportHeight - footerHeight}rem`;
    this.overlayClass = `${viewportHeight - 7.5}rem`; // 120px in rem
  }

  combinedSearch: any = null;
  ngOnInit(): void {
    this.setIframeHeight();
    window.addEventListener("resize", this.setIframeHeight.bind(this));
    this.filterSubscription = this.feedserviceService
      .getFilter()
      .subscribe((userInterestCatagory: any) => {
        const searchQueryHash =
          JSON.stringify(localStorage.getItem("filters")) || "";
        let getHashtags = this.feedserviceService.getHashtags(
          searchQueryHash && searchQueryHash?.replace(/"/g, "")
        );
        const uniqueHashtags = Array.from(new Set(getHashtags.split(" "))).join(
          " "
        );
        let $userInterestCatagory =
          typeof userInterestCatagory === "object" &&
          Object.keys(userInterestCatagory).length
            ? Object.entries(userInterestCatagory)
                .map(([key, value]) => `${value}`)
                .join(" ")
            : "";
        this.combinedSearch = uniqueHashtags
          ? uniqueHashtags + " " + $userInterestCatagory
          : userInterestCatagory + " #shorts";
        console.log(this.combinedSearch);
        this.combinedSearch
          ? this.fetchShorts(this.combinedSearch)
          : this.router.navigate(["/"]);
      });
  }

  ngAfterViewInit(): void {
    this.pauseAllVideos();
    this.setupIntersectionObserver();

    // Start autoplay on the first video
    const firstVideo = this.videoItems.first?.nativeElement.querySelector(
      "iframe"
    );
    if (firstVideo) {
      this.playVideo(firstVideo);
    }

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

        entries.forEach((entry, index) => {
          this.currentIndex = index;
          const iframe = entry.target as HTMLIFrameElement;

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            nextActiveVideo = iframe;
          }
        });

        if (nextActiveVideo) {
          // If the next active video is different from the current one
          if (this.activeVideo && this.activeVideo !== nextActiveVideo) {
            this.pauseVideo(this.activeVideo); // Pause only the previous active video
          }
          // Assign and play the next video
          if (this.activeVideo !== nextActiveVideo) {
            this.activeVideo = nextActiveVideo;
            this.playVideo(nextActiveVideo);
            // this.enableAudio();
            try {
              let x: HTMLIFrameElement = nextActiveVideo;
              if (
                x?.nextSibling &&
                x?.nextElementSibling &&
                (x?.nextElementSibling as HTMLElement).offsetParent?.id ==
                  "loadMore"
              ) {
                this.loadMoreVideos();
              }
            } catch (err) {
              console.error("Error while loading more videos:", err);
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
    const removedIframes = JSON.parse(
      localStorage.getItem("removedIframes") || "[]"
    );
    if (removedIframes.includes(iframe.id)) {
      let removedVDO = removedIframes[iframe.id];
      iframe.src = ""; // Unload the iframe
      console.log(`Iframe with id: ${iframe.id} was previously removed.`);
      iframe.setAttribute(
        "src",
        `https://www.youtube.com/embed/${removedVDO}?enablejsapi=1&autoplay=1&mute=1&controls=0&playlist=${removedVDO}&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
      ); // Clear the src attribute to ensure it doesn't load
      return;
    }
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
  }

  pauseVideo(iframe: HTMLIFrameElement, id?: any): void {
    // this.removeIframe(id);
    iframe.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }
  removeIframe(id: string): void {
    const iframe = document.getElementById(id) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = ""; // Unload the iframe
      console.log(`Removed iframe with id: ${id}`);
      const removedIframes = JSON.parse(
        localStorage.getItem("removedIframes") || "[]"
      );
      removedIframes.push(iframe.id);
      localStorage.setItem("removedIframes", JSON.stringify(removedIframes));
    }
  }
  pauseAllVideos() {
    this.videoItems.forEach((item) => {
      const iframe = item.nativeElement.querySelector("iframe");
      if (iframe) {
        iframe.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
        iframe.contentWindow?.postMessage(
          '{"event":"command","func":"mute","args":""}',
          "*"
        );
      }
    });
  }

  enableAudio() {
    this.activeVideo?.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      "*"
    );
    setTimeout(() => {
      this.activeVideo?.contentWindow?.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*"
      );
    }, 100);
  }
  // Build the YouTube query URL based on filters
  buildQueryUrl(filterSearch: any) {
    let searchQuery;
    if (typeof filterSearch) searchQuery = `${filterSearch} `;
    else
      searchQuery = `${filterSearch} ${filterSearch?.category} ${filterSearch?.contentType} ${filterSearch?.skillLevel}`;
    return searchQuery;
  }
  overlayClass: any;

  // Fetch YouTube Shorts
  fetchShorts(filterSearch?: any): void {
    const searchUrl = this.buildQueryUrl(filterSearch);
    this.shortService.getYoutubeShort(searchUrl).subscribe((res: any) => {
      if (res.status == 200) {
        this.dups = res.body; //this.mapVideoData(res.body)
        let filteredVideos = this.getVideosinChunks(0, 5); // Initial chunk
        let start = 5;
        let end = 10;

        while (filteredVideos.length >= 5 && end <= this.dups.length) {
          filteredVideos = this.getVideosinChunks(start, end); // Next window if no match found
          start += 5;
          end += 5;
        }
        this.getRedditShortCall().subscribe((redditShorts: any) => {
          this.redditShorts = redditShorts;
          this.videos = [...this.redditShorts];
          console.log("Reddit Shorts:", this.videos);
          this.cdr.detectChanges();

        });
        this.videos = [...this.redditShorts,...filteredVideos];

        this.reinitializeObserver();
        // Load dummy data on failure
      }
    });
  }
  getVideosinChunks(start: any, end: any): any[] {
    // Shuffle the dups array
    return this.filterVideosByInterest(
      this.dups.slice(start, end),
      this.combinedSearch
    ).map((short: any) => ({
      ...short,
      safeUrl: this.getSafeURL(short.videoId),
    }));
  }

  filterVideosByInterest(
    data: any,
    interest: string,
    levelMatch = 1
  ): Array<any> {
    const userFilter = JSON.parse(localStorage.getItem("userFilters") || "{}");
    const filteredData = data.filter((video: any) => {
      const interestWords =
        interest?.toLowerCase().replace(/#/g, "").split(" ") || [];
      const titleWords =
        video?.title.toLowerCase().replace(/#/g, "").split(" ") || [];
      const matchesInterest = interestWords.some((word) =>
        titleWords.includes(word)
      );

      const matchesFilters =
        [
          userFilter?.category?.toLowerCase(),
          userFilter?.skillLevel?.toLowerCase(),
          userFilter?.contentType?.toLowerCase(),
        ]
          .filter((filter) => filter)
          .reduce((count, filter) => {
            const isMatched = titleWords.includes(filter.toLowerCase());
            if (isMatched) {
              console.log(`Matched filter: ${filter}`);
            }
            return isMatched ? count + 1 : count;
          }, 0) >= levelMatch;

      if (matchesFilters) {
        console.log(
          `Video "${video?.title}" matches user filters.` + userFilter
        );
      }

      return matchesInterest &&
        Object.values(userFilter).length &&
        matchesFilters
        ? video
        : true;
    });

    return filteredData;
  }

  mapVideoData(data: any[]): any[] {
    return (data || [])
      .filter((short: any) => short.videoId)
      .map((short: any) => ({
        title: short?.title,
        thumbnail: short?.thumbnail,
        id: this.getSafeURL(short?.videoId),
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

  loadMoreVideos(): void {
    console.log("lMore");
    if (this.dups?.length > this.videos.length) {
      const start = this.videos.length;
      const end = start + 5;
      this.videos.push(...this.getVideosinChunks(start, end));
      this.cdr.detectChanges();
      // Trigger re-initialization to update IntersectionObserver
      setTimeout(() => this.setupIntersectionObserver(), 100);
    }
  }

  onPlayerStateChange(event: any, index: number): void {
    if (event.data === 0) {
      // Video ended
      // this.removeIframe(index);//cn replay
    }
  }

  ngOnDestroy() {
    localStorage.removeItem("removedIframes");
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    window.removeEventListener("resize", this.setIframeHeight.bind(this));
    if (this.filterSubscription) this.filterSubscription.unsubscribe();
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.setIframeHeight.bind(this));
  }

  scrollToVideo(index: number): void {
    const targetVideo = this.videoItems.toArray()[index].nativeElement;
    targetVideo.scrollIntoView({ behavior: "smooth" });
  }

  getSafeURL(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&controls=0&playlist=${id}&modestbranding=1&rel=0&loop=1&iv_load_policy=3`
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
  getRedditShortCall(): Observable<any[]> {
    return this.shortService.getRedditShort(this.combinedSearch).pipe(
      map((res: any) =>
        res?.data?.children
      .filter((post: any) => !!post?.data?.secure_media?.reddit_video?.hls_url)
      .map((post: any) => ({
          channelTitle: post?.data?.title,
          title: post?.data?.title,
          url: post?.data?.redditVideo,
          description: "",
          videoId: post?.data?.secure_media?.reddit_video.hls_url ,
          safeUrl: this.getSafeURL(
            this.extractYoutubeId(post?.data?.media?.oembed?.html)
          ),
        }))
      )
    );
  }

  extractYoutubeId(urlOrEmbed: string): string {
    const regex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = urlOrEmbed?.match(regex);
    return match ? match[1] : "";
  }

}
