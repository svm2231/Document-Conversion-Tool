function handleFiles(files) {
  let fileNameDisplay = document.getElementById("file-name");
  if (files.length > 0) {
    fileNameDisplay.textContent = files[0].name;
  } else {
    fileNameDisplay.textContent = "No file chosen";
  }
}

function uploadPDF() {
  let fileInput = document.getElementById("pdfFile");
  let status = document.getElementById("status");
  let downloadLink = document.getElementById("downloadLink");

  if (fileInput.files.length === 0) {
    status.innerText = "Please select a file first.";
    return;
  }

  let formData = new FormData();
  formData.append("file", fileInput.files[0]);

  status.innerText = "Processing...";

  fetch("/uploads", { method: "POST", body: formData })
    .then((response) => response.blob())
    .then((blob) => {
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "converted.xlsx";
      downloadLink.style.display = "inline-block";
      status.innerText = "Conversion completed!";
    })
    .catch((error) => {
      console.error("Error:", error);
      status.innerText = "Conversion failed!";
    });
}

// Drag & Drop Handling
let dropArea = document.getElementById("drop-area");

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "#f1f1f1";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "white";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "white";
  let files = event.dataTransfer.files;
  document.getElementById("pdfFile").files = files;
  handleFiles(files);
});
