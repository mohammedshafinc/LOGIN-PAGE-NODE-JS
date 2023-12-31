const fs = require("fs");
const path = require("path");

const pathfile = path.join(__dirname, "../models/user.json");

const existingUser = JSON.parse(fs.readFileSync(pathfile));

let errors = "";

module.exports = {
    mainRouter: (req, res) => {
        if (req.session.email) {
            res.redirect("/login");
        } else {
            res.redirect("/signup");
            errors = "";
        }
    },
    getSignup: (req, res) => {
        res.render("signup", { error: errors });
    },
    getLogin: (req, res) => {
        if (!req.session.email) {
            res.render("login", { error: errors });
        } else {
            res.redirect("/home");
        }
    },
    postSignup: (req, res) => {
        const { email, password } = req.body;
        const userExists = existingUser.find((user) => user.email === email);
        if (userExists) {
            errors = `An account with ${email} already exist`;
            res.redirect("/");
            // res.redirect("login");
        } else {
            existingUser.push({ email, password });
            fs.writeFile(pathfile, JSON.stringify(existingUser), (err) => {
                if (err) {
                    console.error("Error writing to file:", err);
                } else {
                    req.session.email = "shafin";
                    // console.log("File written successfully. /login");
                    res.redirect("/login");
                }
            });
        }
    },
    postLogin: (req, res) => {
        const { email, password } = req.body;
        const signedUser = existingUser.find((loguser) => {
            return loguser.email === email && loguser.password == password;
        });
        const ifuser = existingUser.find((e) => {
            return e.email === email;
        });

        // console.log("signed", signedUser);
        // console.log(signedUser);
        if (signedUser) {
            req.session.email = "shafin";
            res.redirect("/home");
        } else if (!ifuser) {
            errors = "myran illa";
            res.redirect("/login");
        } else {
            errors = "Email or Pasword is incorrect";
            res.redirect("/login");
        }
    },
    getHome: (req, res) => {
        if (req.session.email) {
            res.render("home");
        } else {
            res.redirect("/");
        }
    },
    getLogout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    },
};
