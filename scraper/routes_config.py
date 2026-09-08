"""
Routes and Configuration for Ethical Airfare Web-Scraping Engine
Based on DGCA Domestic Scheduled Passenger Traffic Data and MoSPI PSD Basket
"""

import os
from typing import List, Dict, Any

# Primary DGCA representative city-pairs
DGCA_CITY_PAIRS = [
    {"code": "DEL-BOM", "origin": "DEL", "destination": "BOM", "name": "Delhi to Mumbai", "weight": 0.19, "pax_lakhs": 8.42},
    {"code": "DEL-BLR", "origin": "DEL", "destination": "BLR", "name": "Delhi to Bengaluru", "weight": 0.15, "pax_lakhs": 6.55},
    {"code": "BOM-BLR", "origin": "BOM", "destination": "BLR", "name": "Mumbai to Bengaluru", "weight": 0.13, "pax_lakhs": 5.68},
    {"code": "DEL-CCU", "origin": "DEL", "destination": "CCU", "name": "Delhi to Kolkata", "weight": 0.10, "pax_lakhs": 4.38},
    {"code": "BLR-HYD", "origin": "BLR", "destination": "HYD", "name": "Bengaluru to Hyderabad", "weight": 0.09, "pax_lakhs": 3.94},
    {"code": "MAA-DEL", "origin": "MAA", "destination": "DEL", "name": "Chennai to Delhi", "weight": 0.12, "pax_lakhs": 5.25},
    {"code": "DEL-HYD", "origin": "DEL", "destination": "HYD", "name": "Delhi to Hyderabad", "weight": 0.11, "pax_lakhs": 4.81},
    {"code": "BOM-CCU", "origin": "BOM", "destination": "CCU", "name": "Mumbai to Kolkata", "weight": 0.11, "pax_lakhs": 4.80},
]

# Standard advance-purchase observation windows (days to departure)
ADVANCE_WINDOWS = [1, 7, 15, 30, 45]

# Website Compliance Matrix from robots.txt and ToS evaluation
SCRAPER_COMPLIANCE = {
    "Yatra": {
        "status": "ALLOWED",
        "robots_txt": True,
        "tos_allowed": True,
        "priority": 1,
        "rate_limit_delay_sec": 4.0,
    },
    "Akasa Air": {
        "status": "ALLOWED",
        "robots_txt": True,
        "tos_allowed": True,
        "priority": 2,
        "rate_limit_delay_sec": 3.5,
    },
    "SpiceJet": {
        "status": "ALLOWED",
        "robots_txt": True,
        "tos_allowed": True,
        "priority": 3,
        "rate_limit_delay_sec": 4.0,
    },
    # Excluded sources due to legal / robots.txt restrictions
    "IndiGo": {"status": "DISALLOWED", "reason": "robots.txt & ToS explicitly forbid automated access"},
    "Air India": {"status": "DISALLOWED", "reason": "robots.txt disallows search path"},
    "Air India Express": {"status": "DISALLOWED", "reason": "Disallowed by portal policy"},
    "Cleartrip": {"status": "DISALLOWED", "reason": "robots.txt disallow rule"},
    "EaseMyTrip": {"status": "DISALLOWED", "reason": "robots.txt disallow rule"},
    "Ixigo": {"status": "DISALLOWED", "reason": "ToS strictly forbids scraping"},
}

def load_city_pairs_from_excel(filepath: str = "flight_city_pairs_01.xlsx") -> List[Dict[str, str]]:
    """
    Loads city pairs from flight_city_pairs_01.xlsx if present,
    falling back to standard DGCA city pairs.
    """
    if os.path.exists(filepath):
        try:
            import pandas as pd
            df = pd.read_excel(filepath)
            pairs = []
            for _, row in df.iterrows():
                origin = str(row.get("CITY1", "")).strip()
                dest = str(row.get("CITY2", "")).strip()
                if origin and dest:
                    pairs.append({
                        "code": f"{origin}-{dest}",
                        "origin": origin,
                        "destination": dest,
                    })
            if pairs:
                return pairs
        except Exception as err:
            print(f"[WARN] Failed reading {filepath}: {err}. Using default DGCA routes.")
    return DGCA_CITY_PAIRS
