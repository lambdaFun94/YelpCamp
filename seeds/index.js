const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const NUMBER_OF_CAMPGROUNDS = 250;

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < NUMBER_OF_CAMPGROUNDS; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const exampleLocation = cities[rand1000];
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      geometry: {
        type: "Point",
        coordinates: [exampleLocation.longitude, exampleLocation.latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      // username: badge; password: badge
      author: "5fd7f6edf3ee431615b2f299",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      location: `${exampleLocation.city}, ${exampleLocation.state}`,
      price: price,
      images: [
        {
          url:
            "https://res.cloudinary.com/du88nhikz/image/upload/v1608122645/YelpCamp/hqdn9e0c287bjhyshr5z.jpg",
          filename: "YelpCamp/hqdn9e0c287bjhyshr5z",
        },
        {
          url:
            "https://res.cloudinary.com/du88nhikz/image/upload/v1608122649/YelpCamp/j6vvexlwn3vrqdi697iu.jpg",
          filename: "YelpCamp/j6vvexlwn3vrqdi697iu",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
