import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { FeedserviceService } from "../feedservice.service";

@Component({
  selector: "app-short-filter",
  templateUrl: "./short-filter.component.html",
  styleUrls: ["./short-filter.component.scss"],
})
export class ShortFilterComponent implements OnInit {
  showFilters: boolean = false;

  // Filter state
  selectedTechnology: string = "";
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
      skillLevels: ["Beginner", "Intermediate", "Advanced"],
      contentTypes: ["Tutorials", "News", "Reviews"],
      languages: ["Node.js", "Python", "Java", "Ruby", "PHP", "Go", "C#"],
      frameworks: ["Express.js", "Django", "Spring Boot", "Ruby on Rails", "Laravel", "Flask"],
      databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Cassandra"],
      apiDesign: ["REST", "GraphQL", "gRPC", "WebSockets"],
      testing: ["Jest", "Mocha", "Chai", "Supertest", "Postman"],
      deployment: ["Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Heroku"],
      versionControl: ["Git", "GitHub Actions", "Jenkins", "CircleCI"],
      optimization: ["Caching", "Load Balancing", "Database Indexing", "Query Optimization"],
      security: ["Authentication", "Authorization", "OWASP", "Encryption"],
      monitoring: ["Prometheus", "Grafana", "New Relic", "ELK Stack"],
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
    private elementRef: ElementRef
  ) {}

  @ViewChild('filterBar') filterBar!: ElementRef;

  ngOnInit(): void {
    // Load user interests from the service (like user signup)
    this.technologies = JSON.parse(localStorage.getItem("filters") || "[]");
    this.selectedTechnology = 'Frontend'//this.technologies[0] || ""; // Use first technology if available
    this.updateSubfilters(); // Initialize subfilters based on the first interest
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  searchQuery:any
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

  selectTechnology(tech: string): void {
    if (this.selectedTechnology !== tech) {
      this.selectedTechnology = tech;
      this.updateSubfilters();
      this.getFilters();
    }
  }

  selectSkillLevel(level: "beginner" | "intermediate" | "advanced"): void {
    if (this.selectedSkillLevel !== level) {
      this.selectedSkillLevel = level;
      this.getFilters();
    }
  }

  selectContentType(type: string): void {
    if (this.selectedContentType !== type) {
      this.selectedContentType = type;
      this.getFilters();
    }
  }

  selectSubfilter(subfilter: string): void {
    if (this.selectedSubfilter !== subfilter) {
      this.selectedSubfilter = subfilter;
      this.getFilters();
    }
  }

  updateDuration(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newDuration = Number(target.value);
      this.getFilters();
  }

  updateSubfilters(): void {
    // If selected technology is a nested category (like Frontend), handle subcategories
    if (this.filters[this.selectedTechnology]) {
      const techFilters = this.filters[this.selectedTechnology];
      this.subfilters = Object.keys(techFilters).reduce(
        (result, key) => [...result, ...techFilters[key]],
        [] as string[]
      );
    } else {
      this.subfilters = [];
    }

    this.selectedSubfilter = this.subfilters[0] || "";
  }

  getFilters(): void {
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
