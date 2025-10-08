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

        const avatarContent = isUser ? 'U' : '<img src="static/sutrastores_logo.jpg" alt="AI" class="bot-avatar-image">';

        // Check if text is Arabic to add rtl-content class
        if (/[؀-ۿ]/.test(text)) {
            messageDiv.classList.add('rtl-content');
        }

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
        
        // فحص إذا كان النص يحتوي على منتجات
        const hasProducts = /Product #\d+:/.test(text);
        
        if (hasProducts) {
            // استخراج المنتجات
            const products = this.parseProductsToCards(text);
            
            if (products.length > 0) {
                // استخراج النص التمهيدي (قبل أول منتج)
                const introText = text.split(/Product #\d+:/)[0].trim();
                
                if (introText) {
                    const introParsed = marked.parse(introText);
                    const introDiv = document.createElement('div');
                    introDiv.innerHTML = introParsed;
                    textContainer.appendChild(introDiv);
                }
                
                // إنشاء container للـ cards
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'products-cards-container';
                
                // إضافة كل منتج كـ card
                products.forEach(product => {
                    const card = this.createProductCard(product);
                    cardsContainer.appendChild(card);
                });
                
                textContainer.appendChild(cardsContainer);
                this.scrollToBottom();
                return messageDiv;
            }
        }
        
        // إذا لم يكن هناك منتجات، استخدم الطريقة القديمة
        const imageRegex = /(images\\?.*?\.jpg|^Image$)/gi;
        let tempText = text.replace(/sutra_/g, '');



        const imageMatches = [];
        let match;
        while ((match = imageRegex.exec(text)) !== null) {
            imageMatches.push(match[1]);
            tempText = tempText.replace(match[1], '');
        }
        
        const parsedHtml = marked.parse(tempText);
        
        if (imageMatches.length > 0) {
            textContainer.innerHTML = parsedHtml;
            this.addProductImagesFromList(textContainer, imageMatches);
            this.scrollToBottom();
        } else {
            this.streamText(textContainer, parsedHtml, () => {
                this.scrollToBottom();
            });
        }
        
        return messageDiv;
    }

    addBotMessageWithImages(text, imageMatches) {
        const messageDiv = this.addMessage('', false);
        const textContainer = messageDiv.querySelector('.message-text');
        
        // Parse markdown first, removing image placeholders if they were in the text
        let tempText = text;
        const regex = /images\\?.*?\.jpg/gi; 
        tempText = tempText.replace(regex, '');

        const parsedHtml = marked.parse(tempText);
        
        // For messages with explicit images, display text instantly then add images
        textContainer.innerHTML = parsedHtml;
        if (imageMatches && imageMatches.length > 0) {
            this.addProductImagesFromList(textContainer, imageMatches);
        }
        this.scrollToBottom();
        
        return messageDiv;
    }

    parseProductsToCards(text) {
        // استخراج المنتجات من النص
        const productPattern = /Product #(\d+):\s*Name:\s*([^\n]+)\s*Price:\s*([^\n]+)\s*Description:\s*([^\n]+)\s*Image:\s*([^\n]+)/gi;
        const products = [];
        let match;
        
        while ((match = productPattern.exec(text)) !== null) {
            products.push({
                number: match[1],
                name: match[2].trim(),
                price: match[3].trim(),
                description: match[4].trim(),
                image: match[5].trim().replace(/\\/g, '/')
            });
        }
        
        return products;
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-card-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-card-image" 
                        onerror="this.parentElement.innerHTML='<div class=\\'image-error\\'>الصورة غير متوفرة</div>'">
                </div>
            </div>
        `;
        
        // إضافة حدث النقر لعرض الصورة بحجم أكبر
        const img = card.querySelector('.product-card-image');
        if (img) {
            img.addEventListener('click', () => {
                this.showImageModal(product.image);
            });
        }
        
        return card;
    }    
    addProductImagesFromList(container, imageMatches) {
        console.log('Adding images from list:', imageMatches);
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-images';
        imageContainer.style.cssText = ``; // Styles moved to CSS file
        
        // Add each image
        imageMatches.forEach(imagePath => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'product-image';
            imageDiv.style.cssText = ``; // Styles moved to CSS file
            
            const img = document.createElement('img');
            // The imagePath should already be in the format /images/filename.jpg
            const imageUrl = imagePath.replace(/\\/g, '/'); // Normalize backslashes to forward slashes
            img.src = imageUrl;
            
            console.log(`Loading image: ${imagePath} -> ${imageUrl}`);
            
            img.style.cssText = ``; // Styles moved to CSS file
            
            // Add success handler for images
            img.onload = function() {
                console.log('Image loaded successfully:', imageUrl);
            };
            
            // Add error handling for images
            img.onerror = function() {
                console.log('Image failed to load:', imagePath, 'URL:', imageUrl);
                imageDiv.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: var(--text-secondary);
                        font-size: 12px;
                        text-align: center;
                        padding: 5px;
                    ">
                        Sorry, AI made a mistake.
                    </div>
                `;
                imageDiv.style.borderColor = 'var(--text-placeholder)';
            };
            
            
            // Add click to view larger
            imageDiv.addEventListener('click', () => {
                this.showImageModal(imageUrl);
            });
            
            imageDiv.appendChild(img);
            imageContainer.appendChild(imageDiv);
        });
        
        // Add the image container after the text
        container.appendChild(imageContainer);
    }

    addProductImages(container) {
        // This function is deprecated, use addProductImagesFromList instead
        console.warn('addProductImages is deprecated. Use addProductImagesFromList instead.');
    }

    showImageModal(imageSrc) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'image-modal'; // Apply CSS class
        
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-modal-content'; // Apply CSS class
        
        const img = document.createElement('img');
        img.src = imageSrc;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'image-modal-close'; // Apply CSS class
        closeBtn.innerHTML = '&times;'; // Use HTML entity for 'x'
        
        imageContainer.appendChild(img);
        imageContainer.appendChild(closeBtn);
        modal.appendChild(imageContainer);
        
        // Add to body
        document.body.appendChild(modal);
        
        // Close modal
        const closeModal = () => {
            // Remove event listener before removing modal to prevent memory leaks
            document.removeEventListener('keydown', handleKeyPress);
            document.body.removeChild(modal);
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Only close if clicking on the overlay itself
                closeModal();
            }
        });
        closeBtn.addEventListener('click', closeModal);
        
        // Close on escape key
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }

    addTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot typing-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar"><img src="static/sutrastores_logo.jpg" alt="AI" class="bot-avatar-image"></div>
                <div class="message-text bot-message-text">
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

    streamText(container, html, onCompleteCallback) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        container.classList.add('generating-text');
        container.innerHTML = '';
        
        let currentDelay = 0;
        const baseDelay = 10; // Reduced base delay for faster generation

        const processChildNodes = (parentNode, sourceNodes) => {
            sourceNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const words = text.split(/(\s+|\b|\u0600-\u06FF)/); // Split by spaces, word boundaries, and Arabic characters
                    
                    words.forEach((word) => {
                        if (word.trim() === '' && word !== ' ' && word !== '\n') return; // Skip empty strings, but keep spaces and newlines

                        setTimeout(() => {
                            const span = document.createElement('span');
                            span.className = 'token';
                            span.textContent = word;
                            parentNode.appendChild(span);
                            // Removed scrollToBottom here
                        }, currentDelay);
                        currentDelay += baseDelay; // Use base delay
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const clonedElement = node.cloneNode(false);
                    setTimeout(() => {
                        parentNode.appendChild(clonedElement);
                        // Removed scrollToBottom here
                        processChildNodes(clonedElement, Array.from(node.childNodes)); // Recursively process children
                    }, currentDelay);
                    // Estimate delay based on text content, or a minimum for elements
                    const textLength = node.textContent.split(/(\s+|\b|\u0600-\u06FF)/).filter(w => w.trim() !== '').length;
                    currentDelay += Math.max(textLength * baseDelay, 30); // Minimum delay for elements
                }
            });
        };

        processChildNodes(container, Array.from(tempDiv.childNodes));

        // Call onCompleteCallback after all processing is theoretically done
        setTimeout(() => {
            container.classList.remove('generating-text');
            if (onCompleteCallback) {
                onCompleteCallback();
            }
            // Call scrollToBottom once after the entire streaming is complete
            this.scrollToBottom();
        }, currentDelay); // Use the final currentDelay
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
                if (distance > 5) { // Reduced threshold for more frequent scrolling
                    this.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                }
            });
        }, 10); // Reduced throttle time for more responsive scrolling
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
                <textarea id="messageInputField" placeholder="أرسل رسالة..." rows="1"></textarea>
                <button id="sendButton" type="button" disabled>
                    <svg viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        this.input = this.querySelector('#messageInputField');
        this.button = this.querySelector('#sendButton');
        this.setupEvents();
        this.updateSendButton(); // Initial state for button
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
        this.input.style.height = Math.min(this.input.scrollHeight, 200) + 'px'; // Max height 200px
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
        this.spinner = this.thinkingBox.querySelector('.spinner');
        this.skeletonLines = this.thinkingBox.querySelectorAll('.skeleton-line');
    }

    show(message) {
        // Handle RTL text
        if (/[؀-ۿ]/.test(message)) {
            this.thinkingBox.style.direction = 'rtl';
            this.thinkingText.style.direction = 'rtl';
        } else {
            this.thinkingBox.style.direction = 'ltr';
            this.thinkingText.style.direction = 'ltr';
        }

        this.thinkingText.textContent = message;
        this.thinkingBox.style.display = 'flex'; // Use flex for centering
        this.thinkingBox.classList.remove('hidden');

        this.spinner.style.display = 'block'; // Show spinner
        this.skeletonLines.forEach(line => {
            line.style.display = 'block';
        });
    }

    hide() {
        this.thinkingBox.classList.add('hidden');
        setTimeout(() => {
            this.thinkingBox.style.display = 'none';
            this.thinkingBox.classList.remove('hidden'); // Reset for next show
        }, 300);

        this.spinner.style.display = 'none'; // Hide spinner
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
                
                // Check if response contains images and add them immediately
                const imageRegex = /sutr-images\\?.*?\.jpg/gi;
                const imageMatches = response.message.match(imageRegex);
                
                if (imageMatches && imageMatches.length > 0) {
                    console.log('Found images in response:', imageMatches);
                    // Add message with images
                    this.messagesArea.addBotMessageWithImages(response.message, imageMatches);
                } else {
                    // Add normal message
                    this.messagesArea.addBotMessageMarkdown(response.message);
                }
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
            this.thinkingBoxManager.hide(); // Hide thinking box on error
        });
    }

    setupEvents() {
        document.addEventListener('message-send', (e) => {
            this.handleUserMessage(e.detail.message);
        });

        if (this.whoAreYouButton) {
            this.whoAreYouButton.addEventListener('click', () => {
                this.handleUserMessage('سعر التيشيرت المكتوب عليه فلسطين وعايز تيشيرت كمان احمر مثلا');
            });
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
                this.messagesArea.addBotMessageMarkdown(
                    `<div dir="rtl" style="text-align: right; margin-bottom: 10px;">
                        أهلاً بيك في سُترة! ❤️<br>
                        عندنا كولكشنز كتير <br> تيشيرتات، قمصان، جينز، عطور! 😉<br>
                        تقدر توصف شكل أو ستايل بتحبه<br> وأنا هختارلك الأنسب ليك مع الصور عشان تشوفها 🛍️
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

