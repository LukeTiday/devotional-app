import os

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from typing import Optional
import re

load_dotenv()

router = APIRouter(prefix="/scripture", tags=["scripture"])

YOUVERSION_API_BASE_URL = os.getenv(
    "YOUVERSION_API_BASE_URL",
    "https://api.youversion.com/v1",
)
YOUVERSION_APP_KEY = os.getenv("YOUVERSION_APP_KEY")

BOOK_TO_USFM = {
    # Pentateuch
    "genesis": "GEN",
    "gen": "GEN",
    "exodus": "EXO",
    "exo": "EXO",
    "ex": "EXO",
    "leviticus": "LEV",
    "lev": "LEV",
    "numbers": "NUM",
    "num": "NUM",
    "deuteronomy": "DEU",
    "deut": "DEU",
    "deu": "DEU",

    # Historical books
    "joshua": "JOS",
    "josh": "JOS",
    "jos": "JOS",
    "judges": "JDG",
    "judg": "JDG",
    "jdg": "JDG",
    "ruth": "RUT",
    "rut": "RUT",

    "1 samuel": "1SA",
    "1samuel": "1SA",
    "1 sam": "1SA",
    "1sam": "1SA",
    "1sa": "1SA",
    "i samuel": "1SA",

    "2 samuel": "2SA",
    "2samuel": "2SA",
    "2 sam": "2SA",
    "2sam": "2SA",
    "2sa": "2SA",
    "ii samuel": "2SA",

    "1 kings": "1KI",
    "1kings": "1KI",
    "1 king": "1KI",
    "1ki": "1KI",
    "i kings": "1KI",

    "2 kings": "2KI",
    "2kings": "2KI",
    "2 king": "2KI",
    "2ki": "2KI",
    "ii kings": "2KI",

    "1 chronicles": "1CH",
    "1chronicles": "1CH",
    "1 chron": "1CH",
    "1chron": "1CH",
    "1ch": "1CH",
    "i chronicles": "1CH",

    "2 chronicles": "2CH",
    "2chronicles": "2CH",
    "2 chron": "2CH",
    "2chron": "2CH",
    "2ch": "2CH",
    "ii chronicles": "2CH",

    "ezra": "EZR",
    "ezr": "EZR",
    "nehemiah": "NEH",
    "neh": "NEH",
    "esther": "EST",
    "est": "EST",

    # Wisdom / poetry
    "job": "JOB",
    "psalm": "PSA",
    "psalms": "PSA",
    "ps": "PSA",
    "psa": "PSA",
    "proverbs": "PRO",
    "prov": "PRO",
    "pro": "PRO",
    "ecclesiastes": "ECC",
    "eccl": "ECC",
    "ecc": "ECC",
    "song of songs": "SNG",
    "song of solomon": "SNG",
    "songs": "SNG",
    "sng": "SNG",

    # Major prophets
    "isaiah": "ISA",
    "isa": "ISA",
    "jeremiah": "JER",
    "jer": "JER",
    "lamentations": "LAM",
    "lam": "LAM",
    "ezekiel": "EZK",
    "ezek": "EZK",
    "ezk": "EZK",
    "daniel": "DAN",
    "dan": "DAN",

    # Minor prophets
    "hosea": "HOS",
    "hos": "HOS",
    "joel": "JOL",
    "jol": "JOL",
    "amos": "AMO",
    "amo": "AMO",
    "obadiah": "OBA",
    "obad": "OBA",
    "oba": "OBA",
    "jonah": "JON",
    "jon": "JON",
    "micah": "MIC",
    "mic": "MIC",
    "nahum": "NAM",
    "nah": "NAM",
    "nam": "NAM",
    "habakkuk": "HAB",
    "hab": "HAB",
    "zephaniah": "ZEP",
    "zeph": "ZEP",
    "zep": "ZEP",
    "haggai": "HAG",
    "hag": "HAG",
    "zechariah": "ZEC",
    "zech": "ZEC",
    "zec": "ZEC",
    "malachi": "MAL",
    "mal": "MAL",

    # Gospels / Acts
    "matthew": "MAT",
    "matt": "MAT",
    "mat": "MAT",
    "mark": "MRK",
    "mrk": "MRK",
    "luke": "LUK",
    "luk": "LUK",
    "john": "JHN",
    "jhn": "JHN",
    "acts": "ACT",
    "act": "ACT",

    # Pauline epistles
    "romans": "ROM",
    "rom": "ROM",

    "1 corinthians": "1CO",
    "1corinthians": "1CO",
    "1 cor": "1CO",
    "1cor": "1CO",
    "1co": "1CO",
    "i corinthians": "1CO",

    "2 corinthians": "2CO",
    "2corinthians": "2CO",
    "2 cor": "2CO",
    "2cor": "2CO",
    "2co": "2CO",
    "ii corinthians": "2CO",

    "galatians": "GAL",
    "gal": "GAL",
    "ephesians": "EPH",
    "eph": "EPH",
    "philippians": "PHP",
    "phil": "PHP",
    "php": "PHP",
    "colossians": "COL",
    "col": "COL",

    "1 thessalonians": "1TH",
    "1thessalonians": "1TH",
    "1 thess": "1TH",
    "1thess": "1TH",
    "1 th": "1TH",
    "1th": "1TH",
    "i thessalonians": "1TH",

    "2 thessalonians": "2TH",
    "2thessalonians": "2TH",
    "2 thess": "2TH",
    "2thess": "2TH",
    "2 th": "2TH",
    "2th": "2TH",
    "ii thessalonians": "2TH",

    "1 timothy": "1TI",
    "1timothy": "1TI",
    "1 tim": "1TI",
    "1tim": "1TI",
    "1ti": "1TI",
    "i timothy": "1TI",

    "2 timothy": "2TI",
    "2timothy": "2TI",
    "2 tim": "2TI",
    "2tim": "2TI",
    "2ti": "2TI",
    "ii timothy": "2TI",

    "titus": "TIT",
    "tit": "TIT",
    "philemon": "PHM",
    "philem": "PHM",
    "phm": "PHM",

    # General epistles
    "hebrews": "HEB",
    "heb": "HEB",
    "james": "JAS",
    "jas": "JAS",

    "1 peter": "1PE",
    "1peter": "1PE",
    "1 pet": "1PE",
    "1pet": "1PE",
    "1pe": "1PE",
    "i peter": "1PE",

    "2 peter": "2PE",
    "2peter": "2PE",
    "2 pet": "2PE",
    "2pet": "2PE",
    "2pe": "2PE",
    "ii peter": "2PE",

    "1 john": "1JN",
    "1john": "1JN",
    "1 jn": "1JN",
    "1jn": "1JN",
    "i john": "1JN",

    "2 john": "2JN",
    "2john": "2JN",
    "2 jn": "2JN",
    "2jn": "2JN",
    "ii john": "2JN",

    "3 john": "3JN",
    "3john": "3JN",
    "3 jn": "3JN",
    "3jn": "3JN",
    "iii john": "3JN",

    "jude": "JUD",
    "jud": "JUD",

    # Apocalypse
    "revelation": "REV",
    "revelations": "REV",
    "rev": "REV",
}

def parse_reference(reference: str):
    cleaned_reference = reference.strip()

    # Supports:
    # John 15
    # Psalm 23
    chapter_match = re.match(
        r"^([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)$",
        cleaned_reference,
    )

    if chapter_match:
        book_name = " ".join(chapter_match.group(1).lower().split())
        chapter = int(chapter_match.group(2))

        book_code = BOOK_TO_USFM.get(book_name)

        if not book_code:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported book name: {book_name}",
            )

        return {
            "type": "chapter",
            "book_code": book_code,
            "chapter": chapter,
            "start_verse": None,
            "end_verse": None,
        }

    # Supports:
    # John 15:1
    # John 15:1-11
    verse_match = re.match(
        r"^([1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+):(\d+)(?:-(\d+))?$",
        cleaned_reference,
    )

    if not verse_match:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported scripture reference format: {reference}",
        )

    book_name = " ".join(verse_match.group(1).lower().split())
    chapter = int(verse_match.group(2))
    start_verse = int(verse_match.group(3))
    end_verse = int(verse_match.group(4) or start_verse)

    book_code = BOOK_TO_USFM.get(book_name)

    if not book_code:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported book name: {book_name}",
        )

    if end_verse < start_verse:
        raise HTTPException(
            status_code=400,
            detail="End verse cannot be before start verse",
        )

    return {
        "type": "verse_range",
        "book_code": book_code,
        "chapter": chapter,
        "start_verse": start_verse,
        "end_verse": end_verse,
    }


@router.get("/bibles")
def get_bibles():
    if not YOUVERSION_APP_KEY:
        raise HTTPException(
            status_code=500,
            detail="Missing YOUVERSION_APP_KEY",
        )

    response = requests.get(
        f"{YOUVERSION_API_BASE_URL}/bibles",
        headers={
            "X-YVP-App-Key": YOUVERSION_APP_KEY,
            "Accept": "application/json",
        },
        params={
            "language_ranges[]": "eng",
        },
        timeout=10,
    )

    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()

@router.get("/passage/{passage_id}")
def get_passage(passage_id: str, bible_id: Optional[int] = None):
    if not YOUVERSION_APP_KEY:
        raise HTTPException(
            status_code=500,
            detail="Missing YOUVERSION_APP_KEY",
        )

    selected_bible_id = bible_id or int(os.getenv("DEFAULT_BIBLE_ID", "111"))

    response = requests.get(
        f"{YOUVERSION_API_BASE_URL}/bibles/{selected_bible_id}/passages/{passage_id}",
        headers={
            "X-YVP-App-Key": YOUVERSION_APP_KEY,
            "Accept": "application/json",
        },
        params={
            "format": "html",
            "include_headings": "true",
            "include_notes": "false",
        },
        timeout=10,
    )

    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail=response.text,
        )

    return response.json()

@router.get("/reference")
def get_reference(reference: str, bible_id: Optional[int] = None):
    if not YOUVERSION_APP_KEY:
        raise HTTPException(
            status_code=500,
            detail="Missing YOUVERSION_APP_KEY",
        )

    selected_bible_id = bible_id or int(os.getenv("DEFAULT_BIBLE_ID", "111"))

    parsed = parse_reference(reference)

    if parsed["type"] == "chapter":
        passage_id = f"{parsed['book_code']}.{parsed['chapter']}"

        response = requests.get(
            f"{YOUVERSION_API_BASE_URL}/bibles/{selected_bible_id}/passages/{passage_id}",
            headers={
                "X-YVP-App-Key": YOUVERSION_APP_KEY,
                "Accept": "application/json",
            },
            params={
                "format": "html",
                "include_headings": "true",
                "include_notes": "false",
            },
            timeout=10,
        )

        if not response.ok:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text,
            )

        passage_data = response.json()

        return {
            "reference": passage_data.get("reference", reference),
            "bible_id": selected_bible_id,
            "verses": [],
            "content": passage_data.get("content", ""),
        }

    verses = []

    for verse_number in range(
        parsed["start_verse"],
        parsed["end_verse"] + 1,
    ):
        passage_id = f"{parsed['book_code']}.{parsed['chapter']}.{verse_number}"

        response = requests.get(
            f"{YOUVERSION_API_BASE_URL}/bibles/{selected_bible_id}/passages/{passage_id}",
            headers={
                "X-YVP-App-Key": YOUVERSION_APP_KEY,
                "Accept": "application/json",
            },
            params={
                "format": "html",
                "include_headings": "true",
                "include_notes": "false",
            },
            timeout=10,
        )

        if not response.ok:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text,
            )

        verse_data = response.json()

        verses.append(
            {
                "id": verse_data.get("id", passage_id),
                "reference": verse_data.get("reference"),
                "content": verse_data.get("content", ""),
                "verse_number": verse_number,
            }
        )

    combined_content = "\n".join(
        verse["content"]
        for verse in verses
    )

    return {
        "reference": reference,
        "bible_id": selected_bible_id,
        "verses": verses,
        "content": combined_content,
    }