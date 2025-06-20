import hrequests
from pprint import pprint
from backend.app.schemas import SearchItem

# Start a stealth browser session (using Firefox)
session = hrequests.Session(browser="firefox")

# Big W API endpoint for product search
url = "https://api.bigw.com.au/search/v1/search"

# Headers to mimic a real browser
headers = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

# Payload for the POST request (search parameters)
payload = {
    "format": "1",
    "clientId": "web",
    "page": 0,
    "perPage": 100,
    "sort": "relevance",
    "text": "",
    "category": "681510201",
    "filter": {"inStock": False, "fulfilment": ["Home Delivery"]},
    "state": "WA",
    "zone": "PERTHONDEMAND",
    "storeId": "0454",
    "include": {
        "facets": True,
        "additionalFacets": ["categorySize"],
        "suggestions": False,
        "productAttributes": [
            "attributes.collectable",
            "attributes.deliverable",
            "attributes.listingStatus",
            "attributes.maxQuantity",
            "information.name",
            "information.brand",
            "information.bundle",
            "information.rating",
            "information.categories",
            "information.collections",
            "information.media.badges",
            "information.media.images",
            "information.specifications",
            "information.variants.code",
            "fulfilment.dsv",
            "fulfilment.preorder",
            "fulfilment.delivery",
            "fulfilment.collection",
            "fulfilment.logisticType",
            "fulfilment.productChannel",
            "prices.WA",
            "identifiers",
            "promotions",
        ],
    },
}

def fetch_bigw():
    """Fetch products from Big W API and return a list of SearchItem objects."""
    try:
        # Send POST request to the API
        response = session.post(url, json=payload, headers=headers)
        if response.ok:
            items = []
            data = response.json()
            # Iterate over each product in the results
            for item in data["organic"]["results"]:
                try:
                    # Extract product details
                    product_id = item["identifiers"]["articleId"]
                    product_name = item["information"]["name"]
                    in_stock = bool(item["stock"])
                    price = item["prices"]["WA"]["price"]["cents"]
                    image_url = (
                        "https:" + item["information"]["media"]["images"][0]["thumbnail"]["url"]
                    )
                    product_url = f"https://www.bigw.com.au/product/{product_name.replace(' ', '-').lower()}/p/{product_id}"  # Add product URL

                    # Create a SearchItem instance
                    search_item = SearchItem(
                        id=product_id,
                        name=product_name,
                        price=price / 100,
                        in_stock=in_stock,
                        image_url=image_url,
                        url=product_url,
                    )
                    items.append(search_item)
                    # Print fetched item details
                    print(
                        f"Fetched item: {search_item.name} (ID: {search_item.id}, Price: ${search_item.price}, In Stock: {search_item.in_stock})"
                    )
                except KeyError as e:
                    # Handle missing keys in product data
                    print(f"KeyError: {e} in item {item}")
            return items
        else:
            # Print error response if request failed
            print("Failed to retrieve data:")
            pprint(response.json())
    except Exception as e:
        # Handle any other exceptions
        print(f"An error occurred: {e}")

