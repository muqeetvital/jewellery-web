// ==========================================================================
// Ikram Jewellers - Admin Panel Logic
// Established since 1960
// ==========================================================================

// Global state variables
let currentProducts = [];
let editModal = null;
let currentUploadedImageUrl = "";
let currentVisibilityFilter = "all"; // "all", "show", "dontshow"

// Default Catalog Data for database initialization/seeding
const defaultShowcaseSeed = [
    {
        name: "Imperial Bridal Necklace Set",
        referenceCode: "IJ-N01",
        category: "necklace",
        metalPurity: "22K Gold",
        estimatedWeight: "8.50 Tola",
        description: "An ornate traditional Pakistani bridal necklace set. Features intricate gold filigree, drop pearls, and studded ruby accents. Ideal for brides seeking absolute heritage luxury.",
        imageUrl: "assets/necklace.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Princess Cut Solitaire Ring",
        referenceCode: "IJ-R02",
        category: "ring",
        metalPurity: "18K White Gold",
        estimatedWeight: "1.2 Carat Diamond",
        description: "A timeless expression of love. Exquisite princess cut center solitaire diamond with a VVS clarity rating, hand-set on a luxurious 18K white gold band with side-channel diamonds.",
        imageUrl: "assets/ring.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Ornate Bridal Kara Set",
        referenceCode: "IJ-B03",
        category: "bangle",
        metalPurity: "22K Gold",
        estimatedWeight: "4.25 Tola",
        description: "A pair of traditional gold karas featuring masterfully engraved floral patterns and antique gold finishing. Complete with safety locks and custom sizing options.",
        imageUrl: "assets/bangles.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Imperial Chandelier Jhumkas",
        referenceCode: "IJ-E04",
        category: "earring",
        metalPurity: "22K Gold",
        estimatedWeight: "2.10 Tola",
        description: "Graceful traditional Pakistani chandelier earrings. Features detailed dome work (jhumki) decorated with real Basra pearl drops and sparkling micro-stone details.",
        imageUrl: "assets/earrings.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Royal Antique Gold Choker Set",
        referenceCode: "IJ-N05",
        category: "necklace",
        metalPurity: "22K Gold",
        estimatedWeight: "6.80 Tola",
        description: "A stunning hand-crafted choker set featuring intricate antique gold work, semi-precious stone settings, and matching drop earrings.",
        imageUrl: "assets/necklace2.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Classic Diamond Halo Ring",
        referenceCode: "IJ-R06",
        category: "ring",
        metalPurity: "18K Yellow Gold",
        estimatedWeight: "0.75 Carat Diamond",
        description: "A breathtaking halo engagement ring. Featuring a brilliant round cut center diamond surrounded by a sparkling halo of micro-pave diamonds on an 18K yellow gold band.",
        imageUrl: "assets/ring2.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Vintage Filigree Gold Kada",
        referenceCode: "IJ-B07",
        category: "bangle",
        metalPurity: "21K Gold",
        estimatedWeight: "3.10 Tola",
        description: "A vintage filigree bracelet (kada) crafted in 21K gold. Showcases traditional handmade wire-work and a hidden push-lock clasp.",
        imageUrl: "assets/bangles2.jpg",
        basePrice: 0,
        listed: true
    },
    {
        name: "Pearl Drop Bridal Earrings",
        referenceCode: "IJ-E08",
        category: "earring",
        metalPurity: "22K Gold",
        estimatedWeight: "1.85 Tola",
        description: "Exquisite bridal earrings displaying classic Pakistani craftsmanship. Perfect hanging chandelier style adorned with high-grade Basra pearls and gold tassels.",
        imageUrl: "assets/earrings2.jpg",
        basePrice: 0,
        listed: true
    }
];

document.addEventListener("DOMContentLoaded", () => {
    checkFirebaseStatus();
    initAuthObserver();
    initModalControls();
    initFormHandlers();
    initDashboardFilters();
    initSidebarNavigation();
});

// 1. Check Configuration Status
function checkFirebaseStatus() {
    const splashScreen = document.getElementById("adminLoadingScreen");
    if (!window.firebaseConfigured) {
        splashScreen.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: #ff5252;"></i>
            <h3 style="color: #ffffff; margin-top: 15px;">Configuration Incomplete</h3>
            <p style="color: #b5b5b5; max-width: 400px; text-align: center; margin-top: 10px; font-size: 0.9rem;">
                Firebase database configurations are not set yet. Please update the credential variables inside the <strong>firebase-config.js</strong> file.
            </p>
        `;
        throw new Error("Firebase configuration placeholders remain. Admin execution stopped.");
    }
}

// 2. Observe Authentication State Changes
function initAuthObserver() {
    const splashScreen = document.getElementById("adminLoadingScreen");
    const loginScreen = document.getElementById("loginScreen");
    const dashboardScreen = document.getElementById("dashboardScreen");
    const adminEmailField = document.getElementById("adminUserEmail");
    const loginError = document.getElementById("loginError");
    const loginErrorText = document.getElementById("loginErrorText");

    window.auth.onAuthStateChanged(user => {
        if (user) {
            // Fetch user role document from Firestore to verify admin privileges
            window.db.collection("users").doc(user.uid).get()
                .then(doc => {
                    // Hide splash screen
                    splashScreen.style.display = "none";

                    if (doc.exists && doc.data().isAdmin === true) {
                        // User is authorized admin
                        loginScreen.style.display = "none";
                        dashboardScreen.style.display = "block";
                        adminEmailField.textContent = user.email;
                        
                        // Fetch and render settings & inventory
                        loadAdminSiteSettings();
                        loadInventory();
                    } else {
                        // User logged in but lacks admin profile
                        console.warn("User lacks admin role profile in users collection.");
                        window.auth.signOut().then(() => {
                            loginScreen.style.display = "flex";
                            dashboardScreen.style.display = "none";
                            loginErrorText.textContent = "Access Denied: This account is not whitelisted as an administrator.";
                            loginError.style.display = "block";
                            showToast("Access Denied: Admin role required", "error");
                        });
                    }
                })
                .catch(error => {
                    console.error("Verification error:", error);
                    splashScreen.style.display = "none";
                    window.auth.signOut().then(() => {
                        loginScreen.style.display = "flex";
                        dashboardScreen.style.display = "none";
                        loginErrorText.textContent = "Security validation failed: " + error.message;
                        loginError.style.display = "block";
                    });
                });
        } else {
            splashScreen.style.display = "none";
            dashboardScreen.style.display = "none";
            loginScreen.style.display = "flex";
        }
    });
}

// 3. Setup Form Submission and Logins
function initFormHandlers() {
    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const loginErrorText = document.getElementById("loginErrorText");
    const logoutBtn = document.getElementById("logoutBtn");
    const productForm = document.getElementById("productForm");

    // Login Form Submit
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        loginError.style.display = "none";

        window.auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                showToast("Login authorized successfully", "success");
                loginForm.reset();
            })
            .catch(error => {
                console.error("Auth error:", error);
                loginErrorText.textContent = error.message;
                loginError.style.display = "block";
                showToast("Access Denied: Invalid Credentials", "error");
            });
    });

    // Logout Click
    logoutBtn.addEventListener("click", () => {
        window.auth.signOut().then(() => {
            showToast("Log out completed successfully", "success");
        });
    });

    // Product Add/Edit Form Submit
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveProduct();
    });

    // Modal Listed Toggle Checkbox Label
    const prodListed = document.getElementById("prodListed");
    const modalListedLabel = document.getElementById("modalListedLabel");
    prodListed.addEventListener("change", () => {
        if (prodListed.checked) {
            modalListedLabel.textContent = "SHOW";
            modalListedLabel.className = "status-label listed";
        } else {
            modalListedLabel.textContent = "DON'T SHOW";
            modalListedLabel.className = "status-label unlisted";
        }
    });

    // Image Upload Input Selector Preview
    const imageInput = document.getElementById("prodImageFile");
    const previewBox = document.getElementById("modalImagePreviewBox");
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewBox.innerHTML = `<img src="${e.target.result}" alt="Upload Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// 4. Manage Modal Open / Close states
function initModalControls() {
    const modal = document.getElementById("productModal");
    const addBtn = document.getElementById("addNewProductBtn");
    const cancelBtn = document.getElementById("modalCancelBtn");
    const productForm = document.getElementById("productForm");

    editModal = {
        open: (title = "Add New Product") => {
            document.getElementById("modalFormTitle").textContent = title;
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        },
        close: () => {
            modal.classList.remove("open");
            document.body.style.overflow = "auto";
            productForm.reset();
            document.getElementById("prodId").value = "";
            document.getElementById("modalImagePreviewBox").innerHTML = '<i class="far fa-image"></i>';
            document.getElementById("uploadProgressContainer").style.display = "none";
            document.getElementById("uploadProgressBar").style.width = "0%";
            currentUploadedImageUrl = "";
        }
    };

    addBtn.addEventListener("click", () => editModal.open("Add New Product"));
    cancelBtn.addEventListener("click", () => editModal.close());
    
    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            editModal.close();
        }
    });
}

// 5. Load and Render Inventory Catalog
function loadInventory() {
    const tableBody = document.getElementById("inventoryTableBody");
    const emptyState = document.getElementById("emptyTableState");
    const seedBtn = document.getElementById("seedDbBtn");
    const dbStatus = document.getElementById("databaseStatusLabel");

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 40px 0; color: var(--text-secondary);">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--admin-gold); margin-bottom: 10px; display:block;"></i> Fetching products catalog...
            </td>
        </tr>
    `;

    window.db.collection("products")
        .get()
        .then(querySnapshot => {
            currentProducts = [];
            querySnapshot.forEach(doc => {
                currentProducts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Update stats
            renderStatsDashboard();

            if (currentProducts.length === 0) {
                // Show empty indicator and seeding assistant
                tableBody.innerHTML = "";
                emptyState.style.display = "block";
                seedBtn.style.display = "inline-flex";
                dbStatus.textContent = "Empty";
                
                // Bind seeder click
                seedBtn.onclick = seedDatabaseWithDefaults;
            } else {
                emptyState.style.display = "none";
                seedBtn.style.display = "none";
                dbStatus.textContent = "Online";
                renderInventoryTable(currentProducts);
            }
        })
        .catch(error => {
            console.error("Firestore read error:", error);
            showToast("Database fetch failed: " + error.message, "error");
        });
}

// Render Dashboard Stat counts
function renderStatsDashboard() {
    const totalItems = currentProducts.length;
    const listedItems = currentProducts.filter(p => p.listed === true).length;
    const unlistedItems = totalItems - listedItems;

    document.getElementById("statTotalItems").textContent = totalItems;
    document.getElementById("statListedItems").textContent = listedItems;
    document.getElementById("statUnlistedItems").textContent = unlistedItems;
}

// Render Table Rows
function renderInventoryTable(products) {
    const tableBody = document.getElementById("inventoryTableBody");
    tableBody.innerHTML = "";

    products.forEach(prod => {
        const row = document.createElement("tr");
        
        let priceLabel = "Price on Request";
        if (prod.basePrice && prod.basePrice > 0) {
            priceLabel = `Rs. ${formatNumber(prod.basePrice)}`;
        }

        const isChecked = prod.listed ? "checked" : "";
        const statusClass = prod.listed ? "listed" : "unlisted";
        const statusText = prod.listed ? "SHOW" : "DON'T SHOW";

        row.innerHTML = `
            <td>
                <img src="${prod.imageUrl}" alt="${prod.name}" class="product-row-img" onerror="this.src='assets/necklace.jpg'">
            </td>
            <td><strong>${prod.referenceCode || "IJ-Custom"}</strong></td>
            <td><strong style="color: #ffffff;">${prod.name}</strong></td>
            <td><span class="badge-tag">${prod.category}</span></td>
            <td>${prod.estimatedWeight || "Custom"}</td>
            <td>${priceLabel}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <label class="switch">
                        <input type="checkbox" class="list-toggle" data-id="${prod.id}" ${isChecked}>
                        <span class="slider"></span>
                    </label>
                    <span class="status-label ${statusClass}">${statusText}</span>
                </div>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon edit-btn" data-id="${prod.id}" title="Edit Specifications"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${prod.id}" title="Remove Jewellery"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Attach Toggle Switches Event Listeners
    document.querySelectorAll(".list-toggle").forEach(toggle => {
        toggle.addEventListener("change", (e) => {
            const id = e.target.dataset.id;
            const listed = e.target.checked;
            toggleProductListed(id, listed, e.target);
        });
    });

    // Attach Edit Actions
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            openEditProductModal(id);
        });
    });

    // Attach Delete Actions
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            deleteProductItem(id);
        });
    });
}

// Quick Switch Listed Toggle Updates
function toggleProductListed(id, listed, inputElement) {
    const label = inputElement.parentElement.nextElementSibling;
    
    window.db.collection("products").doc(id)
        .update({ listed: listed })
        .then(() => {
            if (listed) {
                label.textContent = "SHOW";
                label.className = "status-label listed";
                showToast("Product is now shown on public site", "success");
            } else {
                label.textContent = "DON'T SHOW";
                label.className = "status-label unlisted";
                showToast("Product is now hidden from public site", "success");
            }
            
            // Reload stats locally
            const product = currentProducts.find(p => p.id === id);
            if (product) product.listed = listed;
            renderStatsDashboard();
        })
        .catch(error => {
            console.error("Listing toggle error:", error);
            inputElement.checked = !listed; // revert UI
            showToast("Failed to toggle status: " + error.message, "error");
        });
}

// 6. Add / Edit Product CRUD Core functions
function openEditProductModal(id) {
    const prod = currentProducts.find(p => p.id === id);
    if (!prod) return;

    // Populate Fields
    document.getElementById("prodId").value = prod.id;
    document.getElementById("prodName").value = prod.name;
    document.getElementById("prodRef").value = prod.referenceCode || "";
    document.getElementById("prodPrice").value = prod.basePrice || 0;
    document.getElementById("prodWeight").value = prod.estimatedWeight || "";
    document.getElementById("prodPurity").value = prod.metalPurity || "22K Gold";
    document.getElementById("prodCategory").value = prod.category ? prod.category.toLowerCase() : "necklace";
    document.getElementById("prodDesc").value = prod.description || "";
    
    // Image URL
    const urlInput = document.getElementById("prodImageUrl");
    if (urlInput) urlInput.value = prod.imageUrl || "";

    // Listed status
    const checkbox = document.getElementById("prodListed");
    checkbox.checked = prod.listed;
    
    const label = document.getElementById("modalListedLabel");
    if (prod.listed) {
        label.textContent = "SHOW";
        label.className = "status-label listed";
    } else {
        label.textContent = "DON'T SHOW";
        label.className = "status-label unlisted";
    }

    // Preview image
    const previewBox = document.getElementById("modalImagePreviewBox");
    previewBox.innerHTML = `<img src="${prod.imageUrl}" alt="Preview image" onerror="this.src='assets/necklace.jpg'">`;
    currentUploadedImageUrl = prod.imageUrl; // cache URL

    editModal.open("Edit Product Specs");
}

async function saveProduct() {
    const id = document.getElementById("prodId").value;
    const name = document.getElementById("prodName").value.trim();
    const ref = document.getElementById("prodRef").value.trim();
    const price = parseFloat(document.getElementById("prodPrice").value) || 0;
    const weight = document.getElementById("prodWeight").value.trim();
    const purity = document.getElementById("prodPurity").value;
    const category = document.getElementById("prodCategory").value;
    const description = document.getElementById("prodDesc").value.trim();
    const listed = document.getElementById("prodListed").checked;
    const fileInput = document.getElementById("prodImageFile");
    const saveBtn = document.getElementById("modalSaveBtn");

    if (!name || !ref || !weight || !description) {
        showToast("Please fill in all required fields", "error");
        return;
    }

    const file = fileInput.files[0];
    
    // Disable saving button
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const progressContainer = document.getElementById("uploadProgressContainer");
    const progressBar = document.getElementById("uploadProgressBar");

    try {
        let imageUrl = currentUploadedImageUrl || "assets/necklace.jpg"; // Default placeholder if new product

        if (file) {
            // Must upload image to Firebase Storage
            if (!window.storage) {
                throw new Error("Firebase Storage is not initialized. Please verify your config.");
            }

            if (progressContainer) progressContainer.style.display = "block";
            if (progressBar) progressBar.style.width = "0%";

            try {
                const storageRef = window.storage.ref().child(`products/${Date.now()}_${file.name}`);
                
                // Wrap uploadTask in a Promise to await it cleanly
                imageUrl = await new Promise((resolve, reject) => {
                    const uploadTask = storageRef.put(file);
                    uploadTask.on("state_changed", 
                        (snapshot) => {
                            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            if (progressBar) progressBar.style.width = `${percent}%`;
                        },
                        (error) => {
                            reject(new Error("Firebase Storage upload failed: " + error.message));
                        },
                        () => {
                            uploadTask.snapshot.ref.getDownloadURL()
                                .then(url => resolve(url))
                                .catch(err => reject(new Error("Failed to get download URL: " + err.message)));
                        }
                    );
                });
            } catch (storageErr) {
                // Check if this looks like a storage disabled / configuration / upgrade error
                const isConfigError = storageErr.message.includes("configuration-not-found") || 
                                      storageErr.message.includes("no default bucket") || 
                                      storageErr.message.includes("billing") || 
                                      storageErr.message.includes("Blaze");
                if (isConfigError) {
                    throw new Error("Firebase Cloud Storage is not activated. Please upgrade your Firebase project to the Blaze plan to enable file uploads, or submit without selecting an image.");
                } else {
                    throw storageErr;
                }
            } finally {
                if (progressContainer) progressContainer.style.display = "none";
            }
        }

        // Save Firestore Document
        const productData = {
            name,
            referenceCode: ref,
            basePrice: price,
            estimatedWeight: weight,
            metalPurity: purity,
            category,
            description,
            listed,
            imageUrl: imageUrl,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (id) {
            // Edit Spec
            await window.db.collection("products").doc(id).update(productData);
            showToast("Jewellery details updated successfully", "success");
        } else {
            // Create New Product
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await window.db.collection("products").add(productData);
            showToast("New jewellery piece added to inventory", "success");
        }

        editModal.close();
        loadInventory();

    } catch (error) {
        console.error("Save product error details:", error);
        showToast(error.message, "error");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
}

function deleteProductItem(id) {
    const prod = currentProducts.find(p => p.id === id);
    if (!prod) return;

    const confirmDelete = confirm(`Are you sure you want to permanently delete "${prod.name}" (Ref: ${prod.referenceCode || 'IJ-Custom'})?`);
    if (!confirmDelete) return;

    window.db.collection("products").doc(id)
        .delete()
        .then(() => {
            showToast("Jewellery item removed from database", "success");
            
            // Delete image from storage if it is a Firebase Storage URL
            if (prod.imageUrl && prod.imageUrl.includes("firebasestorage.googleapis.com")) {
                try {
                    const storageRef = window.storage.refFromURL(prod.imageUrl);
                    storageRef.delete()
                        .then(() => console.log("Associated image file deleted from storage."))
                        .catch(err => console.warn("Failed to delete storage file:", err));
                } catch (e) {
                    console.warn("Could not parse image URL for storage deletion:", e);
                }
            }

            loadInventory();
        })
        .catch(error => {
            console.error("Deletion error:", error);
            showToast("Failed to delete item: " + error.message, "error");
        });
}

// 7. Auto Seeding Tool
function seedDatabaseWithDefaults() {
    const seedBtn = document.getElementById("seedDbBtn");
    
    const confirmSeed = confirm("Do you want to initialize the Firestore database with the 8 default showcase items now? This will reset default items but will not duplicate them.");
    if (!confirmSeed) return;

    seedBtn.disabled = true;
    seedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Seeding database...';

    const dbBatch = window.db.batch();

    defaultShowcaseSeed.forEach(item => {
        // Use the product's unique reference code as the document ID in Firestore to prevent duplicates
        const docRef = window.db.collection("products").doc(item.referenceCode);
        dbBatch.set(docRef, {
            ...item,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    });

    dbBatch.commit()
        .then(() => {
            showToast("Showcase database seeded successfully without duplicates!", "success");
            loadInventory();
        })
        .catch(err => {
            console.error("Seeding commit error:", err);
            showToast("Seeding failed: " + err.message, "error");
            seedBtn.disabled = false;
            seedBtn.innerHTML = '<i class="fas fa-database"></i> Seed Default Catalog';
        });
}

// 8. Search and Filter Dashboard lists
function initDashboardFilters() {
    const searchInput = document.getElementById("inventorySearch");
    const categorySelect = document.getElementById("inventoryFilter");

    const filterProductsList = () => {
        const query = searchInput.value.toLowerCase().trim();
        const category = categorySelect.value;

        const filtered = currentProducts.filter(prod => {
            const matchesSearch = 
                prod.name.toLowerCase().includes(query) ||
                (prod.referenceCode && prod.referenceCode.toLowerCase().includes(query)) ||
                (prod.metalPurity && prod.metalPurity.toLowerCase().includes(query));
            
            const matchesCategory = 
                category === "all" || 
                (prod.category && prod.category.toLowerCase() === category);

            const matchesVisibility = 
                currentVisibilityFilter === "all" ||
                (currentVisibilityFilter === "show" && prod.listed === true) ||
                (currentVisibilityFilter === "dontshow" && prod.listed === false);

            return matchesSearch && matchesCategory && matchesVisibility;
        });

        renderInventoryTable(filtered);
    };

    searchInput.addEventListener("input", filterProductsList);
    categorySelect.addEventListener("change", filterProductsList);
}

// 9. Toast Notification Handler
function showToast(text, type = "success") {
    const toast = document.getElementById("toastAlert");
    const icon = document.getElementById("toastIcon");
    const textBox = document.getElementById("toastText");

    textBox.textContent = text;
    toast.className = `toast-msg show ${type}`;

    if (type === "success") {
        icon.className = "fas fa-check-circle";
        icon.style.color = "#25d366";
    } else {
        icon.className = "fas fa-exclamation-circle";
        icon.style.color = "#ff5252";
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

// Helper: Format Numbers
function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// 10. Sidebar Navigation Tabs and Site Settings Logic
function initSidebarNavigation() {
    const linkAll = document.getElementById("linkAllJewellery");
    const linkShow = document.getElementById("linkShowJewellery");
    const linkDont = document.getElementById("linkDontShowJewellery");
    const linkSettings = document.getElementById("linkWebsiteSettings");

    const panelInventory = document.getElementById("panelJewelleryManagement");
    const panelSettings = document.getElementById("panelWebsiteSettings");

    const sidebarLinks = [linkAll, linkShow, linkDont, linkSettings];

    const setActiveLink = (activeLink) => {
        sidebarLinks.forEach(link => {
            if (link) {
                link.classList.remove("active");
                link.style.color = "var(--text-secondary)";
                link.style.background = "transparent";
                link.style.borderLeft = "none";
                link.style.fontWeight = "500";
            }
        });
        if (activeLink) {
            activeLink.classList.add("active");
            activeLink.style.color = "#ffffff";
            activeLink.style.background = "rgba(212, 175, 55, 0.15)";
            activeLink.style.borderLeft = "3px solid var(--admin-gold)";
        }
    };

    if (linkAll) {
        linkAll.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveLink(linkAll);
            panelInventory.style.display = "block";
            panelSettings.style.display = "none";
            currentVisibilityFilter = "all";
            document.getElementById("inventoryTableHeaderTitle").textContent = "Showcase Inventory Log";
            
            // Clear and trigger filters
            document.getElementById("inventorySearch").value = "";
            document.getElementById("inventoryFilter").value = "all";
            document.getElementById("inventorySearch").dispatchEvent(new Event("input"));
        });
    }

    if (linkShow) {
        linkShow.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveLink(linkShow);
            panelInventory.style.display = "block";
            panelSettings.style.display = "none";
            currentVisibilityFilter = "show";
            document.getElementById("inventoryTableHeaderTitle").textContent = "Showcase Inventory Log - SHOW (Listed)";
            document.getElementById("inventorySearch").dispatchEvent(new Event("input"));
        });
    }

    if (linkDont) {
        linkDont.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveLink(linkDont);
            panelInventory.style.display = "block";
            panelSettings.style.display = "none";
            currentVisibilityFilter = "dontshow";
            document.getElementById("inventoryTableHeaderTitle").textContent = "Showcase Inventory Log - DON'T SHOW (Unlisted)";
            document.getElementById("inventorySearch").dispatchEvent(new Event("input"));
        });
    }

    if (linkSettings) {
        linkSettings.addEventListener("click", (e) => {
            e.preventDefault();
            setActiveLink(linkSettings);
            panelInventory.style.display = "none";
            panelSettings.style.display = "block";
            loadSiteSettingsForm();
        });
    }

    // Bind custom file select buttons
    document.querySelectorAll(".btn-file-select").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.nextElementSibling;
            if (input) input.click();
        });
    });
    // Bind Settings Upload Inputs
    const logoFileInput = document.getElementById("settingsSiteLogoFile");
    if (logoFileInput) {
        logoFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showToast("Error: Logo size exceeds 5MB", "error");
                return;
            }
            uploadSettingsFile(file, "logo");
        });
    }

    const iconFileInput = document.getElementById("settingsSiteIconFile");
    if (iconFileInput) {
        iconFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showToast("Error: Favicon size exceeds 2MB", "error");
                return;
            }
            uploadSettingsFile(file, "icon");
        });
    }

    // Bind settings form submit
    const settingsForm = document.getElementById("settingsForm");
    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveSiteSettingsForm();
        });
    }
}

function loadSiteSettingsForm() {
    if (!window.firebaseConfigured || !window.db) return;

    window.db.collection("settings").doc("site").get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById("settingsSiteName").value = data.websiteName || "IKRAM JEWELLERS";
                
                const logoPreview = document.getElementById("settingsLogoPreviewBox");
                if (data.logoUrl) {
                    logoPreview.innerHTML = `<img src="${data.logoUrl}" alt="Logo" style="width:100%; height:100%; object-fit:cover;">`;
                    logoPreview.dataset.url = data.logoUrl;
                } else {
                    logoPreview.innerHTML = `<i class="far fa-image"></i>`;
                    logoPreview.dataset.url = "";
                }

                const iconPreview = document.getElementById("settingsIconPreviewBox");
                if (data.brandIconUrl) {
                    iconPreview.innerHTML = `<img src="${data.brandIconUrl}" alt="Favicon" style="width:100%; height:100%; object-fit:cover;">`;
                    iconPreview.dataset.url = data.brandIconUrl;
                } else {
                    iconPreview.innerHTML = `<i class="far fa-image"></i>`;
                    iconPreview.dataset.url = "";
                }
            } else {
                document.getElementById("settingsSiteName").value = "IKRAM JEWELLERS";
            }
        })
        .catch(err => {
            console.error("Load site settings error:", err);
            showToast("Failed to fetch settings: " + err.message, "error");
        });
}

function uploadSettingsFile(file, type) {
    const isLogo = type === "logo";
    const progressBar = document.getElementById(isLogo ? "logoUploadProgressBar" : "iconUploadProgressBar");
    const progressContainer = document.getElementById(isLogo ? "logoUploadProgressContainer" : "iconUploadProgressContainer");
    const previewBox = document.getElementById(isLogo ? "settingsLogoPreviewBox" : "settingsIconPreviewBox");

    if (!window.storage) {
        showToast("Firebase Storage is not initialized. Please verify your config.", "error");
        return;
    }

    if (progressContainer) progressContainer.style.display = "block";
    if (progressBar) progressBar.style.width = "0%";

    try {
        const storageRef = window.storage.ref().child(`products/settings_${type}_${Date.now()}`);
        const uploadTask = storageRef.put(file);

        uploadTask.on("state_changed", 
            snapshot => {
                const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (progressBar) progressBar.style.width = pct + "%";
            }, 
            error => {
                console.error("Upload error:", error);
                showToast("Upload failed: " + error.message + ". Please ensure your Firebase Storage bucket is activated in the console.", "error");
                if (progressContainer) progressContainer.style.display = "none";
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(url => {
                        previewBox.innerHTML = `<img src="${url}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
                        previewBox.dataset.url = url;
                        if (progressContainer) progressContainer.style.display = "none";
                        showToast(`${isLogo ? "Logo" : "Favicon"} uploaded successfully. Click Save to publish!`, "success");
                    })
                    .catch(err => {
                        console.error("URL retrieval error:", err);
                        showToast("Failed to resolve URL: " + err.message, "error");
                        if (progressContainer) progressContainer.style.display = "none";
                    });
            }
        );
    } catch (e) {
        console.error("Upload settings exception:", e);
        showToast("Cloud Storage error: " + e.message + ". Cloud Storage is likely disabled in Firebase Console.", "error");
        if (progressContainer) progressContainer.style.display = "none";
    }
}

function saveSiteSettingsForm() {
    const siteName = document.getElementById("settingsSiteName").value.trim();
    const logoUrl = document.getElementById("settingsLogoPreviewBox").dataset.url || "";
    const brandIconUrl = document.getElementById("settingsIconPreviewBox").dataset.url || "";
    const saveBtn = document.getElementById("settingsSaveBtn");

    if (!siteName) {
        showToast("Please enter a brand name", "error");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    window.db.collection("settings").doc("site").set({
        websiteName: siteName,
        logoUrl: logoUrl,
        brandIconUrl: brandIconUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        showToast("Website Settings updated successfully!", "success");
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    })
    .catch(err => {
        console.error("Save site settings error:", err);
        showToast("Save failed: " + err.message, "error");
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    });
}// 11. Load Admin Header Site Settings
let adminSettingsListener = null;
function loadAdminSiteSettings() {
    if (!window.firebaseConfigured || !window.db) return;

    if (adminSettingsListener) {
        adminSettingsListener(); // Unsubscribe first
    }

    adminSettingsListener = window.db.collection("settings").doc("site")
        .onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (data.websiteName) {
                    const logoMains = document.querySelectorAll(".admin-logo .logo-main");
                    logoMains.forEach(el => {
                        el.textContent = data.websiteName;
                    });
                }
                if (data.logoUrl) {
                    const logoImgs = document.querySelectorAll(".admin-logo img");
                    logoImgs.forEach(el => {
                        el.src = data.logoUrl;
                    });
                }
            }
        }, error => {
            console.error("Firestore admin settings load error:", error);
        });
}
