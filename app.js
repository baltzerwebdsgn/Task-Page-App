//Clear notes functionality
document.addEventListener("DOMContentLoaded", (event) => {
  const clearNotesButton = document.getElementById("clear-notes-button");

  if (clearNotesButton) {
    clearNotesButton.addEventListener("click", function (event) {
      alert("Your notes have been cleared!");
      document.getElementById("notes-area").value = "";
    });
  } else {
    console.error("The element with the ID '' was not found in the DOM.");
  }
});
