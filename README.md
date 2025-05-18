# Under Work!!

04 march initiation and setting up of the backend... the local server is initiated
PS E:\GithubRepo\E-Book-Recommendation> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

** https://www.figma.com/board/LqTWwlRKuz1x7wg0yX0gpk/Ebook-Recommendation?node-id=0-1&p=f&t=yDg3UGox0drtBxux-0 **

\*\*🛠️ How you can handle the big data pipeline:
Store in MongoDB → Export to HDFS

Set up a batch job (cron or backend script) that:

Periodically dumps MongoDB interactions into a CSV / JSON file

Uploads that to HDFS

MapReduce over metadata

Write MapReduce jobs to:

Count total likes, bookmarks, reads per genre, author, etc.

Calculate user engagement

Maybe clean or aggregate noisy data

Hive for querying

Create Hive tables on top of HDFS interaction + metadata files

Run ad-hoc queries:

sql
Copy
Edit
SELECT genre, COUNT(\*) FROM interactions WHERE action = 'like' GROUP BY genre;
Spark MLlib for recommendations

Use exported interaction data (userId, bookId, action) to:

Train collaborative filtering models (ALS)

Recommend books per user

Web analytics on trending books

Either:

Run Spark jobs to identify trending books + push to MongoDB → show on the frontend

OR integrate with something like Google Analytics, but Spark + MongoDB is more “in-house”
\*\*



im using context cause uk backend can be auth powerred but front end hates u 

set token and user r not setup locally now but globally using context
