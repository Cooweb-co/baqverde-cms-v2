const axios = require('axios');

// --- CONFIGURACIÓN ---
// 1. Pega aquí tu API Token de Strapi. Encuéntralo en Settings > API Tokens.
//    Asegúrate de que el token tenga permisos de 'Create' para 'Ica-report'.
const STRAPI_API_TOKEN = 'YOUR_API_TOKEN_HERE';
const STRAPI_API_URL = 'http://localhost:1337/api/ica-reports';

const generateDaysArray = (n, start = 1) => Array.from({ length: n }, (_, i) => i + start);

// Datos completos de los reportes extraídos de icaReport.ts
const sourceReports = [
  { date: { year: 2025, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2025, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2025, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2025, month: 1, days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 31] } },
  { date: { year: 2024, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2024, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2024, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2024, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2024, month: 2, days: generateDaysArray(29) } },
  { date: { year: 2024, month: 1, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 11, days: generateDaysArray(30) } },
  { date: { year: 2023, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2023, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2023, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2023, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2023, month: 2, days: generateDaysArray(28) } },
  { date: { year: 2023, month: 1, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 11, days: generateDaysArray(30) } },
  { date: { year: 2022, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2022, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2022, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2022, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2022, month: 2, days: generateDaysArray(28) } },
  { date: { year: 2022, month: 1, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 11, days: generateDaysArray(30) } },
  { date: { year: 2021, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2021, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2021, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2021, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2021, month: 2, days: generateDaysArray(28) } },
  { date: { year: 2021, month: 1, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 11, days: generateDaysArray(30) } },
  { date: { year: 2020, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2020, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2020, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2020, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2020, month: 2, days: generateDaysArray(29) } },
  { date: { year: 2020, month: 1, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 12, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 11, days: generateDaysArray(30) } },
  { date: { year: 2019, month: 10, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 9, days: generateDaysArray(30) } },
  { date: { year: 2019, month: 8, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 7, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 6, days: generateDaysArray(30) } },
  { date: { year: 2019, month: 5, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 4, days: generateDaysArray(30) } },
  { date: { year: 2019, month: 3, days: generateDaysArray(31) } },
  { date: { year: 2019, month: 2, days: generateDaysArray(28) } },
  { date: { year: 2019, month: 1, days: generateDaysArray(31) } },
];

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function processAndSortReports(reports) {
    const allReports = [];
    reports.forEach(reportEntry => {
        const group = reportEntry.date;
        group.days.forEach(day => {
            allReports.push({ year: group.year, month: group.month, day: day });
        });
    });

    allReports.sort((a, b) => new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day));

    return allReports;
}

function formatTitle(dateObj) {
    const day = dateObj.day;
    const month = monthNames[dateObj.month - 1];
    const year = dateObj.year;
    return `Reporte del ${day} de ${month} de ${year}`;
}

async function createReport(title) {
    try {
        const response = await axios.post(STRAPI_API_URL, {
            data: { title: title }
        }, {
            headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
        });
        console.log(`Reporte creado: ${title} (ID: ${response.data.data.id})`);
    } catch (error) {
        console.error(`Error creando reporte '${title}':`, error.response ? error.response.data : error.message);
    }
}

async function main() {
    if (STRAPI_API_TOKEN === 'YOUR_API_TOKEN_HERE') {
        console.error('Por favor, reemplaza YOUR_API_TOKEN_HERE con tu token de API de Strapi en el script.');
        return;
    }

    const reportsToCreate = processAndSortReports(sourceReports);
    console.log(`Iniciando importación de ${reportsToCreate.length} reportes...`);

    for (const dateObj of reportsToCreate) {
        const title = formatTitle(dateObj);
        await createReport(title);
        await new Promise(resolve => setTimeout(resolve, 100)); // Pausa para no sobrecargar la API
    }

    console.log('Importación completada.');
}

main();
