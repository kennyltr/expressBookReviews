let username = "kenny";
let review = "whaaat";
let bookreviews = {}

bookreviews[username] = review;
bookreviews['katie'] = "I love it"

console.log(bookreviews);

if (bookreviews["kenny"]) {
    delete bookreviews["kenny"];
}


console.log(bookreviews);

async 