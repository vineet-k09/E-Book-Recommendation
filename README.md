# Welcome to Biblioverse
# 📚 E-Book Recommendation System

## 🎯 Overview

A full-stack E-Book Recommendation System that leverages:

- User interactions stored in MongoDB  
- Batch exports to Hadoop HDFS  
- MapReduce jobs for data aggregation  
- Hive for querying processed data  
- Spark MLlib for collaborative filtering recommendations  
- Frontend in Next.js showing personalized and explored books  

All running locally with manual batch jobs to keep system resource usage in check.

## 🧭 Visual Blueprint — See the System in Action

[![Figma Design](https://img.shields.io/badge/Figma-Design-blue?logo=figma&style=for-the-badge)](https://www.figma.com/board/LqTWwlRKuz1x7wg0yX0gpk/Ebook-Recommendation?node-id=0-1&t=YWQOLIlqQu9NX93z-1)

> Click the badge to explore the full layout on Figma — from user flow to UI components.

---
<img src="https://github.com/vineet-k09/E-Book-Recommendation/blob/main/frontend.png">
<img src="https://github.com/vineet-k09/E-Book-Recommendation/blob/main/image.png">

## 🧰 Tech Stack

| Layer     | Tools & Frameworks                                  |
| --------- | ------------------------------------------------- |
| Frontend  | Next.js, React, Context API                        |
| Backend   | Node.js, Express, MongoDB                          |
| Big Data  | Hadoop (HDFS, MapReduce), Hive, Spark MLlib       |
| Environment | Localhost (Hadoop & Spark), manual batch runs   |

---

## 🗂️ Backend Data Flow

### MongoDB Schema for Interactions

~~~js
interactions: [
  {
    userId: String,
    bookId: String,
    action: 'bookmark' | 'like' | 'dislike' | 'read',
    timestamp: Date
  }
]
~~~

---

### Export Script (`exportInteractions.js`)

Run this **outside** your Express backend to keep batch jobs clean and safe.

~~~js
const mongoose = require('mongoose');
const fs = require('fs');
const Book = require('../models/Book');

mongoose.connect('mongodb://localhost/ebookdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function exportInteractions() {
  try {
    const books = await Book.find().lean();
    fs.writeFileSync('interactions.json', JSON.stringify(books, null, 2));
    console.log('✅ Exported to interactions.json');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error exporting interactions:', err);
  }
}

exportInteractions();
~~~

**How to push to HDFS (terminal):**

~~~bash
hdfs dfs -put interactions.json /user/yourusername/interactions/
~~~

---

### Hadoop MapReduce Job Example

~~~bash
hadoop jar %HADOOP_HOME%\share\hadoop\tools\lib\hadoop-streaming-*.jar \
  -input /user/vineet/interactions/interactions.json \
  -output /user/vineet/processed/interaction_summary \
  -mapper "python3 backend/scripts/hadoop/mapper.py" \
  -reducer "python3 backend/scripts/hadoop/reducer.py" \
  -file backend/scripts/hadoop/mapper.py \
  -file backend/scripts/hadoop/reducer.py
~~~

- Mapper: emits `(bookId, action)` pairs  
- Reducer: aggregates counts per `(bookId, action)`  

---

### Hive Query Sample

~~~sql
CREATE EXTERNAL TABLE interactions (
  bookId STRING,
  action STRING
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
LOCATION '/user/vineet/processed/interaction_summary';

SELECT bookId, COUNT(*) AS total_likes
FROM interactions
WHERE action = 'like'
GROUP BY bookId;
~~~

---

### Spark MLlib Recommendation Pipeline (Overview)

- Input: `(userId, bookId, action)` tuples  
- Model: ALS collaborative filtering  
- Output: Personalized book recommendations  
- Batch-run manually to control memory use  

---

## 🖥️ Frontend Highlights

### Auth Context Setup

`pages/_app.tsx`:

~~~tsx
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
~~~

### API Utility (`lib/api.ts`)

~~~ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBooks = async () => {
  const res = await fetch(`${BASE_URL}/api/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};
~~~

### Using in `books.tsx`

~~~tsx
import { fetchBooks } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {books.map(book => (
        <div key={book._id}>{book.title}</div>
      ))}
    </div>
  );
}
~~~

---

## 🌐 Local Hadoop UI Access

- NameNode: [http://localhost:9870](http://localhost:9870)  
- DataNode: [http://localhost:9864](http://localhost:9864)  
- ResourceManager: [http://localhost:8091](http://localhost:8091)  
- Default HDFS port: **9000**

---

## ⚙️ Java & Hadoop Setup (PowerShell)

~~~powershell
$env:JAVA_HOME="E:\hadoop\jdk-8.0.302.8-hotspot"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"

javac -cp "" -d classes GenrePreference*.java
# Hadoop config files are in E:\hadoop\hadoop324\etc\...
~~~

---

## 🏁 Summary

- Hadoop & Spark run **locally**; manual batch runs prevent RAM overload  
- Full MongoDB schema and interaction logging implemented  
- Book metadata and covers (via Google Books API) fully integrated  
- Frontend ready to consume recommendations from backend API  
- Analytics dashboard not needed for now; focus on recommendations and data pipeline  
