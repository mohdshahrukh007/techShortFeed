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
            "videoId": "DHjqpvDnNGE",
            "title": "JavaScript in 100 Seconds",
            "description": "JavaScript is the the programming language that built the web. Learn how it evolved into a powerful tool for building websites, ...",
            "thumbnail": "https://i.ytimg.com/vi/DHjqpvDnNGE/hqdefault.jpg",
            "channelTitle": "Fireship",
            "publishedAt": "2022-01-13T17:56:13Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "aXOChLn5ZdQ",
            "title": "JavaScript for the Haters",
            "description": "Why does everybody hate JavaScript so much? A complete roast of JS that highlights the strongest criticisms against the world's ...",
            "thumbnail": "https://i.ytimg.com/vi/aXOChLn5ZdQ/hqdefault.jpg",
            "channelTitle": "Fireship",
            "publishedAt": "2022-11-24T16:00:11Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "5-oiLKEWIEw",
            "title": "Best Programming Languages #programming #coding #javascript",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/5-oiLKEWIEw/hqdefault.jpg",
            "channelTitle": "Devslopes",
            "publishedAt": "2023-05-01T03:26:26Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "I5_Gx3JNho8",
            "title": "How To Master JavaScript",
            "description": "Twitch Everything is built live on twitch Twitch : https://bit.ly/3xhFO3E Discord: discord.gg/ThePrimeagen Spotify DevHour: ...",
            "thumbnail": "https://i.ytimg.com/vi/I5_Gx3JNho8/hqdefault.jpg",
            "channelTitle": "ThePrimeagen",
            "publishedAt": "2024-05-29T19:37:45Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "gT0Lh1eYk78",
            "title": "HTML, CSS, JavaScript Explained [in 4 minutes for beginners]",
            "description": "Before you start any web development tutorials for beginners, FIRST understand what languages are used for building websites: ...",
            "thumbnail": "https://i.ytimg.com/vi/gT0Lh1eYk78/hqdefault.jpg",
            "channelTitle": "Danielle Thé",
            "publishedAt": "2016-10-16T19:14:12Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "RvYYCGs45L4",
            "title": "JavaScript Promise in 100 Seconds",
            "description": "Learn JavaScript Promises in 100 seconds, then follow my new IG account for even more content ...",
            "thumbnail": "https://i.ytimg.com/vi/RvYYCGs45L4/hqdefault.jpg",
            "channelTitle": "Fireship",
            "publishedAt": "2020-01-31T16:00:11Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "y2OHIr_CZ4s",
            "title": "Pikachu | HTML CSS JavaScript",
            "description": "shorts #html #css #javascript #tutorials #trending Source code: https://learning-axis.com/snippets/ Sound effects from Pixabay.",
            "thumbnail": "https://i.ytimg.com/vi/y2OHIr_CZ4s/hqdefault.jpg",
            "channelTitle": "Learning Axis",
            "publishedAt": "2023-05-25T03:10:04Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "IfrJfGowmj0",
            "title": "What is the difference between JavaScript and TypeScript ?! #tech #coding #stem",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/IfrJfGowmj0/hqdefault.jpg",
            "channelTitle": "Tiff In Tech",
            "publishedAt": "2024-09-26T19:00:02Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "MLlCBKiYm8c",
            "title": "#queryselector #javascript #css",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/MLlCBKiYm8c/hqdefault.jpg",
            "channelTitle": "Aa",
            "publishedAt": "2025-03-13T05:03:18Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "4PZeIwXx1hc",
            "title": "Maps Are A Game Changer For JavaScript",
            "description": "Map Video: https://youtu.be/yJDofSGTSPQ?t=558 Find Me Here: My Blog: https://blog.webdevsimplified.com My Courses: ...",
            "thumbnail": "https://i.ytimg.com/vi/4PZeIwXx1hc/hqdefault.jpg",
            "channelTitle": "Web Dev Simplified",
            "publishedAt": "2023-01-12T17:00:03Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "zO6CHvTErxE",
            "title": "The best thing you can do with JavaScript #javascript #programming",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/zO6CHvTErxE/hqdefault.jpg",
            "channelTitle": "Sam Meech-Ward",
            "publishedAt": "2023-12-03T23:13:17Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "0Rt8pnYGFms",
            "title": "JS is a vibes based language",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/0Rt8pnYGFms/hqdefault.jpg",
            "channelTitle": "Alberta Tech",
            "publishedAt": "2025-01-03T23:50:24Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "ZRjmGq1gAEQ",
            "title": "Let’s play… Does your code suck? JavaScript Variables Edition",
            "description": "Can you tell which code example is bad? Learn the subtle differences between variables in JavaScript by comparing let vs var.",
            "thumbnail": "https://i.ytimg.com/vi/ZRjmGq1gAEQ/hqdefault.jpg",
            "channelTitle": "Fireship",
            "publishedAt": "2024-02-25T19:51:24Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "NiQd9hZbuVo",
            "title": "Should you Learn JavaScript in 2024?",
            "description": "STEF'S DEVELOPER BOOTCAMP AND MENTORING PROGRAM https://unclestef.com/ JOIN STEF'S 'CODER'S CAREER ...",
            "thumbnail": "https://i.ytimg.com/vi/NiQd9hZbuVo/hqdefault.jpg",
            "channelTitle": "Stefan Mischook",
            "publishedAt": "2024-02-06T15:45:01Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "_YV3NM3i_IY",
            "title": "Why I Hate JavaScript",
            "description": "All Clips are from the live stream of ThePrimeagen https://twitch.tv/ThePrimeagen Wanna Become a Backend Dev & Support me at ...",
            "thumbnail": "https://i.ytimg.com/vi/_YV3NM3i_IY/hqdefault.jpg",
            "channelTitle": "ThePrimeagenClips",
            "publishedAt": "2024-01-26T16:00:22Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "e7b84V2Op1Q",
            "title": "Average day as a JavaScript developer",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/e7b84V2Op1Q/hqdefault.jpg",
            "channelTitle": "mewtru",
            "publishedAt": "2025-03-05T16:33:08Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "Y3Lmf5QoaKA",
            "title": "Created Reptile | HTML | CSS | Javascript #youtubeshorts #trending #coding #animation",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/Y3Lmf5QoaKA/hqdefault.jpg",
            "channelTitle": "Shivin tutorial",
            "publishedAt": "2024-08-19T02:52:59Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "KQ712CebFDM",
            "title": "Solving JavaScript&#39;s Most NOTORIOUS Interview Question",
            "description": "Can you solve this notorious JavaScript coding interview \"trick\" question? Prepping for your frontend interviews? Use code ...",
            "thumbnail": "https://i.ytimg.com/vi/KQ712CebFDM/hqdefault.jpg",
            "channelTitle": "Conner Ardman",
            "publishedAt": "2023-02-24T14:30:04Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "mP0AuMKypd8",
            "title": "Python vs. JavaScript",
            "description": "Which one should you learn? Let me break it down for you.",
            "thumbnail": "https://i.ytimg.com/vi/mP0AuMKypd8/hqdefault.jpg",
            "channelTitle": "Tech With Tim",
            "publishedAt": "2024-10-03T18:43:47Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "L6btUQ8mDZo",
            "title": "I Cannot Believe JavaScript Finally Added This New Array Method",
            "description": "20 More Amazing Array Methods: https://youtu.be/mSBnJvHtgD0 Find Me Here: My Blog: https://blog.webdevsimplified.com My ...",
            "thumbnail": "https://i.ytimg.com/vi/L6btUQ8mDZo/hqdefault.jpg",
            "channelTitle": "Web Dev Simplified",
            "publishedAt": "2023-12-14T17:00:27Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "SMZULGBYOZM",
            "title": "Fastest way to learn Web Development #webdevelopment #html #css #javascript",
            "description": "Fastest way to learn Web Development . ❣️ Save for later and subscribe for more! . For more content like this: ...",
            "thumbnail": "https://i.ytimg.com/vi/SMZULGBYOZM/hqdefault.jpg",
            "channelTitle": "Sahil & Sarra",
            "publishedAt": "2023-09-03T05:00:20Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "W_MYx77TkXg",
            "title": "Girls love Javascript",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/W_MYx77TkXg/hqdefault.jpg",
            "channelTitle": "Jason Goodison",
            "publishedAt": "2024-03-02T15:00:22Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "-rtxfuRTVT4",
            "title": "Just Learn JavaScript!",
            "description": "JavaScript is one of the most versatile programming languages. You can do literally EVERYTHING with it. If you are new to coding ...",
            "thumbnail": "https://i.ytimg.com/vi/-rtxfuRTVT4/hqdefault.jpg",
            "channelTitle": "Travis Media",
            "publishedAt": "2022-12-13T19:45:46Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "3O5DXpVESOI",
            "title": "Html vs css &amp;js website design and development #coding #programming #tech #fyp  #html #tranding",
            "description": "Exploring the roles of HTML, CSS, and JavaScript in website design and development! HTML lays the foundation of your ...",
            "thumbnail": "https://i.ytimg.com/vi/3O5DXpVESOI/hqdefault.jpg",
            "channelTitle": "Develop Code Journey",
            "publishedAt": "2024-11-09T03:04:51Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "lwB4_v60l-g",
            "title": "HTML vs CSS &amp; JavaScript || Html vs css &amp;js website design and development #html #coding #javascript",
            "description": "Thanks For Watching! Don't forget to Like and Subscribe for more tutorials and coding insights! #trend #trending, #foryou, #viral ...",
            "thumbnail": "https://i.ytimg.com/vi/lwB4_v60l-g/hqdefault.jpg",
            "channelTitle": "Develop Code Journey",
            "publishedAt": "2024-11-11T14:34:25Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "EoL5R_0h9xk",
            "title": "Creative CODING: Making Visuals with JAVASCRIPT - Online Course by Bruno Imbrizi | Domestika English",
            "description": "Learn the fundamentals of programming and discover how to develop, draw, and animate visuals and text with code: ...",
            "thumbnail": "https://i.ytimg.com/vi/EoL5R_0h9xk/hqdefault.jpg",
            "channelTitle": "Domestika English",
            "publishedAt": "2021-11-16T11:45:01Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "-oTdhdhZFrw",
            "title": "Why not just re-write the whole app in javascript? #corporate",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/-oTdhdhZFrw/hqdefault.jpg",
            "channelTitle": "Alberta Tech",
            "publishedAt": "2024-06-24T01:33:03Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "_i88AuoEBbc",
            "title": "COMPLETE Beginner’s Guide to JavaScript",
            "description": "COMPLETE Beginner's Guide to JavaScript #javascript #coding #swe #fyp.",
            "thumbnail": "https://i.ytimg.com/vi/_i88AuoEBbc/hqdefault.jpg",
            "channelTitle": "Sajjaad Khader",
            "publishedAt": "2024-12-03T21:00:31Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "bYIhwrHHo3w",
            "title": "Fast Food App in React Native 🔥 #shorts #reactnative #expo #reactjs #app #ui",
            "description": "expo #reactnative #tailwindcss #javascript #programming #typescript #speedcode #coding #design #appdevelopment #reactjs ...",
            "thumbnail": "https://i.ytimg.com/vi/bYIhwrHHo3w/hqdefault.jpg",
            "channelTitle": "Code With Nomi",
            "publishedAt": "2023-05-28T10:00:28Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "CXh55uorQs0",
            "title": "3 Levels Of React Developers #reactjs #reactdevelopment #reactjsdeveloper #webdevelopment",
            "description": "The 3 levels of React.js developers and how they fetch data. What level are you at? ⭐ Get my full-stack Next.js with Express ...",
            "thumbnail": "https://i.ytimg.com/vi/CXh55uorQs0/hqdefault.jpg",
            "channelTitle": "Coding in Flow",
            "publishedAt": "2024-08-21T09:35:20Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "ancXNJ44Y30",
            "title": "Toggle Button Without HTML, CSS Or Javascript (Full Tutorial in Description)",
            "description": "Make A Toggle Button Without CSS and Javascript (JS) In Editor X | No Code Tutorial In this video tutorial, Brandon Groce will ...",
            "thumbnail": "https://i.ytimg.com/vi/ancXNJ44Y30/hqdefault.jpg",
            "channelTitle": "NewForm with Brandon Groce",
            "publishedAt": "2022-09-16T18:45:37Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "jo6U429l3JM",
            "title": "1 TRILLION messages #javascript #python #web #coding #programming",
            "description": "Get a Free System Design PDF with 158 pages by subscribing to our weekly newsletter: https://bytebytego.ck.page/subscribe ...",
            "thumbnail": "https://i.ytimg.com/vi/jo6U429l3JM/hqdefault.jpg",
            "channelTitle": "ByteByteGo",
            "publishedAt": "2023-12-26T16:35:00Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "-tee_eW-niQ",
            "title": "JavaScript Explained in 60 Seconds ⚡️",
            "description": "Are you confused where to start coding/what to learn/what roadmap to take? Take this free 2 minute quiz: ...",
            "thumbnail": "https://i.ytimg.com/vi/-tee_eW-niQ/hqdefault.jpg",
            "channelTitle": "Mehul - Codedamn",
            "publishedAt": "2023-09-22T15:15:00Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "aXcuz6fn8_w",
            "title": "the untold history of web development",
            "description": "A totally comprehensive history of web development and JavaScript frameworks #humor #webdevelopment #shorts.",
            "thumbnail": "https://i.ytimg.com/vi/aXcuz6fn8_w/hqdefault.jpg",
            "channelTitle": "Fireship",
            "publishedAt": "2023-12-20T23:50:43Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "D9BnZM6RnEk",
            "title": "How to Link JavaScript to HTML in Visual Studio Code 2023",
            "description": "How to Link JavaScript to HTML in Visual Studio Code 2023 #javascript #html #visualstudio.",
            "thumbnail": "https://i.ytimg.com/vi/D9BnZM6RnEk/hqdefault.jpg",
            "channelTitle": "what is HTML?",
            "publishedAt": "2023-08-10T17:01:55Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "jNgppRzIaMc",
            "title": "How to master javascript",
            "description": "How to master javascript.",
            "thumbnail": "https://i.ytimg.com/vi/jNgppRzIaMc/hqdefault.jpg",
            "channelTitle": "Chai aur Code",
            "publishedAt": "2024-07-21T10:35:16Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "DjjrSW5Pe-k",
            "title": "This JavaScript update is Incredible 💻 #technology #software #programming #code #javascript",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/DjjrSW5Pe-k/hqdefault.jpg",
            "channelTitle": "Coding with Lewis",
            "publishedAt": "2025-02-06T18:31:21Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "qEfqjKLCwhU",
            "title": "Trolley Problem Solved #coding #programming #javascript #python",
            "description": "this video is a fun take on programming logic follow form more programming content specially in javascript , python , c++ , java ...",
            "thumbnail": "https://i.ytimg.com/vi/qEfqjKLCwhU/hqdefault.jpg",
            "channelTitle": "CodeVenture",
            "publishedAt": "2025-03-01T22:34:44Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "Q7YNXu9OsGU",
            "title": "bruh needs and operator #coding #programming #javascript #python",
            "description": "this video is a fun take on programming operators follow form more programming content specially in javascript , python , c++ ...",
            "thumbnail": "https://i.ytimg.com/vi/Q7YNXu9OsGU/hqdefault.jpg",
            "channelTitle": "CodeVenture",
            "publishedAt": "2025-03-10T07:37:54Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "ngQ0eNkn4nM",
            "title": "Can you do this JS Interview Question? 👀 #frontend #reactjs #javascript",
            "description": "Full Course - https://youtu.be/sZjlEKbaykc Javascript Interview Questions on closures will be discussed in this video including ...",
            "thumbnail": "https://i.ytimg.com/vi/ngQ0eNkn4nM/hqdefault.jpg",
            "channelTitle": "RoadsideCoder",
            "publishedAt": "2024-12-06T13:30:27Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "DbSJ2dsQvb4",
            "title": "JavaScript is Everywhere in 2024 #javascript #stackoverflow",
            "description": "It's the most popular for professional developers, and third on the list for those learning to code, it's the most popular in web ...",
            "thumbnail": "https://i.ytimg.com/vi/DbSJ2dsQvb4/hqdefault.jpg",
            "channelTitle": "Travis Media",
            "publishedAt": "2024-08-05T13:44:49Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "iBbBPkVhgNQ",
            "title": "JavaScript Event Loop Explained! 🚀 | How Async Code Works #shorts #coding #javascript #tutorial #js",
            "description": "Wondering how JavaScript handles asynchronous code? Meet the Event Loop! In this quick video, we'll explain how the Event ...",
            "thumbnail": "https://i.ytimg.com/vi/iBbBPkVhgNQ/hqdefault.jpg",
            "channelTitle": "ColorCode",
            "publishedAt": "2024-11-13T01:00:33Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "aPvkad_Eusg",
            "title": "JavaScript Tutorial: Convert to Uppercase and Lowercase",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/aPvkad_Eusg/hqdefault.jpg",
            "channelTitle": "freeCodeCamp.org",
            "publishedAt": "2024-06-28T19:30:00Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "qITHupvqX4A",
            "title": "What&#39;s a Signal? 🤔 #javascript",
            "description": "Watch the full video: https://youtu.be/t18Kzj9S8-M 🖥️ Official Website & Courses https://academind.com/courses/ Academind ...",
            "thumbnail": "https://i.ytimg.com/vi/qITHupvqX4A/hqdefault.jpg",
            "channelTitle": "Academind",
            "publishedAt": "2024-02-26T14:00:42Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "qLeziONDVLg",
            "title": "5 MUST HAVE VS Code Extensions for JavaScript",
            "description": "These are the 5 best VS Code extensions for working with JavaScript. 1. Quokka 2. Prettier 3. Live Server 4. Postman 5. Github ...",
            "thumbnail": "https://i.ytimg.com/vi/qLeziONDVLg/hqdefault.jpg",
            "channelTitle": "James Q Quick",
            "publishedAt": "2024-01-10T16:32:52Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "CMS-Wz1nn64",
            "title": "Can you do this Interview Question? 👀 #frontend #reactjs #javascript",
            "description": "Full Course - https://youtu.be/sZjlEKbaykc Javascript Interview Questions on closures will be discussed in this video including ...",
            "thumbnail": "https://i.ytimg.com/vi/CMS-Wz1nn64/hqdefault.jpg",
            "channelTitle": "RoadsideCoder",
            "publishedAt": "2024-11-22T16:29:10Z",
            "liveBroadcastContent": "none"
        },
        {
            "kind": "youtube#searchResult",
            "videoId": "EV54cKn_X2A",
            "title": "Why is JavaScript ASI like this? #javascript",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/EV54cKn_X2A/hqdefault.jpg",
            "channelTitle": "Sam Meech-Ward",
            "publishedAt": "2024-03-31T13:00:19Z",
            "liveBroadcastContent": "none"
        },
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
