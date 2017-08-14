  //---------- VARIABLES ----------
  //---------- VARIABLES ----------
  //---------- VARIABLES ----------

var filterarray = [
    {"name":"MaxPrice",
     "value":"25",
     "paramName":"Currency",
     "paramValue":"USD"},
    {"name":"ListingType",
     "value":["AuctionWithBIN", "FixedPrice"],
     "paramName":"",
     "paramValue":""},
    ];

var urlfilter = "";

$(document).on("click", ".comicImg", function() {

  var title = $(this).attr("data-title").replace(/ *\([^)]*\) */gi, "").split(" ").join("+");

  //console.log("title " + title);

  database.ref("lastebay").set({
      title:title
  })

  //getebay(title);
})

function getebay(title) {

  var ebayDevID = "db7d4570-89e1-4992-b3b2-c00b74d7a1c3"
  var ebayProdID = "KenThomp-UNCCBoot-PRD-78e35c535-321c2472"

  // Create a JavaScript array of the item filters you want to use in your request
  
  //buildURLArray(filterarray);

  // Replace MyAppID with your Production AppID
  var url = "http://svcs.ebay.com/services/search/FindingService/v1";
      url += "?OPERATION-NAME=findItemsAdvanced";
      url += "&SERVICE-VERSION=1.0.0";
      url += "&SECURITY-APPNAME=" + ebayProdID;
      url += "&GLOBAL-ID=EBAY-US";
      url += "&RESPONSE-DATA-FORMAT=JSON";
      url += "&callback=processResponse";
      url += "&REST-PAYLOAD";
      url += "&paginationInput.entriesPerPage=3";
      url += "&sortOrder=startTimeNewest";
      url += "&categoryid=267";   //267=comics
      url += "&keywords=" + title;


   // console.log("url " + url);
  //let's talk to ebay
  $.ajax({
    url: url,
    method: "GET",
    dataType : 'jsonp'
  }).done(function(response) {

   // console.log(response);

  });
}

function processResponse(root) {

  $("#ebay").empty();
  var items = root.findItemsAdvancedResponse[0].searchResult[0].item || [];

  for (var i = 0; i < items.length; ++i) {
    var item     = items[i];
    var title    = item.title;
    var pic      = item.galleryURL;
    var viewitem = item.viewItemURL;
    if (pic === null || pic === "" || typeof pic === "undefined") {
      pic = "assets/images/ina.jpg"
    }
    if (null != title && null != viewitem) {
      $("#ebay").append('<tr class="brand-logo"><td>' + '<img src="' + pic + '" border="0">' + '</td>' + 
      '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td></tr>');
    }
  }
}

function  buildURLArray() {

  urlfilter = ""; 
  // Iterate through each filter in the array
  for(var i=0; i<filterarray.length; i++) {
    //Index each item filter in filterarray
    var itemfilter = filterarray[i];
    // Iterate through each parameter in each item filter
    for(var index in itemfilter) {
      // Check to see if the paramter has a value (some don't)
      if (itemfilter[index] !== "") {
        if (itemfilter[index] instanceof Array) {
          for(var r=0; r<itemfilter[index].length; r++) {
          var value = itemfilter[index][r];
          urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value ;
          }
        } 
        else {
          urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
        }
      }
    }
  }
}  // End buildURLArray() function

//---------- DATABASE ----------
//---------- DATABASE ----------
//---------- DATABASE ----------

database.ref("lastebay").on("value", function(snapshot) {

  //refresh ebay listing
  if (snapshot.child("title").exists()) {
    var title = snapshot.val().title;
    getebay(title);
  }

    
})