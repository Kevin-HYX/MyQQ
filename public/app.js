class MyQQClient {
    constructor() {
        this.ws = null;
        this.username = null;
        this.init();
    }

    init() {
        this.connect();
        this.setupEventListeners();
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('连接到服务器');
            this.updateConnectionStatus('已连接');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };

        this.ws.onclose = () => {
            console.log('连接已断开');
            this.updateConnectionStatus('已断开');
            setTimeout(() => this.connect(), 3000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            this.updateConnectionStatus('连接错误');
        };
    }

    handleMessage(data) {
        switch (data.type) {
            case 'history':
                this.loadHistory(data.messages);
                break;
            case 'join':
            case 'leave':
                this.addSystemMessage(data.message);
                break;
            case 'message':
                this.addMessage(data);
                break;
        }
    }

    loadHistory(messages) {
        messages.forEach(msg => {
            if (msg.type === 'message') {
                this.addMessage(msg, false);
            } else if (msg.type === 'join' || msg.type === 'leave') {
                this.addSystemMessage(msg.message);
            }
        });
    }

    addMessage(message, animate = true) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        const time = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-username">${message.username}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.escapeHtml(message.message)}</div>
        `;

        if (animate) {
            messageDiv.style.animation = 'fadeIn 0.3s ease-in';
        }

        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addSystemMessage(text) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        this.updateOnlineCount();
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ text: message }));
            input.value = '';
        }
    }

    setupEventListeners() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        sendButton.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        input.addEventListener('input', () => {
            sendButton.disabled = !input.value.trim();
        });
    }

    updateOnlineCount() {
        // 简单的在线人数显示，实际应用中可通过服务器推送
        const count = Math.floor(Math.random() * 10) + 1;
        document.getElementById('onlineCount').textContent = count;
    }

    updateConnectionStatus(status) {
        console.log('连接状态:', status);
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MyQQClient();
});