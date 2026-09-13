from datetime import date, datetime
from decimal import Decimal
from hashlib import sha256
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class SearchJob(BaseModel):
    source: str
    origin: str
    destination: str
    date: date
    id: str = Field(default="")

    @field_validator("source", "origin", "destination")
    @classmethod
    def normalize_code(cls, value):
        return value.strip().upper()

    def model_post_init(self, __context):
        if not self.id:
            raw = f"{self.source}|{self.origin}|{self.destination}|{self.date}"
            self.id = sha256(raw.encode()).hexdigest()[:16]


class FlightRecord(BaseModel):
    job_id: str
    scrape_time: datetime
    date: date
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    carrier: str
    flight_no: Optional[str] = None
    fare_class: Optional[str] = None
    base_fare: Optional[Decimal] = None
    convenience_fee: Optional[Decimal] = None
    taxes: Optional[Decimal] = None
    total_fees: Optional[Decimal] = None
    src_platform: str

    @property
    def route_id(self):
        return f"{self.origin}-{self.destination}"

    @property
    def flight_key(self):
        return (
            f"{self.carrier}_{self.flight_no}_"
            f"{self.origin}_{self.destination}_{self.date}"
        )

    @field_validator("origin", "destination", "carrier", "src_platform")
    @classmethod
    def normalize_text(cls, value):
        return value.strip().upper()

    @field_validator(
        "base_fare",
        "convenience_fee",
        "taxes",
        "total_fees",
    )
    @classmethod
    def validate_money(cls, value):
        if value is not None and value < 0:
            raise ValueError("Money values cannot be negative")
        return value