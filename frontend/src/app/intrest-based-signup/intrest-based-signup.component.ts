import { Component, OnInit } from "@angular/core";
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
export class IntrestBasedSignupComponent implements OnInit {
  selectedInterests: string[] = [];
  activeFilter: string = "all";
  filteredInterests: Interest[] = [];
  dynamicFilters: string[] = [];
  interests: Interest[] = [
    // Development category
    { name: "Frontend", category: "dev", icon: "fas fa-code" },
    { name: "Mobile Dev", category: "dev", icon: "fas fa-mobile-alt" },
    { name: "Game Dev", category: "dev", icon: "fas fa-gamepad" },
    { name: "Backend", category: "dev", icon: "fas fa-server" },
    { name: "DevOps", category: "dev", icon: "fas fa-sync-alt" },
  
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
    // { name: "AR/VR", category: "emerging", icon: "fas fa-vr-cardboard" },
    { name: "Blockchain", category: "emerging", icon: "fas fa-link" },
    { name: "IoT", category: "emerging", icon: "fas fa-network-wired" },
    // { name: "Robotics", category: "emerging", icon: "fas fa-robot" },
    // { name: "Quantum Computing", category: "emerging", icon: "fas fa-atom" },
    { name: "Cloud", category: "emerging", icon: "fas fa-cloud" },
    { name: "Cybersecurity", category: "emerging", icon: "fas fa-shield-alt" },
    // { name: "5G", category: "emerging", icon: "fas fa-broadcast-tower" },
    { name: "Edge Computing", category: "emerging", icon: "fas fa-microchip" },
  
    // ✅ New Interests
    { name: "Interview Preparation", category: "additional", icon: "fas fa-comments" },
    { name: "Tips & Tricks", category: "additional", icon: "fas fa-lightbulb" },
    { name: "Optimization Techniques", category: "additional", icon: "fas fa-chart-line" },
  ];
  
  constructor(private router: Router, private feedserviceService: FeedserviceService) {}

  ngOnInit(): void {
    this.filterInterests("all");
  }

  filterInterests(category: string): void {
    this.activeFilter = category;
    this.filteredInterests = category === "all"
      ? this.interests
      : this.interests.filter(interest => interest.category === category);
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.includes(interest)) {
      this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
    } else {
      this.selectedInterests.push(interest);
    }
    // this.generateDynamicFilters();
  }

  // generateDynamicFilters(): void {
  //   // const relatedFilters:any = {
  //   //   "Frontend": ["JavaScript", "TypeScript", "Web Development", "App Development", "AI", "UI/UX"],
  //   //   "Backend": ["Node.js", "Databases", "API Development", "Security", "Performance Optimization"],
  //   //   "DevOps": ["CI/CD", "Containerization", "Cloud Services", "Monitoring", "Automation"],
  //   //   "AI": ["Machine Learning", "Data Science", "Neural Networks", "NLP", "Computer Vision"],
  //   //   "Interview Preparation": ["Common Questions", "Coding Challenges", "System Design", "Behavioral Questions"],
  //   //   "Tips & Tricks": ["Best Practices", "Code Snippets", "Productivity Hacks", "Debugging Techniques"],
  //   //   "Optimization Techniques": ["Performance Tuning", "Memory Management", "Efficient Algorithms", "Scalability Strategies"]
  //   // };

  //   this.dynamicFilters = [];
  //   // this.selectedInterests.forEach(interest => {
  //   //   // if (relatedFilters[interest]) {
  //   //   //   this.dynamicFilters.push(...relatedFilters[interest]);
  //   //   // }
  //   // });

  //   // Remove duplicates
  //   this.dynamicFilters = [...new Set(this.dynamicFilters)];
  // }
  createAccount(): void {
    localStorage.clear();
    if (this.selectedInterests.length >= 1) {
      let interestsString = this.selectedInterests.join(" & ");
      // const dynamicFiltersString = this.dynamicFilters.join(" & ");
  
      // this.feedserviceService.setFilter({
      //   interests: interestsString,
      //   // dynamicFilters: dynamicFiltersString
      // });
      this.feedserviceService.setFilter(interestsString);
      // localStorage.setItem("filters", JSON.stringify(interestsString));
      // localStorage.setItem("dynamicFilters", JSON.stringify(dynamicFiltersString));
   
      localStorage.setItem("filters", interestsString);
      this.router.navigate(["/reel"]);
    } else {
      alert("Please select at least 1 interest to continue");
    }
  }
  
}