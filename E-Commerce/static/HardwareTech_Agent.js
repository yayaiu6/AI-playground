// Messages Area Component
class MessagesArea extends HTMLElement {
    constructor() {
        super();
        this.messages = [];
        this.innerHTML = '<div id="messages"></div>';
        this.messagesContainer = this.querySelector('#messages');
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        const avatarContent = isUser ? 'U' : '<img src="static/hardwareTech_logo.jpg" alt="AI" class="bot-avatar-image">';

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar">${avatarContent}</div>
                <div class="message-text">${text}</div>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    addBotMessageMarkdown(text) {
        const messageDiv = this.addMessage('', false);
        const textContainer = messageDiv.querySelector('.message-text');
        
        // Parse markdown first
        const parsedHtml = marked.parse(text);
        
        // Add text with streaming effect
        this.streamText(textContainer, parsedHtml);
        
        return messageDiv;
    }

    addTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot typing-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar"><img src="static/hardwareTech_logo.jpg" alt="AI" class="bot-avatar-image"></div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    removeTypingIndicator() {
        const typingMessage = this.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    streamText(container, html) {
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Add generating class for cursor effect
        container.classList.add('generating-text');
        
        // Clear container first to prevent layout shifts
        container.innerHTML = '';
        
        // Get all text nodes and elements
        this.processNode(container, tempDiv, 0, () => {
            // Remove generating class when done
            container.classList.remove('generating-text');
            // Final scroll to ensure we're at the bottom
            this.scrollToBottom();
        });
    }

    processNode(targetContainer, sourceNode, delay, onComplete) {
        let currentDelay = delay;
        const childNodes = Array.from(sourceNode.childNodes);
        let processedNodes = 0;
        let scrollThrottle = 0;

        if (childNodes.length === 0) {
            onComplete();
            return;
        }

        childNodes.forEach((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const words = text.split(/(\s+)/); // Split by spaces but keep them
                
                words.forEach((word, wordIndex) => {
                    setTimeout(() => {
                        const span = document.createElement('span');
                        span.className = 'token';
                        span.textContent = word;
                        span.style.animationDelay = '0s';
                        targetContainer.appendChild(span);
                        
                        // Throttle scrolling to reduce jitter
                        scrollThrottle++;
                        if (scrollThrottle % 3 === 0) {
                            this.scrollToBottom();
                        }
                    }, currentDelay);
                    currentDelay += 15; // Slightly increased delay for smoother effect
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Clone the element
                const clonedElement = node.cloneNode(false);
                
                setTimeout(() => {
                    targetContainer.appendChild(clonedElement);
                    
                    // Process children of this element
                    this.processNode(clonedElement, node, 0, () => {});
                    this.scrollToBottom();
                }, currentDelay);
                
                // Estimate delay based on text content
                const textLength = node.textContent.split(/\s+/).length;
                currentDelay += textLength * 15;
            }

            processedNodes++;
            if (processedNodes === childNodes.length) {
                setTimeout(() => {
                    onComplete();
                    this.scrollToBottom();
                }, currentDelay);
            }
        });
    }

    scrollToBottom() {
        // Use smooth scrolling with throttling to prevent jitter
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                const targetScroll = this.scrollHeight - this.clientHeight;
                const currentScroll = this.scrollTop;
                const distance = targetScroll - currentScroll;
                
                // Only scroll if there's a significant distance to avoid jitter
                if (Math.abs(distance) > 5) {
                    this.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
        }, 10);
    }

    clear() {
        this.messagesContainer.innerHTML = '';
    }
}

// Message Input Component
class MessageInput extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="input-container">
                <textarea id="messageInputField" placeholder="Send a message..." rows="1"></textarea>
                <button id="sendButton" type="button">
                    <svg viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        this.input = this.querySelector('#messageInputField');
        this.button = this.querySelector('#sendButton');
        this.setupEvents();
    }

    setupEvents() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.input.addEventListener('input', () => {
            this.autoResize();
            this.updateSendButton();
        });

        this.button.addEventListener('click', () => this.sendMessage());
    }

    autoResize() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 200) + 'px';
    }

    updateSendButton() {
        this.button.disabled = !this.input.value.trim();
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (message) {
            this.dispatchEvent(new CustomEvent('message-send', {
                detail: { message },
                bubbles: true
            }));
            this.resetInput();
        }
    }

    resetInput() {
        this.input.value = '';
        this.input.style.height = 'auto';
        this.updateSendButton();
        this.input.focus();
    }

    focus() {
        this.input.focus();
    }
}

// Thinking Box Manager
class ThinkingBoxManager {
    constructor() {
        this.thinkingBox = document.getElementById('thinkingBox');
        this.thinkingText = this.thinkingBox.querySelector('.thinking-box-text');
        this.skeletonLines = this.thinkingBox.querySelectorAll('.skeleton-line');
    }

    show(message) {
        // Handle RTL text
        if (/[\u0600-\u06FF]/.test(message)) {
            this.thinkingBox.style.direction = 'rtl';
            this.thinkingText.style.direction = 'rtl';
        } else {
            this.thinkingBox.style.direction = 'ltr';
            this.thinkingText.style.direction = 'ltr';
        }

        this.thinkingText.textContent = message;
        this.thinkingBox.style.display = 'block';
        this.thinkingBox.classList.remove('hidden');

        this.skeletonLines.forEach(line => {
            line.style.display = 'block';
        });
    }

    hide() {
        this.thinkingBox.classList.add('hidden');
        setTimeout(() => {
            this.thinkingBox.style.display = 'none';
            this.thinkingBox.classList.remove('hidden');
        }, 300);

        this.skeletonLines.forEach(line => {
            line.style.display = 'none';
        });
    }
}

const socket = io();

// Chat Controller
class ChatController {
    constructor() {
        this.messagesArea = document.querySelector('messages-area');
        this.messageInput = document.querySelector('message-input');
        this.whoAreYouButton = document.querySelector('.who-are-you-button');
        this.initialActions = document.querySelector('.initial-actions');
        this.thinkingBoxManager = new ThinkingBoxManager();

        this.setupSocketEvents();
        this.setupEvents();
        this.showWelcomeMessage();
    }

    setupSocketEvents() {
        socket.on('backend_response', (data) => {
            const response = JSON.parse(data);
            if (response.type === 'thinkingbox') {
                this.thinkingBoxManager.show(response.message);
            } else {
                this.thinkingBoxManager.hide();
                this.messagesArea.removeTypingIndicator();
                this.messagesArea.addBotMessageMarkdown(response.message);
            }
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.messagesArea.removeTypingIndicator();
        });
    }

    setupEvents() {
        document.addEventListener('message-send', (e) => {
            this.handleUserMessage(e.detail.message);
        });

        if (this.whoAreYouButton) {
            this.whoAreYouButton.addEventListener('click', () => {
                this.handleUserMessage('كنت عايز لابتوب متوسط للألعاب');
            });
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
                this.messagesArea.addBotMessageMarkdown(
                    `<div dir="rtl" style="text-align: right;">
                        اهلا بيك في متجر هاردوير تيك!❤️<br>
                        أسأل عن أي قطعة هاردوير أو استفسار عندك، وأنا هنا عشان أساعدك وأرشحلك الأنسب .😉
                    </div>`
                );

        }, 500);
    }

    handleUserMessage(message) {
        this.messagesArea.addMessage(message, true);

        if (this.initialActions) {
            this.initialActions.style.display = 'none';
        }

        // Show typing indicator
        this.messagesArea.addTypingIndicator();

        socket.emit('message_from_frontend', { message });
    }
}

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('messages-area', MessagesArea);
    customElements.define('message-input', MessageInput);
    new ChatController();
});