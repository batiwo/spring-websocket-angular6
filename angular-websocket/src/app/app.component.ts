import { Component } from "@angular/core";
import { MessagingService } from "./services/messaging.service";
import { Message } from "@stomp/stompjs";
import { StompState } from "@stomp/ng2-stompjs";

const WEBSOCKET_URL = "ws://localhost:8080/socket";
const EXAMPLE_URL = "/topic/server-broadcaster";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private messagingService: MessagingService;

  messageHistory = [];
  state: string = "NOT CONNECTED";

  constructor() {
    // Instantiate a messagingService
    this.messagingService = new MessagingService(WEBSOCKET_URL, EXAMPLE_URL);

    // Subscribe to its stream (to listen on messages)
    this.messagingService.stream().subscribe((message: Message) => {
      this.messageHistory.unshift(message.body);
      console.log(message);
    });

    // Subscribe to its state (to know its connected or not)
    this.messagingService.state().subscribe((state: StompState) => {
      this.state = StompState[state];
    });
  }

  // Use this methods to send message back to server
  sendAction() {
    console.log("Sending message");
    this.messagingService.send("/server-receiver", {
      text: "This is cool",
      text2: "I'm so happy!"
    });
  }
}
