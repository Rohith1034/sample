function search() {
  var searchInput = document.querySelector(".search-data").value.toLowerCase();
  var cardTitles = document.querySelectorAll(".card-title");
  var count = 0;

  for (var i = 0; i < cardTitles.length; i++) {
    var title = cardTitles[i].innerHTML.toLowerCase();
    if (title.includes(searchInput)) {
      count++;
      var itemId = cardTitles[i].getAttribute("id");
      window.location.href = "#" + itemId;
      document.querySelector("#" + itemId).parentNode.parentNode.classList.add("animated");
      setTimeout(function (itemId) {
        document.querySelector("#" + itemId).parentNode.parentNode.classList.remove("animated");
      }, 2000, itemId);
    }
  }

  if (count === 0) {
    alert("Not Found!!");
    window.location.href = "#";
  }
}


