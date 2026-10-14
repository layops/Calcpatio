import React from 'react';
import {NavLink as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Button, ListItem, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    item: {
        display: 'flex',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 0,
        paddingRight: 0
    },
    button: {
        color: '#64748B',
        fontWeight: 600,
        justifyContent: 'flex-start',
        letterSpacing: 0,
        padding: '11px 16px',
        textTransform: 'none',
        width: '100%',
        borderRadius: 12,
        fontSize: '0.875rem',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: '#F1F5F9',
            color: '#0F172A'
        }
    },
    icon: {
        marginRight: theme.spacing(1.5),
        color: '#94A3B8',
        transition: 'color 0.2s ease'
    },
    title: {
        marginRight: 'auto'
    },
    active: {
        backgroundColor: '#EFF6FF !important',
        color: '#2563EB !important',
        fontWeight: 700,
        '& $icon': {
            color: '#2563EB !important'
        }
    }
}));

const NavItem = ({className, href, icon: Icon, title, ...rest}) => {
    const classes = useStyles();

    return (
        <ListItem className={clsx(classes.item, className)} disableGutters {...rest}>
            <Button
                activeClassName={classes.active}
                className={classes.button}
                component={RouterLink}
                to={href}
            >
                {Icon && <Icon className={classes.icon} size="19"/>}
                <span className={classes.title}>
                    {title}
                </span>
            </Button>
        </ListItem>
    );
};

NavItem.propTypes = {
    className: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.elementType,
    title: PropTypes.string
};

export default NavItem;
