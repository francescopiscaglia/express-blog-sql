const serverError = (err, req, res, next) => {
    console.log("Error:", err.message);
    console.error(err.stack);
    res.status(500).send({
        message: "Somethink went wrong",
        error: err.message
    });  
};

module.exports = serverError;