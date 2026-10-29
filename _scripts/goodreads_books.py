"""Turn a Goodreads library export into _data/books.json for /books.html.

Export from Goodreads: My Books -> Import and export -> Export Library.
Usage: python3 _scripts/goodreads_books.py goodreads_library_export.csv

Keeps books on the "read" shelf finished in MIN_YEAR or later, with tidied
titles (subtitles and edition notes dropped, series split out). Unrated
books are skipped; the rest go into the rating tiers the page groups by.
Also writes _data/book_stats.json for the charts under the list.
"""
import csv, json, os, re, sys

MIN_YEAR = 2023
DATA = os.path.join(os.path.dirname(__file__), "..", "_data")
OUT = os.path.join(DATA, "books.json")

# titles the generic clean-up can't fix
TITLES = {
    "東京喰種トーキョーグール 14 [Tokyo Guru 14]": ("Tokyo Ghoul, Vol. 14", ""),
    "Tokyo Ghoul Re - Tome 15": ("Tokyo Ghoul:re, Vol. 15", ""),
    "Dr.STONE 20": ("Dr. Stone, Vol. 20", ""),
    "Demon Slayer: Kimetsu no Yaiba, Vol. 22": ("Demon Slayer, Vol. 22", ""),
}

# Goodreads exports carry no genres, so they're assigned here by hand.
# Books missing from this map are reported and land in "Other fiction".
SF, FAN, SCI, HIST, OTH, COM = ("Science fiction", "Fantasy", "Science & ideas",
                                "History & lives", "Other fiction", "Comics & manga")
GENRES = {
    SF: ["Golden Son", "Red Rising", "The Dispossessed", "Artemis", "Leviathan Wakes",
         "Dust", "His Master's Voice", "Quarantine", "Project Hail Mary", "Diaspora",
         "Network Effect", "Fractal Noise", "Recursion", "2001: A Space Odyssey",
         "Foundation", "Contact", "Generations: Firefly", "Red Mars", "1984", "The Martian",
         "Heretics of Dune", "Dune Messiah", "Dune", "Death's End", "The Dark Forest",
         "The Three-Body Problem", "Utopian Madras & the Herald of the Worlds",
         "Brave New World", "I, Robot"],
    FAN: ["Piranesi", "The City of Brass", "House of Earth and Blood", "She Who Became the Sun",
          "The Blade Itself", "Katabasis", "American Gods", "The Wall of Storms",
          "Babel, or The Necessity of Violence", "Tress of the Emerald Sea", "The Burning God",
          "The Dragon Republic", "The Poppy War", "Mistborn: The Final Empire",
          "Legends & Lattes"],
    SCI: ["The Tao of Physics", "Who We Are and How We Got Here", "Nexus", "The Divine Within",
          "The Big Picture", "Possible Minds", "Physics of the Impossible", "Space Chronicles",
          "Hyperspace"],
    HIST: ["Surely You're Joking, Mr. Feynman!", "A Brief History of China", "First Man",
           "The Three-Cornered War", "The Innovators", "Elon Musk", "Idea Man"],
    OTH: ["Deception Point", "The Secret of Secrets", "The Atlantis Gene",
          "50 Greatest Short Stories", "The Silent Bullet"],
    COM: ["DCeased", "Saga, Compendium One", "Batman: Three Jokers", "Dr. Stone, Vol. 20",
          "Tokyo Ghoul:re, Vol. 15", "Tokyo Ghoul, Vol. 14"],
}
GENRE_OF = {t: g for g, titles in GENRES.items() for t in titles}
KIND = {SCI: "Nonfiction", HIST: "Nonfiction", COM: "Comics & manga"}   # the rest is fiction


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
            "pages": int(row["Number of Pages"] or 0),
            "genre": GENRE_OF.get(title, OTH),
            "url": f"https://www.goodreads.com/book/show/{row['Book Id']}",
        })
        seen[key] = books[-1]

    books = [b for b in books if b["rating"] > 0]   # unrated books stay off the page
    books.sort(key=lambda b: b["date"], reverse=True)
    with open(OUT, "w") as f:
        json.dump(books, f, indent=1, ensure_ascii=False)
    for b in books:
        print(f"{b['date']}  {b['rating']:<4}  {b['title']}  ·  {b['genre']}  ·  {b['author']}")
        if b["title"] not in GENRE_OF:
            print("   ^ no genre set; add it to GENRES")
    print(f"{len(books)} books -> {os.path.normpath(OUT)}")

    with open(os.path.join(DATA, "book_stats.json"), "w") as f:
        json.dump(stats(books), f, indent=1, ensure_ascii=False)


def stats(books):
    """Numbers for the charts under the list; percentages are bar/arc lengths."""
    def avg(bs):
        return round(sum(b["rating"] for b in bs) / len(bs), 1)

    def ranked(key, keep=lambda bs: True):
        groups = {}
        for b in books:
            groups.setdefault(key(b), []).append(b)
        rows = [{"name": k, "count": len(v), "avg": avg(v)} for k, v in groups.items() if keep(v)]
        rows.sort(key=lambda r: (-r["count"], -r["avg"], r["name"]))
        top = max(r["count"] for r in rows)
        for r in rows:
            r["pct"] = round(100 * r["count"] / top)
        return rows

    years = sorted(ranked(lambda b: b["year"]), key=lambda r: r["name"])
    # donut: cumulative start/end of each slice in percent of the ring
    kinds, start = [], 0
    for r in ranked(lambda b: KIND.get(b["genre"], "Fiction")):
        share = 100 * r["count"] / len(books)
        kinds.append({**r, "share": round(share), "start": round(start, 2), "end": round(start + share, 2)})
        start += share
    return {
        "books": len(books),
        "pages": sum(b["pages"] for b in books),
        "avg": avg(books),
        "loved": sum(b["rating"] == 5 for b in books),
        "years": years,
        "kinds": kinds,
        "genres": ranked(lambda b: b["genre"]),
        # authors I've read more than once
        "authors": ranked(lambda b: b["author"], keep=lambda bs: len(bs) > 1),
    }


if __name__ == "__main__":
    main(sys.argv[1])
