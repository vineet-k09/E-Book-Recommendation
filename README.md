# 📚 E-Book Recommendation System

## 🎯 Goal

Build a full-stack, data-powered E-Book Recommendation System that:

* Suggests books based on user reading history and preferences
* Analyzes interaction trends
* Uses a hybrid of web technologies and big data tools

---

## 🛠️ Tech Stack Overview

| Layer      | Tools Used                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js, React, Context API                                                                                                 |
| Backend    | Node.js, Express, AuthContext                                                                                               |
| Database   | MongoDB                                                                                                                     |
| Big Data   | Hadoop (HDFS, MapReduce), Hive, Spark MLlib                                                                                 |
| Scheduling | Cron Jobs (node-cron), potentially Apache Airflow (for production scale)                                                    |

---

## 🔍 Core Functionalities

* **Store interactions in MongoDB** (bookmarks, likes, reads, dislikes)
* **Export logs to HDFS** regularly
* **Process metadata via MapReduce** to count actions per book/genre/author
* **Query insights using Hive** (e.g., total likes per genre)
* **Train collaborative filtering model using Spark MLlib (ALS)**
* **Recommend books to users based on similar behavior**
* **Trend detection via Spark** → push trending books to MongoDB → display on frontend

---

## 🧩 Backend Architecture Breakdown

### 🔄 MongoDB Schema Example

```js
interactions: [
  {
    userId: String,
    bookId: String,
    action: 'bookmark' | 'like' | 'dislike' | 'read',
    timestamp: Date
  }
]
```

* Ideal for local user queries
* Easily exportable to CSV/JSON for Hadoop ingestion

### 🚚 MongoDB → HDFS Export Flow

Batch job (Node.js/Python/cron):

1. Query MongoDB interactions
2. Dump to `interactions.csv`
3. Push to HDFS

### 🛠️ MapReduce Jobs

Examples:

* Count total likes/bookmarks per genre
* Aggregate actions per user/author
* Clean and normalize noisy records

### 🐝 Hive Queries

```sql
SELECT genre, COUNT(*) FROM interactions WHERE action = 'like' GROUP BY genre;
```

* Create external tables on HDFS dumps
* Query logs to generate insights

### 🔮 Spark MLlib Recommendations

* Input format: `(userId, bookId, action)`
* Use ALS (Alternating Least Squares)
* Output: Personalized recommendations

### 📈 Web Analytics

* Identify trending books
* Push trends to MongoDB for UI rendering
* Optionally use Google Analytics or in-house Spark-based analytics

---

## 🌐 Frontend Design: Page Layouts

### 🏠 `index.tsx`

* **Recommended for You** → based on `preferredGenres` (initially via MongoDB, later via Spark)
* **Explore More** → all books outside preferred genres

### 🧠 Recommendation API

Route: `/api/books/recommendations`

* Pulls from MongoDB or post-Spark model output

### 🧭 Auth Context

File: `pages/_app.tsx`

```tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

* Enables `useAuth()` across the app

---

## ⏱️ Automation Possibilities

### ✅ Theoretically Possible

* Use `node-cron` or Python scheduler
* Export logs hourly
* Trigger MapReduce/Hive/Spark scripts

### ❌ Practically Limited on Localhost

Running all services locally (MongoDB, Hadoop, Spark, Hive, Next.js, Express) will likely exhaust your laptop.

### ✅ Future Deployment Stack

* Automate ETL with: Apache Airflow, AWS Glue, or Databricks Workflows

---

## 🤔 Questions to Finalize Workflow

Answer these to lock the structure:

1. Are you running Hadoop & Spark locally, cluster, or cloud?
2. Are recs real-time or periodic (e.g., daily)?
3. Is user login/registration completed?
4. Does frontend need to show analytics?
5. Is book metadata (genre, author, etc.) already stored?

---

## 🚀 Current Status

* ✅ MongoDB schema and local interaction logging
* ✅ AuthContext and frontend structure fixed
* 🛠️ Big data pipeline under construction
* 🔜 Spark + Hive integration for recommendations

Keep hitting me with the next file — we’re stacking this README like a fortress of logic and code. 🧱⚡
