// ==========================================================================
// Ikram Jewellers - Core Application Script
// Established since 1960
// ==========================================================================



// Catalog Details Database
let catalogItems = {
    "1": {
        id: "1",
        ref: "IJ-N01",
        title: "Imperial Bridal Necklace Set",
        category: "necklace",
        purity: "22K Gold",
        weight: "8.50 Tola",
        desc: "An ornate traditional Pakistani bridal necklace set. Features intricate gold filigree, drop pearls, and studded ruby accents. Ideal for brides seeking absolute heritage luxury.",
        image: "assets/necklace.jpg"
    },
    "2": {
        id: "2",
        ref: "IJ-R02",
        title: "Princess Cut Solitaire Ring",
        category: "ring",
        purity: "18K White Gold",
        weight: "1.2 Carat Diamond",
        desc: "A timeless expression of love. Exquisite princess cut center solitaire diamond with a VVS clarity rating, hand-set on a luxurious 18K white gold band with side-channel diamonds.",
        image: "assets/ring.jpg"
    },
    "3": {
        id: "3",
        ref: "IJ-B03",
        title: "Ornate Bridal Kara Set",
        category: "bangle",
        purity: "22K Gold",
        weight: "4.25 Tola",
        desc: "A pair of traditional gold karas featuring masterfully engraved floral patterns and antique gold finishing. Complete with safety locks and custom sizing options.",
        image: "assets/bangles.jpg"
    },
    "4": {
        id: "4",
        ref: "IJ-E04",
        title: "Imperial Chandelier Jhumkas",
        category: "earring",
        purity: "22K Gold",
        weight: "2.10 Tola",
        desc: "Graceful traditional Pakistani chandelier earrings. Features detailed dome work (jhumki) decorated with real Basra pearl drops and sparkling micro-stone details.",
        image: "assets/earrings.jpg"
    },
    "5": {
        id: "5",
        ref: "IJ-N05",
        title: "Royal Antique Gold Choker Set",
        category: "necklace",
        purity: "22K Gold",
        weight: "6.80 Tola",
        desc: "A stunning hand-crafted choker set featuring intricate antique gold work, semi-precious stone settings, and matching drop earrings.",
        image: "assets/necklace2.jpg"
    },
    "6": {
        id: "6",
        ref: "IJ-R06",
        title: "Classic Diamond Halo Ring",
        category: "ring",
        purity: "18K Yellow Gold",
        weight: "0.75 Carat Diamond",
        desc: "A breathtaking halo engagement ring. Featuring a brilliant round cut center diamond surrounded by a sparkling halo of micro-pave diamonds on an 18K yellow gold band.",
        image: "assets/ring2.jpg"
    },
    "7": {
        id: "7",
        ref: "IJ-B07",
        title: "Vintage Filigree Gold Kada",
        category: "bangle",
        purity: "21K Gold",
        weight: "3.10 Tola",
        desc: "A vintage filigree bracelet (kada) crafted in 21K gold. Showcases traditional handmade wire-work and a hidden push-lock clasp.",
        image: "assets/bangles2.jpg"
    },
    "8": {
        id: "8",
        ref: "IJ-E08",
        title: "Pearl Drop Bridal Earrings",
        category: "earring",
        purity: "22K Gold",
        weight: "1.85 Tola",
        desc: "Exquisite bridal earrings displaying classic Pakistani craftsmanship. Perfect hanging chandelier style adorned with high-grade Basra pearls and gold tassels.",
        image: "assets/earrings2.jpg"
    }
};



document.addEventListener("DOMContentLoaded", () => {
    // Initialize UI features
    initMobileNavigation();

    initAppointmentForm();
    initScrollEffects();
    
    // Load products from Firebase Firestore or local fallback
    loadProducts();
    
    // Load dynamic brand configurations
    loadSiteSettings();
});

// 1. Mobile Navigation Logic
function initMobileNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerClose = document.getElementById("drawerClose");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    menuToggle.addEventListener("click", () => {
        mobileDrawer.classList.add("open");
    });

    const closeDrawer = () => {
        mobileDrawer.classList.remove("open");
    };

    drawerClose.addEventListener("click", closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener("click", closeDrawer);
    });
}



// 6. Collection Filter tabs
function initCollectionFilter() {
    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filter = tab.dataset.filter;
            const cards = document.querySelectorAll(".collection-card");

            if (window.analytics && typeof window.analytics.logEvent === "function") {
                window.analytics.logEvent("select_content", {
                    content_type: "category_filter",
                    item_id: filter
                });
            }

            cards.forEach(card => {
                if (filter === "all" || card.dataset.category === filter) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 200);
                }
            });
        });
    });
}

// 7. Quick View Modal Window
let modalInitialized = false;

function initQuickViewModal() {
    if (modalInitialized) return;
    
    const modal = document.getElementById("quickViewModal");
    const modalClose = document.getElementById("modalClose");
    if (!modal || !modalClose) return;

    const closeModal = () => {
        modal.classList.remove("open");
        document.body.style.overflow = "auto";
    };

    modalClose.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    modalInitialized = true;
}

function bindQuickViewToCards() {
    const cards = document.querySelectorAll(".collection-card");
    const modal = document.getElementById("quickViewModal");
    const modalImg = document.getElementById("modalImg");
    const modalMeta = document.getElementById("modalMeta");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalRef = document.getElementById("modalRef");
    const modalWeight = document.getElementById("modalWeight");
    const modalPurity = document.getElementById("modalPurity");
    const modalWhatsappBtn = document.getElementById("modalWhatsappBtn");

    cards.forEach(card => {
        const imgWrapper = card.querySelector(".card-img-wrapper");
        
        const openModal = () => {
            const id = card.dataset.id;
            const item = catalogItems[id];
            
            if (!item) return;

            modalImg.src = item.image;
            modalImg.alt = item.title;
            modalMeta.textContent = `${item.purity} • ${item.category.toUpperCase()}`;
            modalTitle.textContent = item.title;
            modalDesc.textContent = item.desc;
            modalRef.textContent = item.ref;
            modalWeight.textContent = item.weight;
            modalPurity.textContent = item.purity;

            const waMsg = `Hi Ikram Jewellers, I'm interested in viewing or ordering the following catalogue item:\n\n` +
                `• Product Name: ${item.title}\n` +
                `• Reference Ref: ${item.ref}\n` +
                `• Metal Purity: ${item.purity}\n` +
                `• Weight: ${item.weight}\n\n` +
                `Please let me know availability and pricing details.`;
            
            modalWhatsappBtn.href = `https://wa.me/923217624688?text=${encodeURIComponent(waMsg)}`;

            if (window.analytics && typeof window.analytics.logEvent === "function") {
                window.analytics.logEvent("view_item", {
                    item_id: item.id,
                    item_name: item.title,
                    item_category: item.category,
                    item_variant: item.purity,
                    item_reference: item.ref
                });
            }

            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        };

        imgWrapper.addEventListener("click", openModal);
        card.querySelector(".card-hover-overlay").addEventListener("click", openModal);
    });
}

// 7a. Supabase Loading & Fallbacks
let unsubscribeProducts = null;

async function loadProducts() {
    const grid = document.getElementById("collectionGrid");
    if (!grid) return;

    if (window.supabaseConfigured && window.supabaseClient) {
        try {
            // Fetch listed products
            const { data: products, error } = await window.supabaseClient
                .from("products")
                .select("*")
                .eq("listed", true)
                .order("createdAt", { ascending: false });

            if (error) throw error;

            if (!products || products.length === 0) {
                renderEmptyCollection();
            } else {
                renderCatalog(products);
            }

            // Realtime postgres updates subscription
            if (!unsubscribeProducts) {
                const channel = window.supabaseClient
                    .channel("products_realtime")
                    .on(
                        "postgres_changes",
                        { event: "*", schema: "public", table: "products" },
                        async () => {
                            const { data: updatedProducts, error: updateError } = await window.supabaseClient
                                .from("products")
                                .select("*")
                                .eq("listed", true)
                                .order("createdAt", { ascending: false });
                            if (!updateError && updatedProducts) {
                                if (updatedProducts.length === 0) {
                                    renderEmptyCollection();
                                } else {
                                    renderCatalog(updatedProducts);
                                }
                            }
                        }
                    )
                    .subscribe();

                unsubscribeProducts = () => {
                    window.supabaseClient.removeChannel(channel);
                };
            }
        } catch (error) {
            console.error("Supabase loadProducts error:", error);
            // Fallback to local on initial load failure
            if (Object.keys(catalogItems).length === 0) {
                loadLocalFallback();
            }
        }
    } else {
        loadLocalFallback();
    }
}

function loadLocalFallback() {
    const products = Object.keys(catalogItems).map(key => ({
        id: key,
        name: catalogItems[key].title,
        referenceCode: catalogItems[key].ref,
        category: catalogItems[key].category,
        metalPurity: catalogItems[key].purity,
        estimatedWeight: catalogItems[key].weight,
        description: catalogItems[key].desc,
        imageUrl: catalogItems[key].image,
        basePrice: 0,
        listed: true
    }));
    renderCatalog(products);
}

function renderEmptyCollection() {
    const grid = document.getElementById("collectionGrid");
    grid.innerHTML = `
        <div class="collection-loading">
            <i class="fas fa-gem" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 15px; display: block;"></i>
            <p>Our showcase is currently being curated. Check back soon!</p>
        </div>
    `;
}

function renderCatalog(products) {
    const grid = document.getElementById("collectionGrid");
    if (!grid) return;
    
    grid.innerHTML = "";

    // Rebuild catalogItems for Quick View lookup
    catalogItems = {};

    products.forEach(prod => {
        catalogItems[prod.id] = {
            id: prod.id,
            ref: prod.referenceCode || "IJ-Custom",
            title: prod.name,
            category: prod.category ? prod.category.toLowerCase() : "necklace",
            purity: prod.metalPurity || "22K Gold",
            weight: prod.estimatedWeight || "Custom Weight",
            desc: prod.description || "Exquisite bespoke handcrafted jewelry piece from Ikram Jewellers.",
            image: prod.imageUrl || "assets/necklace.jpg"
        };

        let priceText = "Price on Request";
        if (prod.basePrice && prod.basePrice > 0) {
            priceText = `Rs. ${formatNumber(prod.basePrice)}`;
        }

        const card = document.createElement("div");
        card.className = "collection-card";
        card.dataset.category = prod.category ? prod.category.toLowerCase() : "necklace";
        card.dataset.id = prod.id;

        const waMsg = `Hi Ikram Jewellers, I am interested in the ${prod.name} (Ref: ${prod.referenceCode || 'IJ-Custom'}).`;

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${prod.imageUrl || 'assets/necklace.jpg'}" alt="${prod.name}" class="collection-img" onerror="this.src='assets/necklace.jpg'">
                <div class="card-hover-overlay">
                    <span class="btn btn-sm btn-outline">Quick View</span>
                </div>
            </div>
            <div class="card-info">
                <span class="card-meta">${prod.metalPurity || '22K Gold'}</span>
                <h3 class="card-title">${prod.name}</h3>
                <p class="card-weight"><i class="fas fa-weight-hanging"></i> Est. Weight: ${prod.estimatedWeight || 'Custom Weight'}</p>
                <div class="card-bottom">
                    <span class="price-on-request">${priceText}</span>
                    <a href="https://wa.me/923217624688?text=${encodeURIComponent(waMsg)}" target="_blank" class="btn-whatsapp-icon" aria-label="Inquire on WhatsApp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    bindDynamicCollectionEvents();
}

function bindDynamicCollectionEvents() {
    initCollectionFilter();
    initQuickViewModal();
    bindQuickViewToCards();
}

// 8. Appointment Booking Form
function initAppointmentForm() {
    const form = document.getElementById("appointmentForm");
    const apptDateInput = document.getElementById("apptDate");

    // Prevent past dates in input
    if (apptDateInput) {
        const today = new Date().toISOString().split("T")[0];
        apptDateInput.min = today;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("apptName").value;
        const phone = document.getElementById("apptPhone").value;
        const purpose = document.getElementById("apptPurpose").value;
        const date = document.getElementById("apptDate").value;
        const time = document.getElementById("apptTime").value;
        const notes = document.getElementById("apptNotes").value || "None";

        const apptMsg = `Hi Ikram Jewellers, I would like to schedule a VIP consultation booking:\n\n` +
            `• Client Name: ${name}\n` +
            `• Contact Phone: ${phone}\n` +
            `• Purpose: ${purpose}\n` +
            `• Proposed Date: ${date}\n` +
            `• Proposed Time: ${time}\n` +
            `• Special Notes: ${notes}\n\n` +
            `Please confirm my slot availability. Thank you!`;

        if (window.analytics && typeof window.analytics.logEvent === "function") {
            window.analytics.logEvent("generate_lead", {
                service_name: purpose,
                preferred_date: date,
                preferred_time: time
            });
        }

        window.open(`https://wa.me/923217624688?text=${encodeURIComponent(apptMsg)}`, '_blank');
        form.reset();
    });
}

// 9. Scroll Effects (Navbar shrinking, section activation)
function initScrollEffects() {
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        // Navbar scroll shrink effect
        if (window.scrollY > 50) {
            navbar.style.padding = "5px 0";
            navbar.style.background = "rgba(9, 9, 9, 0.95)";
        } else {
            navbar.style.padding = "15px 0";
            navbar.style.background = "var(--bg-glass)";
        }

        // Active navigation link highlighting
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");
                    }
                });
            }
        });
    });
}

// Helper: Format Number with commas
function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// 10. Dynamic Brand and Website Settings Loader
async function loadSiteSettings() {
    if (window.supabaseConfigured && window.supabaseClient) {
        try {
            // Load initial settings
            const { data: settings, error } = await window.supabaseClient
                .from("settings")
                .select("*")
                .eq("key", "site")
                .single();

            if (!error && settings) {
                applySiteSettings(settings);
            }

            // Realtime postgres changes subscription
            window.supabaseClient
                .channel("settings_realtime")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "settings", filter: "key=eq.site" },
                    (payload) => {
                        if (payload.new) {
                            applySiteSettings(payload.new);
                        }
                    }
                )
                .subscribe();
        } catch (err) {
            console.error("Supabase loadSiteSettings error:", err);
        }
    }
}

function applySiteSettings(settings) {
    if (!settings) return;

    // 1. Update Brand/Website Name in navigation, footers, titles, and modals
    if (settings.websiteName) {
        // Update all elements with the logo-main text class
        const logoMains = document.querySelectorAll(".logo-main");
        logoMains.forEach(el => {
            el.textContent = settings.websiteName;
        });

        // Update page title
        document.title = `${settings.websiteName} | Est. 1960 | Pure Gold & Diamond Jewelry`;

        // Update WhatsApp share messages or modals referring to brand name
        window.brandName = settings.websiteName;
    }

    // 2. Update Website Logo Image source
    if (settings.logoUrl) {
        const logoImgs = document.querySelectorAll(".logo-img, .admin-logo img");
        logoImgs.forEach(el => {
            el.src = settings.logoUrl;
        });
    }

    // 3. Update Brand Favicon / Tab Icon
    if (settings.brandIconUrl) {
        let favicon = document.querySelector("link[rel*='icon']");
        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "shortcut icon";
            favicon.type = "image/png";
            document.head.appendChild(favicon);
        }
        favicon.href = settings.brandIconUrl;
    }
}

