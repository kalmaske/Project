// js for code involving marvel
//
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCj-NfgaMdmfQg2Ny4QAz6dsETnzIJFGck",
  authDomain: "awsomeproject-a2f25.firebaseapp.com",
  databaseURL: "https://awsomeproject-a2f25.firebaseio.com",
  projectId: "awsomeproject-a2f25",
  storageBucket: "",
  messagingSenderId: "408693856197"
};

//initialize firebase
firebase.initializeApp(config);

//---------- VARIABLES ----------
//---------- VARIABLES ----------
//---------- VARIABLES ----------

//  Marvel api keys
var publicKey = "7787f189e8742fa9621f551458ef4c36";
var privateKey = "2efe1197ea45941b1e0263d5fef30b7b6c9b10bb"

//  create a hash tag for Marvel api - GRRRRRR!
var ts = String(new Date().getTime());
var hash = md5(ts + privateKey + publicKey);

//this fires when use clicks on image
// $(document).on("click", "", function() {

// var marvelChar = $(this).attr("id");

var marvelChar = "Thor";
console.log(marvelChar);

// create Marvel api query
var queryURL = "http://gateway.marvel.com/v1/public/" +
  "characters?name=" + marvelChar +
  "&apikey=" + publicKey +
  "&ts=" + ts +
  "&hash=" + hash;

//  Make the first call to get unique character id
$.ajax({
  url: queryURL,
  method: "GET"
}).done(function(response) {

  var charCount = response.data.count;

  //1 means a good value was found - can only process 1 unique id per char

  if (charCount !== 1) {
    console.log("error routine goes here")

  } else {

    // we know there is only 1 entry so just use index 0 to store unique id
    var charID = response.data.results[0].id;

    //create date range for comics query - 3 months
    var fromDate = moment().subtract(3, "months").format("YYYY-MM-DD");
    var toDate = moment().format("YYYY-MM-DD");
    var dateRange = fromDate + "%2C" + toDate;

    //get a new hash tag
    ts = String(new Date().getTime());
    hash = md5(ts + privateKey + publicKey);

    var subqueryURL = "https://gateway.marvel.com/v1/public/characters/" +
      charID +
      "/comics?" +
      "dateRange=" + dateRange +
      "&orderBy=-onsaleDate" +
      "&apikey=" + publicKey +
      "&ts=" + ts +
      "&hash=" + hash;

    //make second call to get array of recent comics
    $.ajax({
      url: subqueryURL,
      method: "GET"
    }).done(function(subresponse) {

      console.log(subresponse);

      console.log(subresponse.data.results[0].title);
      var path = subresponse.data.results[0].images[0].path;
      var ext = subresponse.data.results[0].images[0].extension;
      var displayImg = path + "/portrait_large." + ext;
      console.log(displayImg);
      console.log(subresponse.data.results[0].description);

    }) //----------END OF SECOND AJAX CALL
  } //----------END OF IF STATEMENT
}) //----------END OF ID AJAX CALL 