import urllib.request
import json
import os

# Configuration
project_id = "ikram-jewellery"
user_profile = os.environ.get("USERPROFILE", "C:\\Users\\tmtar")
config_path = os.path.join(user_profile, ".config", "configstore", "firebase-tools.json")

# 1. Read token
print("Reading access token from config...")
try:
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
        access_token = config["tokens"]["access_token"]
        print("Success! Authenticated via Firebase CLI.")
except Exception as e:
    print("Failed to authenticate. Make sure you have logged in using: firebase login")
    print("Error details:", e)
    exit(1)

# 2. Define Products
products = [
    # Necklaces
    {
        "id": "ij-n01",
        "name": "Imperial Bridal Necklace Set",
        "referenceCode": "IJ-N01",
        "category": "necklace",
        "metalPurity": "22K Gold",
        "estimatedWeight": "8.50 Tola",
        "description": "An ornate traditional Pakistani bridal necklace set. Features intricate gold filigree, drop pearls, and studded ruby accents. Ideal for brides seeking absolute heritage luxury.",
        "imageUrl": "assets/necklace.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-n02",
        "name": "Royal Antique Gold Choker Set",
        "referenceCode": "IJ-N02",
        "category": "necklace",
        "metalPurity": "22K Gold",
        "estimatedWeight": "6.80 Tola",
        "description": "A stunning hand-crafted choker set featuring intricate antique gold work, semi-precious stone settings, and matching drop earrings.",
        "imageUrl": "assets/necklace2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-n03",
        "name": "Majestic Kundan Rani Haar",
        "referenceCode": "IJ-N03",
        "category": "necklace",
        "metalPurity": "22K Gold",
        "estimatedWeight": "12.50 Tola",
        "description": "A long, traditional Rani Haar styled long-pendant necklace. Hand-set Kundan stones with fresh-water pearl strings and emerald teardrop accents.",
        "imageUrl": "assets/necklace.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-n04",
        "name": "Polki Diamond Choker Set",
        "referenceCode": "IJ-N04",
        "category": "necklace",
        "metalPurity": "18K Yellow Gold",
        "estimatedWeight": "9.80 Tola",
        "description": "An elegant raw Polki diamond choker set. Adorned with uncut diamonds, fine meenakari (enamelling) on the reverse, and green jade drops.",
        "imageUrl": "assets/necklace2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-n05",
        "name": "Basra Pearl Gold Choker",
        "referenceCode": "IJ-N05",
        "category": "necklace",
        "metalPurity": "21K Gold",
        "estimatedWeight": "5.50 Tola",
        "description": "A beautiful classic multi-strand Basra pearl choker set with a central solid 21K gold clasp set with premium cubic zirconia details.",
        "imageUrl": "assets/necklace.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-n06",
        "name": "Bridal Gold Mala Set",
        "referenceCode": "IJ-N06",
        "category": "necklace",
        "metalPurity": "22K Gold",
        "estimatedWeight": "11.50 Tola",
        "description": "A magnificent multi-layered gold mala set with matching jhumkas. Crafted in traditional filigree style representing over six decades of heritage.",
        "imageUrl": "assets/necklace2.jpg",
        "basePrice": 0,
        "listed": True
    },
    
    # Rings
    {
        "id": "ij-r01",
        "name": "Princess Cut Solitaire Ring",
        "referenceCode": "IJ-R01",
        "category": "ring",
        "metalPurity": "18K White Gold",
        "estimatedWeight": "1.20 Carat Diamond",
        "description": "A timeless expression of love. Exquisite princess cut center solitaire diamond with a VVS clarity rating, hand-set on a luxurious 18K white gold band.",
        "imageUrl": "assets/ring.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-r02",
        "name": "Classic Diamond Halo Ring",
        "referenceCode": "IJ-R02",
        "category": "ring",
        "metalPurity": "18K Yellow Gold",
        "estimatedWeight": "0.75 Carat Diamond",
        "description": "A breathtaking halo engagement ring. Featuring a brilliant round cut center diamond surrounded by a sparkling halo of micro-pave diamonds.",
        "imageUrl": "assets/ring2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-r03",
        "name": "Traditional Gold Kara Band",
        "referenceCode": "IJ-R03",
        "category": "ring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "1.50 Tola",
        "description": "A solid, thick gold ring band for bridal wear. Features intricate hand-engraved traditional patterns and comfortable rounded borders.",
        "imageUrl": "assets/ring.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-r04",
        "name": "Kundan Studded Floral Ring",
        "referenceCode": "IJ-R04",
        "category": "ring",
        "metalPurity": "21K Gold",
        "estimatedWeight": "1.80 Tola",
        "description": "An elegant cocktail-style ring. Traditional floral shapes studded with fine Kundan glass stones and rubies, perfect for formal festive wear.",
        "imageUrl": "assets/ring2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-r05",
        "name": "Men's Royal Signet Ring",
        "referenceCode": "IJ-R05",
        "category": "ring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "2.00 Tola",
        "description": "A solid 22K gold men's statement ring. Features a polished square black onyx stone centered on an engraved solid gold band.",
        "imageUrl": "assets/ring.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-r06",
        "name": "Ruby Studded Peacock Ring",
        "referenceCode": "IJ-R06",
        "category": "ring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "1.40 Tola",
        "description": "A gorgeous statement ring shaped like a peacock. Decorated with fine natural rubies and sparkling zircon side crystals.",
        "imageUrl": "assets/ring2.jpg",
        "basePrice": 0,
        "listed": True
    },
    
    # Bangles
    {
        "id": "ij-b01",
        "name": "Ornate Bridal Kara Set",
        "referenceCode": "IJ-B01",
        "category": "bangle",
        "metalPurity": "22K Gold",
        "estimatedWeight": "4.25 Tola",
        "description": "A pair of traditional gold karas featuring masterfully engraved floral patterns and antique gold finishing. Complete with safety locks.",
        "imageUrl": "assets/bangles.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-b02",
        "name": "Vintage Filigree Gold Kada",
        "referenceCode": "IJ-B02",
        "category": "bangle",
        "metalPurity": "21K Gold",
        "estimatedWeight": "3.10 Tola",
        "description": "A vintage filigree bracelet (kada) crafted in 21K gold. Showcases traditional handmade wire-work and a hidden push-lock clasp.",
        "imageUrl": "assets/bangles2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-b03",
        "name": "Royal Kangan Set",
        "referenceCode": "IJ-B03",
        "category": "bangle",
        "metalPurity": "22K Gold",
        "estimatedWeight": "10.20 Tola",
        "description": "A gorgeous set of four gold kangans. Designed with classic dot-filigree patterns and high-shine polished borders for wedding wear.",
        "imageUrl": "assets/bangles.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-b04",
        "name": "Diamond Eternity Bracelet",
        "referenceCode": "IJ-B04",
        "category": "bangle",
        "metalPurity": "18K White Gold",
        "estimatedWeight": "4.50 Carat Diamond",
        "description": "A stunning, flexible white gold tennis bracelet set with a continuous row of premium brilliant-cut round diamonds.",
        "imageUrl": "assets/bangles2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-b05",
        "name": "Gold Charm Bracelet",
        "referenceCode": "IJ-B05",
        "category": "bangle",
        "metalPurity": "21K Gold",
        "estimatedWeight": "2.50 Tola",
        "description": "A modern lightweight daily-wear gold chain link bracelet. Features five unique custom-designed traditional gold coin charms.",
        "imageUrl": "assets/bangles.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-b06",
        "name": "Classic Gold Bangle Set",
        "referenceCode": "IJ-B06",
        "category": "bangle",
        "metalPurity": "22K Gold",
        "estimatedWeight": "6.00 Tola",
        "description": "A traditional set of six simple gold bangles. Crafted with elegant textures that shimmer beautifully in the light.",
        "imageUrl": "assets/bangles2.jpg",
        "basePrice": 0,
        "listed": True
    },
    
    # Earrings
    {
        "id": "ij-e01",
        "name": "Imperial Chandelier Jhumkas",
        "referenceCode": "IJ-E01",
        "category": "earring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "2.10 Tola",
        "description": "Graceful traditional Pakistani chandelier earrings. Features detailed dome work (jhumki) decorated with real Basra pearl drops and sparkling micro-stone details.",
        "imageUrl": "assets/earrings.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-e02",
        "name": "Pearl Drop Bridal Earrings",
        "referenceCode": "IJ-E02",
        "category": "earring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "1.85 Tola",
        "description": "Exquisite bridal earrings displaying classic Pakistani craftsmanship. Perfect hanging chandelier style adorned with high-grade Basra pearls and gold tassels.",
        "imageUrl": "assets/earrings2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-e03",
        "name": "Traditional Gold Baliyan",
        "referenceCode": "IJ-E03",
        "category": "earring",
        "metalPurity": "21K Gold",
        "estimatedWeight": "1.20 Tola",
        "description": "Classic medium-sized gold hoops. Crafted with detailed twisted wire filigree and small gold beads hanging at the base.",
        "imageUrl": "assets/earrings.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-e04",
        "name": "Kundan Chandbali Earrings",
        "referenceCode": "IJ-E04",
        "category": "earring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "2.80 Tola",
        "description": "Magnificent crescent moon shaped (chandbali) earrings. Decorated with emerald drop beads, fresh water pearls, and fine Kundan glass stones.",
        "imageUrl": "assets/earrings2.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-e05",
        "name": "Diamond Flower Studs",
        "referenceCode": "IJ-E05",
        "category": "earring",
        "metalPurity": "18K White Gold",
        "estimatedWeight": "1.00 Carat Diamond",
        "description": "Sparkling diamond cluster earrings designed as flowers in bloom. Hand-set on 18K white gold with secure screw backs.",
        "imageUrl": "assets/earrings.jpg",
        "basePrice": 0,
        "listed": True
    },
    {
        "id": "ij-e06",
        "name": "Traditional Gold Tops",
        "referenceCode": "IJ-E06",
        "category": "earring",
        "metalPurity": "22K Gold",
        "estimatedWeight": "0.80 Tola",
        "description": "Simple and elegant everyday gold tops. Styled with traditional floral textures and highly polished finishes.",
        "imageUrl": "assets/earrings2.jpg",
        "basePrice": 0,
        "listed": True
    }
]

# 3. Seed Products
print(f"Uploading {len(products)} products to Firestore database...")
for item in products:
    doc_id = item["id"]
    print(f" - Seeding product: {item['name']} ({item['referenceCode']})...")
    
    # Structure REST payload
    doc_data = {
        "fields": {
            "name": {"stringValue": item["name"]},
            "referenceCode": {"stringValue": item["referenceCode"]},
            "category": {"stringValue": item["category"]},
            "metalPurity": {"stringValue": item["metalPurity"]},
            "estimatedWeight": {"stringValue": item["estimatedWeight"]},
            "description": {"stringValue": item["description"]},
            "imageUrl": {"stringValue": item["imageUrl"]},
            "basePrice": {"integerValue": int(item["basePrice"])},
            "listed": {"booleanValue": item["listed"]}
        }
    }
    
    url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/products/{doc_id}"
    req = urllib.request.Request(
        url,
        data=json.dumps(doc_data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        method="PATCH"
    )
    
    try:
        with urllib.request.urlopen(req) as res:
            pass # print(f"Uploaded {doc_id} successfully.")
    except Exception as e:
        print(f"Failed to upload product {doc_id}: {e}")
        if hasattr(e, 'read'):
            print("Error details:", e.read().decode())
        exit(1)

# 4. Seed Settings Document
print("Uploading site settings...")
settings_doc = {
    "fields": {
        "websiteName": {"stringValue": "IKRAM JEWELLERS"},
        "logoUrl": {"stringValue": "assets/logo.png"},
        "brandIconUrl": {"stringValue": "assets/logo.png"}
    }
}
settings_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/settings/site"
req_settings = urllib.request.Request(
    settings_url,
    data=json.dumps(settings_doc).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    },
    method="PATCH"
)

try:
    with urllib.request.urlopen(req_settings) as res:
        print("Success! Site identity settings seeded.")
except Exception as e:
    print("Failed to upload site settings:", e)
    if hasattr(e, 'read'):
        print("Error details:", e.read().decode())
    exit(1)

print("\n=======================================================")
print("[SUCCESS] All jewelry catalog items & website settings")
print("seeded successfully into your Firestore database!")
print("=======================================================")
