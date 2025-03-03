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

  fetch("/convert", { method: "POST", body: formData })
    .then((response) => response.blob())
    .then((blob) => {
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "converted.xlsx";
      downloadLink.style.display = "block";
      downloadLink.innerText = "Download Excel File";
      status.innerText = "Conversion completed!";
    })
    .catch((error) => {
      console.error("Error:", error);
      status.innerText = "Conversion failed!";
    });
}
