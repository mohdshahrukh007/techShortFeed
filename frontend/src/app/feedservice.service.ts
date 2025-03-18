import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FeedserviceService {
  private filterObject = new BehaviorSubject<Record<string, any>>({});

  constructor() {}

  // ✅ Set value in filterObject
  setFilter(filter: Record<string, any>) {
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
      type: 'Frontend',
      hashtags: [
        '#Coding', '#Programming', '#JavaScript', '#TypeScript', '#ReactJS', '#Angular',
        '#VueJS', '#Frontend', '#WebDevelopment', '#CodeTips', '#CSS', '#HTML', '#Shorts'
      ]
    },
    {
      type: 'Backend',
      hashtags: [
        '#Coding', '#Programming', '#NodeJS', '#Python', '#Django', '#Flask', '#PHP', '#Backend',
        '#APIDevelopment', '#Database', '#CodingInterview', '#Shorts'
      ]
    },
    {
      type: 'Fullstack',
      hashtags: [
        '#Coding', '#Programming', '#JavaScript', '#TypeScript', '#NodeJS', '#ReactJS', '#Angular',
        '#VueJS', '#MongoDB', '#ExpressJS', '#FullStack', '#CodeTips', '#Shorts'
      ]
    },
    {
      type: 'Mobile',
      hashtags: [
        '#Coding', '#Programming', '#Flutter', '#ReactNative', '#iOS', '#Android',
        '#Swift', '#Kotlin', '#MobileDevelopment', '#AppDevelopment', '#Shorts'
      ]
    },
    {
      type: 'AI/ML',
      hashtags: [
        '#Coding', '#Programming', '#Python', '#AI', '#MachineLearning', '#DeepLearning',
        '#TensorFlow', '#PyTorch', '#DataScience', '#Shorts'
      ]
    },
    {
      type: 'UI/UX',
      hashtags: [
        '#Design', '#UX', '#UI', '#UIUX', '#UserExperience', '#Figma', '#Sketch',
        '#DesignTips', '#CreativeDesign', '#Shorts'
      ]
    },
    {
      type: 'Data Science',
      hashtags: [
        '#Coding', '#Python', '#R', '#MachineLearning', '#DataScience', '#DeepLearning',
        '#TensorFlow', '#DataAnalysis', '#Shorts'
      ]
    },
    {
      type: 'DevOps',
      hashtags: [
        '#Coding', '#Programming', '#Docker', '#Kubernetes', '#AWS', '#CI/CD', 
        '#CloudComputing', '#Shorts', '#InfrastructureAsCode'
      ]
    },
    {
      type: 'Security',
      hashtags: [
        '#Coding', '#Programming', '#CyberSecurity', '#EthicalHacking', '#PenetrationTesting',
        '#MalwareAnalysis', '#SecurityTips', '#Shorts'
      ]
    }
  ];
}
 getHashtags(userType: string): string {
  const dev = this.getHashtagsData().find(d => d.type.toLowerCase() === userType.toLowerCase());
  return dev ? dev.hashtags.join(' | ') : '';
}

}
