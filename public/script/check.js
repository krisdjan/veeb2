let fileSizeLimit = 1 * 1024 * 1024;

window.onload = function() {
    //document.getElementById("photoSubmit"); üks variant
    document.querySelector("#photoSubmit").disabled = true; //uuem variant
    document.querySelector("#photoInput").addEventListener("change", checkPhotoSize);
    document.querySelector("#uploadInfo").innerHTML = "Pilti pole valitud";
};      

function checkPhotoSize() {
   let fileInput = document.querySelector("#photoInput").files[0].size;
   if (fileInput <= fileSizeLimit) {
    document.querySelector("#photoSubmit").disabled = false;
    document.querySelector("#uploadInfo").innerHTML = "";

   } else {
    document.querySelector("#photoSubmit").disabled = true;
    document.querySelector("#uploadInfo").innerHTML = "Pilt on liiga suure mahuga";

   }


}