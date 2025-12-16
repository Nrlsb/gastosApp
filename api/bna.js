import axios from 'axios';
import * as cheerio from 'cheerio';

// URL ÚNICA de BNA
const URL_BNA = 'https://www.bna.com.ar/Personas';

// --- CONFIGURACIÓN DEL CACHÉ (En memoria) ---
// Nota: En serverless, la memoria no es persistente entre invocaciones frías,
// pero ayuda si hay muchas peticiones seguidas a la misma instancia caliente.
let cache = {
    data: null,
    timestamp: null
};
// Duración del caché: 30 minutos en milisegundos
const CACHE_DURATION_MS = 30 * 60 * 1000;

// --- Funciones Auxiliares ---

const limpiarTexto = (texto) => {
    if (!texto) return null;
    return texto.replace(/\n/g, '').trim();
};

/**
 * Parsea valores de Billete.
 * Asume formato: "1.425,00" (punto de miles, coma de decimal) o "1425,00".
 */
const parsearFormatoBillete = (valor) => {
    if (!valor) return null;
    // Quitamos el punto de miles (si existe) y reemplazamos la coma decimal por punto
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
};

/**
 * Parsea valores de Divisa.
 * Asume formato: "1,403.0000" (coma de miles, punto de decimal) o "1403.0000".
 */
const parsearFormatoDivisa = (valor) => {
    if (!valor) return null;
    // Quitamos la coma de miles (si existe) y parseamos
    return parseFloat(valor.replace(/,/g, ''));
};

export default async function handler(req, res) {
    const now = Date.now();

    // 1. Revisar si hay datos en caché y si aún son válidos
    if (cache.data && (now - cache.timestamp < CACHE_DURATION_MS)) {
        // Enviamos una cabecera personalizada para saber que vino del caché interno
        res.setHeader('X-Cache-Hit', 'true');
        // Cache-Control para Vercel Edge Network y el navegador
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=60');
        return res.status(200).json(cache.data);
    }

    try {
        // 2. Si el caché no es válido, buscar los datos
        const { data: html } = await axios.get(URL_BNA, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });

        const $ = cheerio.load(html);

        // --- LÓGICA PARA BILLETES (Solo Venta) ---
        const tablaBilletes = $('#billetes');
        const filaDolarBillete = tablaBilletes.find('tbody tr').first();
        const billeteVenta = limpiarTexto(filaDolarBillete.find('td').eq(2).text());

        // --- LÓGICA PARA DIVISAS (Solo Venta) ---
        const tablaDivisas = $('#divisas');
        const filaDolarDivisa = tablaDivisas.find('tbody tr').first();
        const divisaVenta = limpiarTexto(filaDolarDivisa.find('td').eq(2).text());

        // 3. Crear la nueva respuesta simplificada
        const nuevaRespuesta = {
            status: 'ok',
            fecha_actualizacion: new Date(now).toISOString(),
            banco: 'Banco de la Nación Argentina',
            // Aplicamos el parser correcto a cada valor
            venta_billete: parsearFormatoBillete(billeteVenta),
            venta_divisa: parsearFormatoDivisa(divisaVenta)
        };

        // 4. Guardar la nueva respuesta en el caché
        cache.data = nuevaRespuesta;
        cache.timestamp = now;

        // 5. Enviar la respuesta
        res.setHeader('X-Cache-Hit', 'false'); // Indica que son datos nuevos
        // Cache-Control: Cachear en CDN por 30 mins (1800s), permitir servir stale por 60s mientras revalida
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=60');
        res.status(200).json(nuevaRespuesta);

    } catch (error) {
        console.error('Error al obtener cotizaciones:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo obtener la cotización del BNA',
            details: error.message
        });
    }
}
