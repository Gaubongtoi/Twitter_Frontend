import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
/* eslint-disable react/prop-types */
const Button = forwardRef(
    (
        {
            type,
            onClick,
            children,
            to,
            href,
            primary = false,
            secondary = false,
            outline = false,
            disabled = false,
            rounded = false,
            w_3 = false,
            text = false,
            icon = false,
            leftIcon = false,
            upper = false,
            email = false,
            shopping = false,
            order = false,
            payment = false,
            edit = false,
            managerOrder = false,
            manageReturn = false,
            // isLarge = false,
            ...passProps
        },
        ref,
    ) => {
        let Comp = 'button';
        const props = {
            type,
            onClick,
            ...passProps,
        };

        if (disabled) {
            Object.keys(props).forEach((key) => {
                if (key.startsWith('on') && typeof props[key] === 'function') {
                    delete props[key];
                }
            });
        }

        if (to) {
            props.to = to;
            Comp = Link;
        } else if (href) {
            props.href = href;
            Comp = 'a';
        }

        const baseClasses = `inline-flex items-center justify-center font-bold text-sm px-4 py-2`;

        const classes = [
            baseClasses,
            primary
                ? 'bg-blue-600 text-white w-full hover:border-[rgba(22,24,35,0.2)] hover:bg-primary_darken cursor-pointer'
                : '',
            secondary
                ? 'bg-dark_8 text-black w-full hover:text-white hover:border-[rgba(22,24,35,0.2)] hover:bg-dark_6 cursor-pointer'
                : '',
            outline ? 'border border-current bg-white text-blue-600 hover:bg-red-100' : '',
            disabled ? 'opacity-50 pointer-events-none' : '',
            rounded
                ? 'rounded-full font-bold text-sm min-w-[20px] border border-[rgba(22,24,35,0.12)] shadow-sm py-3 px-[80px] w-full'
                : '',
            w_3 ? 'w-1/3' : '',
            text ? 'relative' : '',
            upper ? 'uppercase text-lg' : '',
            email ? 'bg-blue-700 text-white w-36 ml-3 p-0' : '',
            shopping ? 'relative w-80 h-12 px-5 py-3 rounded-full overflow-hidden transition-all ease-in-out' : '',
            order ? 'w-full' : '',
            payment ? 'block w-full h-12 border bg-blue-700 text-white' : '',
            edit ? 'bg-blue-800 text-white' : '',
            managerOrder ? 'flex-basis-3/12 text-sm p-2' : '',
            manageReturn ? 'flex-basis-14 text-sm' : '',
            // isLarge ? 'w-full' : 'w-1/4',
        ].join(' ');

        return href ? (
            <Comp ref={ref} className={classes} {...props} href={`${href}`}>
                {leftIcon && <div className="mr-3 object-cover">{leftIcon}</div>}
                {children && <span className="font-bold text-lg">{children}</span>}
                {icon && <div className="object-cover">{icon}</div>}
            </Comp>
        ) : (
            <Comp ref={ref} className={classes} {...props}>
                {leftIcon && <div className="mr-3 object-cover">{leftIcon}</div>}
                {children && <span className="font-bold text-lg">{children}</span>}
                {icon && <div className="object-cover">{icon}</div>}
            </Comp>
        );
    },
);

// Thêm displayName cho component
Button.displayName = 'Button';

export default Button;
