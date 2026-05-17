from datetime import timedelta
from feast import FeatureView, Feature, FileSource, ValueType
from entities import customer

fraud_source = FileSource(
    path="../data/processed/processed_features.csv",
    timestamp_field="unix_time",
)

fraud_features = FeatureView(
    name="fraud_features",
    entities=["customer_id"],
    ttl=timedelta(days=90),
    features=[
        Feature(name="amt",          value_type=ValueType.FLOAT),
        Feature(name="city_pop",     value_type=ValueType.FLOAT),
        Feature(name="age",          value_type=ValueType.INT64),
        Feature(name="transaction_hour", value_type=ValueType.INT64),
        Feature(name="high_amount_flag", value_type=ValueType.INT64),
    ],
    online=True,
    source=fraud_source,
)