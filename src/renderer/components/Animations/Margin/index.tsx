import React from "react";
import { motion } from "framer-motion";
import { AnimationsProps } from "../type";

function Margin(props: AnimationsProps) {

    const pageVariants = {
        initial: {
            opacity: 0,
            [props.cssAnimation[0]]: "1.5rem",
        },
        in: {
            opacity: 1,
            [props.cssAnimation[0]]: 0,
        },
        out: {
            opacity: 0,
            [props.cssAnimation[0]]: "1.5rem",
        }
    };

    const pageTransition = {
        type: "tween",
        cubic: "easeIn",
        duration: .3
    };

    const pageStyle: any = {
        [props.cssAnimation[0]]: "0",
        ...props.style || {}
    };


    return (
        <motion.div
        ref={props.ref ? props.ref : null}
            style={pageStyle}
            className={props.className ? props.className : ''}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            onScroll={props.onScroll || (() => {})}
        >
            {props.children}
        </motion.div>
    );
}

export default Margin;