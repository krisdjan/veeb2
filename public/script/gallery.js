window.onload = function() {
    //kogun kokku koik pisikesed galerii elemendid ning määran neile hiirekliki kuulaja
    let allThumbs = document.querySelector(".gallery").querySelectorAll(".thumbs");
    for(let i = 0; i < allThumbs.length; i++) {
        allThumbs[i].addEventListener("click", openModal);
    }
    document.querySelector("#modalClose").addEventListener("click", modalClose);
    document.querySelector("#modalImage").addEventListener("click", modalClose);

}

function openModal(e) {
    document.querySelector("#modalImage").src = "/gallery/normal/" + e.target.dataset.filename;
    document.querySelector("#modalCaption").innerHTML = e.target.alt;
    document.querySelector("#modal").showModal();
}

function modalClose() {
    document.querySelector("#modal").close();
    document.querySelector("#modalImage").src = "/pics/empty.png";
    document.querySelector("#modalCaption").innerHTML = "Galeriipilt";
}