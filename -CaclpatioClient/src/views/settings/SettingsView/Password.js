import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
    TextField,
    Typography
} from '@material-ui/core';
import {Alert} from "@material-ui/lab";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 600,
        margin: '0 auto'
    },
    card: {
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#F8FAFC',
        padding: theme.spacing(2.5, 3)
    },
    updateBtn: {
        padding: '10px 28px',
        fontWeight: 700,
        borderRadius: 10
    }
}));

const Password = ({className, ...rest}) => {
    const classes = useStyles();
    const [values, setValues] = useState({
        currentPassword: '',
        password: '',
        confirm: ''
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    const handleUpdate = () => {
        if (values.currentPassword !== '' && values.password !== '' && values.confirm !== '') {
            if (values.password === values.confirm) {
                if (values.password.length > 3) {
                    setLoading(true);
                    const body = {currentPassword: values.currentPassword, newPassword: values.password};
                    axios.post("user/updatePassword", body).then(response => {
                        setError(null);
                        setMessage(response.data.message);
                        setValues({currentPassword: '', password: '', confirm: ''});
                    }).catch(err => {
                        if (err.response && err.response.data && err.response.data.message) {
                            setError(err.response.data.message);
                        } else {
                            setError("Şifre değiştirilemedi. Lütfen daha sonra tekrar deneyiniz.");
                        }
                    }).finally(() => {
                        setLoading(false);
                    });
                } else {
                    setError("Yeni şifre çok kısa. En az 4 karakter olmalıdır.");
                    setMessage(null);
                }
            } else {
                setError("Yeni şifreler birbiriyle eşleşmiyor.");
            }
        } else {
            setError("Lütfen tüm alanları doldurunuz.");
            setMessage(null);
        }
    };

    return (
        <form className={clsx(classes.root, className)} onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} {...rest}>
            <Card className={classes.card}>
                <CardHeader
                    className={classes.header}
                    title={
                        <Typography variant="h3" style={{fontWeight: 700, color: '#0F172A'}}>
                            Güvenlik & Şifre Değiştir
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" style={{color: '#64748B', marginTop: 4}}>
                            Hesap şifrenizi güncelleyerek hesabınızı güvende tutun
                        </Typography>
                    }
                />
                <Divider/>
                <CardContent style={{padding: 24}}>
                    {message && (
                        <Box mb={2}>
                            <Alert severity="success">{message}</Alert>
                        </Box>
                    )}
                    {error && (
                        <Box mb={2}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    )}
                    <TextField
                        fullWidth
                        label="Mevcut Şifre"
                        margin="normal"
                        name="currentPassword"
                        onChange={handleChange}
                        type="password"
                        value={values.currentPassword}
                        variant="outlined"
                        placeholder="••••••••"
                    />
                    <TextField
                        fullWidth
                        label="Yeni Şifre"
                        margin="normal"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        placeholder="••••••••"
                    />
                    <TextField
                        fullWidth
                        label="Yeni Şifre (Tekrar)"
                        margin="normal"
                        name="confirm"
                        onChange={handleChange}
                        type="password"
                        value={values.confirm}
                        variant="outlined"
                        placeholder="••••••••"
                    />
                </CardContent>
                <Divider/>
                <Box display="flex" justifyContent="flex-end" p={2.5} bgcolor="#F8FAFC">
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.updateBtn}
                        disabled={loading}
                        onClick={handleUpdate}
                    >
                        {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

Password.propTypes = {
    className: PropTypes.string
};

export default Password;
