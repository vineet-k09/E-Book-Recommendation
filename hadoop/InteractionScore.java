import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class InteractionScore {

    public static class InteractionMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
        private ObjectMapper objectMapper = new ObjectMapper();
        private final static IntWritable scoreWritable = new IntWritable();
        private Text userBookKey = new Text();

        @Override
        public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
            try {
                JsonNode node = objectMapper.readTree(value.toString());
                String userId = node.get("userId").asText();
                String bookId = node.get("bookId").asText();
                String action = node.get("action").asText();

                int score;
                switch (action) {
                    case "like":
                        score = 3;
                        break;
                    case "bookmark":
                        score = 2;
                        break;
                    case "click":
                        score = 1;
                        break;
                    case "read":
                        score = 4;
                        break;
                    default:
                        score = 0;
                        break;
                }

                if (score > 0) {
                    userBookKey.set(userId + "," + bookId);
                    scoreWritable.set(score);
                    context.write(userBookKey, scoreWritable);
                }
            } catch (Exception e) {
                System.err.println("Bad line: " + value.toString());
            }
        }
    }

    public static class ScoreReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
            int totalScore = 0;
            for (IntWritable val : values) {
                totalScore += val.get();
            }
            result.set(totalScore);
            context.write(key, result); // Output: userId,bookId \t score
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "interaction score");

        job.setJarByClass(InteractionScore.class);
        job.setMapperClass(InteractionMapper.class);
        job.setCombinerClass(ScoreReducer.class);
        job.setReducerClass(ScoreReducer.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        if (args.length < 2) {
            System.err.println("Usage: InteractionScore <input path> <output path>");
            System.exit(-1);
        }

        FileInputFormat.addInputPath(job, new Path(args[0])); // ✅ Input from CLI
        FileOutputFormat.setOutputPath(job, new Path(args[1])); // ✅ Output from CLI

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
