import React from "react";
import { motion } from "framer-motion";
import { AnimationsProps } from "../type";

function Position(props: AnimationsProps) {

    const { cssAnimation } = props;
    const pageVariants = {
        initial: {
            opacity: 0,
            [cssAnimation[0]]: "-1.5rem",
        },
        in: {
            opacity: 1,
            [cssAnimation[0]]: ".5rem",
        },
        out: {
            opacity: 0,
            [cssAnimation[0]]: "-1.5rem",
        }
    };

    const pageTransition = {
        type: "tween",
        cubic: "easeIn",
        duration: .3
    };

    const pageStyle: any = {
        position: "absolute",
        [cssAnimation[1]]: 0,
        ...props.style || {}
    };

    if (cssAnimation[1] === 'center') {
        pageStyle.left = '50%';
        pageStyle.transform = 'translate(-50%)';
    }


    return (
        <motion.div
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

export default Position;