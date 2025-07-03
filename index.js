import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, FileText, TrendingUp, Settings, Bell, ChevronDown, Search, CheckCircle, Clock, AlertCircle, ArrowRight, Sun, Moon } from 'lucide-react';

// --- DUMMY COMPONENTS FOR MOCK DATA --- //
// Moved Calendar here to resolve ReferenceError
const Calendar = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;


// --- MOCK DATA --- //
const mockClientData = [
  { id: 'C78910', name: 'Eleanor Vance', type: 'Family Office', aum: 125500000, status: 'Active', advisor: 'A. Corbin', lastContact: '2024-06-28', risk: 'Balanced Growth' },
  { id: 'C12345', name: 'Alistair Finch', type: 'HNW Individual', aum: 45200000, status: 'Active', advisor: 'A. Corbin', lastContact: '2024-07-01', risk: 'Conservative' },
  { id: 'C67890', name: 'The Sterling Group', type: 'Foundation', aum: 210000000, status: 'Active', advisor: 'L. Hayes', lastContact: '2024-06-25', risk: 'Growth' },
  { id: 'C23456', name: 'Beatrice Chen', type: 'HNW Individual', aum: 89000000, status: 'Onboarding', advisor: 'A. Corbin', lastContact: '2024-07-02', risk: 'Aggressive Growth' },
  { id: 'C34567', name: 'Orion Industries', type: 'Corporate', aum: 350000000, status: 'Prospect', advisor: 'L. Hayes', lastContact: '2024-06-15', risk: 'N/A' },
  { id: 'C45678', name: 'Dr. Evelyn Reed', type: 'HNW Individual', aum: 62000000, status: 'Active', advisor: 'S. Patel', lastContact: '2024-06-29', risk: 'Balanced' },
  { id: 'C56789', name: 'The Medici Trust', type: 'Trust', aum: 155000000, status: 'Review Pending', advisor: 'L. Hayes', lastContact: '2024-05-30', risk: 'Conservative' },
];

const mockTasks = [
  { id: 1, text: "Finalize Beatrice Chen's Investment Policy Statement", status: 'Pending', icon: <Clock className="w-5 h-5 text-yellow-400" /> },
  { id: 2, text: "Quarterly review for The Sterling Group", status: 'Upcoming', icon: <Calendar className="w-5 h-5 text-blue-400" /> },
  { id: 3, text: "AML/KYC documentation for Alistair Finch is expiring", status: 'Urgent', icon: <AlertCircle className="w-5 h-5 text-red-400" /> },
  { id: 4, text: "Prepare proposal for Orion Industries", status: 'Pending', icon: <Clock className="w-5 h-5 text-yellow-400" /> },
  { id: 5, text: "Execute approved trades for Eleanor Vance portfolio", status: 'Completed', icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
];

const macroscopeData = {
    '1970s Stagflation': [
        { name: 'Commodities', value: 18.5 }, { name: 'Real Estate', value: 12.3 }, { name: 'Gold', value: 24.1 },
        { name: 'US Equities', value: -1.2 }, { name: 'US Bonds', value: 2.3 }, { name: 'Global Equities', value: -0.5 },
    ],
    '1990s Tech Boom': [
        { name: 'Commodities', value: -2.1 }, { name: 'Real Estate', value: 5.6 }, { name: 'Gold', value: -3.5 },
        { name: 'US Equities', value: 22.8 }, { name: 'US Bonds', value: 6.7 }, { name: 'Global Equities', value: 19.4 },
    ],
    '2008 Financial Crisis': [
        { name: 'Commodities', value: -35.7 }, { name: 'Real Estate', value: -25.1 }, { name: 'Gold', value: 5.5 },
        { name: 'US Equities', value: -38.4 }, { name: 'US Bonds', value: 7.8 }, { name: 'Global Equities', value: -40.7 },
    ],
     'Post-Pandemic Reflation': [
        { name: 'Commodities', value: 25.2 }, { name: 'Real Estate', value: 15.8 }, { name: 'Gold', value: 6.1 },
        { name: 'US Equities', value: 18.9 }, { name: 'US Bonds', value: -4.3 }, { name: 'Global Equities', value: 15.2 },
    ],
};

const portfolioPerformance = [
  { name: 'Jan', value: 100 }, { name: 'Feb', value: 102 }, { name: 'Mar', value: 101.5 },
  { name: 'Apr', value: 104 }, { name: 'May', value: 103.8 }, { name: 'Jun', value: 105.2 },
  { name: 'Jul', value: 106.1 },
];

// --- HELPER COMPONENTS --- //
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block";
    const statusMap = {
        'Active': "bg-green-200/50 text-green-200 border border-green-400/50",
        'Onboarding': "bg-blue-200/50 text-blue-200 border border-blue-400/50",
        'Prospect': "bg-gray-200/50 text-gray-200 border border-gray-400/50",
        'Review Pending': "bg-yellow-200/50 text-yellow-200 border border-yellow-400/50",
    };
    return <span className={`${baseClasses} ${statusMap[status] || 'bg-gray-500 text-white'}`}>{status}</span>;
};

const Card = ({ children, className = '' }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/80 rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

// --- MAIN COMPONENTS --- //

const Sidebar = ({ activeView, setActiveView, isDarkMode }) => {
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: <TrendingUp /> },
        { id: 'clients', name: 'Clients', icon: <Users /> },
        { id: 'workflows', name: 'Workflows', icon: <Briefcase /> },
        { id: 'macroscope', name: 'Macroscope', icon: <FileText /> },
        { id: 'settings', name: 'Settings', icon: <Settings /> },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-900 text-gray-300 flex flex-col p-4 border-r border-gray-800">
            <div className="flex items-center mb-12 px-2">
                <svg width="32" height="32" viewBox="0 0 24 24" className="text-gold-400 mr-3">
                    <path fill="currentColor" d="M12 2L4.5 6L12 10L19.5 6L12 2M12 11.54L4.5 7.54L4.5 16.46L12 20.46L19.5 16.46L19.5 7.54L12 11.54Z"/>
                </svg>
                <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Operati<span className="text-gold-400">.</span>
                </h1>
            </div>
            <nav className="flex-grow">
                <ul>
                    {menuItems.map(item => (
                        <li key={item.id} className="mb-2">
                            <a
                                href="#"
                                onClick={() => setActiveView(item.id)}
                                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                                    activeView === item.id 
                                    ? 'bg-gold-400/10 text-gold-300' 
                                    : 'hover:bg-gray-700/50'
                                }`}
                            >
                                <div className="w-6 h-6 mr-4">{item.icon}</div>
                                <span className="font-medium">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                 <Card className="p-4 text-center">
                    <h3 className="font-semibold text-gray-100">Need Assistance?</h3>
                    <p className="text-xs text-gray-400 mt-2 mb-4">Our support team is available 24/7 to help you.</p>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Contact Support
                    </button>
                </Card>
            </div>
        </aside>
    );
};

const Header = ({ activeView, isDarkMode, setIsDarkMode }) => {
    const viewTitles = {
        dashboard: 'Command Console',
        clients: 'Client Hub',
        workflows: 'Automated Workflows',
        macroscope: 'The Macroscope™',
        settings: 'Platform Settings',
    };

    return (
        <header className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                {viewTitles[activeView]}
            </h2>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search clients, tasks..."
                        className="bg-gray-800/60 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-72 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all"
                    />
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-gray-400 hover:text-gold-300 transition-colors">
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                </button>
                <button className="text-gray-400 hover:text-gold-300 transition-colors">
                    <Bell size={22} />
                </button>
                <div className="flex items-center space-x-3">
                    <img 
                        src="https://placehold.co/40x40/1a202c/e2e8f0?text=AC" 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full border-2 border-gray-600"
                    />
                    <div>
                        <p className="font-semibold text-gray-200">A. Corbin</p>
                        <p className="text-xs text-gray-500">Wealth Manager</p>
                    </div>
                    <ChevronDown size={20} className="text-gray-500" />
                </div>
            </div>
        </header>
    );
};

const Dashboard = () => {
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>My Tasks</h3>
                        <div className="space-y-4">
                            {mockTasks.slice(0, 4).map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gold-400/50 transition-colors">
                                    <div className="flex items-center">
                                        {task.icon}
                                        <p className="ml-4 text-gray-300">{task.text}</p>
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        task.status === 'Urgent' ? 'text-red-400' : 
                                        task.status === 'Pending' ? 'text-yellow-400' : 'text-gray-400'
                                    }`}>{task.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="p-6">
                         <h3 className="text-xl font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Portfolio Performance (YTD)</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={portfolioPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c09a3e" stopOpacity={0.6}/>
                                            <stop offset="95%" stopColor="#c09a3e" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                    <XAxis dataKey="name" stroke="#A0AEC0" />
                                    <YAxis stroke="#A0AEC0" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                                    <Area type="monotone" dataKey="value" stroke="#c09a3e" fillOpacity={1} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Firm Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Total AUM</p>
                                <p className="text-2xl font-bold text-gold-300">{formatCurrency(mockClientData.reduce((acc, c) => acc + c.aum, 0))}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Active Clients</p>
                                <p className="text-2xl font-bold text-gray-100">{mockClientData.filter(c => c.status === 'Active').length}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">Pending Tasks</p>
                                <p className="text-2xl font-bold text-gray-100">{mockTasks.filter(t => t.status === 'Pending' || t.status === 'Urgent').length}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Recent Activity</h3>
                        <ul className="space-y-4">
                             <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-400 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-sm text-gray-300"><strong className="font-medium text-white">L. Hayes</strong> updated the risk profile for The Sterling Group.</p>
                            </li>
                            <li className="flex items-start">
                                <Users className="w-5 h-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-sm text-gray-300">New client <strong className="font-medium text-white">Beatrice Chen</strong> was added to the onboarding flow.</p>
                            </li>
                             <li className="flex items-start">
                                <FileText className="w-5 h-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-sm text-gray-300">A new report was generated for <strong className="font-medium text-white">Eleanor Vance</strong>.</p>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

const ClientHub = () => {
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>All Clients</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-t border-gray-700 bg-gray-900/30">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-400">Client Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">AUM</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-400">Advisor</th>
                                <th className="p-4 text-sm font-semibold text-gray-400"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockClientData.map(client => (
                                <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800/70 transition-colors">
                                    <td className="p-4 text-gray-200 font-medium">{client.name}</td>
                                    <td className="p-4 text-gray-300">{client.type}</td>
                                    <td className="p-4 text-gray-200 font-mono">{formatCurrency(client.aum)}</td>
                                    <td className="p-4"><StatusBadge status={client.status} /></td>
                                    <td className="p-4 text-gray-300">{client.advisor}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-gold-300 hover:text-gold-200 flex items-center">
                                            View Hub <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

const Macroscope = () => {
    const [activeRegime, setActiveRegime] = useState('1970s Stagflation');
    const data = macroscopeData[activeRegime];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Regime-Adaptive Asset Allocation
                            </h3>
                            <p className="text-lg font-bold text-gold-300">{activeRegime}</p>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-3xl">
                            Select a historical economic era to visualize the annualized performance of major asset classes during that period. This tool helps turn market intuition into data-backed historical context.
                        </p>
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" horizontal={false} />
                                    <XAxis type="number" stroke="#A0AEC0" />
                                    <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={120} tick={{ fill: '#E2E8F0' }} />
                                    <Tooltip
                                        cursor={{fill: 'rgba(192, 154, 62, 0.1)'}}
                                        contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, 'Annualized Return']}
                                    />
                                    <Bar dataKey="value" fill="#c09a3e" barSize={20}>
                                        {data.map((entry, index) => (
                                            <Bar key={`bar-${index}`} fill={entry.value > 0 ? '#c09a3e' : '#B91C1C'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                <div>
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Select Economic Regime</h3>
                        <div className="space-y-3">
                            {Object.keys(macroscopeData).map(regime => (
                                <button
                                    key={regime}
                                    onClick={() => setActiveRegime(regime)}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
                                        activeRegime === regime 
                                        ? 'bg-gold-400/20 border-gold-400 text-gold-200' 
                                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 text-gray-300'
                                    }`}
                                >
                                    <p className="font-semibold">{regime}</p>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

const LoginScreen = ({ onLogin }) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-8">
                    <div className="text-center mb-8">
                        <svg width="48" height="48" viewBox="0 0 24 24" className="text-gold-400 mx-auto mb-4">
                            <path fill="currentColor" d="M12 2L4.5 6L12 10L19.5 6L12 2M12 11.54L4.5 7.54L4.5 16.46L12 20.46L19.5 16.46L19.5 7.54L12 11.54Z"/>
                        </svg>
                        <h1 className="text-4xl font-bold tracking-wider text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Operati<span className="text-gold-400">.</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Operate as one.</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input type="email" defaultValue="a.corbin@wealth.co" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                <input type="password" defaultValue="password" className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors text-lg">
                                Sign In
                            </button>
                        </div>
                         <div className="text-center mt-6">
                            <a href="#" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">Forgot Password?</a>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};


// --- APP --- //
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(true);

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard />;
            case 'clients': return <ClientHub />;
            case 'macroscope': return <Macroscope />;
            case 'workflows':
            case 'settings':
            default:
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="p-12 text-center">
                            <h3 className="text-2xl font-bold text-gray-100 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Feature In Development</h3>
                            <p className="text-gray-400">This module is currently being built. Please check back later.</p>
                        </Card>
                    </motion.div>
                );
        }
    };

    useEffect(() => {
        // Add fonts to the document head
        const fontLinkPlayfair = document.createElement('link');
        fontLinkPlayfair.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap";
        fontLinkPlayfair.rel = 'stylesheet';

        const fontLinkLato = document.createElement('link');
        fontLinkLato.href = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap";
        fontLinkLato.rel = 'stylesheet';

        document.head.appendChild(fontLinkPlayfair);
        document.head.appendChild(fontLinkLato);

        return () => {
            document.head.removeChild(fontLinkPlayfair);
            document.head.removeChild(fontLinkLato);
        };
    }, []);
    

    if (!isLoggedIn) {
        return (
             <div className={`w-screen h-screen font-sans ${isDarkMode ? 'dark' : ''}`} style={{ fontFamily: "'Lato', sans-serif" }}>
                <LoginScreen onLogin={() => setIsLoggedIn(true)} />
            </div>
        );
    }

    return (
        <div className={`w-screen h-screen flex bg-gray-900 overflow-hidden font-sans ${isDarkMode ? 'dark' : ''}`} style={{ fontFamily: "'Lato', sans-serif" }}>
            <style>{`
                :root {
                    --color-gold-100: #fefce8;
                    --color-gold-200: #fde68a;
                    --color-gold-300: #facc15;
                    --color-gold-400: #eab308;
                    --color-gold-500: #ca8a04;
                    --color-gold-600: #a16207;
                }
                .text-gold-100 { color: var(--color-gold-100); }
                .text-gold-200 { color: var(--color-gold-200); }
                .text-gold-300 { color: var(--color-gold-300); }
                .text-gold-400 { color: var(--color-gold-400); }
                .bg-gold-400 { background-color: var(--color-gold-400); }
                .bg-gold-500 { background-color: var(--color-gold-500); }
                .bg-gold-600 { background-color: var(--color-gold-600); }
                .border-gold-400 { border-color: var(--color-gold-400); }
                .bg-gold-400\\/10 { background-color: rgba(234, 179, 8, 0.1); }
                .bg-gold-400\\/20 { background-color: rgba(234, 179, 8, 0.2); }
            `}</style>

            <Sidebar activeView={activeView} setActiveView={setActiveView} isDarkMode={isDarkMode} />
            <main className="flex-1 flex flex-col">
                <Header activeView={activeView} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                <div className="flex-1 p-8 overflow-y-auto bg-black bg-opacity-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderActiveView()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

