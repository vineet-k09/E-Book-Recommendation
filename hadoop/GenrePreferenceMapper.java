import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;
import org.json.JSONArray;
import org.json.JSONObject;

public class GenrePreferenceMapper extends Mapper<LongWritable, Text, Text, Text> {

    public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        try {
            JSONObject obj = new JSONObject(value.toString().trim());
            String userId = obj.optString("userId");
            String action = obj.optString("action");

            if (!userId.isEmpty() && (action.equals("read") || action.equals("like"))) {
                JSONArray genres = obj.optJSONArray("genre");
                if (genres != null) {
                    for (int i = 0; i < genres.length(); i++) {
                        String genre = genres.getString(i).trim();
                        context.write(new Text(userId), new Text(genre));
                    }
                }
            }
        } catch (Exception e) {
            // skip bad JSON lines
        }
    }
}
