import java.io.IOException;
import java.util.HashMap;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Reducer;

public class GenrePreferenceReducer extends Reducer<Text, Text, Text, Text> {

    public void reduce(Text userId, Iterable<Text> genres, Context context) throws IOException, InterruptedException {
        HashMap<String, Integer> genreCount = new HashMap<>();

        for (Text genre : genres) {
            String g = genre.toString();
            genreCount.put(g, genreCount.getOrDefault(g, 0) + 1);
        }

        for (String genre : genreCount.keySet()) {
            context.write(userId, new Text(genre + "\t" + genreCount.get(genre)));
        }
    }
}
