const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

// --- CONFIGURACIÓN ---
// 1. Pega aquí tu API Token de Strapi.
//    Asegúrate de que el token tenga permisos de 'Create', 'Update' para 'Ica-report' y 'Upload' para la Mediateca.
const STRAPI_API_TOKEN = 'YOUR_API_TOKEN_HERE';
const STRAPI_BASE_URL = 'http://localhost:1337/api';

// --- DATOS DE PRUEBA ---
// Como prueba, solo se procesarán los reportes del 30 y 31 de mayo de 2025.
const reportsToUpdate = [
  {
    link: "http://api.barranquillaverde.gov.co/storage/app/media/calidad-aire/30-05-25%20ICA.pdf",
    date: { year: 2025, month: 5, day: 30 },
  },
  {
    link: "http://api.barranquillaverde.gov.co/storage/app/media/calidad-aire/31-05-25%20ICA.pdf",
    date: { year: 2025, month: 5, day: 31 },
  },
];

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// --- FUNCIONES AUXILIARES ---

// Formatea el título de la misma forma que el script de importación masiva.
function formatTitle(dateObj) {
  const day = dateObj.day;
  const month = monthNames[dateObj.month - 1];
  const year = dateObj.year;
  return `Reporte del ${day} de ${month} de ${year}`;
}

// Descarga el archivo PDF desde una URL y devuelve un buffer.
async function downloadPdf(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log(`PDF descargado de ${url}`);
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error al descargar el PDF de ${url}:`, error.message);
    throw error;
  }
}

// Sube el buffer del PDF a la mediateca de Strapi.
async function uploadPdfToStrapi(pdfBuffer, reportDate) {
  const formData = new FormData();
  const fileName = `${reportDate.year}-${reportDate.month}-${reportDate.day}-reporte-ica.pdf`;

  formData.append('files', pdfBuffer, fileName);

  try {
    const response = await axios.post(`${STRAPI_BASE_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
      },
    });
    console.log(`PDF ${fileName} subido a Strapi. ID: ${response.data[0].id}`);
    return response.data[0].id; // Devuelve el ID del archivo subido
  } catch (error) {
    console.error(`Error al subir el PDF a Strapi:`, error.response?.data || error.message);
    throw error;
  }
}

// Actualiza un reporte existente en Strapi para asignarle el PDF.
async function updateReportWithPdf(reportId, pdfId) {
  try {
    await axios.put(`${STRAPI_BASE_URL}/ica-reports/${reportId}`,
      { data: { report_pdf: pdfId } },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );
    console.log(`Reporte con ID ${reportId} actualizado con el PDF ID ${pdfId}.`);
  } catch (error) {
    console.error(`Error al actualizar el reporte ${reportId}:`, error.response?.data || error.message);
    throw error;
  }
}

// --- FUNCIÓN PRINCIPAL ---
async function main() {
  console.log('Iniciando el script de actualización de PDFs...');

  // 1. Obtener TODOS los reportes de Strapi, manejando la paginación.
  let allStrapiReports = [];
  let page = 1;
  let pageCount = 1;
  console.log('Obteniendo todos los reportes de Strapi...');
  try {
    do {
      const response = await axios.get(`${STRAPI_BASE_URL}/ica-reports?pagination[page]=${page}&pagination[pageSize]=100`, {
        headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
      });

      if (response.data && response.data.data) {
        allStrapiReports = allStrapiReports.concat(response.data.data);
        pageCount = response.data.meta.pagination.pageCount;
        console.log(`  -> Página ${page} de ${pageCount} obtenida.`);
        page++;
      } else {
        break; // Detener si no hay más datos
      }
    } while (page <= pageCount);

    console.log(`Se encontraron un total de ${allStrapiReports.length} reportes en Strapi.`);
  } catch (error) {
    console.error('Error fatal: No se pudieron obtener los reportes de Strapi.', error.message);
    return; // Detener si no podemos obtener los reportes
  }

  // 2. Procesar cada reporte de la lista de prueba.
  for (const report of reportsToUpdate) {
    const titleToFind = formatTitle(report.date);
    console.log(`\nProcesando: ${titleToFind}`);

    const strapiReport = allStrapiReports.find(r => r.attributes.title === titleToFind);

    if (!strapiReport) {
      console.warn(`  -> No se encontró el reporte con título "${titleToFind}" en Strapi. Saltando...`);
      continue;
    }

    console.log(`  -> Reporte encontrado en Strapi con ID: ${strapiReport.id}`);

    try {
      // 3. Descargar, subir y actualizar.
      const pdfBuffer = await downloadPdf(report.link);
      const pdfId = await uploadPdfToStrapi(pdfBuffer, report.date);
      await updateReportWithPdf(strapiReport.id, pdfId);
      console.log(`  -> ¡Éxito! El reporte "${titleToFind}" ha sido actualizado con su PDF.`);
    } catch (error) {
      console.error(`  -> Falló el proceso para "${titleToFind}".`);
    }
  }

  console.log('\nScript finalizado.');
}

main();
