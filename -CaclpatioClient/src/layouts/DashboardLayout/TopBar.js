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
import {Moon, Sun} from 'react-feather';
import Logo from '../../components/Logo';
import {logout} from "../../redux/actions/authAction";
import {useDispatch, useSelector} from "react-redux";
import {useThemeMode} from "../../context/ThemeContext";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        boxShadow: theme.palette.type === 'dark' 
            ? '0 1px 3px 0 rgba(0, 0, 0, 0.4)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
    },
    toolbar: {
        minHeight: 64,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    brandLink: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.2),
        textDecoration: 'none',
        color: 'inherit'
    },
    versionBadge: {
        backgroundColor: theme.palette.type === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
        color: theme.palette.type === 'dark' ? '#60A5FA' : '#2563EB',
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
    statusPill: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 16,
        backgroundColor: theme.palette.type === 'dark' ? '#1E293B' : '#F8FAFC',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'background-color 0.25s ease'
    },
    themeToggleBtn: {
        color: theme.palette.text.secondary,
        padding: 8,
        borderRadius: 10,
        transition: 'all 0.2s ease',
        '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(37, 99, 235, 0.08)',
            transform: 'rotate(15deg)'
        }
    },
    logoutBtn: {
        color: theme.palette.text.secondary,
        transition: 'all 0.2s ease',
        '&:hover': {
            color: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
    }
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {mode, toggleTheme} = useThemeMode();
    const isDark = mode === 'dark';

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
                    <Box mr={2}>
                        <div className={classes.statusPill}>
                            <span className={classes.statusDot}/>
                            <Typography variant="caption" style={{fontWeight: 600}}>
                                Sistem Aktif
                            </Typography>
                        </div>
                    </Box>
                </Hidden>

                {/* Dark / Light Theme Toggle Button */}
                <Box mr={1}>
                    <Tooltip title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"} arrow>
                        <IconButton
                            className={classes.themeToggleBtn}
                            onClick={toggleTheme}
                            aria-label="Tema Değiştir"
                        >
                            {isDark ? <Sun size={20} color="#FBBF24" /> : <Moon size={20} color="#64748B" />}
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* User Greeting & Logout */}
                {user && (
                    <>
                        <Hidden xsDown>
                            <Box mr={2} textAlign="right">
                                <Typography variant="body2" style={{fontWeight: 700, lineHeight: 1.2}}>
                                    {user.nameSurname || user.username}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
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
                    <IconButton color="inherit" onClick={onMobileNavOpen} edge="end" style={{marginLeft: 4}}>
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
