import React, {useState} from 'react';
import {Link as RouterLink, Navigate, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Link,
    makeStyles,
    TextField,
    Typography
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import axios from 'axios';
import Page from '../../components/Page';
import Logo from '../../components/Logo';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#F8FAFC',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    card: {
        borderRadius: 20,
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.1)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden'
    },
    topAccent: {
        height: 6,
        background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)'
    },
    headerBox: {
        textAlign: 'center',
        marginBottom: theme.spacing(3)
    },
    submitButton: {
        height: 50,
        borderRadius: 12,
        fontSize: '1rem',
        fontWeight: 700,
        marginTop: theme.spacing(1)
    }
}));

const RegisterView = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (user) {
        return <Navigate to="/polyCarbonCalculate" />;
    }

    const handleSubmit = async (values, {setSubmitting}) => {
        setServerError(null);
        setSuccessMessage(null);
        try {
            await axios.post('/user/register', {
                username: values.username.trim(),
                nameSurname: values.nameSurname.trim(),
                password: values.password,
                secretPassword: values.secretPassword
            });
            setSuccessMessage('Kayıt başarıyla oluşturuldu! Giriş ekranına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError('Kayıt sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol ediniz.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Page className={classes.root} title="Kayıt Ol">
            <Container maxWidth="sm">
                <Card className={classes.card}>
                    <div className={classes.topAccent}/>
                    <CardContent style={{padding: 32}}>
                        <div className={classes.headerBox}>
                            <Box mb={2} display="flex" justifyContent="center">
                                <Logo style={{height: 38}}/>
                            </Box>
                            <Typography variant="h3" style={{fontWeight: 800, color: '#0F172A', marginBottom: 4}}>
                                Yeni Hesap Oluştur
                            </Typography>
                            <Typography variant="body2" style={{color: '#64748B'}}>
                                Calcpatio veranda hesaplama sistemine kayıt olun
                            </Typography>
                        </div>

                        {serverError && (
                            <Box mb={2}>
                                <Alert severity="error">{serverError}</Alert>
                            </Box>
                        )}
                        {successMessage && (
                            <Box mb={2}>
                                <Alert severity="success">{successMessage}</Alert>
                            </Box>
                        )}

                        <Formik
                            initialValues={{
                                username: '',
                                nameSurname: '',
                                password: '',
                                confirmPassword: '',
                                secretPassword: ''
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().min(3, 'En az 3 karakter').max(15, 'En fazla 15 karakter').required('Kullanıcı adı zorunludur'),
                                nameSurname: Yup.string().min(3, 'En az 3 karakter').max(30, 'En fazla 30 karakter').required('Ad Soyad zorunludur'),
                                password: Yup.string().min(4, 'Şifre en az 4 karakter olmalıdır').max(72, 'En fazla 72 karakter').required('Şifre zorunludur'),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
                                    .required('Şifre tekrarı zorunludur'),
                                secretPassword: Yup.string().required('Yönetici güvenlik şifresi zorunludur')
                            })}
                            onSubmit={handleSubmit}
                        >
                            {({
                                  errors,
                                  handleBlur,
                                  handleChange,
                                  handleSubmit,
                                  isSubmitting,
                                  touched,
                                  values
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        error={Boolean(touched.username && errors.username)}
                                        fullWidth
                                        helperText={touched.username && errors.username}
                                        label="Kullanıcı Adı"
                                        margin="normal"
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.username}
                                        variant="outlined"
                                    />

                                    <TextField
                                        error={Boolean(touched.nameSurname && errors.nameSurname)}
                                        fullWidth
                                        helperText={touched.nameSurname && errors.nameSurname}
                                        label="Ad Soyad"
                                        margin="normal"
                                        name="nameSurname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.nameSurname}
                                        variant="outlined"
                                    />

                                    <TextField
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
                                        helperText={touched.password && errors.password}
                                        label="Şifre"
                                        margin="normal"
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password}
                                        variant="outlined"
                                    />

                                    <TextField
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                        fullWidth
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                        label="Şifre Tekrarı"
                                        margin="normal"
                                        name="confirmPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.confirmPassword}
                                        variant="outlined"
                                    />

                                    <TextField
                                        error={Boolean(touched.secretPassword && errors.secretPassword)}
                                        fullWidth
                                        helperText={touched.secretPassword && errors.secretPassword}
                                        label="Yönetici Güvenlik Şifresi"
                                        margin="normal"
                                        name="secretPassword"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.secretPassword}
                                        variant="outlined"
                                    />

                                    <Box my={2.5}>
                                        <Button
                                            color="primary"
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            className={classes.submitButton}
                                        >
                                            {isSubmitting ? <CircularProgress size={24} color="inherit"/> : 'Hesap Oluştur'}
                                        </Button>
                                    </Box>

                                    <Box textAlign="center" pt={1}>
                                        <Typography color="textSecondary" variant="body2">
                                            Zaten hesabınız var mı?{' '}
                                            <Link component={RouterLink} to="/login" style={{fontWeight: 700, color: '#2563EB'}}>
                                                Giriş Yapın
                                            </Link>
                                        </Typography>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
};

export default RegisterView;
