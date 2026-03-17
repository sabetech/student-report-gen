import * as XLSX from 'xlsx';

export const excelService = {
    readUpload: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Header 1 means array of arrays

                    if (jsonData.length < 2) {
                        throw new Error('File appears to be empty or missing headers');
                    }

                    // Assume first row is headers
                    const headers = jsonData[0];
                    const rows = jsonData.slice(1);

                    // Map to objects
                    const result = rows.map(row => {
                        const rowData = {};
                        headers.forEach((header, index) => {
                            rowData[header] = row[index];
                        });
                        return rowData;
                    });

                    resolve({ headers, data: result });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsBinaryString(file);
        });
    },

    generateTemplate: (config) => {
        // Generate headers based on components
        const headers = ['Student ID', 'Student Name'];
        config.components.forEach(comp => {
            headers.push(comp.name);
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');
        XLSX.writeFile(workbook, `${config.name.replace(/\s+/g, '_')}_Template.xlsx`);
    }
};
