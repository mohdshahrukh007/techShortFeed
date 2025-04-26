import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Hls from 'hls.js';

@Injectable({
  providedIn: "root",
})
export class FeedserviceService {
  private hls?: Hls;
  private filterObject = new BehaviorSubject<Record<string, any>>({});

  constructor() {}

  // ✅ Set value in filterObject
  setFilter(filter: any) {
    this.filterObject.next(filter);
  }

  // ✅ Get value from filterObject as Observable
  getFilter() {
    return this.filterObject.asObservable();
  }

  // ✅ Get current value (optional)
  getCurrentFilter(): Record<string, any> {
    return this.filterObject.getValue();
  }

  getHashtagsData(): any[] {
    return [
      {
        type: "Dev",
        hashtags: [
          "ChatGPT",
          "Midjourney",
          "DALLE",
          "Copilot",
          "AutoML",
          "AIApis",
          "LangChain",
          "VectorDBs",
          "PromptEngineering",
          "AIAgents",
          "SystemDesign",
          "DSA",
          "TopInterviewQuestions",
          "TechShorts",
          "ResumeTips",
          "BehavioralRounds",
          "CodingRounds",
          "MockInterviews",
          "CrackingTheCode",
          "TechCareerAdvice",
        ],
      },

      {
        type: "Frontend",
        hashtags: [
          "ChatGPT",
          "Midjourney",
          "DALLE",
          "Copilot",
          "AutoML",
          "AIApis",
          "LangChain",
          "VectorDBs",
          "PromptEngineering",
          "AIAgents",
          "SystemDesign",
          "DSA",
          "TopInterviewQuestions",
          "TechShorts",
          "ResumeTips",
          "BehavioralRounds",
          "CodingRounds",
          "MockInterviews",
          "CrackingTheCode",
          "TechCareerAdvice",
          "Coding",
          "Programming",
          "JavaScript",
          "TypeScript",
          "ReactJS",
          "Angular",
          "VueJS",
          "Frontend",
          "WebDevelopment",
          "CSS",
          "HTML",
        ],
      },
      {
        type: "Backend",
        hashtags: [
          "Coding",
          "Programming",
          "NodeJS",
          "Python",
          "Django",
          "Flask",
          "PHP",
          "Backend",
          "APIDevelopment",
          "Database",
          "CodingInterview",
          "Backend",
        ],
      },
      {
        type: "Fullstack",
        hashtags: [
          "Coding",
          "Programming",
          "JavaScript",
          "TypeScript",
          "NodeJS",
          "ReactJS",
          "Angular",
          "VueJS",
          "MongoDB",
          "ExpressJS",
          "FullStack",
          "CodeTips",
          "Fullstack",
        ],
      },
      {
        type: "Mobile",
        hashtags: [
          "Coding",
          "Programming",
          "Flutter",
          "ReactNative",
          "iOS",
          "Android",
          "Swift",
          "Kotlin",
          "MobileDevelopment",
          "AppDevelopment",
          "AppDevelopment",
        ],
      },
      {
        type: "Game Dev",
        hashtags: [
          "Coding",
          "Programming",
          "GameDevelopment",
          "Unity",
          "UnrealEngine",
          "GameDesign",
          "GameDev",
          "Gaming",
        ],
      },
      {
        type: "AI/ML",
        hashtags: [
          "Coding",
          "Programming",
          "Python",
          "AI",
          "MachineLearning",
          "DeepLearning",
          "TensorFlow",
          "PyTorch",
          "DataScience",
          "AI",
        ],
      },
      {
        type: "Data Science",
        hashtags: [
          "Coding",
          "Python",
          "R",
          "MachineLearning",
          "DataScience",
          "DeepLearning",
          "TensorFlow",
          "DataAnalysis",
          "Data",
          "BigData",
          "Analytics",
        ],
      },
      {
        type: "Big Data",
        hashtags: [
          "Data",
          "BigData",
          "Hadoop",
          "DataAnalysis",
          "DataMining",
          "DataEngineering",
        ],
      },
      {
        type: "Analytics",
        hashtags: [
          "Data",
          "Analytics",
          "BusinessIntelligence",
          "DataAnalysis",
          "DataDriven",
          "Visualization",
        ],
      },
      {
        type: "Computer Vision",
        hashtags: [
          "AI",
          "MachineLearning",
          "ComputerVision",
          "DeepLearning",
          "ImageProcessing",
          "OpenCV",
          "ObjectDetection",
        ],
      },
      {
        type: "NLP",
        hashtags: [
          "AI",
          "MachineLearning",
          "NLP",
          "NaturalLanguageProcessing",
          "LanguageModel",
          "TextProcessing",
          "SpeechRecognition",
        ],
      },
      {
        type: "UI/UX",
        hashtags: [
          "Design",
          "UX",
          "UI",
          "UIUX",
          "UserExperience",
          "Figma",
          "Sketch",
          "DesignTips",
          "CreativeDesign",
          "UI",
        ],
      },
      {
        type: "Graphic Design",
        hashtags: [
          "Design",
          "GraphicDesign",
          "Photoshop",
          "Illustrator",
          "LogoDesign",
          "CreativeDesign",
        ],
      },
      {
        type: "Product Design",
        hashtags: [
          "Design",
          "ProductDesign",
          "UX",
          "UserExperience",
          "Prototyping",
          "DesignThinking",
        ],
      },
      {
        type: "Prototyping",
        hashtags: [
          "Design",
          "Prototyping",
          "Figma",
          "Sketch",
          "UX",
          "Wireframe",
          "UserFlow",
        ],
      },
      {
        type: "Animation",
        hashtags: [
          "Design",
          "Animation",
          "MotionDesign",
          "AfterEffects",
          "CreativeDesign",
          "Graphics",
        ],
      },
      {
        type: "DevOps",
        hashtags: [
          "Coding",
          "Programming",
          "Docker",
          "Kubernetes",
          "AWS",
          "CI/CD",
          "CloudComputing",
          "DevOps",
          "InfrastructureAsCode",
        ],
      },
      {
        type: "Blockchain",
        hashtags: [
          "Blockchain",
          "Cryptocurrency",
          "Ethereum",
          "Bitcoin",
          "Decentralized",
          "SmartContracts",
          "Web3",
        ],
      },
      {
        type: "IoT",
        hashtags: [
          "IoT",
          "InternetOfThings",
          "SmartDevices",
          "EdgeComputing",
          "HomeAutomation",
        ],
      },
      {
        type: "Cloud",
        hashtags: [
          "Cloud",
          "AWS",
          "Azure",
          "GoogleCloud",
          "CloudComputing",
          "Infrastructure",
        ],
      },
      {
        type: "Cybersecurity",
        hashtags: [
          "Coding",
          "Programming",
          "CyberSecurity",
          "EthicalHacking",
          "PenetrationTesting",
          "MalwareAnalysis",
          "SecurityTips",
          "Security",
        ],
      },
      {
        type: "Edge Computing",
        hashtags: [
          "EdgeComputing",
          "IoT",
          "Cloud",
          "Decentralized",
          "Infrastructure",
        ],
      },
      {
        type: "Interview Preparation",
        hashtags: [
          "Coding",
          "InterviewPreparation",
          "CodingInterview",
          "TechnicalInterview",
          "DataStructures",
          "Algorithms",
          "BehavioralQuestions",
        ],
      },
      {
        type: "Tips & Tricks",
        hashtags: [
          "CodingTips",
          "ProgrammingHacks",
          "BestPractices",
          "Efficiency",
          "Coding",
        ],
      },
      {
        type: "Optimization Techniques",
        hashtags: [
          "Optimization",
          "Performance",
          "Coding",
          "Programming",
          "BestPractices",
          "AlgorithmOptimization",
          "CodeEfficiency",
        ],
      },
    ];
  }

  getHashtags(userType: string): string {
    let dev = this.getHashtagsData().find(
      (d) => d.type.toLowerCase() === userType.toLowerCase()
    );
    if (dev) {
        // Shuffle the hashtags array
        const shuffledHashtags = dev.hashtags.sort(() => Math.random() - 0.5);
        return shuffledHashtags.join(" | ");
    }
    return "";
}
  loadVideo(videoUrl:any,nativeElement: any): void {
    // Clean up previous instance if exists
    if (this.hls) {
      this.hls.destroy();
    }

    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(videoUrl);
      this.hls.attachMedia(nativeElement);
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js error:', data);
      });
    } else if (nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      nativeElement.src = videoUrl;
    } else {
      console.warn('HLS not supported in this browser');
    }
  }
}
