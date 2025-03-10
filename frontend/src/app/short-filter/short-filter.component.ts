import { Component, OnInit } from "@angular/core";
import { FeedserviceService } from "../feedservice.service";

interface TechVideo {
  id: number;
  title: string;
  creator: string;
  creatorAvatar: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  techTags: string[];
  likes: number;
  dislikes: number;
  comments: number;
  thumbnailUrl: string;
}

@Component({
  selector: "app-short-filter",
  templateUrl: "./short-filter.component.html",
  styleUrls: ["./short-filter.component.scss"],
})
export class ShortFilterComponent implements OnInit {
  videos: any[] = [];
  filteredVideos: any[] = [];
  showFilters: boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
  // Filter state
  selectedTechnology: string = "Web Dev";
  selectedSkillLevel: string = "beginner";
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
  skillLevels: string[] = ["beginner", "intermediate", "advanced"];
  contentTypes: string[] = ["Tutorials", "Reviews", "News", "Tips & Tricks"];

  constructor(private feedService: FeedserviceService) {}
  trackByFn(index: number, video: any): string {
    return video.id;
  }
  ngOnInit(): void {
    this.feedService.setFilter({ category: "Tech", tag: "AI" });
  }
  selectTechnology(tech: string): void {
    this.selectedTechnology = tech;
    this.getFilters(); // 🔥 Call the filter method directly
  }
  getFilters() {
    const filters = {
      category: this.selectedTechnology,
      skillLevel: this.selectedSkillLevel,
      contentType: this.selectedContentType,
      maxDuration: this.maxDuration,
    };
    this.feedService.setFilter(filters);
  }

  selectSkillLevel(level: string): void {
    this.selectedSkillLevel = level as "beginner" | "intermediate" | "advanced";
    this.getFilters();
  }

  selectContentType(type: string): void {
    this.selectedContentType = type;
    this.getFilters();
  }

  updateDuration(event: any): void {
    this.maxDuration = event.target.value;
    this.getFilters();
  }

  // selectTechnology(tech: string): void {
  //   this.selectedTechnology = tech;
  //   this.feedService.setFilter({ category: "Tech", tag: "AI" });
  // }

  // selectSkillLevel(level: string): void {
  //   this.selectedSkillLevel = level as "beginner" | "intermediate" | "advanced";
  //   this.feedService.setFilter({ Level: this.selectedSkillLevel });
  // }

  // selectContentType(type: string): void {
  //   this.selectedContentType = type;
  //   this.feedService.setFilter({ ContentType: this.selectedContentType });
  // }

  // updateDuration(event: any): void {
  //   this.maxDuration = event.target.value;
  //   this.feedService.setFilter({ maxDuration: this.maxDuration });
  // }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }
}
