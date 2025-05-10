import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { FeedserviceService } from "../feedservice.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-short-filter",
  templateUrl: "./short-filter.component.html",
  styleUrls: ["./short-filter.component.scss"],
})
export class ShortFilterComponent implements OnInit {
  showFilters: boolean = false;

  // Filter state
  selectedTechnology: string = "Angular";
  SkillsFilter: string = "";
  selectedSkillLevel: "beginner" | "intermediate" | "advanced" = "beginner";
  selectedContentType: string = "";
  selectedSubfilter: string = "";

  // User-specific interests (pulled from the service)
  technologies: string[] = [];
  skillLevels: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];
  contentTypes: string[] = ["Tutorials", "Reviews", "News", "Tips & Tricks", "Best Practices", "Interview Question Snippet"];

  // Dynamic filters
  filters: { [key: string]: { [key: string]: string[] } } = {
    Frontend: {
      // contentTypes: ["Tutorials", "News", "Reviews"],
      // languages: ["HTML", "CSS", "JavaScript", "TypeScript"],
      frameworks: ["React.js", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js"],
      // stateManagement: ["Redux", "MobX", "Zustand", "Pinia"],
      // css: ["SASS", "LESS", "Tailwind CSS", "Bootstrap", "Material UI"],
      // buildTools: ["Webpack", "Vite", "Rollup", "Parcel"],
      // testing: ["Jest", "Cypress", "Mocha", "Storybook", "Playwright"],
      // optimization: ["Code Splitting", "Lazy Loading", "Minification", "Tree Shaking"],
      // versionControl: ["Git", "GitHub Actions", "Jenkins"],
      // accessibility: ["ARIA roles", "Semantic HTML", "Color Contrast"],
      // browserApis: ["LocalStorage", "WebSockets", "WebRTC"],
      // deployment: ["Netlify", "Vercel", "Firebase", "AWS"],
    },
    Backend: {
      // skillLevels: ["Beginner", "Intermediate", "Advanced"],
      // contentTypes: ["Tutorials", "News", "Reviews"],
      // languages: ["Node.js", "Python", "Java", "Ruby", "PHP", "Go", "C#"],
      frameworks: ["Express.js", "Django", "Spring Boot", "Ruby on Rails", "Laravel", "Flask"],
      // databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Cassandra"],
      // apiDesign: ["REST", "GraphQL", "gRPC", "WebSockets"],
      // testing: ["Jest", "Mocha", "Chai", "Supertest", "Postman"],
      // deployment: ["Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Heroku"],
      // versionControl: ["Git", "GitHub Actions", "Jenkins", "CircleCI"],
      // optimization: ["Caching", "Load Balancing", "Database Indexing", "Query Optimization"],
      // security: ["Authentication", "Authorization", "OWASP", "Encryption"],
      // monitoring: ["Prometheus", "Grafana", "New Relic", "ELK Stack"],
    },
    dev: {
      categories: ["Frontend", "Backend", "JavaScript", "Python", "Java", "Spring", "Game Dev", "Mobile Dev", "DevOps"],
    },
    data: {
      categories: ["AI", "Machine Learning", "Data Science", "Big Data", "Analytics", "Computer Vision", "NLP"],
    },
    design: {
      categories: ["UI/UX", "Graphic Design", "Product Design", "Prototyping", "Animation"],
    },
    emerging: {
      categories: ["AR/VR", "Blockchain", "IoT", "Robotics", "Quantum Computing", "Cloud", "Cybersecurity", "5G", "Edge Computing"],
    },
    additional: {
      categories: ["Interview Preparation", "Tips & Tricks", "Optimization Techniques"],
    }
  };

  subfilters: string[] = [];

  constructor(
    private feedService: FeedserviceService,
    private elementRef: ElementRef,
    private router: Router
  ) {}

  @ViewChild('filterBar') filterBar!: ElementRef;
  isSidebarOpen:boolean = false
  ngOnInit(): void {
    // Load user interests from the service (like user signup)
    this.SkillsFilter = localStorage.getItem("filters") || ""; // Use first technology if available
    this.updateSubfilters(); // Initialize subfilters based on the first interest
  }
  toggleSidebar(){
    this.isSidebarOpen = !this.isSidebarOpen
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  reset(){
    this.SkillsFilter = 'Frontend'
    this.selectedSkillLevel = 'beginner'
    this.selectedContentType = ''
    this.selectedSubfilter = ''
    localStorage.clear();
    this.router.navigate(['/']); // Navigate to the main page
  }
  searchQuery:any=""
  filterSubfilters(searchTerm?: string): void {
    if (!searchTerm) {
      this.updateSubfilters(); // Reset to all subfilters if no search term
      return;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.subfilters = this.subfilters.filter(subfilter =>
      subfilter.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
  selectFilter(type: 'technology' | 'skillLevel' | 'contentType', value: string): void {
    switch (type) {
      case 'technology':
        if (this.selectedTechnology !== value) {
          this.selectedTechnology = value;
          // this.updateSubfilters();
        }
        break;
      case 'skillLevel':
        if (this.selectedSkillLevel !== value) {
          this.selectedSkillLevel = value as "beginner" | "intermediate" | "advanced";
        }
        break;
      case 'contentType':
        if (this.selectedContentType !== value) {
          this.selectedContentType = value;
        }
        break;
    }
    console.log("Selected", type, ":", value);
    
  } 

   
  updateSubfilters(): void {
    // If selected technology is a nested category (like Frontend), handle subcategories
    if (this.filters[this.SkillsFilter]) {
      const techFilters = this.filters[this.SkillsFilter];
      this.subfilters = Object.keys(techFilters).reduce(
        (result, key) => [...result, ...techFilters[key]],
        [] as string[]
      );
    } else {
      this.subfilters = [];
    }

    this.selectedSubfilter = this.subfilters[0] || "";
  }

  applyFilters(): void {
    this.toggleFilters();
    const filters = {
      category: this.selectedTechnology,
      skillLevel: this.selectedSkillLevel,
      contentType: this.selectedContentType,
      subfilter: this.selectedSubfilter,
    };

    console.log("Filters:", filters);

    // Save as an object to localStorage
    localStorage.setItem("userFilters", JSON.stringify(filters));
    
    // Send filters to feed service
    this.feedService.setFilter(filters);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showFilters = false;
    }
  }
}
