import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default class Exporter {
    exportToCSV(labels, datasets, fileName) {
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add headers
        const headers = ["Label"];
        datasets.forEach((dataset, index) => {
            headers.push(dataset.label || `Dataset ${index + 1}`);
        });
        csvContent += headers.join(",") + "\n";

        // Add rows
        labels.forEach((label, rowIndex) => {
            const row = [label];
            datasets.forEach((dataset) => {
                row.push(parseFloat(dataset.data[rowIndex]).toFixed(1));
            });
            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportToPDF(labels, datasets, fileName) {
        const doc = new jsPDF();

        const tableColumn = ["Label"];
        datasets.forEach((dataset, index) => {
            tableColumn.push(dataset.label || `Dataset ${index + 1}`);
        });

        const tableRows = [];
        labels.forEach((label, rowIndex) => {
            const row = [label];
            datasets.forEach((dataset) => {
                row.push(parseFloat(dataset.data[rowIndex]).toFixed(1));
            });
            tableRows.push(row);
        });

        // Title
        doc.setFontSize(18);
        doc.text(fileName, 14, 22);

        // AutoTable
        doc.autoTable({
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 12 },
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], halign: 'center' },
            bodyStyles: { halign: 'center' },
            theme: 'grid'
        });

        // Save the PDF
        doc.save(fileName + '.pdf');
    }
}
