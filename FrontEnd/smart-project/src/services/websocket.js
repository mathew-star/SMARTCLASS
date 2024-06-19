class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(classId, userId) {
    const path = `ws://localhost:8000/ws/chat/${classId}/${userId}/`;
    this.socketRef = new WebSocket(path);

    this.socketRef.onopen = () => {
      console.log('WebSocket open');
    };

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = (e) => {
      console.error('WebSocket error', e);
    };

    this.socketRef.onclose = () => {
      console.log('WebSocket closed');
    };
  }

  disconnect() {
    if (this.socketRef) {
      this.socketRef.close();
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    if (this.callbacks['new_message']) {
      this.callbacks['new_message'](parsedData);
    }
  }

  addMessageListener(callback) {
    this.callbacks['new_message'] = callback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify(data));
    } catch (err) {
      console.log(err.message);
    }
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
