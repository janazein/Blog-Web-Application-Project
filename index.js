import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let posts = [];

// Home page
app.get("/", (req, res) => {
  res.render("home.ejs", { posts });
});

// Compose page
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

// Handle new post
app.post("/post", (req, res) => {
  const { author, title, content } = req.body;
  const date = new Date().toLocaleDateString();
  posts.push({ author, title, content, date });
  res.redirect("/");
});

// View a post
app.get("/posts", (req, res) => {
  const blogIndex = parseInt(req.query.blogIndex, 10);

  if (isNaN(blogIndex) || blogIndex < 0 || blogIndex >= posts.length) {
    res.status(404).send("Blog not found");
  } else {
    const blog = posts[blogIndex];
    const escapeHTML = (str) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const formattedContent = escapeHTML(blog.content).replace(/\n/g, "<br>");

    res.render("posts.ejs", {
      title: blog.title,
      date: blog.date,
      author: blog.author,
      content: formattedContent,
    });
  }
});

// Delete post
app.post("/delete", (req, res) => {
  const index = parseInt(req.body.index, 10);
  if (!isNaN(index) && index >= 0 && index < posts.length) {
    posts.splice(index, 1);
  }
  res.redirect("/");
});

// Show edit page
app.get('/edit', (req, res) => {
  const index = parseInt(req.query.index, 10);
  if (isNaN(index) || index < 0 || index >= posts.length) {
    return res.status(404).send("Post not found.");
  }

  const post = posts[index];
  res.render('edit.ejs', { post, index });
});

// Update post
app.post('/update', (req, res) => {
  const { index, author, title, content } = req.body;
  const postIndex = parseInt(index, 10);

  if (isNaN(postIndex) || postIndex < 0 || postIndex >= posts.length) {
    return res.status(400).send("Invalid index.");
  }

  posts[postIndex] = { author, title, content };
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Content in the home page
const blogs = [];
posts.push({
  title: "Learning New Skills in 2025",
  author: "Jana",
  content:
    "I’ve decided that 2025 is the year of learning new skills. From coding to photography, I’ve been diving into different courses and activities. One of the most exciting ones so far has been taking an online full-stack web development course. It’s challenging, but every little victory, like finally understanding how databases work, makes it all worth it.",
  date: "September 6, 2025",
});

posts.push({
  title: "The Joy of Reading Books",
  author: "Abbass",
  content:
    "Books have always been my escape. Whether it's a gripping thriller or a peaceful self help read, the joy of getting lost in pages is unmatched. Lately, I’ve been diving into more fiction. I recently finished The Night Circus by Erin Morgenstern, and it was mesmerizing! The vivid descriptions made me feel as if I was walking through the circus itself.",
  date: "March 1, 2025",
});

posts.push({
  title: "Beauty of Morning Coffee",
  author: "Hiba",
  content:
    "There's something magical about the first cup of coffee in the morning. The warmth, the aroma, and the anticipation of a new day, it's a small ritual that helps me center myself before the hustle begins. I've recently started experimenting with different types of beans, and I must say, the variety is endless.",
  date: "July 24, 2025",
});