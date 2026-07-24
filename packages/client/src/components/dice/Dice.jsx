import { motion } from "framer-motion";

const PIPS={

1:[[50,50]],

2:[[28,28],[72,72]],

3:[[28,28],[50,50],[72,72]],

4:[[28,28],[72,28],[28,72],[72,72]],

5:[[28,28],[72,28],[50,50],[28,72],[72,72]],

6:[[28,28],[72,28],[28,50],[72,50],[28,72],[72,72]]

};

export default function Dice({value}){

    if(!value){

        return null;

    }

    return(

        <motion.svg

            viewBox="0 0 100 100"

            initial={{
                rotate:-180,
                scale:.5
            }}

            animate={{
                rotate:0,
                scale:1
            }}

            transition={{
                duration:.35
            }}

            width="100%"

            height="100%"

        >

            <rect

                x="6"

                y="6"

                width="88"

                height="88"

                rx="18"

                fill="#ffffff"

            />

            {

                PIPS[value].map(([cx,cy],i)=>(

                    <circle

                        key={i}

                        cx={cx}

                        cy={cy}

                        r="8"

                        fill="#111827"

                    />

                ))

            }

        </motion.svg>

    );

}