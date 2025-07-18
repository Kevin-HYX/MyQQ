class MyQQClient {
    constructor() {
        this.ws = null;
        this.username = null;
        this.currentLang = 'zh';
        this.translations = {
            zh: {
                title: 'MyQQ群聊天',
                online: '在线',
                placeholder: '输入消息...',
                send: '发送',
                welcome: '欢迎来到MyQQ群聊天室！',
                joined: '加入了群聊',
                left: '离开了群聊'
            },
            en: {
                title: 'MyQQ Group Chat',
                online: 'Online',
                placeholder: 'Type a message...',
                send: 'Send',
                welcome: 'Welcome to MyQQ Group Chat!',
                joined: 'joined the group',
                left: 'left the group'
            }
        };
        this.init();
    }

    init() {
        this.connect();
        this.setupEventListeners();
        this.applyLanguage();
    }

    applyLanguage() {
        const t = this.translations[this.currentLang];
        
        document.querySelector('[data-i18n="title"]').textContent = t.title;
        document.querySelector('[data-i18n="online"]').textContent = t.online;
        document.querySelector('[data-i18n="placeholder"]').placeholder = t.placeholder;
        document.querySelector('[data-i18n="send"]').textContent = t.send;
        
        // 更新欢迎消息
        const welcomeMsg = document.querySelector('.system-message');
        if (welcomeMsg) welcomeMsg.textContent = t.welcome;
    }

    switchLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.applyLanguage();
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
            case 'onlineCount':
                this.updateOnlineCount(data.count);
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
        
        // 判断消息是否是我方发送的
        const isOwnMessage = message.username === this.username;
        messageDiv.className = `message ${isOwnMessage ? 'own' : 'other'}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString(this.currentLang === 'zh' ? 'zh-CN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-username">${message.username}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${this.escapeHtml(message.message)}</div>
            </div>
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
        const langToggle = document.getElementById('langToggle');

        sendButton.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        input.addEventListener('input', () => {
            sendButton.disabled = !input.value.trim();
        });

        langToggle.addEventListener('click', () => this.switchLanguage());
    }

    updateOnlineCount(count) {
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