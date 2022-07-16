import React from "react";
import { motion } from "framer-motion";
import { AnimationsProps } from "../type";

function TranformOpacity(props: AnimationsProps) {

    const pageVariants = {
        initial: {
            [props.cssAnimation[0]]: "scale(1.05)",
            opacity: 0,
        },
        in: {
            [props.cssAnimation[0]]: "scale(1)",
            opacity: 1,
        },
        out: {
            [props.cssAnimation[0]]: "scale(1.05)",
            opacity: 0,
        }
    };

    const pageTransition = {
        type: "tween",
        cubic: "easeInOut",
        duration: .2
    };

    const pageStyle: any = {
        [props.cssAnimation[0]]: "scale(1)",
        ...props.style || {}
    };


    return (
        <motion.div
            style={pageStyle}
            className={props.className ? props.className : ''}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onClick={ props.onClick ? props.onClick : () => {} }
            onMouseDown={ props.onMouseDown ? props.onMouseDown : () => {} }
            onMouseUp={ props.onMouseUp ? props.onMouseUp : () => {} }
            onMouseLeave={ props.onMouseLeave ? props.onMouseLeave : () => {} }
            onMouseEnter={ props.onMouseEnter ? props.onMouseEnter : () => {} }
        >
            {props.children}
        </motion.div>
    );
}

export default TranformOpacity;