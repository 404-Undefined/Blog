function displayPop() {
  var timeOut = setTimeout(function () {
    document.querySelector(".bg-modal").style.display = "flex";
  }, 4000);

  document.querySelector(".close").addEventListener("click", function () {
    document.querySelector(".bg-modal").style.display = "none";
  });
  document
    .getElementById("modal-button")
    .addEventListener("click", function () {
      if ($("#modal-name").val() != "" && $("#modal-name").val() != "") {
        $.ajax({
          url: "{{ url_for('main.email_confirm')}}",
          type: "POST",
          data: {
            name: $("#modal-name").val(),
            email: $("#modal-email").val(),
          },
        });
        document.querySelector(".bg-modal").style.display = "none";
      }
    });
}
if (document.referrer.indexOf(window.location.hostname) == -1) {
  displayPop();
}
