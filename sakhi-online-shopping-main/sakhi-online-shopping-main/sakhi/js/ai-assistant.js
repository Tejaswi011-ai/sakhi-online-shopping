// js/ai-assistant.js

// AI Fashion Assistant Logic
function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim().toLowerCase();
    if (!msg) return;

    const chatBody = document.getElementById('chat-body');
    
    // Add user message
    chatBody.innerHTML += `<div class="user-msg">${input.value}</div>`;
    input.value = '';

    // Simulate thinking delay
    setTimeout(() => {
        let response = "I couldn't find exactly what you're looking for, but here are some popular items!";
        let foundProducts = products; // Default to all

        // Expanded keyword matching for AI Stylist
        if (msg.includes("wedding") || msg.includes("bridal") || msg.includes("lehenga")) {
            foundProducts = products.filter(p => p.occasion === "wedding" || p.category === "lehenga");
            response = "For a wedding, these are our top recommendations:";
        } else if (msg.includes("saree") || msg.includes("banarasi")) {
            foundProducts = products.filter(p => p.category === "saree");
            response = "Here are some beautiful sarees for you:";
        } else if (msg.includes("college") || msg.includes("farewell")) {
            foundProducts = products.filter(p => p.category === "saree" || p.category === "kurti");
            response = "A stylish saree or a designer kurti is perfect for a farewell:";
        } else if (msg.includes("kurti") || msg.includes("casual")) {
            foundProducts = products.filter(p => p.category === "kurti" || p.occasion === "casual");
            response = "I found these amazing casual outfits:";
        } else if (msg.includes("jewelry") || msg.includes("jewellery") || msg.includes("earring")) {
            foundProducts = products.filter(p => p.category === "jewelry");
            response = "Complete your look with this stunning jewelry:";
        } else if (msg.includes("under")) {
            // Very basic price parsing mockup: "under 2000"
            const match = msg.match(/under (\d+)/);
            if (match && match[1]) {
                const limit = parseInt(match[1]);
                foundProducts = products.filter(p => p.price <= limit);
                response = `Here are some great options under ₹${limit}:`;
            }
        }

        // Generate response HTML
        let botHtml = `<div class="bot-msg">${response}</div>`;
        foundProducts.slice(0, 3).forEach(p => {
            botHtml += `
                <div class="chat-product" style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.img}" alt="${p.name}" style="width:50px; height:50px; object-fit:cover;">
                    <div>
                        <h4 style="font-size:12px; margin:0;">${p.name}</h4>
                        <p style="font-size:12px; margin:0;">₹${p.price}</p>
                        <button class="btn-outline" style="padding: 3px 6px; font-size:10px; border-radius:3px; margin-top:5px;" onclick="window.location.href='product-details.html?id=${p.id}'">View</button>
                    </div>
                </div>
            `;
        });

        chatBody.innerHTML += botHtml;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
}

// Image Search Logic
function openImageSearchModal() {
    document.getElementById('image-search-modal').style.display = 'flex';
}

function closeImageSearchModal() {
    document.getElementById('image-search-modal').style.display = 'none';
    document.getElementById('image-search-results').style.display = 'none';
    document.getElementById('image-upload').value = "";
}

function handleImageUpload(e) {
    if (e.target.files.length > 0) {
        const resultsDiv = document.getElementById('image-search-results');
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = "<h3>Scanning image...</h3>";
        
        // Simulate ML processing delay
        setTimeout(() => {
            let html = `<h3>✨ Similar Styles Found</h3>`;
            // Randomly select 2 products to mock visual search results
            let similar = products.sort(() => 0.5 - Math.random()).slice(0, 2);
            
            similar.forEach(p => {
                html += `
                    <div class="similar-product" style="display:flex; align-items:center; gap:10px; margin-bottom:10px; background:#f9f9f9; padding:10px; border-radius:8px;">
                        <img src="${p.img}" alt="${p.name}" style="width:60px; height:60px; object-fit:cover;">
                        <div>
                            <h4 style="margin:0;">${p.name}</h4>
                            <p style="margin:0; color:#b50042; font-weight:bold;">₹${p.price}</p>
                            <button class="btn-outline" style="padding: 5px 10px; font-size:12px; margin-top:5px;" onclick="window.location.href='product-details.html?id=${p.id}'">View Product</button>
                        </div>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        }, 2000);
    }
}
