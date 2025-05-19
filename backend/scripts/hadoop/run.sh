#!/bin/bash
#backend/scripts/hadoop/run.sh
# bash run.sh

HADOOP_HOME="E:/hadoop/hadoop324"
HADOOP_BIN="$HADOOP_HOME/bin/hadoop.cmd"
STREAMING_JAR=$(ls "$HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-"*.jar)
OUTPUT_PATH="hdfs:///user/vineet/output/genre_preferences"

echo "🧹 Cleaning old output..."
"$HADOOP_BIN" fs -rm -r -f "$OUTPUT_PATH"

echo "🚀 Running MapReduce job..."
"$HADOOP_BIN" jar "$STREAMING_JAR" \
  -files mapper.py,reducer.py \
  -input /user/vineet/interactions/interactions_lines.json \
  -output "$OUTPUT_PATH" \
  -mapper "python3 mapper.py" \
  -reducer "python3 reducer.py"

if [ $? -eq 0 ]; then
    echo "✅ Genre preferences per user calculated!"
    echo "🔍 To see results: hdfs dfs -cat $OUTPUT_PATH/part-*"
else
    echo "❌ MapReduce job failed!"
fi

# interactions.json ⟶ mapper.py + reducer.py ⟶ Hadoop MapReduce job

# Avoid clutter by deleting failed or test runs using:
# hdfs dfs -rm -r /user/vineet/output/old_folder