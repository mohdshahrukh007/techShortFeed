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
 
}
