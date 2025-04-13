import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError, of, Observable } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
  providedIn: "root",
})
export class ShortService {
  private redditUrl = environment.apiUrl + "/api/reddit?query=";
  private ytUrl = environment.apiUrl + "/api/shorts?query=";
  randomKeywords = [
    "tech",
    "javascript",
    "react",
    "funny",
    "life",
    "startup",
    "design",
    "ai",
  ];
  constructor(private http: HttpClient) {}
 
  getRedditShort(query: string):Observable<any> {
    return this.http.get('https://www.reddit.com/r/videos/hot.json?limit=10')
    // return this.http.get(`${this.redditUrl}${encodeURIComponent(query)}`)
  }
  // Get YouTube Shorts
  getYoutubeShort(query: string) {
    return this.http
      .get(`${this.ytUrl}${encodeURIComponent(query)}`, { observe: "response" })
      .pipe(
        map((response: any) => {
          return {
            status: response.status,
            body: response.body,
          };
        }),
        catchError(this.handleError) // Handle error
      );
  }

  // ✅ Error Handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error occurred";
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
