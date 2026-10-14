import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Chip,
    Hidden,
    IconButton,
    makeStyles,
    Toolbar,
    Tooltip,
    Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Logo from '../../components/Logo';
import {logout} from "../../redux/actions/authAction";
import {useDispatch, useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: '#0F172A',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    },
    toolbar: {
        minHeight: 64,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
    },
    brandLink: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        textDecoration: 'none',
        color: 'inherit'
    },
    versionBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        color: '#2563EB',
        fontWeight: 700,
        fontSize: '0.725rem',
        height: 22
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#10B981',
        display: 'inline-block',
        marginRight: 6,
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
    },
    logoutBtn: {
        color: '#64748B',
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#EF4444',
            backgroundColor: '#FEE2E2'
        }
    }
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
            <Toolbar className={classes.toolbar}>
                <RouterLink to="/" className={classes.brandLink}>
                    <Logo style={{height: 32}}/>
                    <Chip label="PRO SUITE" size="small" className={classes.versionBadge}/>
                </RouterLink>

                <Box flexGrow={1}/>

                {/* Live System Status Pill */}
                <Hidden smDown>
                    <Box mr={2} display="flex" alignItems="center">
                        <Box
                            display="flex"
                            alignItems="center"
                            px={1.5}
                            py={0.5}
                            borderRadius={16}
                            bgcolor="#F8FAFC"
                            border="1px solid #E2E8F0"
                        >
                            <span className={classes.statusDot}/>
                            <Typography variant="caption" style={{fontWeight: 600, color: '#475569'}}>
                                Veritabanı Aktif (SQLite)
                            </Typography>
                        </Box>
                    </Box>
                </Hidden>

                {/* User Greeting & Logout */}
                {user && (
                    <>
                        <Hidden xsDown>
                            <Box mr={2} textAlign="right">
                                <Typography variant="body2" style={{fontWeight: 700, color: '#0F172A', lineHeight: 1.2}}>
                                    {user.nameSurname || user.username}
                                </Typography>
                                <Typography variant="caption" style={{color: '#64748B'}}>
                                    Yetkili Kullanıcı
                                </Typography>
                            </Box>
                        </Hidden>
                        <Hidden mdDown>
                            <Tooltip title="Güvenli Çıkış Yap" arrow>
                                <IconButton
                                    className={classes.logoutBtn}
                                    onClick={handleLogout}
                                    size="medium"
                                    aria-label="Çıkış Yap"
                                >
                                    <PowerSettingsNewIcon/>
                                </IconButton>
                            </Tooltip>
                        </Hidden>
                    </>
                )}

                {/* Mobile Menu Toggle */}
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onMobileNavOpen} edge="end">
                        <MenuIcon/>
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    className: PropTypes.string,
    onMobileNavOpen: PropTypes.func
};

export default TopBar;
