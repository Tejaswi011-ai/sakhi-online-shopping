// js/recommendations.js

// 1. Complete Your Look
let currentBundle = [];
let bundleMainProduct = null;

function completeLook(mainId) {
    bundleMainProduct = getProductById(mainId);
    if(!bundleMainProduct) return;
    
    currentBundle = [];
    
    // Find matching accessories (basic logic: if dress, suggest jewelry)
    let accessories = [];
    if (bundleMainProduct.category !== 'jewelry') {
        accessories = products.filter(p => p.category === 'jewelry');
    } else {
        accessories = products.filter(p => p.category === 'saree' || p.category === 'lehenga'); // reverse look
    }
    
    let html = '';
    let total = bundleMainProduct.price;
    
    accessories.slice(0, 3).forEach(acc => {
        currentBundle.push(acc);
        total += acc.price;
        html += `
            <div class="similar-product" style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                <img src="${acc.img}" alt="${acc.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                <div>
                    <h4 style="margin:0;">${acc.name}</h4>
                    <p style="margin:0; color:#b50042;">₹${acc.price}</p>
                </div>
            </div>
        `;
    });
    
    document.getElementById('main-product-name').innerText = `Main Item: ${bundleMainProduct.name} (₹${bundleMainProduct.price})`;
    document.getElementById('matching-items').innerHTML = html;
    document.getElementById('bundle-total').innerText = `Total Complete Look: ₹${total}`;
    
    document.getElementById('complete-look-modal').style.display = 'flex';
}

function closeCompleteLookModal() {
    document.getElementById('complete-look-modal').style.display = 'none';
}

function addBundleToCart() {
    addToCart(bundleMainProduct.name, bundleMainProduct.price, bundleMainProduct.img);
    currentBundle.forEach(item => {
        addToCart(item.name, item.price, item.img);
    });
    alert("Complete Look added to cart successfully!");
    closeCompleteLookModal();
}

// 2. Find My Size
function openSizeModal() {
    document.getElementById('size-modal').style.display = 'flex';
}

function closeSizeModal() {
    document.getElementById('size-modal').style.display = 'none';
    document.getElementById('size-result').style.display = 'none';
}

function calculateSize(e) {
    e.preventDefault();
    const height = parseInt(document.getElementById('size-height').value);
    const weight = parseInt(document.getElementById('size-weight').value);
    
    let recommended = "M";
    if (weight < 50) recommended = "S";
    else if (weight > 70) recommended = "L";
    else if (weight > 85) recommended = "XL";

    const resultDiv = document.getElementById('size-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3 style="color:#b50042;">Recommended Size: ${recommended}</h3>
        <p style="font-size:12px;">Based on the measurements you entered, ${recommended} is the best fit.</p>
    `;
}

// 3. Tracking & Recommendations (localStorage)
function trackViewedProduct(id) {
    let viewed = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    viewed = viewed.filter(v => v !== id); // remove if exists
    viewed.unshift(id); // add to front
    if(viewed.length > 10) viewed.pop(); // keep last 10
    localStorage.setItem('viewedProducts', JSON.stringify(viewed));
}

function renderTrending(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    // Mock trending logic (sort by reviews for now)
    const trending = [...products].sort((a,b) => b.reviews - a.reviews).slice(0, 4);
    
    let html = '';
    trending.forEach(p => {
        html += createProductCardHtml(p);
    });
    container.innerHTML = html;
}

function renderRecommended(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    
    // If user has viewed products, show similar category. Otherwise, random.
    let viewed = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    let recs = [];
    
    if(viewed.length > 0 && products.length > 0) {
        const lastViewed = getProductById(viewed[0]);
        if(lastViewed) {
             recs = products.filter(p => p.category === lastViewed.category && p.id !== lastViewed.id);
        }
    }
    
    // Fallback if not enough recs
    if(recs.length < 4) {
        const extra = [...products].sort(() => 0.5 - Math.random());
        recs = [...new Set([...recs, ...extra])].slice(0, 4);
    }
    
    let html = '';
    recs.forEach(p => {
        html += createProductCardHtml(p);
    });
    container.innerHTML = html;
}

// Helper for generating standard product cards
function createProductCardHtml(p) {
    return `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-details">
                <h3>${p.name}</h3>
                <div class="price-container">
                     <a href="product-details.html?id=${p.id}" class="btn-outline">View Product</a>
                    <p class="price">₹${p.price}</p>
                </div>
            </div>
        </div>
    `;
}
