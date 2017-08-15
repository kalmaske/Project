// js for code involving marvel
//
// Initialize Firebase

// Initialize Firebase - My play project
// var config = {
//   apiKey: "AIzaSyCydG5tZ2_SBPwbdC8fhShlXFEq70BsamM",
//   authDomain: "uncc-project-1-5c704.firebaseapp.com",
//   databaseURL: "https://uncc-project-1-5c704.firebaseio.com",
//   projectId: "uncc-project-1-5c704",
//   storageBucket: "",
//   messagingSenderId: "1081385197579"
// };

//Initialize Firebase - Team DB
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

var database = firebase.database();

$(document).ready(function() {

  var maxComics = 9;
  var characters = [];

  //  Marvel api keys
  var publicKey = "7787f189e8742fa9621f551458ef4c36";
  var privateKey = "2efe1197ea45941b1e0263d5fef30b7b6c9b10bb"

  //  vars for hash tag for Marvel api - GRRRRRR!
  var ts = "";
  var hash = "";

  //---------- METHODS ----------
  //---------- METHODS ----------
  //---------- METHODS ----------

  //clear the input field with a clicked
  $(document).on("click", "#search-char", function() {

    event.preventDefault();

    $("#search-char").val("");

  })
  //This occurs when user clicks on a carousel item
  $(".carousel-item").on("click", function() {

    //event.preventDefault();

    //check to see if active class was clicked
    var charClass = ($(this).attr("class").split(' ')[1]);

    if (charClass === "active") {

      var clickedID = $(this).attr("id");
      var clickedName = $(this).attr("data-name");
      var clickedIndex = $(this).attr("data-index")

      $("#ebay").empty();
      database.ref("lastebay").set({
         title:null
      })

      database.ref("comicsCharacter").set({
        id: clickedID,
        name: clickedName,
      })

      //store in firebase to persist
      database.ref("carousel").set({
        id: clickedID,
        name: clickedName,
        idx: clickedIndex
      })

    }

  }) //----------END OF CAROUSEL CLICK

  //----------  ADD A CHARACTER
  //$(document).on("click", ".addChar", function() {
  $(".addChar").on("click", function(event) {

    event.preventDefault();

    var newChar = $("#search-char").val().trim();

    //check to see if nothing entered
    if (!newChar) {
      return;
    } else {

      getCharacterID(newChar).done(function(response) {

        // console.log(response);

        var charCount = response.data.count;

        //1 means a good value was found - can only process 1 unique id per char

        if (charCount === 1) {
          // we know there is only 1 entry so just use index 0 to store unique id
          var charID = response.data.results[0].id;
          var charName = response.data.results[0].name;
          var path = response.data.results[0].thumbnail.path.replace("http:", "https:");
          var ext = response.data.results[0].thumbnail.extension;
          var displayImg = path + "/portrait_large." + ext;

          var charObj = {
            charID: charID,
            charName: charName,
            thumbnail: displayImg
          };

          //Does character already exist no - add them,  yes - skip them

          characters.push(charObj);

          //need this if not using database for persistence
          //loadCharacters(charObj);

          database.ref("characters").push(charObj);

          $("#search-char").val("");

        } else {
          $("#search-char").val("OOPS! " + newChar + " does not live in Marvel's universe");

        } //---------- END OF IF STATEMENT

      }) //----------END OF AJAX DONE

    } // ----------END OF IF STATEMENT
  }) //---------- End of Add Char

  //display comic books when a user clicks on a newly added character
  $(document).on("click", ".newCharImg", function() {

    //event.preventDefault();

    //check to see if active class was clicked
    var charID = $(this).attr("id");
    var charName = $(this).attr("data-name")


    $("#ebay").empty();
    database.ref("lastebay").set({
         title:null
     })

    database.ref("comicsCharacter").set({
      id: charID,
      name: charName,
    })

  }) //----------END OF NEW CHAR IMG CLICK

  //---------- FUNCTIONS ----------
  //---------- FUNCTIONS ----------
  //---------- FUNCTIONS ----------
  function getCharacterID(character) {

    // console.log("character " + character);
    var charID = "";
    //  create a hash tag for Marvel api - GRRRRRR!
    ts = String(new Date().getTime());
    hash = md5(ts + privateKey + publicKey);

    // create Marvel api query
    var queryURL = "https://gateway.marvel.com/v1/public/" +
      "characters?name=" + character +
      "&apikey=" + publicKey +
      "&ts=" + ts +
      "&hash=" + hash;

    //  Make the first call to get unique character id
    return $.ajax({
      url: queryURL,
      method: "GET"
    }) //----------END OF ID AJAX CALL 

  } //---------END OF GETCHARACTERID

  //get list of comics from Marvel
  function getComics(characterID, characterName) {

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

      // console.log(subresponse);

      var comicCount = subresponse.data.count;
      var loopCount = comicCount;

      $(".comics").empty();

      if (comicCount === 0) {
        // console.log("ERROR:  NO COMICS AVAILABLE")
        var heading = $("<h5>");
        heading.addClass("comicHead");
        heading.html("Dang!  No current comics for " + characterName);
        $(".comics").append(heading);
        return;
      }


      //Does the results key exist
      if (subresponse.data.hasOwnProperty("results")) {

        //if more than comic limit is returned, set to default, else use returned count
        if (comicCount > maxComics) {
          comicCount = maxComics;
        }

        var heading = $("<h5>");
        heading.addClass("comicHead");
        heading.html(characterName);
        $(".comics").append(heading);

        for (var i = 0; i < comicCount; i++) {

          var path = subresponse.data.results[i].thumbnail.path.replace("http:", "https:");
          var ext = subresponse.data.results[i].thumbnail.extension;
          var displayImg = path + "/portrait_large." + ext;
          var title = subresponse.data.results[i].title;

          var imgDiv = $("<div>");
          var comicImg = $("<img>").attr("src", displayImg);
          comicImg.addClass("comicImg");
          comicImg.attr("alt", "comic book image");
          comicImg.attr("data-title", title);
          imgDiv.append(comicImg);

          $(".comics").append(imgDiv);

          imgDiv.css("float", "left");
          imgDiv.css("padding", "10px");
          imgDiv.css("margin-top", "20px");

        }

      } else {
        //display an error message
        var heading = $("<h5>");
        heading.addClass("comicHead");
        heading.html("OOPS - Our search encountered an issue. Please contact comic support");
        $(".comics").append(heading);
        return;

      }

    }) //----------END OF SECOND AJAX CALL  

  } //----------END OF GET COMICS

  //---------- DATABASE ----------
  //---------- DATABASE ----------
  //---------- DATABASE ----------
  database.ref("characters").orderByKey().on("child_added", function(snapshot) {
    
    //Create a img and add to 
    var b = $("<img>");
    b.addClass("newCharImg");
    b.attr("id", snapshot.val().charID);
    b.attr("src", snapshot.val().thumbnail.replace("http:", "https:"));
    b.attr("data-name", snapshot.val().charName);
    b.attr("title", snapshot.val().charName);
    $(".newChar").append(b);
  })

  database.ref("carousel").on("value", function(snapshot) {

    if (snapshot.child("idx").exists()) {
      var id = snapshot.val().id;
      var name = snapshot.val().name;
      var index = snapshot.val().idx;
      $('.carousel').carousel('set', parseInt(index));
    } else {
      $('.carousel').carousel('set', 0);
    }
  })

  database.ref("comicsCharacter").on("value", function(snapshot) {

    if (snapshot.child("id").exists() && snapshot.child("name").exists()) {
      var id = snapshot.val().id;
      var name = snapshot.val().name;
      getComics(id, name);
    }
  })

})