import jsPDF from 'jspdf';

export default class ExportHandler {
  exportToCSV(labels, dataset, fileName) {
      let csvContent = "data:text/csv;charset=utf-8,";

      const headers = ["Label"];
      if (dataset.length > 0 && typeof dataset[0] === 'object') {
          headers.push(...Object.keys(dataset[0]));
      } else {
          headers.push("Value");
      }
      csvContent += headers.join(",") + "\n";

      for (let i = 0; i < labels.length; i++) {
          const row = [labels[i]];
          if (typeof dataset[i] === 'object') {
              row.push(...Object.values(dataset[i]));
          } else {
              row.push(dataset[i]);
          }
          csvContent += row.join(",") + "\n";
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName + ".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  exportToPDF(labels, dataset, fileName) {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text(fileName, 14, 22);

      // Add table headers
      doc.setFontSize(12);
      doc.text("Label", 14, 32);
      doc.text("Value", 60, 32);

      // Add table rows
      labels.forEach((label, index) => {
          const yPosition = 40 + (index * 10);
          doc.text(label, 14, yPosition);
          doc.text(dataset[index].toString(), 60, yPosition);
      });

      // Save the PDF
      doc.save(fileName + '.pdf');
  }
}
