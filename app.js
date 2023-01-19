const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { application } = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Database connection
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//Target all articles
app.route('/articles')
    
    .get(function (req, res) {
    Article.find(function (error, foundArticles) {
        if (!error) {
            res.send(foundArticles);
        } else {
            res.send(error);
        }
    });
    })
    //Create new Articles
    .post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send("Article saved succesfully!");
        } else {
            res.send(err);
        }
    });
    })
    
    .delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Succesfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});

//----TARGET SPECIFIC ARTICLES----

app.route('/articles/:articleTitle')
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No article matching that title was found.")
                
            }
        });
    })
    .put(function (req, res) {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send("Succesfully updated article.");
                }
            }
           
        );
    })
    .patch(function (req, res) {
        Article.updateOne({ title: req.params.articleTitle },
             req.body ,
            function (err) {
                if (!err) {
                    res.send("Succesfully updated article!");
                } else {
                    res.send(err);
                }
            
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Succesfully deleted article!")
            }
        })
    });




















app.listen(3000, () => {
  console.log("server started on port 3000");
});
