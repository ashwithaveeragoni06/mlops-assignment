from datetime import timedelta
from feast import FeatureView, Field, FileSource, Entity
from feast.types import Float32, Int64

customer = Entity(
    name="customer_id",
    description="Customer identifier"
)

fraud_source = FileSource(
    path="../data/processed/processed_features.parquet",
    timestamp_field="event_timestamp",
)

fraud_features = FeatureView(
    name="fraud_features",
    entities=[customer],
    ttl=timedelta(days=90),
    schema=[
        Field(name="amt",              dtype=Float32),
        Field(name="city_pop",         dtype=Float32),
        Field(name="age",              dtype=Int64),
        Field(name="transaction_hour", dtype=Int64),
        Field(name="high_amount_flag", dtype=Int64),
    ],
    online=True,
    source=fraud_source,
)
