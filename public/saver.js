$(document.body).ready(function() {

  displaySavedArticles();

  $(document).on("click", ".unsave-article", unsaveArticle);
  $(document).on("click", ".article-notes", getArticleNotes);
  $(document).on("click", "#savenote", saveArticleNotes);
});


function displaySavedArticles() {
  $(".saved-container").empty();
  $.ajax({
    method: "GET",
    url: "/api/articles/" + true
  }).then(function(data) {
    if (data) {
      for (var i = 0; i < 5; i++) {
        console.log(data[i]);

        var article = $("<div>");
        article.addClass("card");

        var header = $("<div>");
        header.addClass("card-header");
        header.html("<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>");

        var body = $("<div>");
        body.addClass("card-body");
        body.html("<p>" + data[i].summary + "</p>");

        var unsaveButton = $("<button>");
        unsaveButton.addClass("btn");
        unsaveButton.addClass("unsave-article");
        unsaveButton.attr("data", data[i]._id);
        unsaveButton.text("Delete From Saved");

        var noteButton = $("<button>");
        noteButton.addClass("btn");
        noteButton.addClass("article-notes");
        noteButton.attr("data", data[i]._id);
        noteButton.text("Article Notes");

        body.append(unsaveButton);
        body.append(noteButton);
        article.append(header);
        article.append(body);
        $(".saved-container").append(article);
        $(".saved-container").append("<br>");
      }
    }
  });
}


function getArticleNotes() {
  event.preventDefault();
  $("#note-content").empty();
  var id = $(this)[0].attributes[1].value;
  console.log(id);
  $.ajax({
    method: "GET",
    url: "/api/articles/" + id
  }).done(function(data) {
    console.log("getnotes");
    console.log(data);
    $("#note-content").append("<h2>" + data.title + "</h2>");
     
      $("#note-content").append("<textarea id='bodyinput' placeholder='Your note'></textarea>");
      $("#note-content").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      if (data.note) {      
        $("#bodyinput").val(data.note.body);
      }
      $("#note-modal").modal("toggle");
  });
}

function saveArticleNotes() {
  var noteId = $(this).attr("data-id");
  console.log(noteId);
  console.log($("#bodyinput").val());
  $.ajax({
    method: "POST",
    url: "/api/articles/" + noteId,
    data: {
      body: $("#bodyinput").val()
    }
  }).done(function(data) {
    console.log(data);
    $("#note-content").empty();
  });
}

function unsaveArticle() {
  event.preventDefault();
  var id = $(this)[0].attributes[1].value;
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + id + "/" + false
  }).then(function(result) {
    console.log("UNSAVE SUCCESS");
  });
}
