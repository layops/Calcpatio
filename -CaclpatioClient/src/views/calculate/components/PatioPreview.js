import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, makeStyles, Typography, Button, ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        padding: theme.spacing(3),
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: theme.spacing(1.5),
        marginBottom: theme.spacing(2)
    },
    titleGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5)
    },
    titleIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
    },
    badgeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        flexWrap: 'wrap'
    },
    viewToggleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1.5),
        flexWrap: 'wrap',
        gap: theme.spacing(1)
    },
    canvasContainer: {
        width: '100%',
        minHeight: 380,
        backgroundColor: '#090D16',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        borderRadius: 14,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #1E293B',
        boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
    },
    svg: {
        width: '100%',
        maxHeight: 460,
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))'
    },
    emptyState: {
        color: '#94A3B8',
        textAlign: 'center',
        padding: theme.spacing(8, 2)
    },
    legendRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        borderTop: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: theme.spacing(1.5)
    },
    swatch: {
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 4,
        marginRight: 6,
        verticalAlign: 'middle',
        border: '1px solid rgba(0,0,0,0.2)'
    },
    viewBtn: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.8rem',
        padding: '5px 14px'
    },
    viewBtnActive: {
        backgroundColor: '#2563EB !important',
        color: '#FFFFFF !important',
        borderColor: '#2563EB !important'
    },
    viewBtnInactive: {
        backgroundColor: '#FFFFFF',
        color: '#475569',
        borderColor: '#CBD5E1',
        '&:hover': {
            backgroundColor: '#F1F5F9'
        }
    },
    infoNotice: {
        fontSize: '0.78rem',
        color: '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        gap: 6
    }
}));

const COLOR_MAP = {
    '7016': {
        hex: '#33383C',
        topHex: '#4A5258',
        shadowHex: '#1E2225',
        stroke: '#0F172A',
        name: 'RAL 7016 Antrasit Gri'
    },
    '9005': {
        hex: '#18181B',
        topHex: '#2E2E33',
        shadowHex: '#09090B',
        stroke: '#000000',
        name: 'RAL 9005 Mat Siyah'
    },
    '9001': {
        hex: '#ECE7DA',
        topHex: '#FDFCF9',
        shadowHex: '#CBC4B2',
        stroke: '#94A3B8',
        name: 'RAL 9001 Krem Beyaz'
    }
};

const PatioPreview = ({
    width = 0,
    height = 0,
    liggerCount = 0,
    aluminumColor = '7016',
    roofType = 'polyCarbon', // 'polyCarbon' | 'glass'
    roofColor = 'opaal',     // 'opaal' | 'helder' | 'glass'
    lambCount = 0,
    ayakCount = 2,
    liggerWidth = '6'
}) => {
    const classes = useStyles();
    const [viewMode, setViewMode] = useState('3d'); // '3d' | '2d'

    const numWidth = Number(width) || 0;
    const numHeight = Number(height) || 0;
    const numLiggers = Number(liggerCount) || (numWidth > 0 ? Math.max(2, Math.round((numWidth / 94.5) + 1)) : 0);
    const numLambs = parseInt(lambCount, 10) || 0;

    const colorConfig = COLOR_MAP[aluminumColor] || COLOR_MAP['7016'];
    const frameColor = colorConfig.hex;
    const topFrameColor = colorConfig.topHex;
    const shadowFrameColor = colorConfig.shadowHex;
    const isLightFrame = aluminumColor === '9001';

    // Roof appearance & naming
    let roofTitle = 'Polikarbon (Opak Süt Beyaz)';
    let panelBadge = 'Opak Polikarbon Tavan';
    let isGlass = roofType === 'glass';
    let isClearPoly = roofType === 'polyCarbon' && roofColor === 'helder';

    if (isGlass) {
        roofTitle = 'Lamine Emniyet Camı';
        panelBadge = 'Lamine Cam Tavan';
    } else if (isClearPoly) {
        roofTitle = 'Polikarbon (Şeffaf)';
        panelBadge = 'Şeffaf Polikarbon Tavan';
    }

    const hasDimensions = numWidth >= 50 && numHeight >= 50;
    const areaM2 = hasDimensions ? ((numWidth * numHeight) / 10000).toFixed(2) : '0.00';
    const panelCount = Math.max(1, numLiggers - 1);
    const panelWidthCm = hasDimensions && panelCount > 0 
        ? ((numWidth - (numLiggers * Number(liggerWidth))) / panelCount).toFixed(1) 
        : '0.0';

    const actualAyakCount = numWidth <= 650 ? 2 : (ayakCount || 3);

    // 3D Perspective Coordinate Geometry
    // ViewBox: 840 x 460
    const svgW = 840;
    const svgH = 460;

    // Rear Wall Mount (Muurplaat) line high on the rear house wall
    const rearY = 70;
    const rearXStart = 160;
    const rearXEnd = 680;
    const rearSpan = rearXEnd - rearXStart;

    // Front Gutter (Goot) line lower & wider due to perspective
    const frontY = 210;
    const frontXStart = 100;
    const frontXEnd = 740;
    const frontSpan = frontXEnd - frontXStart;

    // Ground level where posts land
    const groundY = 390;

    // Compute rafter coordinates for 3D perspective
    const rafters3D = [];
    for (let i = 0; i < numLiggers; i++) {
        const factor = numLiggers > 1 ? i / (numLiggers - 1) : 0;
        const rx = rearXStart + (factor * rearSpan);
        const fx = frontXStart + (factor * frontSpan);
        rafters3D.push({ rx, fx, idx: i });
    }

    // Support posts in 3D perspective
    const posts3D = [];
    if (actualAyakCount === 2) {
        posts3D.push(frontXStart + 16, frontXEnd - 16);
    } else {
        posts3D.push(frontXStart + 16, (frontXStart + frontXEnd) / 2, frontXEnd - 16);
    }

    // 2D Top-down geometry
    const pad2DX = 70;
    const pad2DTop = 50;
    const w2D = svgW - (pad2DX * 2);
    const h2D = 230;
    const rafters2D = [];
    const step2D = w2D / (numLiggers > 1 ? numLiggers - 1 : 1);
    for (let i = 0; i < numLiggers; i++) {
        rafters2D.push(pad2DX + (i * step2D));
    }

    return (
        <div className={classes.root}>
            {/* Header info bar */}
            <div className={classes.header}>
                <div className={classes.titleGroup}>
                    <div className={classes.titleIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M3 10l9-7 9 7"/>
                        </svg>
                    </div>
                    <div>
                        <Typography variant="h5" style={{fontWeight: 700, color: '#0F172A'}}>
                            Mimari Veranda Önizlemesi
                        </Typography>
                        <Typography variant="caption" style={{color: '#64748B'}}>
                            Eğimli tavan kaplaması ve açık yan cephe yapısını canlı inceleyin
                        </Typography>
                    </div>
                </div>

                <div className={classes.badgeRow}>
                    <Chip
                        size="small"
                        label={colorConfig.name}
                        style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                        }}
                        icon={<span className={classes.swatch} style={{backgroundColor: colorConfig.hex}}/>}
                    />
                    <Chip
                        size="small"
                        label={panelBadge}
                        color="primary"
                        variant="outlined"
                        style={{fontWeight: 600, fontSize: '0.75rem'}}
                    />
                    {hasDimensions && (
                        <Chip
                            size="small"
                            label={`${numWidth} × ${numHeight} cm (${areaM2} m²)`}
                            style={{
                                backgroundColor: '#EFF6FF',
                                color: '#1D4ED8',
                                fontWeight: 700,
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                </div>
            </div>

            {/* View Mode Switcher */}
            <div className={classes.viewToggleContainer}>
                <ButtonGroup size="small" variant="outlined">
                    <Button
                        className={`${classes.viewBtn} ${viewMode === '3d' ? classes.viewBtnActive : classes.viewBtnInactive}`}
                        onClick={() => setViewMode('3d')}
                        startIcon={
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                                <line x1="12" y1="22.08" x2="12" y2="12"/>
                            </svg>
                        }
                    >
                        3D Perspektif Görünüm (Açık Alan & Eğimli Tavan)
                    </Button>
                    <Button
                        className={`${classes.viewBtn} ${viewMode === '2d' ? classes.viewBtnActive : classes.viewBtnInactive}`}
                        onClick={() => setViewMode('2d')}
                        startIcon={
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <path d="M3 9h18M9 21V9"/>
                            </svg>
                        }
                    >
                        2D Kuşbakışı Çatı Planı (Sadece Tavan Kesimi)
                    </Button>
                </ButtonGroup>

                <div className={classes.infoNotice}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>{viewMode === '3d' ? 'Cam/Polikarbon yalnızca tavanda yer alır, yan cepheler tamamen açıktır.' : 'Bu plan tavan profillerinin ve panellerinin üstten kuşbakışı kesitidir.'}</span>
                </div>
            </div>

            {/* SVG Visualizer Canvas */}
            <div className={classes.canvasContainer}>
                {!hasDimensions ? (
                    <div className={classes.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" style={{margin: '0 auto 12px', display: 'block'}}>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                        <Typography variant="h6" style={{color: '#E2E8F0', fontWeight: 600, marginBottom: 4}}>
                            Canlı Mimari Önizleme Bekleniyor
                        </Typography>
                        <Typography variant="body2" style={{color: '#94A3B8'}}>
                            Sol menüden Genişlik ve Yükseklik ölçülerini girdiğinizde 3D veranda modeli çizilecektir.
                        </Typography>
                    </div>
                ) : viewMode === '3d' ? (
                    /* ================= 3D ISOMETRIC ARCHITECTURAL PERSPECTIVE ================= */
                    <svg
                        className={classes.svg}
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Wall & Deck Gradients */}
                            <linearGradient id="houseWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1E293B"/>
                                <stop offset="100%" stopColor="#0F172A"/>
                            </linearGradient>
                            <linearGradient id="deckFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#172033"/>
                                <stop offset="100%" stopColor="#090D16"/>
                            </linearGradient>

                            {/* Aluminum Frame Gradients */}
                            <linearGradient id="alTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={topFrameColor}/>
                                <stop offset="50%" stopColor={frameColor}/>
                                <stop offset="100%" stopColor={shadowFrameColor}/>
                            </linearGradient>
                            <linearGradient id="alSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={frameColor}/>
                                <stop offset="100%" stopColor={shadowFrameColor}/>
                            </linearGradient>

                            {/* Polycarbonate Opal Gradient */}
                            <linearGradient id="polyOpalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.65)"/>
                                <stop offset="60%" stopColor="rgba(241, 245, 249, 0.45)"/>
                                <stop offset="100%" stopColor="rgba(226, 232, 240, 0.55)"/>
                            </linearGradient>

                            {/* Polycarbonate Clear Gradient */}
                            <linearGradient id="polyClearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(186, 230, 253, 0.35)"/>
                                <stop offset="50%" stopColor="rgba(125, 211, 252, 0.20)"/>
                                <stop offset="100%" stopColor="rgba(56, 189, 248, 0.28)"/>
                            </linearGradient>

                            {/* Glass Panel Gradient */}
                            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.30)"/>
                                <stop offset="35%" stopColor="rgba(14, 165, 233, 0.15)"/>
                                <stop offset="70%" stopColor="rgba(56, 189, 248, 0.25)"/>
                                <stop offset="100%" stopColor="rgba(2, 132, 199, 0.35)"/>
                            </linearGradient>

                            {/* LED Glow filter */}
                            <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                                <feMerge>
                                    <feMergeNode in="blur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* 1. BACKGROUND: HOUSE WALL (Bina Duvarı - Arka Cephe) */}
                        <g id="house-wall">
                            <rect x="50" y="20" width="740" height="280" rx="4" fill="url(#houseWallGrad)" stroke="#334155" strokeWidth="1"/>
                            {/* Architectural horizontal siding lines on house wall */}
                            {[50, 80, 110, 140, 170, 200, 230, 260].map((yLine) => (
                                <line key={`siding-${yLine}`} x1="50" y1={yLine} x2="790" y2={yLine} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                            ))}

                            {/* Patio Sliding Door on House Wall (Behind the veranda to give authentic scale) */}
                            <rect x="290" y="85" width="260" height="215" rx="3" fill="#0A0F1D" stroke="#475569" strokeWidth="2"/>
                            <rect x="296" y="91" width="120" height="203" fill="rgba(56, 189, 248, 0.05)" stroke="#334155" strokeWidth="1"/>
                            <rect x="424" y="91" width="120" height="203" fill="rgba(56, 189, 248, 0.05)" stroke="#334155" strokeWidth="1"/>
                            {/* Glass reflections on door */}
                            <line x1="310" y1="100" x2="390" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
                            <line x1="438" y1="100" x2="518" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
                            {/* Door Handles */}
                            <line x1="412" y1="180" x2="412" y2="215" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
                            <line x1="428" y1="180" x2="428" y2="215" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
                            <text x="420" y="105" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                                BİNA DUVARI &amp; BAHÇE ÇIKIŞ KAPISI
                            </text>
                        </g>

                        {/* 2. GROUND TERRACE DECK (Açık Teras Zemin Alanı) */}
                        <g id="terrace-ground">
                            <polygon
                                points={`50,300 790,300 810,440 30,440`}
                                fill="url(#deckFloorGrad)"
                                stroke="#1E293B"
                                strokeWidth="1"
                            />
                            {/* Decking planks perspective lines */}
                            {[325, 350, 375, 400, 425].map((yPlank) => (
                                <line key={`plank-${yPlank}`} x1="40" y1={yPlank} x2="800" y2={yPlank} stroke="rgba(255,255,255,0.04)" strokeWidth="1.2"/>
                            ))}

                            {/* Soft ground shadow cast by the roof */}
                            <polygon
                                points={`${frontXStart - 10},${groundY - 10} ${frontXEnd + 10},${groundY - 10} ${frontXEnd + 25},${groundY + 15} ${frontXStart - 25},${groundY + 15}`}
                                fill="rgba(0, 0, 0, 0.45)"
                            />
                        </g>

                        {/* 3. OPEN AIR CALLOUTS (YANLAR VE ALT AÇIK ALAN) */}
                        <g id="open-space-indicators">
                            {/* Left Side Open Space Guide */}
                            <path
                                d={`M ${rearXStart - 20} 80 Q ${frontXStart - 50} 150 ${frontXStart - 10} 220`}
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <rect x="25" y="165" width="125" height="24" rx="12" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" strokeWidth="1"/>
                            <text x="87" y="181" fill="#38BDF8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                🌿 Yan Cephe Açık (Boşluk)
                            </text>

                            {/* Right Side Open Space Guide */}
                            <path
                                d={`M ${rearXEnd + 20} 80 Q ${frontXEnd + 50} 150 ${frontXEnd + 10} 220`}
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                            />
                            <rect x="690" y="165" width="125" height="24" rx="12" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" strokeWidth="1"/>
                            <text x="752" y="181" fill="#38BDF8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                🌿 Yan Cephe Açık (Boşluk)
                            </text>

                            {/* Center Passage Underneath Guide */}
                            <rect x="330" y="295" width="180" height="22" rx="11" fill="rgba(15, 23, 42, 0.85)" stroke="#64748B" strokeWidth="1"/>
                            <text x="420" y="310" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                🚶 Açık Veranda / Yaşam Alanı
                            </text>
                        </g>

                        {/* 4. SLOPED ROOF PLANE (EĞİMLİ TAVAN: POLİKARBON / CAM PANELLER) */}
                        <g id="sloped-roof-panels">
                            {/* Panel Quads between Rafters */}
                            {rafters3D.map((raft, idx) => {
                                if (idx === rafters3D.length - 1) return null;
                                const nextRaft = rafters3D[idx + 1];

                                const panelFill = isGlass 
                                    ? 'url(#glassGrad)' 
                                    : (isClearPoly ? 'url(#polyClearGrad)' : 'url(#polyOpalGrad)');
                                const panelStroke = isGlass 
                                    ? 'rgba(56, 189, 248, 0.4)' 
                                    : (isClearPoly ? 'rgba(125, 211, 252, 0.35)' : 'rgba(255, 255, 255, 0.25)');

                                return (
                                    <g key={`roof-panel-${idx}`}>
                                        {/* Translucent Panel Quad */}
                                        <polygon
                                            points={`
                                                ${raft.rx + 3},${rearY + 8}
                                                ${nextRaft.rx - 3},${rearY + 8}
                                                ${nextRaft.fx - 4},${frontY - 3}
                                                ${raft.fx + 4},${frontY - 3}
                                            `}
                                            fill={panelFill}
                                            stroke={panelStroke}
                                            strokeWidth="1"
                                        />

                                        {/* If Polycarbonate: Internal vertical rib/flute lines running down the slope */}
                                        {!isGlass && (
                                            <>
                                                {[0.33, 0.66].map((fraction, fIdx) => {
                                                    const topSubX = raft.rx + ((nextRaft.rx - raft.rx) * fraction);
                                                    const botSubX = raft.fx + ((nextRaft.fx - raft.fx) * fraction);
                                                    return (
                                                        <line
                                                            key={`flute-${fIdx}`}
                                                            x1={topSubX}
                                                            y1={rearY + 8}
                                                            x2={botSubX}
                                                            y2={frontY - 3}
                                                            stroke="rgba(255,255,255,0.18)"
                                                            strokeWidth="0.8"
                                                        />
                                                    );
                                                })}
                                            </>
                                        )}

                                        {/* Glass & Poly Clear diagonal sunlight reflection sheen */}
                                        <line
                                            x1={raft.rx + 8}
                                            y1={rearY + 15}
                                            x2={nextRaft.fx - 12}
                                            y2={frontY - 20}
                                            stroke="rgba(255,255,255,0.22)"
                                            strokeWidth="1.5"
                                        />
                                    </g>
                                );
                            })}
                        </g>

                        {/* 5. REAR WALL MOUNTING BEAM (Muurplaat - Duvara Sabitlenen Profil) */}
                        <g id="muurplaat-beam">
                            {/* 3D Box extrusion */}
                            <polygon
                                points={`
                                    ${rearXStart - 12},${rearY - 6}
                                    ${rearXEnd + 12},${rearY - 6}
                                    ${rearXEnd + 12},${rearY + 8}
                                    ${rearXStart - 12},${rearY + 8}
                                `}
                                fill="url(#alTopGrad)"
                                stroke={colorConfig.stroke}
                                strokeWidth="1.2"
                            />
                            {/* Front face lip */}
                            <rect
                                x={rearXStart - 12}
                                y={rearY + 2}
                                width={rearSpan + 24}
                                height="6"
                                fill="url(#alSideGrad)"
                            />
                            {/* Label */}
                            <text
                                x={rearXStart + (rearSpan / 2)}
                                y={rearY - 11}
                                fill="#94A3B8"
                                fontSize="10"
                                fontWeight="700"
                                textAnchor="middle"
                                fontFamily="sans-serif"
                            >
                                DUVAR PROFİLİ (MUURPLAAT) ── Duvara Sabitlenen Arka Kısım
                            </text>
                        </g>

                        {/* 6. RAFTERS (Ligger - Eğimli Çatı Taşıyıcı Profilleri) */}
                        <g id="rafter-beams">
                            {rafters3D.map((raft, idx) => {
                                const beamHalfTop = 3.5;
                                const beamHalfBot = 5;

                                return (
                                    <g key={`rafter-3d-${idx}`}>
                                        {/* Top face of rafter */}
                                        <polygon
                                            points={`
                                                ${raft.rx - beamHalfTop},${rearY + 4}
                                                ${raft.rx + beamHalfTop},${rearY + 4}
                                                ${raft.fx + beamHalfBot},${frontY - 1}
                                                ${raft.fx - beamHalfBot},${frontY - 1}
                                            `}
                                            fill="url(#alTopGrad)"
                                            stroke={colorConfig.stroke}
                                            strokeWidth="1"
                                        />
                                        {/* 3D side edge for realistic bevel */}
                                        <polygon
                                            points={`
                                                ${raft.rx + beamHalfTop},${rearY + 4}
                                                ${raft.rx + beamHalfTop + 2},${rearY + 7}
                                                ${raft.fx + beamHalfBot + 3},${frontY + 2}
                                                ${raft.fx + beamHalfBot},${frontY - 1}
                                            `}
                                            fill={shadowFrameColor}
                                        />

                                        {/* Integrated LED Spotlights on roof rafters */}
                                        {numLambs > 0 && idx > 0 && idx < rafters3D.length - 1 && (idx % 2 === 1) && (
                                            <g filter="url(#ledGlow)">
                                                <circle
                                                    cx={(raft.rx + raft.fx) / 2}
                                                    cy={(rearY + frontY) / 2}
                                                    r="5"
                                                    fill="#FDE047"
                                                />
                                                <circle
                                                    cx={(raft.rx + raft.fx) / 2}
                                                    cy={(rearY + frontY) / 2}
                                                    r="2"
                                                    fill="#FFFFFF"
                                                />
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </g>

                        {/* 7. FRONT GUTTER PROFILE (Goot - Ön Oluk Profili) */}
                        <g id="gutter-profile">
                            {/* Top bevel face */}
                            <polygon
                                points={`
                                    ${frontXStart - 16},${frontY - 6}
                                    ${frontXEnd + 16},${frontY - 6}
                                    ${frontXEnd + 16},${frontY}
                                    ${frontXStart - 16},${frontY}
                                `}
                                fill={topFrameColor}
                                stroke={colorConfig.stroke}
                                strokeWidth="1"
                            />
                            {/* Front face of gutter */}
                            <rect
                                x={frontXStart - 16}
                                y={frontY}
                                width={frontSpan + 32}
                                height="18"
                                rx="3"
                                fill="url(#alSideGrad)"
                                stroke={colorConfig.stroke}
                                strokeWidth="1.2"
                            />
                            {/* Gutter highlight groove */}
                            <line
                                x1={frontXStart - 12}
                                y1={frontY + 6}
                                x2={frontXEnd + 12}
                                y2={frontY + 6}
                                stroke={topFrameColor}
                                strokeWidth="1.5"
                            />
                            {/* Front Gutter Badge Text */}
                            <text
                                x={frontXStart + (frontSpan / 2)}
                                y={frontY + 13}
                                fill={isLightFrame ? '#0F172A' : '#F8FAFC'}
                                fontSize="10"
                                fontWeight="800"
                                textAnchor="middle"
                                fontFamily="sans-serif"
                            >
                                ÖN OLUK PROFİLİ (GOOT) ── Su Tahliye Oluk Kirişi
                            </text>
                        </g>

                        {/* 8. VERTICAL SUPPORT POSTS (Ayaklar - Taşıyıcı Dikmeler) */}
                        <g id="support-posts">
                            {posts3D.map((px, pIdx) => (
                                <g key={`post-3d-${pIdx}`}>
                                    {/* Main post shaft dropping from gutter to terrace floor */}
                                    <rect
                                        x={px - 7}
                                        y={frontY + 18}
                                        width="14"
                                        height={groundY - (frontY + 18)}
                                        rx="2"
                                        fill="url(#alTopGrad)"
                                        stroke={colorConfig.stroke}
                                        strokeWidth="1.2"
                                    />
                                    {/* Post side shadow facet for 3D cylinder/box look */}
                                    <rect
                                        x={px + 2}
                                        y={frontY + 18}
                                        width="5"
                                        height={groundY - (frontY + 18)}
                                        fill={shadowFrameColor}
                                    />
                                    {/* Base mounting foot plate on the terrace ground */}
                                    <polygon
                                        points={`
                                            ${px - 14},${groundY}
                                            ${px + 14},${groundY}
                                            ${px + 18},${groundY + 8}
                                            ${px - 18},${groundY + 8}
                                        `}
                                        fill="#475569"
                                        stroke="#1E293B"
                                        strokeWidth="1"
                                    />
                                    {/* Anchor bolts */}
                                    <circle cx={px - 9} cy={groundY + 4} r="1.5" fill="#CBD5E1"/>
                                    <circle cx={px + 9} cy={groundY + 4} r="1.5" fill="#CBD5E1"/>
                                </g>
                            ))}
                        </g>

                        {/* 9. DIMENSION & ARCHITECTURAL ANNOTATIONS */}
                        <g id="dimension-annotations">
                            {/* Width Dimension (Top) */}
                            <line x1={rearXStart} y1="38" x2={rearXEnd} y2="38" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3"/>
                            <line x1={rearXStart} y1="32" x2={rearXStart} y2="44" stroke="#38BDF8" strokeWidth="2"/>
                            <line x1={rearXEnd} y1="32" x2={rearXEnd} y2="44" stroke="#38BDF8" strokeWidth="2"/>
                            <rect x={(rearXStart + rearXEnd) / 2 - 50} y="26" width="100" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2"/>
                            <text x={(rearXStart + rearXEnd) / 2} y="42" fill="#38BDF8" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
                                ↔ {numWidth} cm Genişlik
                            </text>

                            {/* Slope Depth Dimension (Along Left Edge) */}
                            <line
                                x1={rearXStart - 18}
                                y1={rearY + 10}
                                x2={frontXStart - 22}
                                y2={frontY}
                                stroke="#38BDF8"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                            />
                            <circle cx={rearXStart - 18} cy={rearY + 10} r="3" fill="#38BDF8"/>
                            <circle cx={frontXStart - 22} cy={frontY} r="3" fill="#38BDF8"/>
                            <rect x="52" y="115" width="105" height="22" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1"/>
                            <text x="104" y="130" fill="#38BDF8" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                ↗ {numHeight} cm Derinlik
                            </text>

                            {/* Post Height Dimension (Along Rightmost Post) */}
                            <line
                                x1={frontXEnd + 26}
                                y1={frontY + 18}
                                x2={frontXEnd + 26}
                                y2={groundY}
                                stroke="#10B981"
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                            />
                            <line x1={frontXEnd + 20} y1={frontY + 18} x2={frontXEnd + 32} y2={frontY + 18} stroke="#10B981" strokeWidth="2"/>
                            <line x1={frontXEnd + 20} y1={groundY} x2={frontXEnd + 32} y2={groundY} stroke="#10B981" strokeWidth="2"/>
                            <rect x={frontXEnd + 36} y={frontY + 70} width="70" height="22" rx="4" fill="#0F172A" stroke="#10B981" strokeWidth="1"/>
                            <text x={frontXEnd + 71} y={frontY + 85} fill="#10B981" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                ↕ 250 cm Boy
                            </text>
                        </g>

                        {/* Roof Callout Banner (Top Floating Tag) */}
                        <g>
                            <rect x="300" y="135" width="240" height="26" rx="13" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1"/>
                            <text x="420" y="152" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                🏠 EĞİMLİ TAVAN: {roofTitle}
                            </text>
                        </g>
                    </svg>
                ) : (
                    /* ================= 2D DIRECT TOP-DOWN CEILING BLUEPRINT ================= */
                    <svg
                        className={classes.svg}
                        viewBox={`0 0 ${svgW} ${svgH}`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="blueprintPanelOpal" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)"/>
                                <stop offset="100%" stopColor="rgba(226, 232, 240, 0.3)"/>
                            </linearGradient>
                            <linearGradient id="blueprintPanelGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.35)"/>
                                <stop offset="100%" stopColor="rgba(14, 165, 233, 0.20)"/>
                            </linearGradient>
                        </defs>

                        {/* Background blueprint grid box */}
                        <rect x={pad2DX - 20} y={pad2DTop - 20} width={w2D + 40} height={h2D + 130} rx="8" fill="#0B132B" stroke="#1E293B" strokeWidth="1.5"/>

                        {/* Blueprint Title Notice */}
                        <text x={svgW / 2} y={pad2DTop + 5} fill="#38BDF8" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
                            📐 TAVAN KUŞBAKIŞI KESİT PLANI (Sadece Çatı Profilleri &amp; Paneller)
                        </text>
                        <text x={svgW / 2} y={pad2DTop + 24} fill="#94A3B8" fontSize="10" fontWeight="500" textAnchor="middle" fontFamily="sans-serif">
                            Veranda altı ve yanları açık havadır; polikarbon/cam levhalar yalnızca aşağıdaki tavan ızgarasına yerleştirilir.
                        </text>

                        {/* Width Dimension */}
                        <g>
                            <line x1={pad2DX} y1={pad2DTop + 45} x2={pad2DX + w2D} y2={pad2DTop + 45} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3"/>
                            <line x1={pad2DX} y1={pad2DTop + 39} x2={pad2DX} y2={pad2DTop + 51} stroke="#38BDF8" strokeWidth="2"/>
                            <line x1={pad2DX + w2D} y1={pad2DTop + 39} x2={pad2DX + w2D} y2={pad2DTop + 51} stroke="#38BDF8" strokeWidth="2"/>
                            <text x={svgW / 2} y={pad2DTop + 42} fill="#38BDF8" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                                ↔ Veranda Tavan Genişliği: {numWidth} cm
                            </text>
                        </g>

                        {/* Top Wall Mounting Profile (Muurplaat) */}
                        <rect
                            x={pad2DX}
                            y={pad2DTop + 60}
                            width={w2D}
                            height="16"
                            rx="2"
                            fill={frameColor}
                            stroke={colorConfig.stroke}
                            strokeWidth="1.5"
                        />
                        <text x={pad2DX + (w2D / 2)} y={pad2DTop + 72} fill={isLightFrame ? '#0F172A' : '#F8FAFC'} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                            DUVAR PROFİLİ (MUURPLAAT) ── {numWidth} cm
                        </text>

                        {/* Ceiling Panels Between Rafters */}
                        {rafters2D.map((rx, idx) => {
                            if (idx === rafters2D.length - 1) return null;
                            const nextRx = rafters2D[idx + 1];
                            const pW = nextRx - rx;
                            return (
                                <g key={`panel-2d-${idx}`}>
                                    <rect
                                        x={rx + 4}
                                        y={pad2DTop + 78}
                                        width={pW - 8}
                                        height={h2D - 20}
                                        fill={isGlass ? 'url(#blueprintPanelGlass)' : 'url(#blueprintPanelOpal)'}
                                        stroke={isGlass ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.3)'}
                                        strokeWidth="1"
                                        rx="2"
                                    />
                                    {/* Panel width label */}
                                    <text
                                        x={rx + (pW / 2)}
                                        y={pad2DTop + 78 + (h2D / 2)}
                                        fill="#CBD5E1"
                                        fontSize="10"
                                        fontWeight="600"
                                        textAnchor="middle"
                                        fontFamily="sans-serif"
                                    >
                                        {panelWidthCm} cm
                                    </text>
                                    <text
                                        x={rx + (pW / 2)}
                                        y={pad2DTop + 78 + (h2D / 2) + 14}
                                        fill="#64748B"
                                        fontSize="8"
                                        fontWeight="500"
                                        textAnchor="middle"
                                        fontFamily="sans-serif"
                                    >
                                        Panel #{idx + 1}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Rafters (Ligger) */}
                        {rafters2D.map((rx, idx) => (
                            <g key={`rafter-2d-${idx}`}>
                                <rect
                                    x={rx - 4}
                                    y={pad2DTop + 76}
                                    width="8"
                                    height={h2D - 16}
                                    rx="2"
                                    fill={frameColor}
                                    stroke={colorConfig.stroke}
                                    strokeWidth="1"
                                />
                                {numLambs > 0 && idx > 0 && idx < rafters2D.length - 1 && (idx % 2 === 1) && (
                                    <circle cx={rx} cy={pad2DTop + 76 + ((h2D - 16) / 2)} r="4" fill="#FDE047"/>
                                )}
                            </g>
                        ))}

                        {/* Front Gutter Profile (Goot) */}
                        <rect
                            x={pad2DX}
                            y={pad2DTop + 60 + h2D - 2}
                            width={w2D}
                            height="18"
                            rx="2"
                            fill={frameColor}
                            stroke={colorConfig.stroke}
                            strokeWidth="1.5"
                        />
                        <text x={pad2DX + (w2D / 2)} y={pad2DTop + 60 + h2D + 11} fill={isLightFrame ? '#0F172A' : '#F8FAFC'} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                            ÖN OLUK PROFİLİ (GOOT) ── {numWidth} cm
                        </text>

                        {/* Depth Dimension on Right */}
                        <g>
                            <line x1={pad2DX + w2D + 25} y1={pad2DTop + 60} x2={pad2DX + w2D + 25} y2={pad2DTop + 60 + h2D + 16} stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3"/>
                            <line x1={pad2DX + w2D + 19} y1={pad2DTop + 60} x2={pad2DX + w2D + 31} y2={pad2DTop + 60} stroke="#38BDF8" strokeWidth="2"/>
                            <line x1={pad2DX + w2D + 19} y1={pad2DTop + 60 + h2D + 16} x2={pad2DX + w2D + 31} y2={pad2DTop + 60 + h2D + 16} stroke="#38BDF8" strokeWidth="2"/>
                            <text
                                x={pad2DX + w2D + 40}
                                y={pad2DTop + 60 + (h2D / 2) + 5}
                                fill="#38BDF8"
                                fontSize="11"
                                fontWeight="700"
                                textAnchor="start"
                                fontFamily="sans-serif"
                            >
                                ↕ {numHeight} cm Çatı Eğim Derinliği
                            </text>
                        </g>

                        {/* Open Sides Notice Badge at Bottom */}
                        <rect x={svgW / 2 - 190} y={pad2DTop + 60 + h2D + 35} width="380" height="26" rx="13" fill="#1E293B" stroke="#475569" strokeWidth="1"/>
                        <text x={svgW / 2} y={pad2DTop + 60 + h2D + 52} fill="#38BDF8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                            🌿 DİKKAT: Verandanın altı ve her iki yanı tamamen açık alandır (boşluk).
                        </text>
                    </svg>
                )}
            </div>

            {/* Bottom Summary Bar */}
            {hasDimensions && (
                <div className={classes.legendRow}>
                    <Typography variant="body2" style={{color: '#475569', fontWeight: 600}}>
                        Tavan Detayı: <strong style={{color: '#0F172A'}}>{numLiggers} adet Taşıyıcı Profil</strong>, <strong style={{color: '#0F172A'}}>{panelCount} adet Tavan Paneli</strong> (~{panelWidthCm} cm en), <strong style={{color: '#0F172A'}}>{actualAyakCount} adet Taşıyıcı Dikme</strong> (Ön Cephe)
                    </Typography>
                    <Box display="flex" alignItems="center" gridGap={8}>
                        <Chip
                            size="small"
                            label="Yanlar & Alt: Açık Havadar Alan"
                            style={{backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 700, border: '1px solid #A7F3D0'}}
                        />
                        {numLambs > 0 && (
                            <Chip
                                size="small"
                                label={`${numLambs}x Entegre LED Spot`}
                                style={{backgroundColor: '#FEF08A', color: '#854D0E', fontWeight: 700}}
                            />
                        )}
                    </Box>
                </div>
            )}
        </div>
    );
};

PatioPreview.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    liggerCount: PropTypes.number,
    aluminumColor: PropTypes.string,
    roofType: PropTypes.string,
    roofColor: PropTypes.string,
    lambCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ayakCount: PropTypes.number,
    liggerWidth: PropTypes.string
};

export default PatioPreview;
