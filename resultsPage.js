$(document).ready(initializeApp);
let food;
function initializeApp() {
  //grab url params here
  const { search } = window.location; // gets current url
  const [, countryCode] = search.split("="); // splits url into array and gets the second index.

  const countryName = CountryApi.getCountryNameFromCode(countryCode);
  const countryLogoUrl = CountryApi.getCountryLogoUrl(countryCode);
  food = CountryApi.getFoodFromCountry(countryCode);
  getFoodAndMedia(countryCode);
  // ajaxGoogleImageSearch(food); //searches google search API for food
  // getWikipediaDescription(food); // gets wiki description
  // YoutubeApi.youtubeServerCall(food); //gets related videos from youtube APi

  renderCountryName(countryName); //display's country name
  renderLogoImage(countryLogoUrl); //displays country flag

  addEventHandlers();
}

function getFoodAndMedia(countryCode){
  var ajaxOptions = {
    url: 'api/result_page_endpoint.php',
    method: 'GET',
    data:{
      'countryCode': countryCode,             
    },
    success: function(response){
      foodObj = JSON.parse(response);
      console.log(foodObj);
      const {countryName, name, description, image, videoIds} = foodObj.data;
      renderDescriptionSection(name, description, image);
      youtubeIDSearch(videoIds);
    },
  };
  $.ajax( ajaxOptions )
}

function youtubeIDSearch(idArr){
  let idStr = idArr.join();  
  var ajaxOptions = {
    url: `https://www.googleapis.com/youtube/v3/videos?id=${idStr}&key=AIzaSyAq7z-Gi9RbxC9wrUqxIpIkUFV6u76Qwhw&part=snippet`,
    method: 'GET',
    success: function(response){
      const videosArr = response.items;
      console.log(videosArr);
      videosArr.forEach(renderVideo)
    },
  };
  $.ajax( ajaxOptions )
}

function renderDescriptionSection(foodName, description, image){
  console.log('render function', foodName, description, image);
  let headerHtml = makeheader(foodName);
  let foodHeaderTag = $("<h1>").html(headerHtml);
  let foodImgTag = $("<img>").attr(
    "src",
    image
  );
  $(".food-section").prepend(foodHeaderTag);
  $(".foodImageContainer").append(foodImgTag);
  $(".wikiDescription").text(description);
}

function renderVideo(video){
  console.log('video', video);
  const videoBody = $("<div>", {
    class: `videoDiv video-${video.id}`,
    on: {
      click: () => {
        openYoutubeModal(video.id);
      }
    }
  });
  const title = $("<p>", {
    class: "videoImageTitle",
    text: video.snippet.title
  });
  const videoImage = $("<img>", {
    src: `${video.snippet.thumbnails.medium.url}`
  });
  videoBody.append(videoImage, title);

  $(".youtubeVideos").append(videoBody);
}

function openYoutubeModal(videoClicked) {


  let youtubeVideo = $("<iframe>", {
    width: "100%",
    height: "100%",
    src: `http://www.youtube.com/embed/${videoClicked}`,
    frameborder: "1"
  });
  $(".youtubeModal").append(youtubeVideo);

  $(".modal").addClass("animated fadeIn");
  $(".modal .youtubeModal").addClass("animated zoomIn");
  $(".modal").removeClass("hide");
}

function closeYoutubeModal() {
  $(".youtubeModal").html("");
  $(".modal").addClass("hide");
}

function renderYelpResults(businesses) {
  businesses.businesses.forEach(business => {
    const {
      name,
      rating,
      review_count,
      display_phone,
      image_url,
      location,
      url,
      categories
    } = business;

    const $yelpReviewCard = $("<a>", {
      attr: {
        href: url,
        target: "_blank",
        class: "yelp-review-card animated fadeIn"
      }
    });

    const $reviewImg = $("<div>", {
      class: "image",
      style: `background-image: url('${image_url}')`
    });

    const $reviewTitle = $("<h1>").text(name);

    const $rating = $("<div>", { class: "rating" }).rate({
      step_size: 0.1,
      readonly: true,
      initial_value: rating
    });

    const $categories = $("<p>", {
      class: "categories",
      text: categories.reduce((accumulator, next) => {
        return accumulator + next.title + " ";
      }, "")
    });
    const $address = $("<p>", {
      class: "address",
      text: `${location.city}`
    });

    const $details = $("<div>", { class: "details" });

    $details.append($reviewTitle, $rating, $categories, $address);
    $yelpReviewCard.append($reviewImg, $details).appendTo(".yelp-list");
  });
}

function addEventHandlers() {
  $(".brand").on("click", returnToHomepage);
  $(".modal").on("click", closeYoutubeModal); //closes fixed youtube modal
  document.querySelector(".flag img").addEventListener("error", addDummyFlag);
  $(".search-icon").on("click", sendLocationToYelp );
  $("input.inputField").on("keydown", handleInputBarEnterKey );
  $(window).scroll(hideBlinkScrollBar);
}

function renderCountryName(name) {
  $("h2.name").text(name);
}

function renderLogoImage(url) {
  $(".flag img").attr("src", url);
}

function addDummyFlag() {
  $(".flag img").attr("src", "images/UN_flag.png");
}

function returnToHomepage() {
  window.location.href = "index.html";
}

// function ajaxGoogleImageSearch(inputFoodStr) {
//   const ajaxObject = {
//     dataType: "json",
//     data: {
//       key: "AIzaSyDCZkB-dNOWPZKRKZ8qExgMivNbyyAUcPQ",
//       q: `${inputFoodStr}+gourmet+meal`,
//       num: 2,
//       type: "image/jpeg",
//       imgSize: "huge",
//       cx: "010569814504410284789:dq0xetlzofa",
//       safe: "high"
//     },
//     url: "https://www.googleapis.com/customsearch/v1",
//     method: "GET",
//     success: function(response) {
//       let headerHtml = makeheader(inputFoodStr);
//       let foodHeaderTag = $("<h1>").html(headerHtml);
//       let foodImgTag = $("<img>").attr(
//         "src",
//         response.items["1"].pagemap.cse_image["0"].src
//       );
//       $(".food-section").prepend(foodHeaderTag);
//       $(".foodImageContainer").append(foodImgTag);
//     },
//     error: function() {
//       let headerHtml = makeheader(inputFoodStr);
//       let foodHeaderTag = $("<h1>").html(headerHtml);
//       let foodImgTag = $("<img>").attr(
//         "src",
//         images/moo_cow.jpg
//       );
//       $(".food-section").prepend(foodHeaderTag);
//       $(".foodImageContainer").append(foodImgTag);
//     }
//   };
//   $.ajax(ajaxObject);
// }

function makeheader(inputString) {
  let strArray = inputString.split(" "); //splits string into array
  let result = "";
  for (let i = 0; i < strArray.length; i++) {
    // concats html into result for $.html
    result += `<span>${strArray[i][0]}</span>${strArray[i].substr(
      1,
      strArray[i].length
    )} `;
  }
  return result;
}

// function getWikipediaDescription(inputStr) {
//   let pageTitle = null;
//   let pageID = null;
//   const urlSearchStr =
//     "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
//     inputStr +
//     "&format=json&srprop=snippet";
//   let descrSearchStr = null;

//   $.ajax({
//     url: urlSearchStr,
//     dataType: "jsonp",

//     success: function getPageTitle(data) {
//       const paulsTitle = data.query.search[0].title;
//       pageTitle = data.query.search[0].title;
//       pageID = data.query.search[0].pageid;
//       descrSearchStr =
//         "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" +
//         pageTitle;
//       getDescription();
//     }
//   });

//   function getDescription() {
//     $.ajax({
//       url: descrSearchStr,
//       dataType: "jsonp",
//       success: function(data) {
//         var pageSummary = data.query.pages[pageID].extract;
//         /*****Save pageSummary onto DOM element here*****/
//         $(".wikiDescription").text(pageSummary);
//         /*$('DOMelement').text(pageSummary) */
//         /***** ^^Do it here^^ ******/
//       }
//     });
//   }
// }

function sendLocationToYelp(){
  let location = $("input.inputField")[0].value;
  $('.yelp-list').empty();
  //data.results[0].geometry.location
  Geolocation.cityLocation(location).done(({ results: [first] }) => {
    const { location } = first.geometry;
    Yelp.getLocalBusinesses(location, food).done((businesses) => {
      businesses = JSON.parse(businesses);
      YelpMap(location, businesses.businesses);
      renderYelpResults(businesses);
    });
  });
  return;
}

function handleInputBarEnterKey(event){
      if(event.keyCode === 13){ //enter keypressed redirect the browser to page indicated with country code.
          sendLocationToYelp();
      }
      return;
}

function hideBlinkScrollBar () {
  $('.blinkScrollBar').css('display', 'none');
}