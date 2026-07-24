import "./PlayerCard.css";
import { motion } from "framer-motion";

const COLORS={
    red:"#ef4444",
    green:"#22c55e",
    yellow:"#facc15",
    blue:"#3b82f6"
};

const EMOJIS={
    red:"🔴",
    green:"🟢",
    yellow:"🟡",
    blue:"🔵"
};

export default function PlayerCard({

    player,
    active=false

}){

    if(!player) return null;

    const pawnsHome=player.home ?? 4;
    const finished=player.finished ?? 0;

    return(

        <motion.section

            className={`player-card ${active?"active":""}`}

            initial={{
                opacity:0,
                y:20
            }}

            animate={{
                opacity:1,
                y:0
            }}

            whileHover={{
                scale:1.03
            }}

        >

            <div className="player-header">

                <div

                    className="player-avatar"

                    style={{
                        background:COLORS[player.color]
                    }}

                >

                    {EMOJIS[player.color]}

                </div>

                <div className="player-info">

                    <div className="player-name">

                        {player.name}

                    </div>

                    <div className="player-role">

                        {player.type==="bot"
                            ? "Computer"
                            : "Player"}

                    </div>

                </div>

            </div>

            <div className="player-stats">

                <div className="stat">

                    <div className="stat-label">

                        Home

                    </div>

                    <div className="stat-value">

                        {pawnsHome}

                    </div>

                </div>

                <div className="stat">

                    <div className="stat-label">

                        Finished

                    </div>

                    <div className="stat-value">

                        {finished}

                    </div>

                </div>

            </div>

            {

                active &&

                <motion.div

                    className="turn-indicator"

                    initial={{
                        opacity:0
                    }}

                    animate={{
                        opacity:1
                    }}

                >

                    <span className="turn-dot"/>

                    Your Turn

                </motion.div>

            }

        </motion.section>

    );

}