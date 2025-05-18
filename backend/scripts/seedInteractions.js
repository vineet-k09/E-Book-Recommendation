const mongoose = require("mongoose");
const Book = require("../models/Book"); // adjust this path as needed
require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI;

const userIds = [
    "68289a3d84bc5a83ae986872",
    "6829982b5915d55e1a5cb92f",
    "682a060e9d02f03e1c4b707a"
];

const actions = ["like", "read", "bookmark", "dislike"];

mongoose.connect('mongodb://localhost:27017/ebooks', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        addFakeInteractions();
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

async function addFakeInteractions() {
    try {
        const books = await Book.find({});

        for (const book of books) {
            const newInteractions = [];

            for (const userId of userIds) {
                const numberOfActions = Math.floor(Math.random() * 4); // 0–3 actions per user

                for (let i = 0; i < numberOfActions; i++) {
                    const action = actions[Math.floor(Math.random() * actions.length)];
                    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)); // past 30 days

                    newInteractions.push({
                        userId,
                        action,
                        timestamp
                    });
                }
            }

            if (newInteractions.length > 0) {
                await Book.updateOne(
                    { _id: book._id },
                    { $push: { interactions: { $each: newInteractions } } }
                );
                console.log(`📚 Added ${newInteractions.length} interactions to "${book.title}"`);
            }
        }

        console.log("✅ Done adding interactions.");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        mongoose.disconnect();
    }
}


// How this works:
// Loads all books from your DB.

// For each book and user, randomly adds 0 - 3 interactions.

// Each interaction has a random action from your tabs and a random timestamp within the last month.

// Uses proper ObjectId for _id.

// Updates book document by pushing new interactions to the existing array.

// Before running:
// Backup your DB or test on a staging environment first.

// Make sure your Book model matches the schema expectations.

// Adjust path to your model if needed.

// Why I like this method:
// Safe incremental updates — no overwriting data.

// Realistic randomness for variety in logs.

// Simple and fast.

// If you want, I can also help you build a script to extract and export these logs for Hadoop later.Just say the word!

// TL; DR: Run the above script, and your books will be sprinkled with user interaction logs that look legit and will work nicely for your frontend and Hadoop analytics pipelines.

// Let me know if you want me to write the log export script next or need help tweaking the seeding logic!
// ✅ Connected to MongoDB
// 📚 Added 6 interactions to "The Picture of Dorian Gray"
// 📚 Added 7 interactions to "Frankenstein or The Modern Prometheus"       
// 📚 Added 4 interactions to "Dracula"
// 📚 Added 3 interactions to "The Jewel of Seven Stars"
// 📚 Added 6 interactions to "The Turn of the Screw"
// 📚 Added 6 interactions to "The Strange Case of Dr. Jekyll and Mr. Hyde" 
// 📚 Added 3 interactions to "Herland"
// 📚 Added 4 interactions to "Carmilla"
// 📚 Added 4 interactions to "The Great God Pan"
// 📚 Added 4 interactions to "Tales of Terror and Mystery"
// 📚 Added 2 interactions to "Carrie"
// 📚 Added 4 interactions to "Brood of the Witch-Queen"
// 📚 Added 3 interactions to "The Damned"
// 📚 Added 7 interactions to "Misery"
// 📚 Added 8 interactions to "The Shining"
// 📚 Added 8 interactions to "Alice's Adventures in Wonderland"
// 📚 Added 1 interactions to "Adventures of Huckleberry Finn"
// 📚 Added 3 interactions to "Gulliver's Travels"
// 📚 Added 3 interactions to "Don Quixote"
// 📚 Added 3 interactions to "Candide"
// 📚 Added 3 interactions to "Alice's Adventures in Wonderland / Through the Looking Glass"
// 📚 Added 6 interactions to "A history of New York"
// 📚 Added 8 interactions to "The History of Tom Jones"
// 📚 Added 4 interactions to "The Devil's Dictionary"
// 📚 Added 3 interactions to "Satyricon"
// 📚 Added 8 interactions to "Harry Potter and the Chamber of Secrets"     
// 📚 Added 6 interactions to "Мастер и Маргарита"
// 📚 Added 1 interactions to "Idle Thoughts of an Idle Fellow"
// 📚 Added 2 interactions to "American notes"
// 📚 Added 3 interactions to "The Hound of the Baskervilles"
// 📚 Added 2 interactions to "The Adventures of Sherlock Holmes [12 stories]"
// 📚 Added 1 interactions to "The Mysterious Affair at Styles"
// 📚 Added 4 interactions to "The Secret Adversary"
// 📚 Added 2 interactions to "His Last Bow [8 stories]"
// 📚 Added 5 interactions to "The Riddle of the Sands"
// 📚 Added 6 interactions to "The Man Who Was Thursday"
// 📚 Added 7 interactions to "Heart of Darkness"
// 📚 Added 3 interactions to "Преступление и наказание"
// 📚 Added 7 interactions to "Greenmantle"
// 📚 Added 6 interactions to "Trent's Last Case"
// 📚 Added 6 interactions to "Harry Potter and the Philosopher's Stone"    
// 📚 Added 3 interactions to "Prester John"
// 📚 Added 2 interactions to "Whose Body?"
// 📚 Added 2 interactions to "Treasure Island"
// 📚 Added 4 interactions to "The Thirty-Nine Steps"
// 📚 Added 6 interactions to "The Red Badge of Courage"
// 📚 Added 7 interactions to "The Prisoner of Zenda"
// 📚 Added 6 interactions to "The deerslayer"
// 📚 Added 4 interactions to "The Pathfinder"
// 📚 Added 8 interactions to "Le Tour du Monde en Quatre-Vingts Jours"     
// 📚 Added 5 interactions to "Vingt mille lieues sous les mers"
// 📚 Added 1 interactions to "The pioneers"
// 📚 Added 2 interactions to "White Fang"
// 📚 Added 8 interactions to "Kidnapped"
// 📚 Added 6 interactions to "Wuthering Heights"
// 📚 Added 1 interactions to "Emma"
// 📚 Added 8 interactions to "Sense and Sensibility"
// 📚 Added 4 interactions to "Little Women"
// 📚 Added 4 interactions to "Northanger Abbey"
// 📚 Added 6 interactions to "Ethan Frome"
// 📚 Added 3 interactions to "Anna Karenina"
// 📚 Added 6 interactions to "Jane Eyre"
// 📚 Added 5 interactions to "Le Comte de Monte Cristo"
// 📚 Added 2 interactions to "Uncle Tom's Cabin"
// 📚 Added 2 interactions to "The Moonstone"
// 📚 Added 5 interactions to "Women in Love"
// 📚 Added 4 interactions to "This Side of Paradise"
// 📚 Added 5 interactions to "Cranford"
// 📚 Added 2 interactions to "The Wonderful Wizard of Oz"
// 📚 Added 4 interactions to "The Prince"
// 📚 Added 7 interactions to "Through the Looking-Glass"
// 📚 Added 6 interactions to "Wind in the Willows"
// 📚 Added 2 interactions to "Five Children and It"
// 📚 Added 5 interactions to "A Midsummer Night's Dream"
// 📚 Added 2 interactions to "The Lost World"
// 📚 Added 8 interactions to "The Marvelous Land of Oz"
// 📚 Added 5 interactions to "Ozma of Oz"
// 📚 Added 5 interactions to "The Emerald City of Oz"
// 📚 Added 5 interactions to "Dorothy and the Wizard in Oz"
// 📚 Added 4 interactions to "The Lost Princess of Oz"
// 📚 Added 3 interactions to "The Time Machine"
// 📚 Added 3 interactions to "Brave New World"
// 📚 Added 5 interactions to "The Iron Heel"
// 📚 Added 7 interactions to "The Invisible Man"
// 📚 Added 2 interactions to "Flatland"
// 📚 Added 4 interactions to "The War of the Worlds"
// 📚 Added 5 interactions to "Nineteen Eighty-Four"
// 📚 Added 9 interactions to "The Princess and Curdie"
// 📚 Added 7 interactions to "Ἰλιάς"
// 📚 Added 6 interactions to "The Adventures of Tom Sawyer"
// 📚 Added 3 interactions to "The Scarlet Pimpernel"
// 📚 Added 1 interactions to "The Coral Island"
// 📚 Added 5 interactions to "Le petit prince"
// 📚 Added 3 interactions to "Tom Sawyer, Detective"
// 📚 Added 4 interactions to "The Return of the King"
// 📚 Added 4 interactions to "Harry Potter and the Prisoner of Azkaban"    
// 📚 Added 6 interactions to "Pride and Prejudice"
// 📚 Added 4 interactions to "Oliver Twist"
// 📚 Added 3 interactions to "A Tale of Two Cities"
// 📚 Added 5 interactions to "Les Trois Mousquetaires"
// 📚 Added 4 interactions to "The Last of the Mohicans"
// 📚 Added 7 interactions to "David Copperfield"
// 📚 Added 1 interactions to "The Prince and the Pauper"
// 📚 Added 4 interactions to "It"
// 📚 Added 1 interactions to "The Gunslinger"
// 📚 Added 4 interactions to "The Green Mile"
// 📚 Added 4 interactions to "Pet Sematary"
// 📚 Added 2 interactions to "The Dead Zone"
// 📚 Added 1 interactions to "James and the Giant Peach"
// 📚 Added 5 interactions to "The BFG"
// 📚 Added 6 interactions to "Colloquia"
// 📚 Added 6 interactions to "The Admirable Crichton"
// 📚 Added 2 interactions to "Nonsense novels"
// 📚 Added 3 interactions to "Basil"
// 📚 Added 2 interactions to "The Black Robe"
// 📚 Added 5 interactions to "Murder on the Links"
// 📚 Added 7 interactions to "Fifty Candles"
// 📚 Added 4 interactions to "The Amateur Cracksman"
// 📚 Added 8 interactions to "Mr. Standfast"
// 📚 Added 4 interactions to "A strange disappearance"
// 📚 Added 5 interactions to "The Evil Shepherd"
// 📚 Added 2 interactions to "Otto of the Silver Hand"
// 📚 Added 4 interactions to "Voyage au Centre de la Terre"
// 📚 Added 3 interactions to "Jude the Obscure"
// 📚 Added 7 interactions to "The Woodlanders"
// 📚 Added 6 interactions to "कामसूत्र"
// 📚 Added 3 interactions to "Under the Greenwood Tree or, The Mellstock quire"
// 📚 Added 3 interactions to "The Story of the Amulet"
// 📚 Added 2 interactions to "The Complete Life and Adventures of Santa Claus"
// 📚 Added 5 interactions to "The Road to Oz"
// 📚 Added 6 interactions to "The Sea Fairies"
// 📚 Added 1 interactions to "The Poison Belt"
// 📚 Added 5 interactions to "The Island of Dr. Moreau"
// 📚 Added 4 interactions to "The Secret Agent"
// 📚 Added 5 interactions to "Fahrenheit 451"
// 📚 Added 7 interactions to "Lord of the Flies"
// 📚 Added 3 interactions to "Northern Lights"
// 📚 Added 2 interactions to "She"
// 📚 Added 4 interactions to "Lost Horizon"
// 📚 Added 6 interactions to "War and Peace"
// 📚 Added 5 interactions to "The Scarlet Letter"
// 📚 Added 3 interactions to "Ulysses"
// ✅ Done adding interactions. 