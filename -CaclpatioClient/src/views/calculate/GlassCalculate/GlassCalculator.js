import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import {exportPatioReportToExcel} from "../../../utils/ExportToExcel";
import moment from "moment";
import {isNumber} from "@material-ui/data-grid";
import ReactToPrint from "react-to-print";
import {Alert} from "@material-ui/lab";
import CalculatePrint from "../../print/CalculatePrint";
import PatioPreview from "../components/PatioPreview";
import CalculationSummaryCards from "../components/CalculationSummaryCards";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(4)
    },
    heroCard: {
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: 16,
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(3)
        },
        marginBottom: theme.spacing(3),
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
        border: '1px solid #334155'
    },
    heroBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 20,
        backgroundColor: 'rgba(14, 165, 233, 0.25)',
        color: '#38BDF8',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: theme.spacing(1)
    },
    sectionTitle: {
        fontSize: '0.825rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1.5),
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    sectionCard: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 14,
        padding: theme.spacing(2.5),
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
    },
    calculateCard: {
        marginTop: theme.spacing(3),
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.type === 'dark' ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
    },
    tableHeader: {
        backgroundColor: theme.palette.type === 'dark' ? '#1E293B' : '#F8FAFC'
    },
    rowMaterialName: {
        fontWeight: 600,
        color: theme.palette.text.primary
    },
    countChip: {
        fontWeight: 700,
        backgroundColor: theme.palette.type === 'dark' ? '#1F2937' : '#F1F5F9',
        color: theme.palette.text.primary
    },
    calculateButton: {
        padding: '12px 32px',
        fontSize: '1rem',
        fontWeight: 700,
        borderRadius: 12
    },
    excelButton: {
        background: 'linear-gradient(135deg, #107C41 0%, #15803D 100%)',
        color: '#FFFFFF',
        borderRadius: 12,
        fontWeight: 700,
        padding: '12px 24px',
        height: 54,
        boxShadow: '0 4px 14px 0 rgba(16, 124, 65, 0.35)',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'linear-gradient(135deg, #0E6B38 0%, #166534 100%)',
            boxShadow: '0 6px 20px 0 rgba(16, 124, 65, 0.45)',
            transform: 'translateY(-1px)'
        }
    }
}));

const getCategoryChip = (name = '') => {
    if (name.includes('Ligger') || name.includes('Goot') || name.includes('Muurplaat') || name.includes('Kapak') || name.includes('Profil')) {
        return <Chip size="small" label="Profil" style={{backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 600, height: 22}}/>;
    }
    if (name.includes('Cam Panel') || name.includes('Glass') || name.includes('Sierklick') || name.includes('Çıta')) {
        return <Chip size="small" label="Cam Panel" style={{backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 600, height: 22}}/>;
    }
    if (name.includes('Vida') || name.includes('Civata') || name.includes('Conta') || name.includes('Silikon') || name.includes('Ayak')) {
        return <Chip size="small" label="Bağlantı" style={{backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600, height: 22}}/>;
    }
    return <Chip size="small" label="Donanım" style={{backgroundColor: '#F0FDF4', color: '#15803D', fontWeight: 600, height: 22}}/>;
};

const GlassCalculator = ({className, ...rest}) => {
    const classes = useStyles();
    const printRef = useRef();

    const [exportToExcelLoading, setExportToExcelLoading] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const [values, setValues] = useState({
        width: '',
        height: '',
        liggerWidth: '6',
        aluminumColor: '7016',
        lambCount: '',
        customerName: '',
        ledStrip: '',
        note: '',
        angaraj: ''
    });

    const [rows, setRows] = useState([]);
    const [validationError, setValidationError] = useState(null);

    const handleChange = (event) => {
        const name = event.target.name;
        if (name === 'width' || name === 'height') {
            setValues({
                ...values,
                [name]: event.target.value === '' ? '' : parseInt(event.target.value, 10)
            });
        } else {
            setValues({
                ...values,
                [name]: event.target.value
            });
        }
    };

    const handleCalculate = () => {
        setValidationError(null);
        const width = Number(values.width);
        const height = Number(values.height);

        if (!width || width < 50 || !height || height < 50) {
            setValidationError('Lütfen geçerli genişlik ve yükseklik değerleri giriniz (en az 50 cm).');
            return;
        }

        const goot = {
            name: 'Oluk (Goot)',
            size: width,
            count: 1
        };
        const muurplaat = {
            name: 'Duvar Profili (Muurplaat)',
            size: width,
            count: 1
        };
        
        let liggerCount = Math.max(2, Math.round((width / 94.5) + (width >= 330 ? 3 : 2)));
        if (height < 295 && liggerCount > 2) {
            liggerCount -= 1;
        }

        const ligger = {
            name: 'Taşıyıcı Profil (Ligger)',
            size: Math.max(0, height - 7),
            count: liggerCount
        };

        let divider = Math.max(1, ligger.count - 1);
        let sierklickSize = (width - (ligger.count * Number(values.liggerWidth))) / divider;
        
        // Loop safety guard
        let iterations = 0;
        while (sierklickSize >= 67.5 && iterations < 30) {
            ligger.count += 1;
            divider = Math.max(1, ligger.count - 1);
            sierklickSize = (width - (ligger.count * Number(values.liggerWidth))) / divider;
            iterations += 1;
        }

        const sierklick = {
            name: 'Cam Çıtası (Sierklick)',
            size: Math.max(0, sierklickSize),
            count: divider * 2
        };

        const glass = {
            name: 'Cam Panel',
            size: Math.max(0, sierklick.size + 3.7),
            count: divider
        };

        const muurCivatasi = {
            name: 'Duvar Cıvatası',
            size: null,
            count: width > 900 ? 16 : width > 800 ? 14 : width > 700 ? 12 : width > 600 ? 10 : width > 500 ? 8 : width > 400 ? 6 : width > 300 ? 4 : 3
        };

        const ortaCount = Math.max(0, ligger.count - 2);

        setRows([
            goot,
            muurplaat,
            {name: "Yan Taşıyıcı (Ligger Yan)", size: ligger.size, count: 2},
            {name: "Orta Taşıyıcı (Ligger Orta)", size: ligger.size, count: ortaCount},
            {name: 'Üst Orta Kapak', size: height, count: ortaCount},
            {name: 'Üst Yan Kapak', size: height, count: 2},
            sierklick,
            glass,
            {name: 'Destek Ayağı (250 cm)', size: 250, count: width <= 650 ? 2 : 3},
            {name: 'Ayak Kapağı (250 cm)', size: 250, count: width <= 650 ? 2 : 3},
            {name: 'Duvar Contası', size: width, count: 1},
            {name: 'Silikon', size: null, count: 1},
            {name: 'Oluk Yan Kapağı', size: null, count: 2},
            {name: 'Duvar Profil Kapağı', size: null, count: 2},
            {name: 'Su Tahliye Süzgeci', size: null, count: width < 700 ? 1 : 2},
            {name: '4.2x19 Boyalı Vida', size: null, count: 12},
            muurCivatasi,
            {name: 'Taşıyıcı Cıvatası', size: null, count: ligger.count * 4},
        ]);
    };

    const handleExportToExcel = () => {
        setExportToExcelLoading(true);
        try {
            const customerName = (values.customerName || '').trim();
            const timeStamp = moment().format('YYYY-MM-DD_HH-mm-ss');
            const fileName = customerName ? `${customerName}_Cam_${timeStamp}` : `Cam_Veranda_${timeStamp}`;

            const extraItems = [];
            if (values.lambCount) {
                extraItems.push({name: 'Led Spot', size: '-', count: parseInt(values.lambCount, 10)});
            }
            if (values.ledStrip) {
                extraItems.push({name: 'Led Şerit', size: '-', count: parseInt(values.ledStrip, 10)});
            }
            if (values.angaraj) {
                extraItems.push({name: 'Ankraj', size: '-', count: parseInt(values.angaraj, 10)});
            }

            exportPatioReportToExcel({
                systemTitle: 'Cam Veranda',
                projectInfo: values,
                rows,
                extraItems,
                fileName
            });
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 4500);
        } finally {
            setExportToExcelLoading(false);
        }
    };

    const currentLiggerCount = values.width && values.width >= 50
        ? Math.max(2, Math.round((Number(values.width) / 94.5) + (Number(values.width) >= 330 ? 3 : 2)))
        : 0;

    return (
        <div className={clsx(classes.root, className)} {...rest}>

            {/* Interactive 2D Pergola Visualizer */}
            <Box mb={3}>
                <PatioPreview
                    width={values.width}
                    height={values.height}
                    liggerCount={currentLiggerCount}
                    aluminumColor={values.aluminumColor}
                    roofType="glass"
                    roofColor="glass"
                    lambCount={values.lambCount}
                    liggerWidth={values.liggerWidth}
                />
            </Box>

            {/* Input Configuration Card */}
            <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}>
                <Card>
                    <CardContent style={{padding: 24}}>
                        {validationError && (
                            <Box mb={3}>
                                <Alert severity="error">{validationError}</Alert>
                            </Box>
                        )}

                        <Grid container spacing={3}>
                            {/* Section 1: Dimensions & Rafter Model */}
                            <Grid item lg={4} md={6} xs={12}>
                                <div className={classes.sectionCard}>
                                    <div className={classes.sectionTitle}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                            <path d="M21 3L3 21M21 3H15M21 3V9M3 21H9M3 21V15"/>
                                        </svg>
                                        Ölçüler & Profil Modeli
                                    </div>
                                    <TextField
                                        fullWidth
                                        label="Genişlik"
                                        margin="normal"
                                        name="width"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.width}
                                        variant="outlined"
                                        placeholder="Ör: 500"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">cm</InputAdornment>
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Yükseklik (Derinlik)"
                                        margin="normal"
                                        name="height"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.height}
                                        variant="outlined"
                                        placeholder="Ör: 300"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">cm</InputAdornment>
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Taşıyıcı Profil (Ligger)"
                                        margin="normal"
                                        name="liggerWidth"
                                        onChange={handleChange}
                                        select
                                        SelectProps={{native: true}}
                                        value={values.liggerWidth}
                                        variant="outlined"
                                    >
                                        <option value="6">Premium (6 cm)</option>
                                        <option value="5.6">Optimum (5.6 cm)</option>
                                    </TextField>
                                </div>
                            </Grid>

                            {/* Section 2: Colors & Glass Details */}
                            <Grid item lg={4} md={6} xs={12}>
                                <div className={classes.sectionCard}>
                                    <div className={classes.sectionTitle}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                                        </svg>
                                        Renk & Cam Yapısı
                                    </div>
                                    <TextField
                                        fullWidth
                                        label="Alüminyum Rengi"
                                        margin="normal"
                                        name="aluminumColor"
                                        onChange={handleChange}
                                        select
                                        SelectProps={{native: true}}
                                        value={values.aluminumColor}
                                        variant="outlined"
                                    >
                                        <option value="7016">RAL 7016 (Antrasit Gri)</option>
                                        <option value="9005">RAL 9005 (Siyah)</option>
                                        <option value="9001">RAL 9001 (Krem)</option>
                                    </TextField>
                                    <Box mt={2} p={2} bgcolor="#F0F9FF" borderRadius={8} border="1px solid #BAE6FD">
                                        <Typography variant="subtitle2" style={{color: '#0369A1', fontWeight: 700, marginBottom: 4}}>
                                            Lamine Cam Panel Standardı
                                        </Typography>
                                        <Typography variant="caption" style={{color: '#0284C7', display: 'block'}}>
                                            Maksimum cam genişliği 67.5 cm aşmayacak şekilde taşıyıcı kiriş aralıkları otomatik sıklaştırılır.
                                        </Typography>
                                    </Box>
                                </div>
                            </Grid>

                            {/* Section 3: Hardware & Lighting */}
                            <Grid item lg={4} md={12} xs={12}>
                                <div className={classes.sectionCard}>
                                    <div className={classes.sectionTitle}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                                        </svg>
                                        Aydınlatma & Aksesuarlar
                                    </div>
                                    <TextField
                                        fullWidth
                                        label="Led Spot"
                                        margin="normal"
                                        name="lambCount"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.lambCount}
                                        variant="outlined"
                                        placeholder="0"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Adet</InputAdornment>
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Led Şerit"
                                        margin="normal"
                                        name="ledStrip"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.ledStrip}
                                        variant="outlined"
                                        placeholder="0"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Adet</InputAdornment>
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Ankraj"
                                        margin="normal"
                                        name="angaraj"
                                        onChange={handleChange}
                                        type="number"
                                        value={values.angaraj}
                                        variant="outlined"
                                        placeholder="0"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Adet</InputAdornment>
                                        }}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider/>
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2.5} bgcolor="#F8FAFC">
                        <Typography variant="body2" style={{color: '#64748B'}}>
                            Ölçüleri tamamladıktan sonra kesim ve parça listesini hesaplayın
                        </Typography>
                        <Button
                            color="primary"
                            variant="contained"
                            className={classes.calculateButton}
                            onClick={handleCalculate}
                        >
                            Hesapla
                        </Button>
                    </Box>
                </Card>
            </form>

            {/* Calculation Results Section */}
            {rows.length > 0 && (
                <Card className={classes.calculateCard}>
                    <Box p={3} pb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <div>
                            <Typography variant="h3" style={{fontWeight: 800, color: '#0F172A'}}>
                                Malzeme & Kesim Listesi
                            </Typography>
                            <Typography variant="body2" style={{color: '#64748B'}}>
                                Toplam {rows.length + (values.lambCount ? 1 : 0) + (values.ledStrip ? 1 : 0) + (values.angaraj ? 1 : 0)} kalem malzeme hesaplandı
                            </Typography>
                        </div>
                        <Box display="flex" gap={1.5} alignItems="center">
                            <ReactToPrint
                                trigger={() => <Button color="primary" variant="outlined"> Yazdır </Button>}
                                content={() => printRef.current}
                            />
                            <div style={{display: "none"}}>
                                <CalculatePrint printRef={printRef} values={values} rows={rows} />
                            </div>
                        </Box>
                    </Box>

                    <Divider/>

                    <CardContent style={{padding: 24}}>
                        {/* Summary Metrics Cards */}
                        <CalculationSummaryCards
                            width={values.width}
                            height={values.height}
                            rows={rows}
                            roofType="Cam"
                        />

                        {/* Material Table with horizontal scroll on mobile */}
                        <TableContainer>
                            <Table>
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell>Kategori</TableCell>
                                        <TableCell>Malzeme Adı</TableCell>
                                        <TableCell align="right">Boyut (cm)</TableCell>
                                        <TableCell align="right">Adet</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell style={{width: 120}}>
                                                {getCategoryChip(row.name)}
                                            </TableCell>
                                            <TableCell className={classes.rowMaterialName}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right" style={{fontFamily: 'monospace', fontWeight: 700, color: '#2563EB', fontSize: '0.9rem'}}>
                                                {row.size != null ? Number(row.size).toFixed(2) : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip size="small" label={`${row.count} Adet`} className={classes.countChip}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {Boolean(values.lambCount) && (
                                        <TableRow hover>
                                            <TableCell>{getCategoryChip('Led Spot')}</TableCell>
                                            <TableCell className={classes.rowMaterialName}>Led Spot</TableCell>
                                            <TableCell align="right" style={{color: '#94A3B8'}}>-</TableCell>
                                            <TableCell align="right">
                                                <Chip size="small" label={`${values.lambCount} Adet`} style={{fontWeight: 700, backgroundColor: '#FEF08A', color: '#854D0E'}}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {Boolean(values.ledStrip) && (
                                        <TableRow hover>
                                            <TableCell>{getCategoryChip('Led Şerit')}</TableCell>
                                            <TableCell className={classes.rowMaterialName}>Led Şerit</TableCell>
                                            <TableCell align="right" style={{color: '#94A3B8'}}>-</TableCell>
                                            <TableCell align="right">
                                                <Chip size="small" label={`${values.ledStrip} Adet`} style={{fontWeight: 700, backgroundColor: '#FEF08A', color: '#854D0E'}}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {Boolean(values.angaraj) && (
                                        <TableRow hover>
                                            <TableCell>{getCategoryChip('Ankraj')}</TableCell>
                                            <TableCell className={classes.rowMaterialName}>Ankraj</TableCell>
                                            <TableCell align="right" style={{color: '#94A3B8'}}>-</TableCell>
                                            <TableCell align="right">
                                                <Chip size="small" label={`${values.angaraj} Adet`} className={classes.countChip}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Customer & Note & Excel Section */}
                        <Box mt={4} pt={3} borderTop="1px solid #E2E8F0">
                            <Grid container alignItems="center" justify="space-between" spacing={3}>
                                <Grid item lg={4} sm={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Müşteri Adı"
                                        name="customerName"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.customerName}
                                        variant="outlined"
                                        placeholder="Müşteri / Proje Adı"
                                    />
                                </Grid>
                                <Grid item lg={5} sm={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Not / Açıklama"
                                        name="note"
                                        onChange={handleChange}
                                        type="text"
                                        value={values.note}
                                        variant="outlined"
                                        placeholder="Sipariş veya montaj notu..."
                                    />
                                </Grid>
                                <Grid item lg={4} sm={12} xs={12} style={{textAlign: "right"}}>
                                    <Button
                                        className={classes.excelButton}
                                        variant="contained"
                                        fullWidth
                                        disabled={exportToExcelLoading}
                                        onClick={handleExportToExcel}
                                    >
                                        {exportToExcelLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{marginRight: 10}}>
                                                    <rect x="3" y="3" width="18" height="18" rx="3" fill="#FFFFFF" fillOpacity="0.2"/>
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <polyline points="14 2 14 8 20 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <line x1="8" y1="13" x2="16" y2="17" stroke="#FFFFFF" strokeWidth="2"/>
                                                    <line x1="16" y1="13" x2="8" y2="17" stroke="#FFFFFF" strokeWidth="2"/>
                                                </svg>
                                                <span>Excel Raporu İndir (.xlsx)</span>
                                            </Box>
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                            {exportSuccess && (
                                <Box mt={2}>
                                    <Alert severity="success" onClose={() => setExportSuccess(false)}>
                                        Excel kesim raporu başarıyla oluşturuldu ve indirildi!
                                    </Alert>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

GlassCalculator.propTypes = {
    className: PropTypes.string
};

export default GlassCalculator;
