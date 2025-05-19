@echo off
setlocal enabledelayedexpansion

set HADOOP_HOME=E:\hadoop\hadoop324
set HADOOP_BIN=%HADOOP_HOME%\bin\hadoop.cmd
set STREAMING_JAR=%HADOOP_HOME%\share\hadoop\tools\lib\hadoop-streaming-3.2.4.jar
set OUTPUT_PATH=hdfs:///user/vineet/output/genre_preferences

echo 🚀 Running MapReduce job...

"%HADOOP_BIN%" jar "%STREAMING_JAR%" -files mapper.py,reducer.py -input /user/vineet/interactions/sfs.json -output OUTPUT_PATH% -mapper "python mapper.py" -reducer "python reducer.py"

echo ✅ Genre preferences per user calculated!
echo 🔍 To see results: hdfs dfs -cat %OUTPUT_PATH%/part-*

pause
