from backend.app.crud.release import get_release_by_id, upsert_release, get_release_by_url, get_all_releases
import datetime

def test_insert_new():
    info1 = {
        "name": "Alpha Test Set",
        "url": "https://example.com/pokemon-alpha",
        "source": "TestSource",
        "status": "pre-order",
        "release_date": datetime.date(2025, 8, 1),
        "last_checked": datetime.datetime.now(),
    }
    inserted = upsert_release(info1)
    print("Inserted:", inserted)

def test_update_existing():
    # Use the same URL but change status
    info2 = {
        "name": "Alpha Test Set - Renamed",  # maybe the title changed
        "url": "https://example.com/pokemon-alpha",
        "source": "TestSource",
        "status": "in-stock",  # now it’s in stock
        # We can omit release_date if it remains the same
        "last_checked": datetime.datetime.now(),
    }
    updated = upsert_release(info2)
    print("Updated:", updated)

    # Verify get_release_by_url returns the updated status
    found = get_release_by_url("https://example.com/pokemon-alpha")
    print("After update, lookup:", found)

def test_lookup_by_id():
    # Create (or update) a release so we know its ID
    info = {
        "name": "ID Test Set",
        "url": "https://example.com/pokemon-id-test",
        "source": "TestSource",
        "status": "pre-order",
        "release_date": datetime.date(2025, 9, 1),
        "last_checked": datetime.datetime.now(),
    }
    inserted = upsert_release(info)
    rid = inserted.id
    print("Inserted release ID is:", rid)

    # Now fetch it by ID
    found = get_release_by_id(rid)
    print("Lookup by ID returned:", found)

    # If we fetch an ID that doesn’t exist (e.g. 99999), we should get None
    missing = get_release_by_id(99999)
    print("Lookup of non-existent ID returned:", missing)


def test_list_all():
    # Insert a couple of test releases (if none exist)
    base_url = "https://example.com/pokemon-test-"
    for i in range(2):
        info = {
            "name": f"Test Set #{i}",
            "url": base_url + str(i),
            "source": "TestSource",
            "status": "pre-order",
            "last_checked": datetime.datetime.now(),
        }
        upsert_release(info)

    all_releases = get_all_releases()
    print(f"There are {len(all_releases)} releases in total:")
    for rel in all_releases:
        print(rel.id, rel.name, rel.status)

if __name__ == "__main__":
    test_insert_new()
    test_lookup_by_id()
    test_update_existing()
    test_list_all()