import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
declare var SockJS: any;
declare var Stomp: any;
declare var StompJs: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';
  private wsUrl = 'http://localhost:8080/ws';
  private stompClient: any;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  getUserNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }

  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unread`);
  }

  getUnreadCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-all-read`, {});
  }

  private initializeWebSocketConnection() {
    // Skip WebSocket initialization if SockJS is not available
    if (typeof SockJS === 'undefined') {
      console.warn('SockJS not available, skipping WebSocket connection');
      return;
    }
    
    const socket = new SockJS(this.wsUrl);
    
    // Use StompJs from CDN if available, fallback to Stomp
    const StompClient = (window as any).StompJs?.Client || Stomp;
    
    if (StompClient.over) {
      this.stompClient = StompClient.over(socket);
    } else {
      this.stompClient = new StompClient({
        webSocketFactory: () => socket
      });
    }
    
    const connectCallback = () => {
      const userId = this.getCurrentUserId();
      if (userId) {
        this.stompClient.subscribe(`/user/${userId}/queue/notifications`, (message: any) => {
          const notification = JSON.parse(message.body);
          this.addNotification(notification);
        });
      }
    };
    
    if (this.stompClient.connect) {
      this.stompClient.connect({}, connectCallback);
    } else {
      this.stompClient.activate();
      this.stompClient.onConnect = connectCallback;
    }
  }

  private addNotification(notification: any) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
  }

  private getCurrentUserId(): string | null {
    // Get user ID from token or localStorage
    return localStorage.getItem('userId');
  }
}