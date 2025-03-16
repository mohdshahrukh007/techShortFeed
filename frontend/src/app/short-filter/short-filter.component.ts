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
    // Don't call getFilters() initially
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // Call filters only on change
  selectTechnology(tech: string): void {
    if (this.selectedTechnology !== tech) {
      this.selectedTechnology = tech;
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

  updateDuration(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newDuration = Number(target.value);
    if (this.maxDuration !== newDuration) {
      this.maxDuration = newDuration;
      this.getFilters();
    }
  }

  // Unified getFilters() call to avoid multiple redundant calls
  getFilters(): void {
    const filters = {
      category: this.selectedTechnology,
      skillLevel: this.selectedSkillLevel,
      contentType: this.selectedContentType,
      maxDuration: this.maxDuration,
    };
    //make proper string 
    const filterString = `Category: ${filters.category}, Skill Level: ${filters.skillLevel}, Content Type: ${filters.contentType}, Max Duration: ${filters.maxDuration}`;
    localStorage.setItem("userFilters", JSON.stringify(filterString));
    this.feedService.setFilter(filters);
  }

  formatNumber(num: number): string {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();
  }
}
