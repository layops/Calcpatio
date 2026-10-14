import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment';

/**
 * Sanitizes a filename for Windows, macOS and Linux by stripping/replacing invalid characters.
 */
export const sanitizeFileName = (name) => {
    if (!name || typeof name !== 'string') return 'export';
    return name
        .replace(/[\\/:*?"<>|]/g, '_')
        .replace(/\s+/g, '_')
        .substring(0, 100);
};

const COLOR_NAMES = {
    '7016': 'RAL 7016 (Antrasit Gri)',
    '9005': 'RAL 9005 (Siyah)',
    '9001': 'RAL 9001 (Krem)'
};

const getMaterialCategory = (name = '') => {
    if (name.includes('Ligger') || name.includes('Goot') || name.includes('Muurplaat') || name.includes('Profil')) {
        return 'Alüminyum Profil';
    }
    if (name.includes('Kapak')) {
        return 'Kapak Profili';
    }
    if (name.includes('Çıta') || name.includes('Sierklick')) {
        return 'Panel / Cam Çıtası';
    }
    if (name.includes('Polikarbon') || name.includes('Cam Panel') || name.includes('Glass')) {
        return 'Tavan Paneli';
    }
    if (name.includes('Ayak')) {
        return 'Destek Direği';
    }
    if (name.includes('Conta') || name.includes('Silikon') || name.includes('Lastik')) {
        return 'Sızdırmazlık';
    }
    if (name.includes('Vida') || name.includes('Civata')) {
        return 'Bağlantı Elemanı';
    }
    if (name.includes('Süzgeç')) {
        return 'Drenaj & Tahliye';
    }
    if (name.includes('Led') || name.includes('Spot') || name.includes('Ankraj')) {
        return 'Opsiyonel Donanım';
    }
    return 'Malzeme';
};

const getMaterialDescription = (name = '') => {
    if (name.includes('Oluk (Goot)')) return 'Ön Taşıyıcı ve Yağmur Suyu Oluk Profili';
    if (name.includes('Duvar Profili (Muurplaat)')) return 'Duvar Montaj ve Arka Taşıyıcı Hat Profili';
    if (name.includes('Yan Taşıyıcı (Ligger Yan)')) return 'Dış Yan Kenar Taşıyıcı Kiriş Profili';
    if (name.includes('Orta Taşıyıcı (Ligger Orta)')) return 'İç Ara Taşıyıcı Kiriş Profili';
    if (name.includes('Üst Orta Kapak')) return 'Orta Kirişler Üst Pres Kapama Profili';
    if (name.includes('Üst Yan Kapak')) return 'Yan Kenar Kirişleri Üst Pres Kapama Profili';
    if (name.includes('Panel Çıtası') || name.includes('Cam Çıtası') || name.includes('Sierklick')) return 'Panel / Cam Kilitleme ve Baskı Çıtası';
    if (name.includes('Polikarbon Levha')) return '16 mm Çok Odacıklı UV Korumalı Polikarbon Plaka';
    if (name.includes('Cam Panel')) return 'Lamine Güvenlikli Tavan Cam Paneli';
    if (name.includes('Destek Ayağı')) return 'Alüminyum Zemin Taşıyıcı Direk (250 cm)';
    if (name.includes('Ayak Kapağı')) return 'Destek Ayağı Entegre Ön Kapak Profili';
    if (name.includes('Duvar Contası')) return 'EPDM Kauçuk Duvar İzolasyon Contası';
    if (name.includes('Silikon')) return 'Nötr Dış Cephe Silikon Mastik (310 ml)';
    if (name.includes('Oluk Yan Kapağı')) return 'Oluk Sağ/Sol Tahliye Bitiş Kapağı Takımı';
    if (name.includes('Duvar Profil Kapağı')) return 'Duvar Profili Bitiş Kapağı Takımı';
    if (name.includes('Su Tahliye Süzgeci')) return 'İniş Borusu Yaprak Tutucu Süzgeç';
    if (name.includes('Boyalı Vida')) return 'RAL Renk Uyumlu Paslanmaz Sac Vidası';
    if (name.includes('Duvar Cıvatası')) return 'Ağır Yük Duvar Sabitleme Dübelli Cıvatası';
    if (name.includes('Taşıyıcı Cıvatası')) return 'Kiriş & Oluk Bağlantı İmbus Cıvatası';
    if (name.includes('Led Spot')) return 'Veranda Entegre Gömme LED Spot Aydınlatma';
    if (name.includes('Led Şerit')) return 'Kanal İçi Su Geçirmez Lineer LED Şerit';
    if (name.includes('Ankraj')) return 'Zemin Çelik Ankraj Flanş ve Sabitleme Takımı';
    return '-';
};

/**
 * Exports detailed cutting & material lists to a beautifully formatted Excel workbook (.xlsx).
 */
export const exportPatioReportToExcel = ({
    systemTitle = 'Polikarbon Veranda',
    projectInfo = {},
    rows = [],
    extraItems = [],
    fileName = 'Veranda_Hesaplama'
}) => {
    const width = Number(projectInfo.width) || 0;
    const height = Number(projectInfo.height) || 0;
    const areaM2 = width > 0 && height > 0 ? ((width * height) / 10000).toFixed(2) : '0.00';
    const reportDate = moment().format('DD.MM.YYYY HH:mm');
    const colorLabel = COLOR_NAMES[projectInfo.aluminumColor] || projectInfo.aluminumColor || '-';

    let roofLabel = 'Polikarbon';
    if (systemTitle.includes('Cam')) {
        roofLabel = 'Lamine Cam Panel';
    } else if (projectInfo.polyCarbonColor === 'opaal') {
        roofLabel = '16 mm Opak (Opaal) Polikarbon Levha';
    } else if (projectInfo.polyCarbonColor === 'helder') {
        roofLabel = '16 mm Şeffaf (Helder) Polikarbon Levha';
    }

    const profileModel = projectInfo.liggerWidth === '5.6' ? 'Optimum (5.6 cm)' : 'Premium (6 cm)';

    // Build Executive Array of Arrays
    const aoa = [];

    // Header Title Banner
    aoa.push(['CALCPATIO - MİMARİ VERANDA VE PERGOLA KESİM RAPORU']);
    aoa.push(['Raporlama Tarihi:', reportDate, '', 'Yazılım Sürümü:', 'Calcpatio Pro Suite v2.0']);
    aoa.push([]); // blank row

    // Project & System Details Section
    aoa.push(['1. PROJE VE SİSTEM BİLGİLERİ']);
    aoa.push(['Müşteri / Proje Adı:', projectInfo.customerName || 'Belirtilmedi', '', 'Sistem Modeli:', systemTitle]);
    aoa.push(['Genişlik (En):', `${width} cm`, '', 'Yükseklik (Derinlik):', `${height} cm`]);
    aoa.push(['Toplam Çatı Alanı:', `${areaM2} m²`, '', 'Alüminyum Rengi:', colorLabel]);
    aoa.push(['Tavan Kaplaması:', roofLabel, '', 'Profil Tipi:', profileModel]);
    if (projectInfo.note) {
        aoa.push(['Sipariş / Montaj Notu:', projectInfo.note]);
    }
    aoa.push([]); // blank row

    // Materials Cutting List Section
    aoa.push(['2. MALZEME VE PARÇA KESİM LİSTESİ']);
    aoa.push([
        'S.No',
        'Kategori',
        'Malzeme Tanımı',
        'Kesim Ölçüsü (cm)',
        'Miktar (Adet)',
        'Açıklama / Teknik Detay'
    ]);

    // All combined items
    const allRows = [...rows, ...extraItems];
    let totalPieces = 0;

    allRows.forEach((item, index) => {
        const countNum = Number(item.count) || 0;
        totalPieces += countNum;
        const sizeFormatted = item.size != null && item.size !== '-' && !isNaN(Number(item.size))
            ? Number(Number(item.size).toFixed(2))
            : '-';

        aoa.push([
            index + 1,
            getMaterialCategory(item.name),
            item.name,
            sizeFormatted,
            countNum,
            getMaterialDescription(item.name)
        ]);
    });

    // Total Summary Row
    aoa.push([]);
    aoa.push([
        'TOPLAM',
        `${allRows.length} Kalem Malzeme`,
        '',
        '',
        totalPieces,
        `Toplam ${totalPieces} adet parça ve montaj elemanı`
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Precise column widths (wch) for comfortable reading without truncation
    ws['!cols'] = [
        {wch: 8},   // S.No
        {wch: 22},  // Kategori
        {wch: 36},  // Malzeme Tanımı
        {wch: 20},  // Kesim Ölçüsü (cm)
        {wch: 16},  // Miktar (Adet)
        {wch: 45}   // Açıklama / Teknik Detay
    ];

    // Merge ranges for headings
    ws['!merges'] = [
        {s: {r: 0, c: 0}, e: {r: 0, c: 5}}, // Title banner
        {s: {r: 3, c: 0}, e: {r: 3, c: 5}}, // Section 1 header
        {s: {r: 10 + (projectInfo.note ? 1 : 0), c: 0}, e: {r: 10 + (projectInfo.note ? 1 : 0), c: 5}} // Section 2 header
    ];

    const sheetTitle = systemTitle.includes('Cam') ? 'Cam_Veranda' : 'Polikarbon_Veranda';
    const wb = {Sheets: {[sheetTitle]: ws}, SheetNames: [sheetTitle]};

    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    const safeName = sanitizeFileName(fileName);
    FileSaver.saveAs(blob, safeName + '.xlsx');
};

/**
 * Standard legacy export (retained for backward compatibility).
 */
const exportToExcel = (data, fileName, sheetName = 'Calculation') => {
    const ws = XLSX.utils.json_to_sheet(data);

    if (data && data.length > 0) {
        const colKeys = Object.keys(data[0]);
        ws['!cols'] = colKeys.map(key => {
            const maxLen = Math.max(
                key.length,
                ...data.map(row => (row[key] !== null && row[key] !== undefined ? String(row[key]).length : 0))
            );
            return {wch: Math.min(Math.max(maxLen + 3, 14), 45)};
        });
    }

    const wb = {Sheets: {[sheetName]: ws}, SheetNames: [sheetName]};
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    const safeName = sanitizeFileName(fileName);
    FileSaver.saveAs(blob, safeName + '.xlsx');
};

export default exportToExcel;