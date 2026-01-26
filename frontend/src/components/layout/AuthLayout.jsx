import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

// 3D Glassmorphism Blob Component with realistic styling
const GlassBlob = ({ style, delay = 0, duration = 20, scaleRange = [1, 1.05], xRange = [-15, 15], yRange = [-15, 15] }) => {
    return (
        <motion.div
            style={style}
            animate={{
                x: xRange,
                y: yRange,
                scale: scaleRange,
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: delay,
            }}
        />
    );
};

// Glass Sphere/Bubble Component for right side
const GlassBubble = ({ size, top, left, right, bottom, delay = 0, opacity = 0.6 }) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top, left, right, bottom,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, 
                    rgba(255, 255, 255, ${opacity}) 0%, 
                    rgba(255, 255, 255, ${opacity * 0.3}) 40%, 
                    rgba(200, 220, 255, ${opacity * 0.2}) 70%, 
                    transparent 100%)`,
                boxShadow: `
                    inset 0 0 20px rgba(255, 255, 255, 0.5),
                    inset -5px -5px 15px rgba(0, 0, 0, 0.05),
                    0 5px 20px rgba(0, 0, 0, 0.1)
                `,
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            animate={{
                y: [-10, 10],
                x: [-5, 5],
            }}
            transition={{
                duration: 15 + delay * 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: delay,
            }}
        />
    );
};

const AuthLayout = () => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: '100vh',
            width: '100%'
        }}>
            {/* LEFT SIDE - Dark Hero Section */}
            <div style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem'
            }}>
                {/* Animated 3D Blobs */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

                    {/* Top Left - Purple/Violet Gradient Blob */}
                    <GlassBlob
                        style={{
                            position: 'absolute',
                            top: '5%',
                            left: '-5%',
                            width: '280px',
                            height: '200px',
                            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9) 0%, rgba(139, 92, 246, 0.7) 50%, rgba(99, 102, 241, 0.5) 100%)',
                            borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
                            boxShadow: `
                                inset -20px -20px 40px rgba(0, 0, 0, 0.3),
                                inset 10px 10px 30px rgba(255, 255, 255, 0.1),
                                0 20px 40px rgba(139, 92, 246, 0.3)
                            `,
                            filter: 'blur(1px)',
                        }}
                        delay={0}
                        duration={25}
                        xRange={[-20, 25]}
                        yRange={[-15, 20]}
                    />

                    {/* Center Right - Dark Blue Sphere */}
                    <GlassBlob
                        style={{
                            position: 'absolute',
                            top: '15%',
                            right: '15%',
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%)',
                            borderRadius: '50%',
                            boxShadow: `
                                inset -10px -10px 25px rgba(0, 0, 0, 0.5),
                                inset 5px 5px 15px rgba(255, 255, 255, 0.1),
                                0 10px 30px rgba(0, 0, 0, 0.4)
                            `,
                        }}
                        delay={1}
                        duration={18}
                        xRange={[-12, 12]}
                        yRange={[-15, 15]}
                    />

                    {/* Small Dark Sphere */}
                    <GlassBlob
                        style={{
                            position: 'absolute',
                            top: '35%',
                            right: '25%',
                            width: '50px',
                            height: '50px',
                            background: 'radial-gradient(circle at 35% 35%, rgba(71, 85, 105, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                            borderRadius: '50%',
                            boxShadow: `
                                inset -5px -5px 15px rgba(0, 0, 0, 0.5),
                                inset 3px 3px 8px rgba(255, 255, 255, 0.08),
                                0 8px 20px rgba(0, 0, 0, 0.3)
                            `,
                        }}
                        delay={3}
                        duration={20}
                        xRange={[-8, 8]}
                        yRange={[-10, 10]}
                    />

                    {/* Bottom Left - Teal/Cyan Bean */}
                    <GlassBlob
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '5%',
                            width: '220px',
                            height: '140px',
                            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.8) 0%, rgba(6, 182, 212, 0.6) 100%)',
                            borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
                            boxShadow: `
                                inset -15px -15px 35px rgba(0, 0, 0, 0.3),
                                inset 8px 8px 25px rgba(255, 255, 255, 0.15),
                                0 15px 35px rgba(20, 184, 166, 0.3)
                            `,
                            filter: 'blur(0.5px)',
                        }}
                        delay={2}
                        duration={28}
                        xRange={[15, -20]}
                        yRange={[12, -18]}
                        scaleRange={[0.98, 1.08]}
                    />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ position: 'relative', zIndex: 10, color: 'white', maxWidth: '480px' }}
                >
                    <h1 style={{
                        fontSize: '3.25rem',
                        fontWeight: '700',
                        lineHeight: '1.15',
                        marginBottom: '1.5rem',
                        color: 'white',
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em'
                    }}>
                        Learn Smarter.<br />
                        Teach Better.<br />
                        Scale Faster.
                    </h1>

                    <p style={{
                        fontSize: '1.05rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: '1.6',
                        fontWeight: '400'
                    }}>
                        All-in-one LMS platform for modern education.
                    </p>
                </motion.div>
            </div>

            {/* RIGHT SIDE - Frosted Glass Panel */}
            <div style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #e0f2fe 0%, #dbeafe 30%, #eff6ff 70%, #f8fafc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                {/* Glass Bubble Decorations */}
                <GlassBubble size="120px" top="8%" right="15%" delay={0} opacity={0.5} />
                <GlassBubble size="80px" top="20%" right="5%" delay={2} opacity={0.4} />
                <GlassBubble size="60px" top="50%" right="8%" delay={1} opacity={0.35} />
                <GlassBubble size="100px" bottom="15%" right="10%" delay={3} opacity={0.45} />
                <GlassBubble size="70px" bottom="30%" left="5%" delay={4} opacity={0.4} />

                {/* Colorful Gradient Bean - Bottom Left */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '-3%',
                        left: '-5%',
                        width: '200px',
                        height: '120px',
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.7) 0%, rgba(168,85,247,0.7) 25%, rgba(99,102,241,0.7) 50%, rgba(6,182,212,0.7) 75%, rgba(34,197,94,0.6) 100%)',
                        borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
                        boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.2), inset 5px 5px 20px rgba(255,255,255,0.2)',
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        x: [-10, 15],
                        y: [-8, 12],
                        scale: [1, 1.05],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />



                {/* Auth Card - Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: '380px',
                        padding: '2.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        transform: 'rotate(0deg)',
                        boxShadow: `
                            0 8px 32px rgba(0, 0, 0, 0.08),
                            0 0 0 1px rgba(255, 255, 255, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.8)
                        `
                    }}
                >
                    <Outlet />
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
