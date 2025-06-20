import hrequests

# Start a stealth browser session
session = hrequests.Session(browser="firefox")

# Request the search results page
resp = session.get("https://www.bigw.com.au/toys/board-games-puzzles/trading-cards/pokemon-trading-cards/c/681510201")

# Render the page to execute JS and load product tiles
with resp.render(mock_human=True, timeout=60000) as page:
    tiles = page.html.find_all("li.ProductGrid_ProductTileWrapper__LkYlE")
    print(f"🔎 Found {len(tiles)} product tiles.\n")

    available = []
    sold_out = []

    for tile in tiles:
        # Get the product title
        title_elem = tile.find("p.ProductTile_name__0VCwU")
        title = title_elem.text.strip() if title_elem else "[No Title]"

        # Look for sold out label explicitly
        sold_out_label = tile.find('div[data-optly-product-tile-vertical-label="sold_out"]')

        # Look for "Add to Cart" button
        add_to_cart_section = tile.find("div.ProductTile_addToCart__J95xW")
        has_button = add_to_cart_section and add_to_cart_section.find("button")

        # Classify based on presence of button or sold_out label
        if sold_out_label or not has_button:
            sold_out.append(title)
        else:
            available.append(title)

    print("🟢 AVAILABLE ITEMS:")
    for name in available:
        print("  -", name)

    print("\n🔴 SOLD OUT ITEMS:")
    for name in sold_out:
        print("  -", name)
