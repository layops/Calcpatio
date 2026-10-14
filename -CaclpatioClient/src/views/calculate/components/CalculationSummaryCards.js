import React from 'react';
import PropTypes from 'prop-types';
import {Box, Grid, makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => {
    const isDark = theme.palette.type === 'dark';

    return {
        card: {
            background: theme.palette.background.paper,
            borderRadius: 14,
            padding: theme.spacing(2, 2.5),
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(2),
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.25s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.5)' : '0 8px 24px rgba(15, 23, 42, 0.08)'
            }
        },
        iconBox: {
            width: 48,
            height: 48,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        },
        label: {
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.palette.text.secondary,
            marginBottom: 2
        },
        value: {
            fontSize: '1.45rem',
            fontWeight: 800,
            color: theme.palette.text.primary,
            lineHeight: 1.2
        },
        subtext: {
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
            fontWeight: 500
        }
    };
});

const CalculationSummaryCards = ({
    width,
    height,
    rows = [],
    roofType = 'Polikarbon'
}) => {
    const classes = useStyles();

    const numWidth = Number(width) || 0;
    const numHeight = Number(height) || 0;
    const areaM2 = ((numWidth * numHeight) / 10000).toFixed(2);

    // Calculate total item quantity
    const totalParts = rows.reduce((acc, r) => acc + (Number(r.count) || 0), 0);

    // Find specific component counts
    const liggerRow = rows.find(r => r.name && r.name.includes('Ligger') && !r.name.includes('Cıvatası'));
    const rafterCount = rows
        .filter(r => r.name && (r.name.includes('Yan Taşıyıcı') || r.name.includes('Orta Taşıyıcı')))
        .reduce((sum, r) => sum + (Number(r.count) || 0), 0) || (liggerRow ? liggerRow.count : 0);

    const ayakRow = rows.find(r => r.name && r.name.includes('Destek Ayağı'));
    const ayakCount = ayakRow ? ayakRow.count : (numWidth <= 650 ? 2 : 3);

    const panelRow = rows.find(r => r.name && (r.name.includes('Polikarbon') || r.name.includes('Cam Panel')));
    const panelCount = panelRow ? panelRow.count : 0;

    return (
        <Grid container spacing={2} style={{marginBottom: 20}}>
            <Grid item lg={3} sm={6} xs={12}>
                <div className={classes.card}>
                    <div className={classes.iconBox} style={{backgroundColor: '#EFF6FF', color: '#2563EB'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                        </svg>
                    </div>
                    <div>
                        <Typography className={classes.label}>Toplam Alan</Typography>
                        <Typography className={classes.value}>{areaM2} m²</Typography>
                        <Typography className={classes.subtext}>{numWidth} × {numHeight} cm</Typography>
                    </div>
                </div>
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
                <div className={classes.card}>
                    <div className={classes.iconBox} style={{backgroundColor: '#F0FDF4', color: '#16A34A'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="21" x2="4" y2="14"/>
                            <line x1="4" y1="10" x2="4" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12" y2="3"/>
                            <line x1="20" y1="21" x2="20" y2="16"/>
                            <line x1="20" y1="12" x2="20" y2="3"/>
                        </svg>
                    </div>
                    <div>
                        <Typography className={classes.label}>Taşıyıcı Profil</Typography>
                        <Typography className={classes.value}>{rafterCount || '-'} Adet</Typography>
                        <Typography className={classes.subtext}>Kiriş Dağılımı</Typography>
                    </div>
                </div>
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
                <div className={classes.card}>
                    <div className={classes.iconBox} style={{backgroundColor: '#FEF3C7', color: '#D97706'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 12h20M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/>
                            <path d="M6 12V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/>
                        </svg>
                    </div>
                    <div>
                        <Typography className={classes.label}>{roofType} Panel</Typography>
                        <Typography className={classes.value}>{panelCount || '-'} Adet</Typography>
                        <Typography className={classes.subtext}>Tavan Levhası</Typography>
                    </div>
                </div>
            </Grid>

            <Grid item lg={3} sm={6} xs={12}>
                <div className={classes.card}>
                    <div className={classes.iconBox} style={{backgroundColor: '#FAF5FF', color: '#9333EA'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                    </div>
                    <div>
                        <Typography className={classes.label}>Donanım Özeti</Typography>
                        <Typography className={classes.value}>{ayakCount} Ayak</Typography>
                        <Typography className={classes.subtext}>{totalParts} Toplam Parça</Typography>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

CalculationSummaryCards.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rows: PropTypes.array,
    roofType: PropTypes.string
};

export default CalculationSummaryCards;
