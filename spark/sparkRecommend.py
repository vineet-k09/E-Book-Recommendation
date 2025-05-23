# spark/sparkRecommender.py

import json
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from pyspark.sql.functions import col, count
from pyspark.ml.evaluation import RegressionEvaluator

# Initialize Spark
spark = SparkSession.builder \
    .appName("BookRecommendationSystem") \
    .master("local[*]") \
    .getOrCreate()

# Load data
data_path = "../hadoop/output/output.txt"
df_raw = spark.read.csv(data_path, sep="\t", inferSchema=True).withColumnRenamed("_c0", "user_book").withColumnRenamed("_c1", "rating")
df = df_raw.selectExpr("split(user_book, ',')[0] as user_id", "split(user_book, ',')[1] as book_id", "cast(rating as int) as rating")

# Generate string to integer IDs
from pyspark.ml.feature import StringIndexer
from pyspark.sql.functions import regexp_replace

df_cleaned = df.withColumn("user_id", regexp_replace("user_id", "[^a-zA-Z0-9]", "")).withColumn("book_id", regexp_replace("book_id", "[^a-zA-Z0-9]", ""))


user_indexer = StringIndexer(inputCol="user_id", outputCol="user_index").fit(df_cleaned)
book_indexer = StringIndexer(inputCol="book_id", outputCol="book_index").fit(df_cleaned)

df_indexed = user_indexer.transform(df_cleaned)
df_indexed = book_indexer.transform(df_indexed)

# Drop rows with null ratings as ALS does not support them
df_indexed = df_indexed.dropna(subset=["rating"])

# ALS Model
als = ALS(userCol="user_index", itemCol="book_index", ratingCol="rating", coldStartStrategy="drop")
model = als.fit(df_indexed)

# Make user recommendations
userRecs = model.recommendForAllUsers(5)

# Reverse index for user/book IDs
user_id_labels = user_indexer.labels
book_id_labels = book_indexer.labels

# Convert ALS output to readable format
rec_result = []

for row in userRecs.collect():
    uid = int(row["user_index"])
    recs = [{"book_id": book_id_labels[r.book_index], "score": float(r.rating)} for r in row["recommendations"]]
    rec_result.append({"user_id": user_id_labels[uid], "recommendations": recs})

# Save recommendations
with open("output/recommendations.json", "w") as f:
    json.dump(rec_result, f, indent=2)

# Find top 15 popular books (most rated)
top_books = df_cleaned.groupBy("book_id").agg(count("rating").alias("rating_count")).orderBy(col("rating_count").desc()).limit(15)
top_books_result = [{"book_id": r["book_id"], "rating_count": r["rating_count"]} for r in top_books.collect()]

# Save popular books
with open("output/popular_books.json", "w") as f:
    json.dump(top_books_result, f, indent=2)

print("✅ Recommendation and popular books saved in 'output/' folder.")

spark.stop()