import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FeedserviceService } from "../feedservice.service";

interface Interest {
  name: string;
  category: string;
  icon: string;
}

@Component({
  selector: "app-intrest-based-signup",
  templateUrl: "./intrest-based-signup.component.html",
  styleUrls: ["./intrest-based-signup.component.scss"],
})
export class IntrestBasedSignupComponent {
  selectedInterests: string[] = [];
  activeFilter: string = "all";
  filteredInterests: Interest[] = [];

  interests: Interest[] = [
    // Development category
    { name: "Web Dev", category: "dev", icon: "fas fa-code" },
    { name: "Mobile Dev", category: "dev", icon: "fas fa-mobile-alt" },
    { name: "Game Dev", category: "dev", icon: "fas fa-gamepad" },
    { name: "Frontend", category: "dev", icon: "fas fa-desktop" },
    { name: "Backend", category: "dev", icon: "fas fa-server" },
    { name: "DevOps", category: "dev", icon: "fas fa-sync-alt" },
    { name: "JavaScript", category: "dev", icon: "fab fa-js" },
    { name: "Python", category: "dev", icon: "fab fa-python" },
    { name: "Java", category: "dev", icon: "fab fa-java" },
    { name: "Spring", category: "dev", icon: "fab fa-java" },

    // Data category
    { name: "AI", category: "data", icon: "fas fa-brain" },
    { name: "Machine Learning", category: "data", icon: "fas fa-robot" },
    { name: "Data Science", category: "data", icon: "fas fa-chart-bar" },
    { name: "Big Data", category: "data", icon: "fas fa-database" },
    { name: "Analytics", category: "data", icon: "fas fa-chart-line" },
    { name: "Computer Vision", category: "data", icon: "fas fa-eye" },
    { name: "NLP", category: "data", icon: "fas fa-comment-alt" },

    // Design category
    { name: "UI/UX", category: "design", icon: "fas fa-pencil-ruler" },
    { name: "Graphic Design", category: "design", icon: "fas fa-pen-nib" },
    { name: "Product Design", category: "design", icon: "fas fa-object-group" },
    { name: "Prototyping", category: "design", icon: "fas fa-bezier-curve" },
    { name: "Animation", category: "design", icon: "fas fa-film" },

    // Emerging tech category
    { name: "AR/VR", category: "emerging", icon: "fas fa-vr-cardboard" },
    { name: "Blockchain", category: "emerging", icon: "fas fa-link" },
    { name: "IoT", category: "emerging", icon: "fas fa-network-wired" },
    { name: "Robotics", category: "emerging", icon: "fas fa-robot" },
    { name: "Quantum Computing", category: "emerging", icon: "fas fa-atom" },
    { name: "Cloud", category: "emerging", icon: "fas fa-cloud" },
    { name: "Cybersecurity", category: "emerging", icon: "fas fa-shield-alt" },
    { name: "5G", category: "emerging", icon: "fas fa-broadcast-tower" },
    { name: "Edge Computing", category: "emerging", icon: "fas fa-microchip" },
  ];
  constructor(private router: Router, private feedserviceService: FeedserviceService) {}

  ngOnInit(): void {
    this.filterInterests("all");
  }

  filterInterests(category: string): void {
    this.activeFilter = category;

    if (category === "all") {
      this.filteredInterests = this.interests;
    } else {
      this.filteredInterests = this.interests.filter(
        (interest) => interest.category === category
      );
    }
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.includes(interest)) {
      this.selectedInterests = this.selectedInterests.filter(
        (i) => i !== interest
      );
    } else {
      this.selectedInterests.push(interest);
    }
  }

  createAccount(): void {
    if (this.selectedInterests.length >= 1) {
      this.feedserviceService.setFilter({ interests: this.selectedInterests });
      // Navigate to next step or submit to backend
      this.router.navigate(["/reel"]);
    } else {
      alert("Please select at least 3 interests to continue");
      alert("Please select at least 3 interests to continue");
    }
  }
}
