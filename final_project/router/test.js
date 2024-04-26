let users = [];

users.push({"username":"user","password":"pass"});
users.push({"username":"user1","password":"pass2"})

let username = "user"

const checkifexists = (username) => {
    let existinguser = users.filter((user) => user.username === username)
    if (existinguser.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

if (checkifexists(username)) {
    console.log("true")
}
else {
    console.log("false")
}