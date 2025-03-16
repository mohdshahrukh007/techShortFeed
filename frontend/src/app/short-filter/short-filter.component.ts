import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FeedserviceService } from "../feedservice.service";

@Component({
  selector: "app-short-filter",
  templateUrl: "./short-filter.component.html",
  styleUrls: ["./short-filter.component.scss"],
})
export class ShortFilterComponent implements OnInit {
  showFilters: boolean = false;
  // Filter state
  selectedTechnology: string = "Web Dev";
  selectedSkillLevel: "beginner" | "intermediate" | "advanced" = "beginner";
  selectedContentType: string = "Tutorials";
  maxDuration: number = 90;

  // Available filter options
  technologies: string[] = [
    "Web Dev",
    "Mobile Dev",
    "AI/ML",
    "DevOps",
    "Cybersecurity",
    "Data Science",
  ];
  skillLevels: ("beginner" | "intermediate" | "advanced")[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];
  contentTypes: string[] = ["Tutorials", "Reviews", "News", "Tips & Tricks"];

  constructor(private feedService: FeedserviceService) {}
  @ViewChild('filterBar') filterBar!: ElementRef;

  ngOnInit(): void {
    this.getFilters(); // Initial filter setup
  }

  // ngAfterViewInit(): void {
  //   document.addEventListener('click', (event) => {
  //     if (!this.filterBar?.nativeElement?.contains(event?.target)) {
  //       this.showFilters = false;
  //     }
  //   });
  // }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Unified getFilters() call to avoid multiple redundant calls
  getFilters(): void {
    const filters = {
      category: this.selectedTechnology,
      skillLevel: this.selectedSkillLevel,
      contentType: this.selectedContentType,
      maxDuration: this.maxDuration,
    };
    this.feedService.setFilter(filters);
  }

  selectTechnology(tech: string): void {
    this.selectedTechnology = tech;
    this.getFilters();
  }

  selectSkillLevel(level: "beginner" | "intermediate" | "advanced"): void {
    this.selectedSkillLevel = level;
    this.getFilters();
  }

  selectContentType(type: string): void {
    this.selectedContentType = type;
    this.getFilters();
  }

  updateDuration(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.maxDuration = Number(target.value);
    this.getFilters();
  }

  formatNumber(num: number): string {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();
  }
}
