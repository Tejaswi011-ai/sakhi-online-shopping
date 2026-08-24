// js/products.js
const products = [
    { 
        id: 1, 
        name: "Banarasi Silk Saree", 
        price: 3499, 
        mainImage: "bana.webp",
        category: "saree",
        color: "red",
        occasion: "wedding",
        sizes: ["Free Size"],
        gallery: [
            "bana.webp",
            "bs.webp",
            "bss2.jpg",
            "bss4.webp",
            "bss5.jpg",
            "bss6.webp"
        ],
        rating: 4.5,
        reviews: 128
    },
    { 
        id: 2, 
        name: "New Season Cotton Kurti", 
        price: 1999, 
        mainImage: "n.jpg",
        category: "kurti",
        color: "yellow",
        occasion: "casual",
        sizes: ["S", "M", "L", "XL"],
        gallery: [
            "n.jpg"
        ],
        rating: 4.2,
        reviews: 85
    },
    { 
        id: 3, 
        name: "Bridal Lehenga", 
        price: 7999, 
        mainImage: "bridal.webp",
        category: "lehenga",
        color: "pink",
        occasion: "wedding",
        sizes: ["M", "L", "XL"],
        gallery: [
            "bridal.webp"
        ],
        rating: 4.8,
        reviews: 320
    },
    { 
        id: 4, 
        name: "Traditional Jewelry Set", 
        price: 1599, 
        mainImage: "tra.jpg",
        category: "jewelry",
        color: "gold",
        occasion: "wedding",
        sizes: ["Free Size"],
        gallery: [
            "tra.jpg"
        ],
        rating: 4.6,
        reviews: 210
    },
    { 
        id: 5, 
        name: "Gold Plated Earrings", 
        price: 499, 
        mainImage: "j3.jpg",
        category: "jewelry",
        color: "gold",
        occasion: "wedding",
        sizes: ["Free Size"],
        gallery: [
            "j3.jpg"
        ],
        rating: 4.3,
        reviews: 45
    },
    { 
        id: 6, 
        name: "Kundun Necklace", 
        price: 799, 
        mainImage: "j5.jpg",
        category: "jewelry",
        color: "gold",
        occasion: "wedding",
        sizes: ["Free Size"],
        gallery: [
            "j5.jpg"
        ],
        rating: 4.7,
        reviews: 156
    }
];

// Helper to get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}
