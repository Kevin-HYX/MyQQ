const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

let messages = [];
let users = new Map();

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
    console.log('新用户连接');
    
    const userId = Date.now().toString();
    const username = `用户${userId.slice(-4)}`;
    users.set(ws, { id: userId, username });
    
    ws.send(JSON.stringify({
        type: 'history',
        messages: messages
    }));
    
    const joinMessage = {
        type: 'join',
        username: username,
        message: `${username}加入了群聊`,
        timestamp: new Date().toISOString()
    };
    
    messages.push(joinMessage);
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(joinMessage));
        }
    });
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            const user = users.get(ws);
            
            const chatMessage = {
                type: 'message',
                username: user.username,
                message: message.text,
                timestamp: new Date().toISOString()
            };
            
            messages.push(chatMessage);
            
            if (messages.length > 100) {
                messages = messages.slice(-100);
            }
            
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(chatMessage));
                }
            });
        } catch (error) {
            console.error('消息解析错误:', error);
        }
    });
    
    ws.on('close', () => {
        const user = users.get(ws);
        if (user) {
            const leaveMessage = {
                type: 'leave',
                username: user.username,
                message: `${user.username}离开了群聊`,
                timestamp: new Date().toISOString()
            };
            
            messages.push(leaveMessage);
            
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(leaveMessage));
                }
            });
            
            users.delete(ws);
            console.log(`${user.username}断开连接`);
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket错误:', error);
    });
});

server.listen(PORT, () => {
    console.log(`MyQQ服务器运行在 http://localhost:${PORT}`);
});