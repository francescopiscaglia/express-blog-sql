// importazione array
const posts = require("../db/db.js");
// sql import
const connection = require("../data/db.js");

// path middleware
const path = require("path");

// fs middleware
const fs = require("fs");

// API
const api = (req, res) => {
    res.json({
        data: posts,
        counter: posts.length
    });
};

// index 
const index = (req, res) => {

    // prepare the query
    const sql = "SELECT * FROM posts";

    // connect to sql
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    })

    // res.json({
    //     data: posts,
    //     counter: posts.length
    // });
};

// show
const show = (req, res) => {

    // param id
    const { id } = req.params;

    // prepare the query
    const sql = "SELECT * FROM posts WHERE id = ?";

    // prepare the join query
    const tagsSql = `
    SELECT tags.*
    FROM posts
    JOIN post_tag ON posts.id = post_tag.post_id
    JOIN tags ON post_tag.tag_id = tags.id
    WHERE tags.id = ?
    `;

    // connect to sql
    connection.query(sql, [id], (err, results) => {

        // internal server error
        if (err) return res.status(500).json({ error: "Internal server error" });

        // not found error
        if (results.length === 0) return res.status(404).json({ error: "404, post not found" });

        const post = results[0]

        // second connection
        connection.query(tagsSql, [id], (err, tagsResults) => {
            // internal server error
            if (err) return res.status(500).json({ error: "Internal server error" });

            // not found error
            if (tagsResults.length === 0) return res.status(404).json({ error: "404, post not found" });

            // mapping the tag array
            post.tags = tagsResults.map(tag => tag.label);

            res.status(200).json(post);
        });
    });

    // // find
    // const findPostWithSlug = posts.find(post => post.slug.toLowerCase() == req.params.slug.toLowerCase());

    // // verifica
    // if (!findPostWithSlug) {
    //     return res.status(404).json({
    //         error: "404! Not found"
    //     });
    // };

    // // risposta trovata
    // res.json({
    //     data: findPostWithSlug
    // });
};

// store
const store = (req, res) => {

    // creazione del nuovo dolce
    const newObj = {
        id: posts.length + 1,
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags,
    };

    posts.push(newObj);

    // update db
    fs.writeFileSync("./db/db.js", `module.exports = ${JSON.stringify(posts, null, 4)}`);

    res.json({
        status: 201,
        data: posts,
        counter: posts.length
    });
};

// update
const update = (req, res) => {

    // find the post by slug
    const post = posts.find(post => post.slug.toLowerCase() === req.params.slug.toLowerCase());

    // check if post exists
    if (!post) {
        return res.status(404).json({
            error: `404! Not found post with this slug: ${req.params.slug}`
        });
    }

    // update the post
    post.title = req.body.title;
    post.slug = req.body.slug;
    post.content = req.body.content;
    post.tags = req.body.tags;
    post.image = req.body.image;

    // update the db
    fs.writeFileSync("./db/db.js", `module.exports = ${JSON.stringify(posts, null, 4)}`);

    // return the new post 
    res.json({
        status: 201,
        data: post
    });

};

// destroy
const destroy = (req, res) => {

    // param id
    const { id } = req.params;

    // connect to sql
    connection.query("DELETE FROM posts WHERE id = ?", [id], (err, results) => {

        // catch error for server error
        if (err) return res.status(500).json({ error: "Internal Server Error: faild to delete post" });

        // catch error for 404
        if (results.affectedRows === 0) return res.status(404).json({ error: "404, post not found" });

        // return the response
        res.sendStatus(204);
    });

    // // Take the title from the req.params (url) and transfrom it in slug
    // const deleteTitle = req.params.title?.toLowerCase().replaceAll(" ", "-");

    // // find the post by slug
    // const post = posts.find(post => post.title.toLowerCase().replace(/ /g, "-") === deleteTitle);

    // // check if post exists
    // if (!post) {
    //     return res.status(404).json({
    //         error: `404! Not found post with this slug: ${req.params.title}`
    //     });
    // };

    // // delete from array
    // const newPosts = posts.filter(post => post.title.toLowerCase().replace(/ /g, "-") !== deleteTitle);

    // // update the db
    // fs.writeFileSync("./db/db.js", `module.exports = ${JSON.stringify(newPosts, null, 4)}`);

    // // return the new db
    // res.json({
    //     status: 201,
    //     data: newPosts,
    //     counter: newPosts.length
    // });
};



module.exports = {
    api,
    index,
    show,
    store,
    update,
    destroy
};