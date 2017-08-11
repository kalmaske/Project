// js for code involving marvel
//
// Initialize Firebase

$(document).ready(function() {

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

var maxComics = 8;
var characters = [];

//  Marvel api keys
var publicKey = "7787f189e8742fa9621f551458ef4c36";
var privateKey = "2efe1197ea45941b1e0263d5fef30b7b6c9b10bb"

//  vars for hash tag for Marvel api - GRRRRRR!
var ts = "";
var hash = "";

//this fires when use clicks on image in carousel

$(".somefunction").on("click", "", function() {

// var marvelChar = $(this).attr("id");

var marvelChar = ("thor").split(" ").join("+").toLowerCase();
console.log(marvelChar);

//call function to get unique character id
// true means to get comics also
var characterID = getCharacterID(marvelChar, true)
})

//This occurs when user enters search criteria for new character
$(".carousel-item").on("click", function() {

  //check to see if active class was clicked
  var charClass = ($(this).attr("class").split(' ')[1]);

  if (charClass === "active") {

    $(".comics").empty();
    var clickedID = $(this).attr("id");
    getComics(clickedID);

  }
 
}) //----------END OF CAROUSEL

//---------- FUNCTIONS ----------
//---------- FUNCTIONS ----------
//---------- FUNCTIONS ----------

//get unique character id
function getCharacterID (character, comicsNeeded) {

  console.log("character " +character);
  var charID = "";
  //  create a hash tag for Marvel api - GRRRRRR!
  ts = String(new Date().getTime());
  hash = md5(ts + privateKey + publicKey);

  // create Marvel api query
  var queryURL = "http://gateway.marvel.com/v1/public/" +
    "characters?name=" + character +
    "&apikey=" + publicKey +
    "&ts=" + ts +
    "&hash=" + hash;

  //  Make the first call to get unique character id
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {


    console.log(response);

    var charCount = response.data.count;

    //1 means a good value was found - can only process 1 unique id per char

    if (charCount === 1) {
      // we know there is only 1 entry so just use index 0 to store unique id
      charID = response.data.results[0].id;
      console.log(response.data.results[0].id);
      //do we need to get comics also?
      if (comicsNeeded) {
        getComics(charID);
      }

    }//----------END OF IF STATEMENT

    return charID;

  }) //----------END OF ID AJAX CALL 

}

//get list of comics from Marvel
function getComics(characterID) {

  //create date range for comics query - 3 months
  var fromDate = moment().subtract(3, "months").format("YYYY-MM-DD");
  var toDate = moment().format("YYYY-MM-DD");
  var dateRange = fromDate + "%2C" + toDate;

  //get a new hash tag
  ts = String(new Date().getTime());
  hash = md5(ts + privateKey + publicKey);

  var subqueryURL = "https://gateway.marvel.com/v1/public/characters/" +
    characterID +
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

    var comicCount = subresponse.data.count;
    var loopCount = comicCount;

    if (comicCount === 0) {
      console.log("NO COMICS AVAILABLE")
      return;
    }


    //Does the results key exist
    if (subresponse.data.hasOwnProperty("results")) {

      //if more than comic limit is returned, set to default, else use returned count
      if (comicCount > maxComics) {
        comicCount = maxComics;
      }

      for (var i = 0; i < comicCount; i++) {

        var path = subresponse.data.results[i].thumbnail.path;
        var ext = subresponse.data.results[i].thumbnail.extension;
        var displayImg = path + "/portrait_large." + ext;
        
        var imgDiv = $("<div>");
        // var ratingTxt = $("<p>");
        // ratingTxt.addClass("ratingTxt");
        // ratingTxt.html("Rating: " + rating + "<br>"); 

        var comicImg = $("<img>").attr("src", displayImg);
        comicImg.addClass("comicImg");
        comicImg.attr("alt", "comic book image");
        imgDiv.append(comicImg); 
    
        $(".comics").append(imgDiv);
        
      }

    } else {

      console.log("error - no results were found");
      return;

    }
    //console.log(subresponse.data.results[0].title);

    //console.log(displayImg);
    //console.log(subresponse.data.results[0].description);

  }) //----------END OF SECOND AJAX CALL  

} //----------END OF GET COMICS

//Add a character
//$(document).on("click", ".addChar", function() {
$(".addChar").on("click", function() {

  event.preventDefault();

  var newChar = $(".addChar").val().trim();

  //check to see if nothing entered
  if (!newChar) {
    return;
  } else {
    var charCheck = getCharacterID(newChar);

    //Was a character found?
    if (charCheck === "") {
      console.log("ERROR - invalid char name")
      return;
    } else {

      characters.push(newChar);
      loadCharacters();
      $(".addChar").val("");
    }
  }

// Loads the buttons
function loadCharacters(thumbnail) {

  $(".newChar").empty();
  $.each(characters, function(index, value) {

     //Create a button and add to 
    var b = $("<img>");
    b.addClass("id", );
    b.attr("data-name", value);
    b.attr("id", value);  
    b.text(value);
    $(".buttons").append(b);

  })  // end of each loop
} //********** end of loadbuttons


})  //----------end of add character


})