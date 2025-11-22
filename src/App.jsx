import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Calendar, Shield, Wifi, Crosshair, Map, Star, Globe, Github, PlayCircle } from 'lucide-react';

// --- CONFIGURACIÓN DE ZONAS HORARIAS ---
const REGION_OFFSETS = {
    'NA': 0,
    'LATAM': 1,
    'EU': 6,
    'AP': 15
};

const REGION_NAMES = {
    'NA': 'Norteamérica',
    'LATAM': 'Latinoamérica',
    'EU': 'Europa',
    'AP': 'Asia-Pacífico'
};

// Función para calcular el tiempo restante
const calculateTimeLeft = (endTime) => {
    const now = new Date().getTime();
    const difference = endTime - now;
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
}

// --- COMPONENTES DECORATIVOS ---
const CornerDecor = ({ className }) => (
    <div className={`absolute w-2 h-2 bg-[#FF4655] ${className}`} />
);

const AdPlaceholder = ({ label }) => (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 border-2 border-dashed border-gray-600 bg-gray-800/30 flex flex-col items-center justify-center h-32 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
        <span className="text-gray-400 font-mono uppercase tracking-widest text-sm z-10">{label}</span>
        <span className="text-xs text-gray-500 mt-2 z-10">Google Ads Leaderboard (728x90)</span>
        <div className="absolute inset-0 bg-[#FF4655]/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
);

// --- COMPONENTES UI PRINCIPALES ---
const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 md:mx-6 relative group">
        <div className="relative bg-[#0F1923] border border-white/10 w-20 h-24 md:w-32 md:h-40 flex items-center justify-center mb-2 shadow-lg overflow-hidden transition-all duration-300 hover:border-[#FF4655]/50">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-white/20 border-r-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF4655]"></div>
            <span className="text-4xl md:text-7xl font-black text-white tracking-tighter z-10 font-sans tabular-nums">
                {String(value).padStart(2, '0')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
        </div>
        <span className="text-[#FF4655] font-bold uppercase tracking-widest text-xs md:text-sm">{label}</span>
    </div>
);

const RegionSelector = ({ selectedRegion, onRegionChange, endTimeUTC }) => {
    const getRegionalTime = (region) => {
        if (!endTimeUTC) return null;
        const offset = REGION_OFFSETS[region];
        const regionalDate = new Date(endTimeUTC + (offset * 60 * 60 * 1000));
        return regionalDate;
    };

    const regionalTime = getRegionalTime(selectedRegion);

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 border border-white/10 bg-[#0F1923]/60 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Globe className="text-[#FF4655]" size={20} />
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Tu Región:</span>
                    <select
                        value={selectedRegion}
                        onChange={(e) => onRegionChange(e.target.value)}
                        className="bg-[#0F1923] border border-white/20 text-white px-4 py-2 rounded-sm font-bold uppercase text-sm tracking-wider cursor-pointer hover:border-[#FF4655] transition-colors focus:outline-none focus:border-[#FF4655]"
                    >
                        {Object.keys(REGION_OFFSETS).map(region => (
                            <option key={region} value={region}>
                                {region} - {REGION_NAMES[region]}
                            </option>
                        ))}
                    </select>
                </div>
                {regionalTime && (
                    <div className="text-center md:text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hora estimada del parche</p>
                        <p className="text-white font-bold text-sm">
                            {regionalTime.toLocaleString('es-ES', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZoneName: 'short'
                            })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SkinShowcase = ({ skin, isLoading }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-md mx-auto mt-12 p-1 border border-white/10 bg-[#0F1923]/80 h-64 flex items-center justify-center">
                <span className="text-white/50 animate-pulse font-mono text-sm">BUSCANDO EN EL MERCADO NEGRO...</span>
            </div>
        );
    }

    if (!skin) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-16 relative group cursor-default">
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#FF4655]"></div>
                <h3 className="text-[#FF4655] font-black uppercase tracking-widest text-sm">¿QUÉ COMPRAR HOY?</h3>
                <div className="h-px w-12 bg-[#FF4655]"></div>
            </div>
            <div className="relative bg-gradient-to-br from-[#1c252e] to-[#0F1923] border border-white/10 p-8 overflow-hidden transition-all duration-500 hover:border-[#FF4655]/50 hover:shadow-[0_0_30px_rgba(255,70,85,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Crosshair size={120} />
                </div>
                <CornerDecor className="top-0 left-0" />
                <CornerDecor className="bottom-0 right-0" />
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-full md:w-2/3 h-48 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#FF4655]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <img
                            src={skin.displayIcon}
                            alt={skin.displayName}
                            className="max-h-full max-w-full object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ease-out"
                        />
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Skin Destacada</span>
                        <h4 className="text-2xl md:text-3xl font-black text-white leading-none mb-4 uppercase italic">
                            {skin.displayName}
                        </h4>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-300 uppercase tracking-wider rounded-sm">
                                Random Drop
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE DE MAPAS ACTIVOS ---
const ActiveMaps = () => {
    const CURRENT_ROTATION = ['Ascent', 'Bind', 'Breeze', 'Sunset', 'Lotus', 'Icebox', 'Split'];
    const [maps, setMaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const response = await fetch('https://valorant-api.com/v1/maps');
                if (!response.ok) {
                    throw new Error('Fallo al obtener los datos de mapas.');
                }
                const data = await response.json();

                const filteredMaps = data.data.filter(map =>
                    CURRENT_ROTATION.includes(map.displayName)
                ).map(map => ({
                    uuid: map.uuid,
                    displayName: map.displayName,
                    imageUrl: map.splash || map.listViewIcon,
                }));

                setMaps(filteredMaps);
                setError(null);
            } catch (err) {
                console.error("Error fetching maps:", err);
                setError("Error al cargar los mapas. Asegúrate de tener conexión.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMaps();
    }, []);

    if (isLoading || error || maps.length === 0) {
        return (
            <section className="w-full bg-gray-900/50 border-t border-white/5 py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    {isLoading && <p className="text-gray-400 font-bold flex items-center justify-center gap-3"><Map size={20} className="animate-spin text-[#FF4655]" /> Cargando rotación de mapas...</p>}
                    {error && <p className="text-[#FF4655] font-bold">{error}</p>}
                    {!isLoading && !error && maps.length === 0 && <p className="text-gray-400">No se encontraron mapas en la rotación actual.</p>}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-gray-900/50 border-t border-white/5 py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-10 justify-center">
                    <div className="h-px w-16 bg-[#FF4655]"></div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                        Rotación de Mapas Activos
                    </h2>
                    <div className="h-px w-16 bg-[#FF4655]"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                    {maps.map((map, index) => {
                        const isLastItemAndNeedsCentering =
                            (index === maps.length - 1) &&
                            (maps.length % 3 === 1);

                        return (
                            <div
                                key={map.uuid}
                                className={`group relative overflow-hidden rounded-lg shadow-xl border border-white/10 cursor-pointer transition-all duration-300 hover:border-[#FF4655] hover:shadow-[0_0_15px_rgba(255,70,85,0.2)] ${isLastItemAndNeedsCentering ? 'lg:col-start-2' : ''}`}
                            >
                                <div className="overflow-hidden bg-[#0F1923] aspect-video w-full">
                                    <img
                                        src={map.imageUrl}
                                        alt={map.displayName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                    <p className="text-white font-bold uppercase tracking-wider text-sm">
                                        {map.displayName}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// --- COMPONENTE DE BUNDLES DESTACADOS ---
const FeaturedBundles = () => {
    const [mostRecentBundle, setMostRecentBundle] = useState(null);
    const [featuredBundles, setFeaturedBundles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const response = await fetch('https://valorant-api.com/v1/bundles');
                if (!response.ok) {
                    throw new Error('Fallo al obtener los datos de bundles.');
                }
                const data = await response.json();

                // Filtrar bundles válidos y ordenar por UUID descendente (más reciente primero)
                const validBundles = data.data
                    .filter(bundle => (bundle.displayIcon || bundle.displayIcon2) && bundle.uuid)
                    .sort((a, b) => b.uuid.localeCompare(a.uuid));

                if (validBundles.length > 0) {
                    // El bundle más reciente (primer elemento después de ordenar)
                    const latest = validBundles[0];
                    setMostRecentBundle({
                        uuid: latest.uuid,
                        displayName: latest.displayName,
                        promoImage: latest.displayIcon2 || latest.displayIcon,
                        description: latest.description || ''
                    });

                    // Los siguientes 4 bundles para la galería secundaria
                    const gallery = validBundles.slice(1, 5).map(bundle => ({
                        uuid: bundle.uuid,
                        displayName: bundle.displayName,
                        imageUrl: bundle.displayIcon2 || bundle.displayIcon,
                        description: bundle.description || ''
                    }));

                    setFeaturedBundles(gallery);
                    setError(null);
                } else {
                    throw new Error('No se encontraron bundles válidos');
                }
            } catch (err) {
                console.error("Error fetching bundles:", err);
                setError("Error al cargar los bundles. Asegúrate de tener conexión.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBundles();
    }, []);

    if (isLoading || error) {
        return (
            <section className="w-full bg-[#0F1923] border-t border-white/5 py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    {isLoading && <p className="text-gray-400 font-bold flex items-center justify-center gap-3"><Star size={20} className="animate-spin text-[#FF4655]" /> Cargando bundles destacados...</p>}
                    {error && <p className="text-[#FF4655] font-bold">{error}</p>}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-[#0F1923] border-t border-white/5 py-20 px-6">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* ÚLTIMA REVELACIÓN - Bundle Más Reciente */}
                {mostRecentBundle && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-px w-16 bg-[#FF4655]"></div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
                                Última Revelación
                            </h2>
                            <div className="h-px w-16 bg-[#FF4655]"></div>
                        </div>

                        {/* Tarjeta Grande del Bundle Más Reciente */}
                        <div className="group relative overflow-hidden bg-gradient-to-br from-[#1c252e] to-[#0F1923] border-2 border-white/10 cursor-pointer transition-all duration-500 hover:border-[#FF4655] hover:shadow-[0_0_40px_rgba(255,70,85,0.4)]">
                            {/* Imagen Panorámica */}
                            <div className="relative overflow-hidden bg-[#0F1923] w-full h-64 md:h-96 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                                <img
                                    src={mostRecentBundle.promoImage}
                                    alt={mostRecentBundle.displayName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay con Nombre del Bundle */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-1 w-12 bg-[#FF4655]"></div>
                                        <span className="text-[#FF4655] uppercase tracking-widest text-xs font-bold">Nuevo</span>
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-[#FF4655] transition-colors duration-300">
                                        {mostRecentBundle.displayName}
                                    </h3>
                                    {mostRecentBundle.description && (
                                        <p className="text-gray-300 text-sm md:text-base max-w-2xl">
                                            {mostRecentBundle.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Decoraciones de Esquinas */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4655] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                )}

                {/* BUNDLES CLÁSICOS Y DESTACADOS - Galería Secundaria */}
                {featuredBundles.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-px w-12 bg-white/20"></div>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white/80">
                                Bundles Clásicos y Destacados
                            </h3>
                            <div className="h-px w-12 bg-white/20"></div>
                        </div>

                        {/* Grid de Bundles Secundarios */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredBundles.map((bundle) => (
                                <div
                                    key={bundle.uuid}
                                    className="group relative overflow-hidden bg-gradient-to-br from-[#1c252e] to-[#0F1923] border border-white/10 cursor-pointer transition-all duration-300 hover:border-[#FF4655] hover:shadow-[0_0_20px_rgba(255,70,85,0.3)] hover:-translate-y-2"
                                >
                                    {/* Imagen del Bundle */}
                                    <div className="relative overflow-hidden bg-[#0F1923] aspect-square w-full flex items-center justify-center p-4">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <img
                                            src={bundle.imageUrl}
                                            alt={bundle.displayName}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Información del Bundle */}
                                    <div className="p-3 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF4655] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-xs text-center group-hover:text-[#FF4655] transition-colors duration-300 line-clamp-2">
                                            {bundle.displayName}
                                        </h4>
                                    </div>

                                    {/* Decoración de esquinas */}
                                    <CornerDecor className="top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <CornerDecor className="bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default function App() {
    const [actInfo, setActInfo] = useState(null);
    const [isActLoading, setIsActLoading] = useState(true);
    const [actError, setActError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [selectedRegion, setSelectedRegion] = useState('NA');
    const [randomSkin, setRandomSkin] = useState(null);
    const [isSkinLoading, setIsSkinLoading] = useState(true);

    const fetchRandomSkin = async () => {
        setIsSkinLoading(true);
        setRandomSkin(null);

        try {
            const skinsRes = await fetch('https://valorant-api.com/v1/weapons/skins');
            const skinsData = await skinsRes.json();

            const validSkins = skinsData.data.filter(skin =>
                skin.displayIcon !== null &&
                !skin.displayName.includes("Standard") &&
                !skin.displayName.includes("Random")
            );

            if (validSkins.length > 0) {
                const randomIndex = Math.floor(Math.random() * validSkins.length);
                setRandomSkin(validSkins[randomIndex]);
            }
        } catch (error) {
            console.error("Error fetching random skin:", error);
        } finally {
            setIsSkinLoading(false);
        }
    };

    useEffect(() => {
        const fetchSeasonData = async () => {
            try {
                const response = await fetch('https://valorant-api.com/v1/seasons');
                if (!response.ok) {
                    throw new Error('Error al obtener datos de temporadas');
                }
                const data = await response.json();

                const now = new Date().getTime();
                const activeAct = data.data.find(season => {
                    if (season.type !== "EAresSeasonType::Act") return false;
                    const startTime = new Date(season.startTime).getTime();
                    const endTime = new Date(season.endTime).getTime();
                    return now >= startTime && now <= endTime;
                });

                if (activeAct) {
                    const episodeName = activeAct.title ?
                        activeAct.title.split('//')[0].trim() :
                        activeAct.displayName;

                    setActInfo({
                        name: activeAct.title || activeAct.displayName,
                        episode: episodeName,
                        startTime: new Date(activeAct.startTime).getTime(),
                        endTime: new Date(activeAct.endTime).getTime(),
                        endTimeUTC: activeAct.endTime
                    });
                    setActError(null);
                } else {
                    throw new Error('No se encontró un acto activo');
                }
            } catch (error) {
                console.error("Error fetching season data:", error);
                setActError("Error al cargar datos del acto. Usando datos de respaldo.");
                const fallbackDate = new Date();
                fallbackDate.setDate(fallbackDate.getDate() + 10);
                setActInfo({
                    name: "EPISODIO 9: ACTO III",
                    episode: "EPISODIO 9",
                    startTime: new Date().getTime() - 1000000000, // Fallback start time
                    endTime: fallbackDate.getTime(),
                    endTimeUTC: fallbackDate.toISOString()
                });
            } finally {
                setIsActLoading(false);
            }
        };

        fetchSeasonData();
        fetchRandomSkin();
    }, []);

    useEffect(() => {
        if (!actInfo) return;

        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft(actInfo.endTime));
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [actInfo]);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0F1923] text-white font-sans overflow-x-hidden selection:bg-[#FF4655] selection:text-white">
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>

            <nav className={`w-full h-16 border-b flex items-center justify-between px-6 md:px-12 fixed top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0F1923] border-white/10 shadow-lg'
                : 'bg-[#0F1923]/70 border-transparent backdrop-blur-sm'
                }`}>
                <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={scrollToTop}
                >
                    <div className="bg-[#FF4655] p-1.5 rounded-sm group-hover:bg-[#ff2b3d] transition-colors">
                        <Clock size={24} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter uppercase hidden md:block group-hover:text-[#FF4655] transition-colors">
                        Valorant Countdown
                    </span>
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-400 uppercase tracking-wider">
                    <span className="text-[#FF4655] cursor-pointer hover:text-white transition-colors">Live Tracker</span>
                </div>
            </nav>

            <div className="pt-32"> {/* Spacer for fixed navbar */}

                {/* THREE-COLUMN LAYOUT */}
                <div className="w-full flex justify-center">
                    {/* LEFT AD SIDEBAR - Hidden on mobile */}
                    <aside className="hidden lg:block w-[300px] flex-shrink-0">
                        <div className="sticky top-20 p-4">
                            <div className="ad-placeholder w-[300px] h-[600px] border-2 border-dashed border-gray-600 bg-gray-800/30 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                <span className="text-gray-400 font-mono uppercase tracking-widest text-xs z-10 text-center px-4">
                                    Publicidad Vertical
                                </span>
                                <span className="text-xs text-gray-500 mt-2 z-10">300x600</span>
                                <div className="absolute inset-0 bg-[#FF4655]/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                            </div>
                        </div>
                    </aside>

                    {/* CENTRAL CONTENT COLUMN */}
                    <main className="flex-1 max-w-6xl w-full">
                        {/* COUNTDOWN SECTION */}
                        <div className="w-full flex flex-col items-center justify-center pt-12 pb-20 relative px-4">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-[#FF4655]/5 via-transparent to-transparent blur-3xl pointer-events-none"></div>

                            {isActLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[400px]">
                                    <Clock className="text-[#FF4655] animate-spin mb-4" size={48} />
                                    <p className="text-white font-bold uppercase tracking-wider">Cargando datos del acto...</p>
                                </div>
                            ) : actInfo ? (
                                <>
                                    <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-2 relative z-10 text-center">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                                            {actInfo.episode}
                                        </span>
                                    </h1>
                                    <p className="text-[#FF4655] uppercase tracking-[0.2em] md:tracking-[0.5em] font-bold mb-10 border-b border-[#FF4655]/50 pb-2 px-4 md:px-10 text-center animate-pulse text-xs md:text-base">
                                        TIEMPO RESTANTE // {actInfo.name}
                                    </p>

                                    {actError && (
                                        <div className="w-full max-w-4xl mx-auto mb-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-sm flex items-center gap-3">
                                            <AlertCircle className="text-yellow-500" size={20} />
                                            <p className="text-yellow-200 text-sm">{actError}</p>
                                        </div>
                                    )}
                                    <div className="relative p-8 md:p-12 border border-white/10 bg-[#0F1923]/80 backdrop-blur-md mt-4 transition-opacity duration-500">
                                        <CornerDecor className="top-0 left-0" />
                                        <CornerDecor className="top-0 right-0" />
                                        <CornerDecor className="bottom-0 left-0" />
                                        <CornerDecor className="bottom-0 right-0" />

                                        <div className="flex flex-wrap justify-center items-center">
                                            <TimeUnit value={timeLeft.days} label="Días" />
                                            <span className="text-4xl font-light text-gray-600 mb-8 hidden md:block">:</span>
                                            <TimeUnit value={timeLeft.hours} label="Horas" />
                                            <span className="text-4xl font-light text-gray-600 mb-8 hidden md:block">:</span>
                                            <TimeUnit value={timeLeft.minutes} label="Minutos" />
                                            <span className="text-4xl font-light text-gray-600 mb-8 hidden md:block">:</span>
                                            <TimeUnit value={timeLeft.seconds} label="Segundos" />
                                        </div>
                                    </div>

                                    <div className="w-full max-w-4xl mx-auto mt-6 p-4 border border-white/5 bg-[#0F1923]/40 backdrop-blur-sm">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm">
                                            <div className="flex items-center gap-2">
                                                <PlayCircle className="text-[#FF4655]" size={16} />
                                                <span className="text-gray-400">Inicio del Acto:</span>
                                                <span className="text-white font-bold">
                                                    {new Date(actInfo.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                                </span>
                                            </div>
                                            <div className="hidden md:block w-px h-4 bg-white/10"></div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-[#FF4655]" size={16} />
                                                <span className="text-gray-400">Fin del Acto (UTC):</span>
                                                <span className="text-white font-bold">
                                                    {new Date(actInfo.endTimeUTC).toLocaleString('es-ES', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        timeZone: 'UTC',
                                                        timeZoneName: 'short'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="w-full max-w-2xl mt-8 px-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                                Progreso del Acto
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                            <div
                                                className="h-full bg-[#FF4655] transition-all duration-1000 ease-out relative"
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, ((Date.now() - actInfo.startTime) / (actInfo.endTime - actInfo.startTime)) * 100))}%`
                                                }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <RegionSelector
                                        selectedRegion={selectedRegion}
                                        onRegionChange={setSelectedRegion}
                                        endTimeUTC={actInfo.endTime}
                                    />
                                </>
                            ) : null}
                        </div>

                        {/* MOBILE ONLY AD - Above Maps */}
                        <div className="block lg:hidden w-full px-4">
                            <AdPlaceholder label="Anuncio Superior - Móvil" />
                        </div>

                        {/* PRIORITY 2: MAP ROTATION */}
                        <ActiveMaps />

                        {/* PRIORITY 3: BUNDLES HIERARCHY */}
                        <FeaturedBundles />

                        {/* PRIORITY 4: SKIN ROULETTE (Moved to bottom) */}
                        {actInfo && (
                            <div className="w-full flex flex-col items-center px-4 py-12">
                                <SkinShowcase skin={randomSkin} isLoading={isSkinLoading} />

                                <button
                                    className="mt-12 group relative px-8 py-4 bg-[#FF4655] text-white font-bold uppercase tracking-widest overflow-hidden disabled:opacity-50"
                                    disabled={isSkinLoading}
                                    onClick={fetchRandomSkin}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Crosshair size={18} />
                                        Buscar Otra Skin
                                    </span>
                                </button>

                                <AdPlaceholder label="Anuncio Inferior - Banner" />
                            </div>
                        )}

                        {/* SEO SECTION */}
                        <section className="w-full bg-gray-900/50 border-t border-white/5 py-20 px-6">
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-1 h-8 bg-[#FF4655]"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                                        Datos del Acto Actual
                                    </h2>
                                </div>
                                <div className="grid gap-12 text-gray-300 leading-relaxed">
                                    <article>
                                        <h3 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                            Zonas Horarias Regionales
                                        </h3>
                                        <p>
                                            El selector de región te permite ver la hora estimada del parche según tu ubicación.
                                            Los offsets regionales son: NA (base), LATAM (+1h), EU (+6h), y AP (+15h).
                                            El contador principal siempre muestra el tiempo restante real basado en UTC.
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </section>

                        {/* FOOTER */}
                        <footer className="w-full bg-[#0F1923] border-t-4 border-[#FF4655] text-gray-400 text-sm relative z-10">
                            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                {/* Column 1: Branding */}
                                <div className="flex flex-col items-center md:items-start space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#FF4655] p-1.5 rounded-sm">
                                            <Clock size={20} className="text-white" />
                                        </div>
                                        <span className="font-black text-lg tracking-tighter uppercase text-white">
                                            Valorant Countdown
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center md:text-left">
                                        © 2025 Valorant Countdown.<br />Todos los derechos reservados.
                                    </p>
                                </div>

                                {/* Column 2: Disclaimer */}
                                <div className="flex flex-col items-center md:items-center justify-center text-center space-y-2">
                                    <div className="w-12 h-1 bg-[#FF4655]/50 mb-2 rounded-full"></div>
                                    <p className="text-[10px] leading-relaxed max-w-xs text-gray-600">
                                        VALORANT is a trademark and/or registered trademark of Riot Games, Inc.
                                        Valorant Countdown is a fan-made site and is not endorsed by or affiliated with Riot Games, Inc.
                                    </p>
                                </div>

                                {/* Column 3: Links & Creator */}
                                <div className="flex flex-col items-center md:items-end space-y-4">
                                    <a
                                        href="https://github.com/luakode-dev"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-white hover:text-[#FF4655] transition-colors group"
                                    >
                                        <Github size={20} className="group-hover:rotate-12 transition-transform" />
                                        <span className="font-bold uppercase tracking-wider">GitHub</span>
                                    </a>

                                    <p className="text-xs font-medium">
                                        Desarrollado por <span className="text-[#FF4655]">Doza</span>
                                    </p>

                                    <div className="flex gap-4 text-[10px] uppercase tracking-widest text-gray-600">
                                        <span className="hover:text-gray-400 cursor-pointer transition-colors">[Política de Privacidad]</span>
                                        <span className="hover:text-gray-400 cursor-pointer transition-colors">[Términos de Uso]</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </main>

                    {/* RIGHT AD SIDEBAR - Hidden on mobile */}
                    <aside className="hidden lg:block w-[300px] flex-shrink-0">
                        <div className="sticky top-20 p-4">
                            <div className="ad-placeholder w-[300px] h-[600px] border-2 border-dashed border-gray-600 bg-gray-800/30 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                                <span className="text-gray-400 font-mono uppercase tracking-widest text-xs z-10 text-center px-4">
                                    Publicidad Vertical
                                </span>
                                <span className="text-xs text-gray-500 mt-2 z-10">300x600</span>
                                <div className="absolute inset-0 bg-[#FF4655]/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
