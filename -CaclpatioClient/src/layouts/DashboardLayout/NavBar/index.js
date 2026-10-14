import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Drawer,
    Hidden,
    List,
    makeStyles,
    Typography
} from '@material-ui/core';
import {Layers, LogOut, Settings as SettingsIcon, Square} from 'react-feather';
import NavItem from './NavItem';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../redux/actions/authAction";

const items = [
    {
        href: '/polyCarbonCalculate',
        icon: Layers,
        title: 'Polikarbon Hesaplama'
    },
    {
        href: '/glassCalculate',
        icon: Square,
        title: 'Cam Hesaplama'
    },
    {
        href: '/settings',
        icon: SettingsIcon,
        title: 'Ayarlar'
    }
];

const useStyles = makeStyles((theme) => ({
    mobileDrawer: {
        width: 270
    },
    desktopDrawer: {
        width: 270,
        top: 64,
        height: 'calc(100% - 64px)',
        borderRight: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF'
    },
    userBox: {
        padding: theme.spacing(3, 2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
    },
    avatar: {
        width: 58,
        height: 58,
        fontSize: '1.25rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        color: '#FFFFFF',
        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.35)',
        marginBottom: theme.spacing(1.2)
    },
    userName: {
        fontWeight: 700,
        fontSize: '0.975rem',
        color: '#0F172A',
        textAlign: 'center'
    },
    roleChip: {
        marginTop: 6,
        height: 20,
        fontSize: '0.675rem',
        fontWeight: 700,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        color: '#2563EB'
    },
    infoCard: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        textAlign: 'center'
    },
    logoutButton: {
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: '10px 16px',
        color: '#EF4444',
        borderRadius: 10,
        fontWeight: 600,
        '&:hover': {
            backgroundColor: '#FEE2E2'
        }
    },
    logoutIcon: {
        marginRight: 10
    }
}));

const getInitials = (name = '') => {
    if (!name) return 'CP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const NavBar = ({onMobileClose, openMobile}) => {
    const classes = useStyles();
    const location = useLocation();
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
    }, [location.pathname]);

    const userName = (user && user.nameSurname) || (user && user.username) || 'Yönetici';
    const initials = getInitials(userName);

    const content = (
        <Box height="100%" display="flex" flexDirection="column">
            {/* User Profile Card */}
            <div className={classes.userBox}>
                <Avatar className={classes.avatar}>
                    {initials}
                </Avatar>
                <Typography className={classes.userName}>
                    {userName}
                </Typography>
                <Chip label="SİSTEM YÖNETİCİSİ" size="small" className={classes.roleChip}/>
            </div>

            {/* Navigation Menu */}
            <Box p={2} flexGrow={1}>
                <Typography variant="overline" style={{color: '#94A3B8', padding: '0 8px', display: 'block', marginBottom: 8}}>
                    MODÜLLER
                </Typography>
                <List disablePadding>
                    {items.map((item) => (
                        <NavItem
                            href={item.href}
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                        />
                    ))}
                </List>
            </Box>

            {/* Bottom Suite Card */}
            <div className={classes.infoCard}>
                <Typography variant="caption" style={{fontWeight: 700, color: '#0F172A', display: 'block'}}>
                    CALCPATIO SUITE
                </Typography>
                <Typography variant="caption" style={{color: '#64748B', display: 'block', marginTop: 2}}>
                    Alüminyum & Veranda Kesim Motoru v2.0
                </Typography>
            </div>

            {/* Mobile Logout Button */}
            <Hidden lgUp>
                <Divider/>
                <Box p={2}>
                    <Button
                        fullWidth
                        className={classes.logoutButton}
                        onClick={() => dispatch(logout())}
                    >
                        <LogOut className={classes.logoutIcon} size="18"/>
                        Güvenli Çıkış Yap
                    </Button>
                </Box>
            </Hidden>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    classes={{paper: classes.mobileDrawer}}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    anchor="left"
                    classes={{paper: classes.desktopDrawer}}
                    open
                    variant="persistent"
                >
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
};

NavBar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool
};

NavBar.defaultProps = {
    onMobileClose: () => {},
    openMobile: false
};

export default NavBar;
