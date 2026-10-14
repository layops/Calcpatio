import React from 'react';
import {Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        padding: 25
    },
    rowClass: {padding: 10},
}));

const CalculatePrint = ({printRef, values, rows = []}) => {
    const classes = useStyles();
    const safeValues = values || {};
    const customerName = (safeValues.customerName || '').trim();
    const note = (safeValues.note || '').trim();

    return (
        <div ref={printRef} className={classes.root}>
            <Grid className={classes.rowClass} container spacing={2}>
                <Grid item xs={6}>
                    <img
                        alt="Logo"
                        src="/static/logoBlack.svg"
                        style={{maxWidth: 180}}
                    />
                </Grid>

                {customerName.length > 0 && (
                    <Grid item xs={6} style={{textAlign: "right"}}>
                        <p style={{padding: 5, fontWeight: "bold"}}>Müşteri: {customerName}</p>
                    </Grid>
                )}
            </Grid>

            {note.length > 0 && (
                <Grid className={classes.rowClass} container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{whiteSpace: "pre-wrap"}}><strong>Not:</strong> {note}</p>
                    </Grid>
                </Grid>
            )}

            <Grid className={classes.rowClass} container spacing={2}>
                <Grid item xs={6}>
                    <p><strong>Genişlik:</strong> {safeValues.width} cm</p>
                </Grid>
                <Grid item xs={6}>
                    <p><strong>Yükseklik:</strong> {safeValues.height} cm</p>
                </Grid>
                <Grid item xs={6}>
                    <p><strong>Alüminyum Rengi:</strong> {
                        safeValues.aluminumColor === '7016' ? 'RAL 7016 (Antrasit Gri)' :
                        safeValues.aluminumColor === '9005' ? 'RAL 9005 (Siyah)' :
                        safeValues.aluminumColor === '9001' ? 'RAL 9001 (Krem)' :
                        safeValues.aluminumColor
                    }</p>
                </Grid>
                {safeValues.polyCarbonColor && (
                    <Grid item xs={6}>
                        <p><strong>Polikarbon Rengi:</strong> {
                            safeValues.polyCarbonColor === 'opaal' ? 'Opak (Opaal)' :
                            safeValues.polyCarbonColor === 'helder' ? 'Şeffaf (Helder)' :
                            safeValues.polyCarbonColor
                        }</p>
                    </Grid>
                )}
            </Grid>

            <Table size="small" style={{marginTop: 20}}>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Malzeme</strong></TableCell>
                        <TableCell><strong>Boyut (cm)</strong></TableCell>
                        <TableCell><strong>Adet</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow hover key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.size != null ? Number(row.size).toFixed(2) : '-'}</TableCell>
                            <TableCell>&nbsp;&nbsp;&nbsp;{row.count}</TableCell>
                        </TableRow>
                    ))}
                    {Boolean(safeValues.lambCount) && (
                        <TableRow hover>
                            <TableCell>Led Spot</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>&nbsp;&nbsp;&nbsp;{safeValues.lambCount}</TableCell>
                        </TableRow>
                    )}
                    {Boolean(safeValues.ledStrip) && (
                        <TableRow hover>
                            <TableCell>Led Şerit</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>&nbsp;&nbsp;&nbsp;{safeValues.ledStrip}</TableCell>
                        </TableRow>
                    )}
                    {Boolean(safeValues.angaraj) && (
                        <TableRow hover>
                            <TableCell>Ankraj</TableCell>
                            <TableCell>-</TableCell>
                            <TableCell>&nbsp;&nbsp;&nbsp;{safeValues.angaraj}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

CalculatePrint.propTypes = {
    printRef: PropTypes.any,
    values: PropTypes.object,
    rows: PropTypes.array
};

export default CalculatePrint;