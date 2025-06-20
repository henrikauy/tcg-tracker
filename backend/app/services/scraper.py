import hrequests
from pprint import pprint
from pydantic import BaseModel

class SearchItem(BaseModel):
    id: str
    name: str
    price: float
    in_stock: bool
    image_url: str

# Start a stealth browser session
session = hrequests.Session(browser="firefox")

# API URL for Big W's product search
url = "https://api.bigw.com.au/search/v1/search"

# Headers to mimic a browser request
headers = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

payload = {
    "format": "1",
    "clientId": "web",
    "page": 0,
    "perPage": 48,
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


response = session.post(url, json=payload, headers=headers)

if response.ok:
    items = []
    data = response.json()
    for item in data["organic"]["results"]:
        try:
            product_id = item["identifiers"]["articleId"]
            product_name = item["information"]["name"]
            in_stock = bool(item["stock"])
            price = item["prices"]["WA"]["price"]["cents"]
            image_url = "https:" + item["information"]["media"]["images"][0]["thumbnail"]["url"]

            search_item = SearchItem(
                id=product_id,
                name=product_name,
                price=price / 100,  # Convert cents to dollars
                in_stock=in_stock,
                image_url=image_url,
            )
            items.append(search_item)
            print("Data retrieved successfully:")
            # for item in items:
            #     pprint(item)

        except KeyError as e:
            print(f"KeyError: {e} in item {item}")

    print("Available products:")
    for item in items:
        if item.in_stock:
            print(f"Name: {item.name}")
    print("Unavailable products:")
    for item in items:
        if not item.in_stock:
            print(f"Name: {item.name}")

else:
    print("Failed to retrieve data:")
    pprint(response.json())
