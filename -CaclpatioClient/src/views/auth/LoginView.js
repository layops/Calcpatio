import React from 'react';
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
import {Link as RouterLink, Navigate} from 'react-router-dom';
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import {login} from "../../redux/actions/authAction";
import {useDispatch, useSelector} from "react-redux";
import {Alert} from "@material-ui/lab";

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
        background: 'linear-gradient(90deg, #2563EB 0%, #38BDF8 100%)'
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

const LoginView = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {error, errorMessage, user} = useSelector(state => state.auth);

    if (user) {
        return <Navigate to="/polyCarbonCalculate" />;
    }

    const handleSubmit = (values, setSubmitting) => {
        dispatch(login(values.username, values.password, setSubmitting));
    };

    return (
        <Page className={classes.root} title="Giriş Yap">
            <Container maxWidth="xs">
                <Card className={classes.card}>
                    <div className={classes.topAccent}/>
                    <CardContent style={{padding: 32}}>
                        <div className={classes.headerBox}>
                            <Box mb={2} display="flex" justifyContent="center">
                                <Logo style={{height: 38}}/>
                            </Box>
                            <Typography variant="h3" style={{fontWeight: 800, color: '#0F172A', marginBottom: 4}}>
                                Sisteme Giriş Yapın
                            </Typography>
                            <Typography variant="body2" style={{color: '#64748B'}}>
                                Veranda hesaplama ve teklif modülü
                            </Typography>
                        </div>

                        {error && (
                            <Box mb={2}>
                                <Alert severity="error">{errorMessage}</Alert>
                            </Box>
                        )}

                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().max(25).required('Kullanıcı adı zorunludur'),
                                password: Yup.string().max(25).required('Şifre zorunludur')
                            })}
                            onSubmit={(values, {setSubmitting}) => {
                                handleSubmit(values, setSubmitting);
                            }}
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
                                            {isSubmitting ? <CircularProgress size={24} color="inherit"/> : 'Giriş Yap'}
                                        </Button>
                                    </Box>

                                    <Box textAlign="center" pt={1}>
                                        <Typography color="textSecondary" variant="body2">
                                            Hesabınız yok mu?{' '}
                                            <Link component={RouterLink} to="/register" style={{fontWeight: 700, color: '#2563EB'}}>
                                                Kayıt Olun
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

export default LoginView;
