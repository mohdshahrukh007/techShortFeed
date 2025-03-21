import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FeedserviceService {
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

  getHashtagsData() {
    return [
      {
        type: "Frontend",
        hashtags: [
          "#Coding",
          "#Programming",
          "#JavaScript",
          "#TypeScript",
          "#ReactJS",
          "#Angular",
          "#VueJS",
          "#Frontend",
          "#WebDevelopment",
          "#CodeTips",
          "#CSS",
          "#HTML",
          "#Frontend",
        ],
      },
      {
        type: "Backend",
        hashtags: [
          "#Coding",
          "#Programming",
          "#NodeJS",
          "#Python",
          "#Django",
          "#Flask",
          "#PHP",
          "#Backend",
          "#APIDevelopment",
          "#Database",
          "#CodingInterview",
          "#Backend",
        ],
      },
      {
        type: "Fullstack",
        hashtags: [
          "#Coding",
          "#Programming",
          "#JavaScript",
          "#TypeScript",
          "#NodeJS",
          "#ReactJS",
          "#Angular",
          "#VueJS",
          "#MongoDB",
          "#ExpressJS",
          "#FullStack",
          "#CodeTips",
          "#Fullstack",
        ],
      },
      {
        type: "Mobile",
        hashtags: [
          "#Coding",
          "#Programming",
          "#Flutter",
          "#ReactNative",
          "#iOS",
          "#Android",
          "#Swift",
          "#Kotlin",
          "#MobileDevelopment",
          "#AppDevelopment",
          "#AppDevelopment",
        ],
      },
      {
        type: "Game Dev",
        hashtags: [
          "#Coding",
          "#Programming",
          "#GameDevelopment",
          "#Unity",
          "#UnrealEngine",
          "#GameDesign",
          "#GameDev",
          "#Gaming",
        ],
      },
      {
        type: "AI/ML",
        hashtags: [
          "#Coding",
          "#Programming",
          "#Python",
          "#AI",
          "#MachineLearning",
          "#DeepLearning",
          "#TensorFlow",
          "#PyTorch",
          "#DataScience",
          "#AI",
        ],
      },
      {
        type: "Data Science",
        hashtags: [
          "#Coding",
          "#Python",
          "#R",
          "#MachineLearning",
          "#DataScience",
          "#DeepLearning",
          "#TensorFlow",
          "#DataAnalysis",
          "#Data",
          "#BigData",
          "#Analytics",
        ],
      },
      {
        type: "Big Data",
        hashtags: [
          "#Data",
          "#BigData",
          "#Hadoop",
          "#DataAnalysis",
          "#DataMining",
          "#DataEngineering",
        ],
      },
      {
        type: "Analytics",
        hashtags: [
          "#Data",
          "#Analytics",
          "#BusinessIntelligence",
          "#DataAnalysis",
          "#DataDriven",
          "#Visualization",
        ],
      },
      {
        type: "Computer Vision",
        hashtags: [
          "#AI",
          "#MachineLearning",
          "#ComputerVision",
          "#DeepLearning",
          "#ImageProcessing",
          "#OpenCV",
          "#ObjectDetection",
        ],
      },
      {
        type: "NLP",
        hashtags: [
          "#AI",
          "#MachineLearning",
          "#NLP",
          "#NaturalLanguageProcessing",
          "#LanguageModel",
          "#TextProcessing",
          "#SpeechRecognition",
        ],
      },
      {
        type: "UI/UX",
        hashtags: [
          "#Design",
          "#UX",
          "#UI",
          "#UIUX",
          "#UserExperience",
          "#Figma",
          "#Sketch",
          "#DesignTips",
          "#CreativeDesign",
          "#UI",
        ],
      },
      {
        type: "Graphic Design",
        hashtags: [
          "#Design",
          "#GraphicDesign",
          "#Photoshop",
          "#Illustrator",
          "#LogoDesign",
          "#CreativeDesign",
        ],
      },
      {
        type: "Product Design",
        hashtags: [
          "#Design",
          "#ProductDesign",
          "#UX",
          "#UserExperience",
          "#Prototyping",
          "#DesignThinking",
        ],
      },
      {
        type: "Prototyping",
        hashtags: [
          "#Design",
          "#Prototyping",
          "#Figma",
          "#Sketch",
          "#UX",
          "#Wireframe",
          "#UserFlow",
        ],
      },
      {
        type: "Animation",
        hashtags: [
          "#Design",
          "#Animation",
          "#MotionDesign",
          "#AfterEffects",
          "#CreativeDesign",
          "#Graphics",
        ],
      },
      {
        type: "DevOps",
        hashtags: [
          "#Coding",
          "#Programming",
          "#Docker",
          "#Kubernetes",
          "#AWS",
          "#CI/CD",
          "#CloudComputing",
          "#DevOps",
          "#InfrastructureAsCode",
        ],
      },
      {
        type: "Blockchain",
        hashtags: [
          "#Blockchain",
          "#Cryptocurrency",
          "#Ethereum",
          "#Bitcoin",
          "#Decentralized",
          "#SmartContracts",
          "#Web3",
        ],
      },
      {
        type: "IoT",
        hashtags: [
          "#IoT",
          "#InternetOfThings",
          "#SmartDevices",
          "#EdgeComputing",
          "#HomeAutomation",
        ],
      },
      {
        type: "Cloud",
        hashtags: [
          "#Cloud",
          "#AWS",
          "#Azure",
          "#GoogleCloud",
          "#CloudComputing",
          "#Infrastructure",
        ],
      },
      {
        type: "Cybersecurity",
        hashtags: [
          "#Coding",
          "#Programming",
          "#CyberSecurity",
          "#EthicalHacking",
          "#PenetrationTesting",
          "#MalwareAnalysis",
          "#SecurityTips",
          "#Security",
        ],
      },
      {
        type: "Edge Computing",
        hashtags: [
          "#EdgeComputing",
          "#IoT",
          "#Cloud",
          "#Decentralized",
          "#Infrastructure",
        ],
      },
      {
        type: "Interview Preparation",
        hashtags: [
          "#Coding",
          "#InterviewPreparation",
          "#CodingInterview",
          "#TechnicalInterview",
          "#DataStructures",
          "#Algorithms",
          "#BehavioralQuestions",
        ],
      },
      {
        type: "Tips & Tricks",
        hashtags: [
          "#CodingTips",
          "#ProgrammingHacks",
          "#BestPractices",
          "#Efficiency",
          "#Coding",
        ],
      },
      {
        type: "Optimization Techniques",
        hashtags: [
          "#Optimization",
          "#Performance",
          "#Coding",
          "#Programming",
          "#BestPractices",
          "#AlgorithmOptimization",
          "#CodeEfficiency",
        ],
      },
    ];
  }
  getHashtags(userType: string): string {
    const dev = this.getHashtagsData().find(
      (d) => d.type.toLowerCase() === userType.toLowerCase()
    );
    return dev ? dev.hashtags.join(" | ") : "";
  }
}
