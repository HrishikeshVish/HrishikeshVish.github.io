"""Turn a Goodreads library export into _data/books.json for /books.html.

Export from Goodreads: My Books -> Import and export -> Export Library.
Usage: python3 _scripts/goodreads_books.py goodreads_library_export.csv

Keeps books on the "read" shelf finished in MIN_YEAR or later, with tidied
titles (subtitles and edition notes dropped, series split out). Unrated
books are skipped; the rest go into the rating tiers the page groups by.
"""
import csv, json, os, re, sys

MIN_YEAR = 2023
OUT = os.path.join(os.path.dirname(__file__), "..", "_data", "books.json")

# titles the generic clean-up can't fix
TITLES = {
    "東京喰種トーキョーグール 14 [Tokyo Guru 14]": ("Tokyo Ghoul, Vol. 14", ""),
    "Tokyo Ghoul Re - Tome 15": ("Tokyo Ghoul:re, Vol. 15", ""),
    "Dr.STONE 20": ("Dr. Stone, Vol. 20", ""),
    "Demon Slayer: Kimetsu no Yaiba, Vol. 22": ("Demon Slayer, Vol. 22", ""),
}


def clean_title(raw):
    title, series = raw, ""
    m = re.match(r"^(.*?)\s*\(([^()]*#[^()]*)\)\s*$", title)       # "(The Expanse, #1)"
    if m:
        title, series = m.group(1), re.sub(r",?\s*#", " #", m.group(2))
    title = re.sub(r"\s*\((?:[^()]*Edition|P\.S\.)\)\s*$", "", title)  # "(French Edition)"
    if title in TITLES:
        return TITLES[title]
    head, _, sub = title.partition(": ")
    # drop long explanatory subtitles, keep short ones like "Batman: Three Jokers"
    if sub and len(sub.split()) > 3:
        title = head
    # "Dune (Dune, #1)" says nothing the title doesn't
    if series.rsplit(" #", 1)[0] == title:
        series = ""
    return title, series


def main(path):
    books, seen = [], {}
    for row in csv.DictReader(open(path, encoding="utf-8-sig")):
        date = row["Date Read"].replace("/", "-")
        if row["Exclusive Shelf"] != "read" or date[:4] < str(MIN_YEAR):
            continue
        title, series = clean_title(row["Title"].strip())
        rating = float(row["My Rating"] or 0)
        key = (date[:4], title.lower())
        if key in seen:                       # same book shelved twice in a year
            seen[key]["rating"] = max(seen[key]["rating"], rating)
            continue
        books.append({
            "title": title,
            "series": series,
            "author": " ".join(row["Author"].split()),
            "rating": rating,
            # shelf on the page: 5 loved, 4 liked, 3 fine, 2 and below not for me
            "tier": str(max(2, int(rating))),
            "date": date,
            "year": date[:4],
            "url": f"https://www.goodreads.com/book/show/{row['Book Id']}",
        })
        seen[key] = books[-1]

    books = [b for b in books if b["rating"] > 0]   # unrated books stay off the page
    books.sort(key=lambda b: b["date"], reverse=True)
    with open(OUT, "w") as f:
        json.dump(books, f, indent=1, ensure_ascii=False)
    for b in books:
        print(f"{b['date']}  {b['rating']:<4}  {b['title']}  ·  {b['series']}  ·  {b['author']}")
    print(f"{len(books)} books -> {os.path.normpath(OUT)}")


if __name__ == "__main__":
    main(sys.argv[1])
