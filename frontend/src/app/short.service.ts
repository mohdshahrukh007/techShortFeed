import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { environment } from "src/environment/environment";
@Injectable({
  providedIn: "root",
})
export class ShortService {
  private twitterUrl =""
  private ytUrl ='http://localhost:3000'+"/api/shorts?query=";

  constructor(private http: HttpClient) {}

  // Get Twitter Shorts
  getTwitterShort(query: string) {
    return this.http.get(`${this.twitterUrl}${encodeURIComponent(query)}`).pipe(
      map((response: any) => {
        // ✅ Process response (if needed)
        return response;
      }),
      catchError(this.handleError) // Handle error
    );
  }
  // Get YouTube Shorts
  getYoutubeShort(query: string) {
    return this.http.get(`${this.ytUrl}${encodeURIComponent(query)}`, { observe: 'response' }).pipe(
      map((response: any) => {
        return {
          status: response.status,
          body: response.body
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
