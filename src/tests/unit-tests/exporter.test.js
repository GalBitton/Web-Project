import Exporter from '../../utils/exporter.js';
import { jsPDF } from 'jspdf'; // Ensure this import matches the actual export

// Mock jsPDF constructor
jest.mock('jspdf', () => {
    const jsPDFMock = jest.fn().mockImplementation(() => ({
        setFontSize: jest.fn(),
        text: jest.fn(),
        autoTable: jest.fn(),
        save: jest.fn(),
    }));

    return { jsPDF: jsPDFMock };
});

describe('Exporter', () => {
    let exporter;

    beforeEach(() => {
        exporter = new Exporter();
    });

    test('exportToCSV returns correct CSV data', () => {
        const labels = ['Label1', 'Label2'];
        const datasets = [{ label: 'Dataset1', data: [10, 20] }];
        const createElementSpy = jest.spyOn(document, 'createElement');
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        const removeChildSpy = jest.spyOn(document.body, 'removeChild');

        const linkElement = document.createElement('a');
        const setAttributeSpy = jest.spyOn(linkElement, 'setAttribute');
        const clickSpy = jest.spyOn(linkElement, 'click');

        createElementSpy.mockReturnValue(linkElement);

        exporter.exportToCSV(labels, datasets, 'test');

        const expectedHref = encodeURI('data:text/csv;charset=utf-8,Label,Dataset1\nLabel1,10.0\nLabel2,20.0\n');

        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(setAttributeSpy).toHaveBeenCalledWith('href', expectedHref);
        expect(setAttributeSpy).toHaveBeenCalledWith('download', 'test.csv');
        expect(clickSpy).toHaveBeenCalled();
        expect(appendChildSpy).toHaveBeenCalledWith(linkElement);
        expect(removeChildSpy).toHaveBeenCalledWith(linkElement);

        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
        setAttributeSpy.mockRestore();
        clickSpy.mockRestore();
    });

    // test('exportToPDF returns correct PDF data', () => {
    //     const labels = ['Label1', 'Label2'];
    //     const datasets = [{ label: 'Dataset1', data: [10, 20] }];
    //
    //     exporter.exportToPDF(labels, datasets, 'test');
    //
    //     const docMock = jsPDF.mock.results[0]; // Access the mock instance
    //     expect(docMock.setFontSize).toHaveBeenCalledWith(18);
    //     expect(docMock.text).toHaveBeenCalledWith('test', 14, 22);
    //     expect(docMock.autoTable).toHaveBeenCalledWith({
    //         startY: 30,
    //         head: [['Label', 'Dataset1']],
    //         body: [['Label1', '10.0'], ['Label2', '20.0']],
    //         styles: { fontSize: 12 },
    //         headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], halign: 'center' },
    //         bodyStyles: { halign: 'center' },
    //         theme: 'grid',
    //     });
    //     expect(docMock.save).toHaveBeenCalledWith('test.pdf');
    // });
});
