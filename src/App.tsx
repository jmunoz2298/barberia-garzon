/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  ChevronRight, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Calendar, 
  User, 
  ShieldCheck, 
  Coffee, 
  Menu, 
  X, 
  BadgeCheck, 
  Sparkles, 
  Calculator,
  ArrowRight,
  Map,
  ThumbsUp,
  Lock,
  Unlock,
  Trash2,
  Plus,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

import { CONTACT_INFO, SERVICES, REVIEWS, GALLERY, SCHEDULES } from './data';
import { Service, Review } from './types';

export default function App() {
  // --- DATABASE COLLECTIONS WITH LOCALSTORAGE PERSISTENCE ---
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('c76_services');
    return saved ? JSON.parse(saved) : SERVICES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('c76_reviews');
    return saved ? JSON.parse(saved) : REVIEWS;
  });

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('c76_schedules');
    return saved ? JSON.parse(saved) : SCHEDULES;
  });

  const [appointments, setAppointments] = useState<any[]>(() => {
    const saved = localStorage.getItem('c76_appointments');
    if (saved) return JSON.parse(saved);
    // 3 default appointments to populate the dashboard on first load
    return [
      {
        id: "app-1",
        clientName: "Alejandro Gómez",
        clientPhone: "3124567890",
        dateTime: "2026-06-05T10:00",
        services: [SERVICES[0], SERVICES[2]],
        totalPrice: 35000,
        status: 'Pendiente',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "app-2",
        clientName: "Carlos Mario Restrepo",
        clientPhone: "3209876543",
        dateTime: "2026-06-05T15:30",
        services: [SERVICES[4]],
        totalPrice: 45000,
        status: 'Confirmada',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "app-3",
        clientName: "Santiago Rivera",
        clientPhone: "3154829910",
        dateTime: "2026-06-04T16:00",
        services: [SERVICES[1]],
        totalPrice: 15000,
        status: 'Completada',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  const [adminOverrideStatus, setAdminOverrideStatus] = useState<string>(() => {
    return localStorage.getItem('c76_override_status') || 'auto';
  });

  // Admin Module States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'appointments' | 'services' | 'reviews' | 'settings'>('dashboard');

  // Client user booking flows
  const [showUserBookingModal, setShowUserBookingModal] = useState(false);
  const [bookingClientName, setBookingClientName] = useState('');
  const [bookingClientPhone, setBookingClientPhone] = useState('');
  const [bookingDateTime, setBookingDateTime] = useState('');

  // Local storage synchronization triggers
  useEffect(() => {
    localStorage.setItem('c76_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('c76_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('c76_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('c76_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('c76_override_status', adminOverrideStatus);
  }, [adminOverrideStatus]);

  // --- FILTERS & INTERFACES ---
  // Filter for services
  const [activeCategory, setActiveCategory] = useState<'todos' | 'corte' | 'barba' | 'especial' | 'combo'>('todos');
  
  // Filter for gallery
  const [galleryFilter, setGalleryFilter] = useState<'todos' | 'coke_or_beard'>('todos');

  // WhatsApp Assistant status
  const [showWpTooltip, setShowWpTooltip] = useState(true);

  // New review state
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Cart/Estimator for Barber Calculator (Booking Planner)
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [calcStepOpen, setCalcStepOpen] = useState(false);

  // Mobile menu status
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Colombia Status state
  const [colombiaStatus, setColombiaStatus] = useState({ isOpen: true, text: "", currentDayName: "" });

  useEffect(() => {
    // Hide tooltip after some time, or toggle
    const timer = setTimeout(() => {
      setShowWpTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Update status based on GMT-5 Colombia time and Admin Overrides
  useEffect(() => {
    const updateColombiaTime = () => {
      if (adminOverrideStatus === 'closed_emergency') {
        setColombiaStatus({
          isOpen: false,
          text: "Cerrado Temporalmente por Mantenimiento Especial",
          currentDayName: ""
        });
        return;
      }
      if (adminOverrideStatus === 'closed_admin') {
        setColombiaStatus({
          isOpen: false,
          text: "Cerrado Hoy por Gestión de Administración / Festivo",
          currentDayName: ""
        });
        return;
      }
      if (adminOverrideStatus === 'open_special') {
        setColombiaStatus({
          isOpen: true,
          text: "Abierto Hoy en Horario Especial de Atención Continuada",
          currentDayName: ""
        });
        return;
      }

      const now = new Date();
      // Colombia is always UTC-5
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const colombiaTime = new Date(utc + (3600000 * -5));
      
      const day = colombiaTime.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
      const hour = colombiaTime.getHours();
      const minutes = colombiaTime.getMinutes();
      const timeDecimal = hour + (minutes / 60);

      let isOpen = false;
      let text = "";
      
      const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const currentDayName = dayNames[day];

      // Retrieve today's schedule from schedules state list edited by admin
      const schedToday = schedules.find(s => s.day === currentDayName);
      
      if (schedToday?.isClosed) {
        isOpen = false;
        text = `Cerrado hoy (${currentDayName}) • No se reciben turnos en labor`;
      } else {
        if (day === 0) { // Sunday
          if (timeDecimal >= 9 && timeDecimal < 14) {
            isOpen = true;
            text = `Abierto Hoy (Domingo): ${colombiaTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Cierra a las 2:00 PM`;
          } else {
            isOpen = false;
            text = "Cerrado • Abre Domingo de 9:00 AM a 2:00 PM";
          }
        } else if (day === 5) { // Friday
          if (timeDecimal >= 8 && timeDecimal < 20.5) {
            isOpen = true;
            text = `Abierto Hoy (Viernes): ${colombiaTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Cierra a las 8:30 PM`;
          } else {
            isOpen = false;
            text = "Cerrado • Abre mañana a las 8:00 AM";
          }
        } else if (day === 6) { // Saturday
          if (timeDecimal >= 8 && timeDecimal < 21) {
            isOpen = true;
            text = `Abierto Hoy (Sábado): ${colombiaTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Cierra a las 9:00 PM`;
          } else {
            isOpen = false;
            text = "Cerrado • Abre el Lunes a las 8:00 AM";
          }
        } else { // Monday - Thursday
          if (timeDecimal >= 8 && timeDecimal < 20) {
            isOpen = true;
            text = `Abierto Hoy (${currentDayName}): ${colombiaTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Cierra a las 8:00 PM`;
          } else {
            isOpen = false;
            text = "Cerrado • Abre mañana a las 8:00 AM";
          }
        }
      }

      setColombiaStatus({ isOpen, text, currentDayName });
    };

    updateColombiaTime();
    const interval = setInterval(updateColombiaTime, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [adminOverrideStatus, schedules]);

  // Filter services array from state
  const filteredServices = services.filter(service => {
    if (activeCategory === 'todos') return true;
    return service.category === activeCategory;
  });

  // Filter gallery array
  const filteredGallery = GALLERY.filter(item => {
    if (galleryFilter === 'todos') return true;
    return item.category === 'corte' || item.category === 'barba';
  });

  // Handle calculator service selection
  const toggleServiceInCalc = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Compile booking message for WhatsApp based on selection
  const handleCalculateBooking = () => {
    if (selectedServices.length === 0) return;
    // Reset inputs & open User Info dialog
    setBookingClientName('');
    setBookingClientPhone('');
    setBookingDateTime('');
    setShowUserBookingModal(true);
  };

  // Confirm booking state & dispatch to WhatsApp API
  const handleConfirmUserBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingClientName.trim() || !bookingClientPhone.trim() || !bookingDateTime) return;

    const totalPrice = selectedServices.reduce((acc, curr) => {
      const numericVal = curr.id === "1" ? 20000 : 
                         curr.id === "2" ? 25000 :
                         curr.id === "3" ? 15000 :
                         curr.id === "4" ? 18000 :
                         curr.id === "5" ? 45000 : 35000;
      return acc + numericVal;
    }, 0);

    const newBooking = {
      id: "app-" + Date.now(),
      clientName: bookingClientName,
      clientPhone: bookingClientPhone,
      dateTime: bookingDateTime,
      services: selectedServices,
      totalPrice: totalPrice,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newBooking, ...prev]);

    const serviceList = selectedServices.map(s => `• ${s.name} (${s.price})`).join('%0A');
    const formattedTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalPrice);
    const dateFormatted = new Date(bookingDateTime).toLocaleString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    const wpBase = `https://wa.me/573219098303?text=Hola%20Barber%20Classic%2076%20Studio%2C%20solicito%20agendamiento%20de%20cita%3A%0A%0A*Mis%20Datos%3A*%0A•%20Nombre%3A%20${encodeURIComponent(bookingClientName)}%0A•%20Contacto%3A%20${encodeURIComponent(bookingClientPhone)}%0A•%20Fecha%2FHora%20Deseada%3A%20${encodeURIComponent(dateFormatted)}%0A%0A*Servicios%20Elegidos%3A*%0A${serviceList}%0A%0A*Total%20Estimado%3A%20${formattedTotal}*%0A%C2%BFCuentan%20con%20agenda%20libre%3F`;
    window.open(wpBase, '_blank');
    
    setShowUserBookingModal(false);
    setSelectedServices([]);
  };

  // Add client-submitted review
  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const addedReview: Review = {
      id: String(reviews.length + 1),
      author: newAuthor,
      rating: newRating,
      text: newText,
      date: "Hace un momento",
      badge: "Cliente Verificado"
    };

    setReviews([addedReview, ...reviews]);
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
    setReviewSubmitted(true);
    
    // Auto reset submission screen after 4s
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowReviewModal(false);
    }, 4000);
  };

  // Form States for service addition
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcDesc, setNewSvcDesc] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState('$ 20.000 COP');
  const [newSvcDuration, setNewSvcDuration] = useState('30 min');
  const [newSvcCategory, setNewSvcCategory] = useState<'corte' | 'barba' | 'combo' | 'especial'>('corte');

  // Form States for manual appointment additions
  const [newApptClient, setNewApptClient] = useState('');
  const [newApptPhone, setNewApptPhone] = useState('');
  const [newApptDateTime, setNewApptDateTime] = useState('');
  const [newApptServices, setNewApptServices] = useState<string[]>([]);

  if (isAdmin) {
    const pendingAppointments = appointments.filter(a => a.status === 'Pendiente');
    const confirmedCount = appointments.filter(a => a.status === 'Confirmada').length;
    const completedCount = appointments.filter(a => a.status === 'Completada').length;
    
    // Projections
    const totalEstRevenue = appointments
      .filter(a => a.status === 'Confirmada' || a.status === 'Completada')
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    const formattedRevenue = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalEstRevenue);

    // Form submission walk-ins
    const handleAddManualAppt = (e: FormEvent) => {
      e.preventDefault();
      if (!newApptClient.trim() || !newApptPhone.trim() || !newApptDateTime || newApptServices.length === 0) {
        alert("Por favor completa los campos y selecciona al menos 1 servicio");
        return;
      }

      const selectedSvcs = services.filter(s => newApptServices.includes(s.id));
      const calculatedPrice = selectedSvcs.reduce((acc, curr) => {
        const numericVal = curr.id === "1" ? 20000 : 
                           curr.id === "2" ? 25000 :
                           curr.id === "3" ? 15000 :
                           curr.id === "4" ? 18000 :
                           curr.id === "5" ? 45000 : 35000;
        return acc + numericVal;
      }, 0);

      const manualAppt = {
        id: "app-manual-" + Date.now(),
        clientName: newApptClient,
        clientPhone: newApptPhone,
        dateTime: newApptDateTime,
        services: selectedSvcs,
        totalPrice: calculatedPrice,
        status: 'Confirmada',
        createdAt: new Date().toISOString()
      };

      setAppointments([manualAppt, ...appointments]);
      setNewApptClient('');
      setNewApptPhone('');
      setNewApptDateTime('');
      setNewApptServices([]);
    };

    // Catalog item submission
    const handleAddManualService = (e: FormEvent) => {
      e.preventDefault();
      if (!newSvcName.trim() || !newSvcDesc.trim()) return;

      const newSvc: Service = {
        id: "svc-custom-" + Date.now(),
        name: newSvcName,
        description: newSvcDesc,
        price: newSvcPrice,
        duration: newSvcDuration,
        category: newSvcCategory,
        featured: false
      };

      setServices([...services, newSvc]);
      setNewSvcName('');
      setNewSvcDesc('');
      setNewSvcPrice('$ 20.000 COP');
      setNewSvcDuration('30 min');
      setNewSvcCategory('corte');
    };

    return (
      <div className="min-h-screen bg-[#070707] text-stone-200 font-sans selection:bg-gold-500 selection:text-stone-950 flex flex-col">
        {/* Admin Header */}
        <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-gold-500 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h1 className="font-serif font-extrabold text-white text-base tracking-widest uppercase">
                Classic 76 • Centro CRM de Control
              </h1>
              <p className="text-[10px] text-gold-500/80 font-mono tracking-widest">
                SESIÓN DE ADMINISTRACIÓN ACTIVA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sesión Segura Local
            </span>
            <button 
              onClick={() => setIsAdmin(false)}
              className="bg-stone-900 hover:bg-gold-500 hover:text-stone-950 text-gold-400 border border-gold-500/30 px-3.5 py-1.5 rounded text-xs font-serif font-bold uppercase transition duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Ver Web Pública</span>
            </button>
          </div>
        </header>

        {/* Panel layouts */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
          
          {/* Admin Menu */}
          <aside className="lg:col-span-3 border-r border-stone-900 bg-stone-950/40 p-5 space-y-4">
            <h3 className="text-[10px] font-mono tracking-widest text-stone-500 uppercase pb-2 border-b border-stone-800">
              Navegación CRM
            </h3>
            
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-1.5 text-xs">
              <button 
                onClick={() => setAdminTab('dashboard')}
                className={`px-4 py-2.5 rounded text-left flex items-center gap-2 whitespace-nowrap lg:w-full transition-all cursor-pointer ${
                  adminTab === 'dashboard' ? 'bg-gold-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900/50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dashboard de Métricas</span>
              </button>

              <button 
                onClick={() => setAdminTab('appointments')}
                className={`px-4 py-2.5 rounded text-left flex items-center gap-2 relative whitespace-nowrap lg:w-full transition-all cursor-pointer ${
                  adminTab === 'appointments' ? 'bg-gold-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900/50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitudes de Citas</span>
                {pendingAppointments.length > 0 && (
                  <span className={`ml-auto font-mono text-[9px] font-bold h-5 px-1.5 rounded-full flex items-center justify-center border ${
                    adminTab === 'appointments' ? 'bg-stone-950 text-gold-400 border-gold-500' : 'bg-gold-500 text-stone-950 border-gold-400'
                  }`}>
                    {pendingAppointments.length} Pnd
                  </span>
                )}
              </button>

              <button 
                onClick={() => setAdminTab('services')}
                className={`px-4 py-2.5 rounded text-left flex items-center gap-2 whitespace-nowrap lg:w-full transition-all cursor-pointer ${
                  adminTab === 'services' ? 'bg-gold-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900/50'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>Catálogo de Servicios</span>
              </button>

              <button 
                onClick={() => setAdminTab('reviews')}
                className={`px-4 py-2.5 rounded text-left flex items-center gap-2 whitespace-nowrap lg:w-full transition-all cursor-pointer ${
                  adminTab === 'reviews' ? 'bg-gold-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900/50'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Control de Reseñas</span>
              </button>

              <button 
                onClick={() => setAdminTab('settings')}
                className={`px-4 py-2.5 rounded text-left flex items-center gap-2 whitespace-nowrap lg:w-full transition-all cursor-pointer ${
                  adminTab === 'settings' ? 'bg-gold-500 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-900/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Ajustes de Horarios</span>
              </button>
            </nav>

            <div className="hidden lg:block pt-6 border-t border-stone-900">
              <span className="block text-[10px] text-stone-500 font-mono">
                DEPARTAMENTO DEL HUILA
              </span>
              <span className="block text-[9px] text-stone-600 font-mono mt-1 leading-relaxed">
                Classic 76, Garzón Huila, CO.<br />
                Los datos expuestos persisten en almacenamiento de navegador local.
              </span>
            </div>
          </aside>

          {/* Central Grid */}
          <main className="lg:col-span-9 p-6 overflow-y-auto max-h-[85vh]">
            
            {/* TAB 1: METRICS */}
            {adminTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="border-b border-stone-900 pb-3">
                  <h2 className="font-serif text-white font-extrabold text-xl sm:text-2xl">Métricas de Rendimiento General</h2>
                  <p className="text-xs text-stone-400">Resumen administrativo del flujo actual de clientes e ingresos proyectados.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-stone-900/50 border border-stone-850 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Ingreso Estimado</span>
                    <h4 className="font-serif font-bold text-2xl text-gold-400 mt-2">{formattedRevenue}</h4>
                    <span className="text-[9px] text-stone-500 block mt-1">Citas Confirmadas + Completadas</span>
                  </div>

                  <div className="bg-stone-900/50 border border-stone-850 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Solicitudes de Cita</span>
                    <div className="flex items-baseline space-x-2 mt-2 font-sans">
                      <h4 className="font-serif font-bold text-2xl text-white">{appointments.length}</h4>
                      {pendingAppointments.length > 0 && (
                        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                          {pendingAppointments.length} Pendientes
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-stone-500 block mt-1">Flujo general de agendamiento</span>
                  </div>

                  <div className="bg-stone-900/50 border border-stone-850 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase text-stone-400 font-sans">Servicios de Catálogo</span>
                    <h4 className="font-serif font-bold text-2xl text-white mt-2">{services.length}</h4>
                    <span className="text-[9px] text-stone-500 block mt-1">Tratamientos activos ofrecidos</span>
                  </div>

                  <div className="bg-stone-900/50 border border-stone-850 p-4 rounded-lg">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Opiniones del Studio</span>
                    <h4 className="font-serif font-bold text-2xl text-white mt-2">{reviews.length}</h4>
                    <span className="text-[9px] text-gold-400/95 block mt-1">★ 5.0 Calificación Promedio</span>
                  </div>
                </div>

                {/* Overrides */}
                <div className="bg-stone-900/20 border border-gold-500/20 rounded-lg p-5">
                  <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-stone-850/60 font-sans">
                    <ShieldCheck className="w-5 h-5 text-gold-500" />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Control Operacional de Barbería en Tiempo Real</h4>
                      <p className="text-[10px] text-stone-400">Fuerza manualmente el visualizador de apertura/cierre del Studio.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <button 
                      onClick={() => setAdminOverrideStatus('auto')}
                      className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        adminOverrideStatus === 'auto' 
                          ? 'bg-gold-500/10 border-gold-500 text-gold-400 shadow'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-[10px]">1. AUTOMÁTICO INTELIGENTE</span>
                      <span className="text-[9px] text-stone-500 mt-1 leading-relaxed">Sigue la zona horaria GMT-5 de Colombia según el horario de atención establecido.</span>
                    </button>

                    <button 
                      onClick={() => setAdminOverrideStatus('closed_emergency')}
                      className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        adminOverrideStatus === 'closed_emergency' 
                          ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-[10px]">2. CERRADO POR MANTENIMIENTO</span>
                      <span className="text-[9px] text-stone-500 mt-1 leading-relaxed">Fuerza cartel de "Cerrado por Mantenimiento Especial" en el banner principal.</span>
                    </button>

                    <button 
                      onClick={() => setAdminOverrideStatus('closed_admin')}
                      className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        adminOverrideStatus === 'closed_admin' 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-[10px]">3. CERRADO POR FESTIVO</span>
                      <span className="text-[9px] text-stone-500 mt-1 leading-relaxed">Fuerza "Cerrado Hoy por Gestión de Administración" de inmediato.</span>
                    </button>

                    <button 
                      onClick={() => setAdminOverrideStatus('open_special')}
                      className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        adminOverrideStatus === 'open_special' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow'
                          : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold block text-[10px]">4. HORARIO EXTRAORDINARIO</span>
                      <span className="text-[9px] text-stone-500 mt-1 leading-relaxed">Indica públicamente "Abierto hoy en Horario Especial" sin importar la hora.</span>
                    </button>
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded border border-stone-900 flex gap-3 text-xs font-light leading-relaxed">
                  <span className="text-gold-500 font-bold shrink-0 mt-0.5">💡</span>
                  <div>
                    <span className="font-bold text-stone-300 block mb-1">Nota del Sistema:</span>
                    Cualquier cambio realizado en las tarifas de servicios, horarios de atención, o reseñas aquí moderadas se traslada instantáneamente al sitio web de los clientes, asegurando sincronización completa.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPOINTMENTS */}
            {adminTab === 'appointments' && (
              <div className="space-y-6">
                <div className="border-b border-stone-900 pb-3">
                  <h2 className="font-serif text-white font-extrabold text-xl sm:text-2xl">Control de Solicitudes de Citas</h2>
                  <p className="text-xs text-stone-400">Verifica, confirma, completa o interactúa directamente con los turnos solicitados.</p>
                </div>

                <div className="bg-stone-900/30 border border-stone-900 p-5 rounded-lg space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Registrar Agendamiento Manual (Walk-in / Directo)</h4>
                  
                  <form onSubmit={handleAddManualAppt} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-stone-400 mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={newApptClient}
                        onChange={(e) => setNewApptClient(e.target.value)}
                        placeholder="Alejandro Restrepo"
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Celular / WhatsApp (sin +)</label>
                      <input 
                        type="text" 
                        value={newApptPhone}
                        onChange={(e) => setNewApptPhone(e.target.value)}
                        placeholder="3124567890"
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Fecha / Hora Propuesta</label>
                      <input 
                        type="datetime-local" 
                        value={newApptDateTime}
                        onChange={(e) => setNewApptDateTime(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Servicio Directo</label>
                      <select 
                        multiple
                        value={newApptServices}
                        onChange={(e) => {
                          const options = Array.from(e.target.selectedOptions, o => o.value);
                          setNewApptServices(options);
                        }}
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100 h-10 overflow-y-auto"
                        required
                      >
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.price})</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                      <button 
                        type="submit"
                        className="bg-gold-500 hover:bg-gold-600 px-5 py-2 text-stone-950 rounded font-bold uppercase transition cursor-pointer"
                      >
                        Insertar en Agenda Directa
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-stone-950 rounded border border-stone-900 overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#0e0e0e] text-stone-400 border-b border-stone-900 uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Fecha y Hora Solicitada</th>
                        <th className="p-3">Tratamientos</th>
                        <th className="p-3">Precio Estimado</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3 text-right">Manejo Operacional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900">
                      {appointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-500 font-mono">
                            No hay solicitudes dadas de alta por el momento.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-stone-900/30 transition">
                            <td className="p-3">
                              <span className="block font-bold text-white">{appt.clientName}</span>
                              <span className="block text-[10px] text-stone-500 font-mono">{appt.clientPhone}</span>
                            </td>
                            <td className="p-3">
                              <span className="block text-stone-300 font-medium font-mono text-[11px]">
                                {new Date(appt.dateTime).toLocaleString('es-CO', {
                                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              <span className="block text-[9px] text-stone-500 font-mono">
                                Recibido: {new Date(appt.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-3 max-w-[200px] truncate">
                              <span className="block text-stone-300">
                                {appt.services.map((s: any) => s.name).join(', ')}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-gold-400 font-mono font-bold">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(appt.totalPrice)}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-bold uppercase ${
                                appt.status === 'Pendiente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                appt.status === 'Confirmada' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                appt.status === 'Completada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {appt.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              {appt.status === 'Pendiente' && (
                                <button 
                                  onClick={() => {
                                    const updated = appointments.map(a => a.id === appt.id ? {...a, status: 'Confirmada'} : a);
                                    setAppointments(updated);
                                  }}
                                  className="p-1 px-1.5 rounded bg-[#1a1a3a] border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-indigo-300 text-[10px] cursor-pointer"
                                >
                                  ✔ Confirmar
                                </button>
                              )}
                              {appt.status !== 'Completada' && appt.status !== 'Cancelada' && (
                                <button 
                                  onClick={() => {
                                    const updated = appointments.map(a => a.id === appt.id ? {...a, status: 'Completada'} : a);
                                    setAppointments(updated);
                                  }}
                                  className="p-1 px-1.5 rounded bg-[#13301d] border border-emerald-500/30 hover:bg-emerald-600 hover:text-white text-emerald-300 text-[10px] cursor-pointer"
                                >
                                  ✂ Completar
                                </button>
                              )}
                              {appt.status !== 'Cancelada' && appt.status !== 'Completada' && (
                                <button 
                                  onClick={() => {
                                    const updated = appointments.map(a => a.id === appt.id ? {...a, status: 'Cancelada'} : a);
                                    setAppointments(updated);
                                  }}
                                  className="p-1 px-1.5 rounded bg-[#3a1a1a] border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-300 text-[10px] cursor-pointer"
                                >
                                  ✕ Cancelar
                                </button>
                              )}

                              <a 
                                href={`https://wa.me/57${appt.clientPhone}?text=Hola%20${encodeURIComponent(appt.clientName)}%2C%20le%20escribimos%20de%20Barber%2520Classic%252076%2520Studio%20con%20respecto%20a%20su%20solicitud%20de%20cita...`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block p-1 px-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] cursor-pointer"
                              >
                                💬 WhatsApp
                              </a>

                              <button 
                                onClick={() => {
                                  if (confirm("¿Estás seguro de eliminar este registro histórico?")) {
                                    setAppointments(appointments.filter(a => a.id !== appt.id));
                                  }
                                }}
                                className="p-1 rounded bg-stone-900 border border-stone-800 text-stone-500 hover:text-rose-450 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {adminTab === 'services' && (
              <div className="space-y-6">
                <div className="border-b border-stone-900 pb-3">
                  <h2 className="font-serif text-white font-extrabold text-xl sm:text-2xl">Gestión del Catálogo de Servicios</h2>
                  <p className="text-xs text-stone-400">Añade, edita tarifas, ajusta descripciones o elimina servicios del portafolio en tiempo real.</p>
                </div>

                <div className="bg-stone-900/30 border border-stone-900 p-5 rounded-lg space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Añadir Nuevo Tratamiento al Catálogo</h4>
                  
                  <form onSubmit={handleAddManualService} className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-stone-400 mb-1">Nombre</label>
                      <input 
                        type="text" 
                        value={newSvcName}
                        onChange={(e) => setNewSvcName(e.target.value)}
                        placeholder="Corte Pompadour Elite"
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Tarifa (ej. $ 22.000 COP)</label>
                      <input 
                        type="text" 
                        value={newSvcPrice}
                        onChange={(e) => setNewSvcPrice(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Duración Relativa</label>
                      <input 
                        type="text" 
                        value={newSvcDuration}
                        onChange={(e) => setNewSvcDuration(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Categoría</label>
                      <select 
                        value={newSvcCategory}
                        onChange={(e) => setNewSvcCategory(e.target.value as any)}
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                      >
                        <option value="corte">Cortes de Cabello</option>
                        <option value="barba">Estilo de Barba</option>
                        <option value="combo">Combos Especiales</option>
                        <option value="especial">Tratamientos Exclusivos</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button 
                        type="submit"
                        className="w-full bg-gold-500 hover:bg-gold-600 py-3 rounded text-stone-950 font-bold uppercase transition block cursor-pointer"
                      >
                        Agregar Servicio
                      </button>
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-stone-400 mb-1">Descripción Breve de la Técnica</label>
                      <input 
                        type="text" 
                        value={newSvcDesc}
                        onChange={(e) => setNewSvcDesc(e.target.value)}
                        placeholder="Corte de precisión degradado con navaja, lavado capilar premium y masaje acondicionador."
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                  </form>
                </div>

                <div className="bg-stone-950 rounded border border-stone-900 overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#0e0e0e] text-stone-400 border-b border-stone-900 uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="p-3">Categoría</th>
                        <th className="p-3">Servicio</th>
                        <th className="p-3">Duración Est.</th>
                        <th className="p-3">Tarifa / Precio</th>
                        <th className="p-3 text-right">Mantenimiento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900">
                      {services.map((svc) => (
                        <tr key={svc.id} className="hover:bg-stone-900/30 transition">
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 font-mono text-[9px] uppercase tracking-wider">
                              {svc.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-white block">{svc.name}</span>
                            <span className="text-[10px] text-stone-500 block leading-relaxed">{svc.description}</span>
                          </td>
                          <td className="p-3 font-mono font-medium text-stone-300">
                            {svc.duration}
                          </td>
                          <td className="p-3 font-mono text-gold-400 font-bold">
                            {svc.price}
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                if (confirm(`¿Estás seguro de quitar "${svc.name}" permanentemente del sitio público?`)) {
                                  setServices(services.filter(s => s.id !== svc.id));
                                }
                              }}
                              className="p-1 px-2 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded cursor-pointer"
                            >
                              Eliminar Svc
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {adminTab === 'reviews' && (
              <div className="space-y-6">
                <div className="border-b border-stone-900 pb-3">
                  <h2 className="font-serif text-white font-extrabold text-xl sm:text-2xl">Control y Moderación de Reseñas</h2>
                  <p className="text-xs text-stone-400">Inspecciona y modera opiniones mostradas en la pantalla principal de Barbería Classic 76.</p>
                </div>

                <div className="bg-stone-900/30 border border-stone-900 p-5 rounded-lg space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Importar Reseña de Cliente Satisfecho (Offline/Google)</h4>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const author = (e.currentTarget.elements.namedItem('revAuthor') as HTMLInputElement).value;
                      const stars = Number((e.currentTarget.elements.namedItem('revStars') as HTMLSelectElement).value);
                      const msg = (e.currentTarget.elements.namedItem('revMsg') as HTMLTextAreaElement).value;
                      
                      if (!author.trim() || !msg.trim()) return;

                      const importComment = {
                        id: "rev-import-" + Date.now(),
                        author: author,
                        rating: stars,
                        text: msg,
                        date: "Hace 1 semana",
                        badge: "Cliente Certificado"
                      };

                      setReviews([importComment, ...reviews]);
                      (e.currentTarget.elements.namedItem('revAuthor') as HTMLInputElement).value = '';
                      (e.currentTarget.elements.namedItem('revMsg') as HTMLTextAreaElement).value = '';
                    }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans"
                  >
                    <div>
                      <label className="block text-stone-400 mb-1">Autor / Cliente</label>
                      <input 
                        name="revAuthor"
                        type="text" 
                        placeholder="Juan Carlos Valenzuela"
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Calificación Estrellas</label>
                      <select 
                        name="revStars"
                        className="w-full bg-stone-950 border border-stone-850 p-2.5 rounded text-stone-100 font-bold"
                        defaultValue="5"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 de 5 Estrellas</option>
                        <option value="4">⭐⭐⭐⭐ 4 de 5 Estrellas</option>
                        <option value="3">⭐⭐⭐ 3 de 5 Estrellas</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                      <button 
                        type="submit"
                        className="w-full bg-gold-500 hover:bg-gold-600 py-3 rounded text-stone-950 font-bold uppercase transition block cursor-pointer"
                      >
                        Importar Opinión Certificada
                      </button>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-stone-400 mb-1">Comentario Expresado</label>
                      <textarea 
                        name="revMsg"
                        rows={2}
                        placeholder="El mejor servicio de corte de pelo de Garzón Huila, excelente toalla caliente..."
                        className="w-full bg-stone-950 border border-stone-840 p-2.5 rounded text-stone-100"
                        required
                      />
                    </div>
                  </form>
                </div>

                <div className="bg-stone-950 rounded border border-stone-900 overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#0e0e0e] text-stone-400 border-b border-stone-900 uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="p-3">Autor</th>
                        <th className="p-3">Mensaje</th>
                        <th className="p-3">Estrellas</th>
                        <th className="p-3 text-right">Moderación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 text-xs">
                      {reviews.map((rev) => (
                        <tr key={rev.id} className="hover:bg-stone-900/30 transition">
                          <td className="p-3 font-bold text-white whitespace-nowrap">
                            {rev.author}
                            {rev.badge && (
                              <span className="block text-[8px] tracking-wider text-gold-400/80 font-mono font-sans mt-0.5">
                                • {rev.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-3 max-w-sm font-light text-stone-300 italic whitespace-normal leading-relaxed">
                            "{rev.text}"
                          </td>
                          <td className="p-3 font-mono font-bold text-xs text-gold-400">
                            {"★".repeat(rev.rating)}
                          </td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                if (confirm(`¿Quitar la reseña de "${rev.author}"?`)) {
                                  setReviews(reviews.filter(r => r.id !== rev.id));
                                }
                              }}
                              className="p-1 px-2 bg-stone-900 text-stone-400 border border-stone-850 hover:text-white rounded hover:bg-rose-600 cursor-pointer text-[11px]"
                            >
                              ✕ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: HOURS */}
            {adminTab === 'settings' && (
              <div className="space-y-6">
                <div className="border-b border-stone-900 pb-3">
                  <h2 className="font-serif text-white font-extrabold text-xl sm:text-2xl">Mantenimiento de Horarios de Atención</h2>
                  <p className="text-xs text-stone-400">Edita las horas de apertura y configure si el negocio está cerrado de manera programada día por día.</p>
                </div>

                <div className="bg-stone-950 p-4 border border-stone-900 rounded-lg text-xs leading-relaxed space-y-4 font-sans">
                  {schedules.map((sched, idx) => {
                    return (
                      <div key={sched.day} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-stone-900 last:border-0">
                        <div className="w-24">
                          <span className="font-serif font-bold text-white text-sm">{sched.day}</span>
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <input 
                            type="text" 
                            value={sched.hours}
                            onChange={(e) => {
                              const updated = [...schedules];
                              updated[idx].hours = e.target.value;
                              setSchedules(updated);
                            }}
                            className="bg-stone-900 text-white border border-stone-850 p-2 rounded text-xs w-full sm:w-64"
                            disabled={sched.isClosed}
                          />

                          <label className="flex items-center gap-2 text-stone-400 cursor-pointer select-none text-[11px] whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              checked={sched.isClosed}
                              onChange={(e) => {
                                const updated = [...schedules];
                                updated[idx].isClosed = e.target.checked;
                                if (e.target.checked) updated[idx].hours = "Cerrado completo";
                                else updated[idx].hours = "8:00 AM - 8:00 PM";
                                setSchedules(updated);
                              }}
                              className="accent-gold-500 text-stone-950 h-4 w-4 rounded border-stone-800 bg-stone-950"
                            />
                            <span>Marcar día como Cerrado</span>
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-sans font-bold">
                    <Check className="w-4 h-4" />
                    <span>Los horarios se guardan automáticamente e impactan en la web pública.</span>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-gold-500 selection:text-stone-900">
      
      {/* 1. HEADER & PREMIUM NAVBAR */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="#inicio" className="flex items-center space-x-3 group" id="nav-logo">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-stone-900 to-black border border-gold-500/50 group-hover:border-gold-500 transition-colors duration-300">
                <Scissors className="w-6 h-6 text-gold-500" />
                <span className="absolute -bottom-1 text-[8px] tracking-widest bg-stone-950 px-1 border border-gold-500/20 text-gold-400 font-serif font-bold">76</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-wider text-white group-hover:text-gold-500 transition-colors duration-300">
                  BARBER CLASSIC 76
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
                  Studio • Garzón, Huila
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-5 text-sm font-medium">
              <a href="#inicio" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Inicio</a>
              <a href="#servicios" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Servicios</a>
              <a href="#nosotros" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Nosotros</a>
              <a href="#opiniones" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Opiniones</a>
              <a href="#galeria" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Galería</a>
              <a href="#contacto" className="px-3 py-2 text-stone-300 hover:text-gold-400 hover:bg-stone-900/50 rounded-md transition duration-200">Ubicación</a>
            </nav>

            {/* Desktop Action Key Button */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Dynamic open hours flag in header */}
              <div className="flex items-center space-x-2 bg-stone-900/80 px-3 py-1.5 rounded-full border border-stone-800 text-xs text-stone-300 font-medium font-sans">
                <span className={`w-2.5 h-2.5 rounded-full ${colombiaStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span>{colombiaStatus.isOpen ? 'Abierto' : 'Cerrado'}</span>
              </div>
              
              {/* Dynamic Admin Lock Trigger Button */}
              <button
                onClick={() => {
                  if (isAdmin) {
                    setIsAdmin(false); // Quick double toggle to sign out
                  } else {
                    setPasscodeInput('');
                    setPasscodeError('');
                    setShowPasscodeModal(true);
                  }
                }}
                className={`flex items-center justify-center p-2.5 rounded border text-stone-300 hover:text-gold-400 hover:border-gold-500/40 cursor-pointer active:scale-95 transition-all duration-150 ${
                  isAdmin ? 'bg-emerald-500/10 border-emerald-500/45 text-emerald-400 hover:text-emerald-300' : 'bg-stone-900/80 border-stone-800'
                }`}
                title={isAdmin ? "Cerrar Modo Admin" : "Entrar a Modo Admin"}
                id="btn-admin-trigger"
              >
                {isAdmin ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
              </button>

              <a 
                href={CONTACT_INFO.whatsappMessageUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gold-500 text-stone-950 font-serif font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded hover:bg-gold-400 active:scale-95 transition-all duration-200 border border-gold-400/20 flex items-center gap-1.5 shadow-lg shadow-gold-500/10"
                id="btn-nav-booking"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Cita</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${colombiaStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-stone-300">{colombiaStatus.isOpen ? 'Abierto' : 'Cerrado'}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-300 hover:text-gold-500 transition-colors"
                aria-label="Abrir menú"
                id="btn-mobile-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-stone-950 border-t border-stone-900 overflow-hidden"
              id="mobile-drawer"
            >
              <div className="px-4 pt-3 pb-6 space-y-2 flex flex-col">
                <a 
                  href="#inicio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Inicio
                </a>
                <a 
                  href="#servicios" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Servicios
                </a>
                <a 
                  href="#nosotros" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Sobre Nosotros
                </a>
                <a 
                  href="#opiniones" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Opiniones de Clientes
                </a>
                <a 
                  href="#galeria" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Galería de Estilos
                </a>
                <a 
                  href="#contacto" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-stone-200 hover:text-gold-400 hover:bg-stone-900/50 rounded-lg text-base font-medium transition"
                >
                  Ubicación & Horarios
                </a>
                
                <div className="pt-4 border-t border-stone-900 space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (isAdmin) {
                        setIsAdmin(false);
                      } else {
                        setPasscodeInput('');
                        setPasscodeError('');
                        setShowPasscodeModal(true);
                      }
                    }}
                    className={`w-full py-2 rounded font-mono text-center flex items-center justify-center gap-1.5 text-xs border tracking-wider transition ${
                      isAdmin 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                        : 'bg-stone-900 border-stone-850 text-stone-300 hover:text-white'
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>CERRAR ADMIN</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>INGRESAR COMO ADMIN (76🔒)</span>
                      </>
                    )}
                  </button>
                  <a 
                    href={CONTACT_INFO.whatsappMessageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-gold-500 text-stone-950 py-3 rounded font-serif font-bold text-center block tracking-wider uppercase text-sm hover:bg-gold-400 transition"
                  >
                    Agendar Cita Vía WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* 2. HERO SECTION */}
      <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-black/85 to-stone-950 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1920" 
            alt="Barber Shop Interior" 
            className="w-full h-full object-cover opacity-35 object-center saturate-50 scale-105 motion-safe:animate-pulse-slow"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          
          {/* Tagline Social Proof */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-stone-900/90 border border-gold-500/35 px-4 py-2 rounded-full text-gold-400 text-xs tracking-wider uppercase font-medium backdrop-blur mb-6 sm:mb-8"
          >
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-white border-l border-stone-700 pl-2 font-mono">Calificación 5.0 Estrellas (Clientes Reales)</span>
          </motion.div>

          {/* Majestic Title */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-white"
          >
            Estilo Clásico, <br />
            <span className="gold-gradient inline-block mt-2 relative">
              Perfección Moderna
              {/* Gold underline decorative item */}
              <span className="absolute left-0 bottom-0.5 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:max-w-2xl mx-auto text-stone-300 mt-6 text-sm sm:text-lg lg:text-xl font-light leading-relaxed font-sans"
          >
            La mejor barbería en Garzón, Huila. Experimenta cortes prémium hechos con absoluta precisión por manos expertas, bajo estrictas normas de higiene y en el mejor ambiente.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12"
          >
            <a 
              href={CONTACT_INFO.whatsappMessageUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-stone-950 font-serif font-extrabold tracking-widest uppercase text-xs sm:text-sm px-8 py-4 sm:py-4.5 rounded shadow-xl shadow-gold-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 border border-gold-400"
              id="cta-whatsapp-hero"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Agendar por WhatsApp</span>
            </a>
            
            <a 
              href={CONTACT_INFO.googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-stone-900/90 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm px-8 py-4 sm:py-4.5 rounded border border-stone-800 hover:border-gold-500/50 transition-all duration-200 flex items-center justify-center gap-2"
              id="cta-maps-hero"
            >
              <MapPin className="w-4 h-4 text-gold-500" />
              <span>¿Cómo llegar al Studio?</span>
            </a>
          </motion.div>

          {/* Business Core Strengths (Fast stats strip) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-8 border-t border-stone-900/80 text-left"
          >
            <div className="flex items-start space-x-3 bg-stone-900/30 p-2.5 rounded-lg border border-stone-900/20">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-xs font-semibold font-serif tracking-wide uppercase">Higiene Estricta</h4>
                <p className="text-stone-400 text-[11px] mt-0.5 leading-tight">100% herramientas esterilizadas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-stone-900/30 p-2.5 rounded-lg border border-stone-900/20">
              <Star className="w-5 h-5 text-gold-500 shrink-0 mt-0.5 fill-gold-500" />
              <div>
                <h4 className="text-white text-xs font-semibold font-serif tracking-wide uppercase">Opiniones 5.0 ★</h4>
                <p className="text-stone-400 text-[11px] mt-0.5 leading-tight">La máxima valoración local</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-stone-900/30 p-2.5 rounded-lg border border-stone-900/20">
              <Coffee className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-xs font-semibold font-serif tracking-wide uppercase">Café Huilense</h4>
                <p className="text-stone-400 text-[11px] mt-0.5 leading-tight">Cortesía de café de origen</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-stone-900/30 p-2.5 rounded-lg border border-stone-900/20">
              <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-xs font-semibold font-serif tracking-wide uppercase">Atención Sin Prisa</h4>
                <p className="text-stone-400 text-[11px] mt-0.5 leading-tight">Trabajos con detalle y pasión</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Diagonal Section Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-950 to-transparent z-10" />
      </section>


      {/* 3. COLOMBIA HOURS STATUS BAR */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 py-4.5 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className={`flex h-3.5 w-3.5 rounded-full ${colombiaStatus.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className={`animate-ping absolute top-0 inline-flex h-3.5 w-3.5 rounded-full opacity-75 ${colombiaStatus.isOpen ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-semibold tracking-wider text-white font-mono uppercase">
                  {colombiaStatus.text}
                </p>
                <p className="text-[10px] text-stone-400">
                  Ubicación física: {CONTACT_INFO.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400 text-xs">¿Prefieres reservar una hora específica?</span>
              <a 
                href={CONTACT_INFO.whatsappMessageUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-gold-500 hover:text-white transition-colors duration-150 inline-flex items-center font-serif text-xs font-bold gap-1 uppercase"
                id="hours-reserve-link"
              >
                <span>Chatear ahora</span>
                <ChevronRight className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* 4. SERVICES SECTION (WITH INTEGRATED BOOKING CONVERSION PLANNER) */}
      <section id="servicios" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex justify-center items-center space-x-1.5 bg-stone-900/80 px-3.5 py-1.5 rounded-full border border-stone-800 text-gold-500 text-xs tracking-widest font-mono uppercase mb-4">
            <Scissors className="w-3.5 h-3.5" />
            <span>Nuestra Carta de Servicios</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            Servicios Hechos con <br />
            <span className="gold-gradient inline-block">Pasión Barbera</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-4 max-w-xl mx-auto font-light leading-relaxed">
            Cada tratamiento combina técnicas clásicas tradicionales con estilos contemporáneos para garantizar un resultado de máxima excelencia.
          </p>

          {/* Service Categories Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 md:mt-10">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'corte', label: 'Cortes' },
              { id: 'barba', label: 'Barbas' },
              { id: 'combo', label: 'Combos' },
              { id: 'especial', label: 'Especiales / Diseños' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 border ${
                  activeCategory === cat.id 
                    ? 'bg-gold-500 text-stone-950 border-gold-500 font-semibold shadow-md shadow-gold-500/10' 
                    : 'bg-stone-900/60 text-stone-300 border-stone-800/80 hover:border-gold-500/40'
                }`}
                id={`filter-srv-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Split: Left column - Interactive Catalog, Right column - WhatsApp Booking Creator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Services Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={service.id}
                    className={`p-6 rounded-lg transition-all duration-300 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative group hover:-translate-y-0.5 ${
                      isSelected 
                        ? 'bg-stone-900 border-gold-500 gold-border-glow' 
                        : 'bg-stone-900/30 border-stone-900/70 hover:bg-stone-900/50 hover:border-stone-800'
                    }`}
                    id={`service-card-${service.id}`}
                  >
                    {/* Visual Tag for Category */}
                    <div className="absolute top-2 right-4 text-[9px] font-mono tracking-widest text-gold-500/60 uppercase">
                      {service.category === 'corte' ? 'CORTE' : service.category === 'barba' ? 'CUIDADO' : service.category === 'combo' ? 'RECOMENDADO' : 'STUDIO 76'}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gold-500 text-sm font-semibold font-serif">#{index + 1}</span>
                        <h3 className="font-serif font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-stone-400 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
                        {service.description}
                      </p>
                      
                      {/* Meta duration & info */}
                      <div className="flex items-center gap-4 mt-3 text-stone-500 text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-500/80" />
                          <span>{service.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-gold-500/80" />
                          <span>Esterilización UV</span>
                        </span>
                      </div>
                    </div>

                    {/* Price and CTA Checkbox */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-stone-805/30 pt-4 sm:pt-0 shrink-0 gap-3">
                      <div className="text-right">
                        <span className="block text-[10px] text-stone-500 font-mono tracking-wider uppercase">Inversión</span>
                        <span className="text-xl font-serif text-gold-400 font-bold tracking-tight">{service.price}</span>
                      </div>
                      
                      {/* Booking Selector Button */}
                      <button 
                        onClick={() => toggleServiceInCalc(service)}
                        className={`px-4.5 py-2.5 rounded text-xs tracking-wider uppercase font-serif font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected 
                            ? 'bg-gold-500 text-stone-950 hover:bg-gold-400' 
                            : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-gold-500/50 hover:text-white'
                        }`}
                        id={`btn-select-srv-${service.id}`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Seleccionado</span>
                          </>
                        ) : (
                          <>
                            <span>Agregar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Column: Premium Interactive Calculator Applet (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-stone-900 border border-gold-500/20 rounded-lg p-6 relative overflow-hidden shadow-2xl">
              
              {/* Decorative radial premium backdrop */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 rounded-full bg-gold-500/5 blur-3xl" />
              
              <div className="flex items-center space-x-2 text-gold-500 mb-4 bg-stone-950/60 p-2 rounded-lg border border-stone-800">
                <Calculator className="w-5 h-5 shrink-0 text-gold-500" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#fdfdd6]">
                  PLANIFICADOR DE RESERVAS
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-white">
                Diseña tu Experiencia
              </h3>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Selecciona uno o más servicios de nuestra lista de la izquierda para estimar el costo total, planificar tu tiempo y reservar directamente.
              </p>

              {/* Selection Items Counter */}
              <div className="mt-6 space-y-3.5 border-t border-b border-stone-800/80 py-5">
                {selectedServices.length === 0 ? (
                  <div className="text-center py-6 text-stone-500 bg-black/20 rounded border border-dashed border-stone-800">
                    <Scissors className="w-8 h-8 text-stone-700 mx-auto stroke-[1.5] animate-bounce" />
                    <p className="text-xs mt-2 font-mono">No has seleccionado servicios</p>
                    <p className="text-[10px] text-stone-600 px-4 mt-1">Dale click a "Agregar" a cualquier servicio a tu izquierda.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedServices.map(srv => {
                      return (
                        <div key={srv.id} className="flex justify-between items-center text-xs bg-stone-950 p-2.5 rounded border border-stone-800">
                          <div className="font-medium text-stone-200 truncate pr-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            <span>{srv.name}</span>
                          </div>
                          <div className="text-right shrink-0 flex items-center space-x-2">
                            <span className="text-gold-400 font-serif font-semibold">{srv.price}</span>
                            <button 
                              onClick={() => toggleServiceInCalc(srv)}
                              className="text-stone-500 hover:text-rose-400 font-extrabold text-[10px]"
                              title="Remover"
                              id={`remove-calc-${srv.id}`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total Block */}
              {selectedServices.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-stone-500">Servicios seleccionados:</span>
                    <span className="text-white font-medium">{selectedServices.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-stone-500">Duración aproximada:</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-500" />
                      <span>
                        {selectedServices.reduce((acc, curr) => {
                          const val = parseInt(curr.duration.replace(/[^0-9]/g, ''), 10);
                          return acc + val;
                        }, 0)} mins
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-end bg-stone-950 p-3 rounded border border-stone-800 mt-4">
                    <span className="text-xs text-stone-400 font-serif tracking-wider uppercase font-bold">Inversión Estimada:</span>
                    <span className="text-2xl font-serif text-gold-400 font-extrabold tracking-tight">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
                        selectedServices.reduce((acc, curr) => {
                          const numericVal = curr.id === "1" ? 20000 : 
                                             curr.id === "2" ? 25000 :
                                             curr.id === "3" ? 15000 :
                                             curr.id === "4" ? 18000 :
                                             curr.id === "5" ? 45000 : 35000;
                          return acc + numericVal;
                        }, 0)
                      )}
                    </span>
                  </div>

                  {/* Booking Action Button */}
                  <button
                    onClick={handleCalculateBooking}
                    className="w-full bg-gold-400 hover:bg-gold-500 cursor-pointer text-stone-950 font-serif font-extrabold tracking-wider text-xs uppercase py-3.5 rounded mt-4 transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-gold-500/10"
                    id="btn-submit-planner"
                  >
                    <span>Reservar a través de WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-stone-500 text-center font-mono mt-2">
                    Esto compila tus servicios y los envía vía WhatsApp para su ágil agendamiento con el equipo.
                  </p>
                </div>
              )}

              {selectedServices.length === 0 && (
                <div className="mt-4">
                  <a
                    href={CONTACT_INFO.whatsappMessageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-stone-950 text-stone-200 border border-stone-800 hover:border-gold-500 hover:text-white font-serif font-bold text-xs uppercase tracking-widest text-center block py-3.5 rounded transition duration-200"
                    id="btn-direct-wp"
                  >
                    Reserva Directa Sin Planificador
                  </a>
                  <p className="text-[10px] text-stone-500 text-center mt-2 leading-relaxed">
                    Si sabes exactamente lo que requieres, haz clic para contactar directamente a nuestros barberos.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </section>


      {/* 5. OVER US SECTION (SOBRE NOSOTROS) */}
      <section id="nosotros" className="relative py-24 sm:py-32 bg-stone-900/40 border-t border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Panel - Legacy Scissors Representation */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-gold-500/20 shadow-2xl">
                <div className="absolute inset-0 bg-stone-950/40 mix-blend-multiply z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800" 
                  alt="Herramientas clásicas de barbería" 
                  className="w-full h-full object-cover saturate-40 scale-102"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded Floating Badges */}
                <div className="absolute bottom-6 left-6 z-20 bg-stone-950/95 border border-gold-500/30 p-4.5 rounded shadow-xl backdrop-blur-md max-w-xs">
                  <span className="font-serif font-bold text-sm text-gold-400 block tracking-wider uppercase mb-1">
                    Acondicionado de Barba
                  </span>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Utilizamos lociones artesanales e hidratantes específicas que recuperan e higienizan cada vello facial con precisión absoluta.
                  </p>
                </div>
              </div>

              {/* Decorative behind border */}
              <div className="absolute -top-3 -left-3 w-2/3 h-23 border-l border-t border-gold-500/30" />
              <div className="absolute -bottom-3 -right-3 w-1/3 h-23 border-r border-b border-gold-500/30" />
            </div>

            {/* Description Narrative */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              <div className="inline-flex items-center space-x-1.5 bg-stone-900 border border-stone-850 px-3.5 py-1.5 rounded-full text-gold-500 text-xs tracking-widest font-mono uppercase">
                <BadgeCheck className="w-4 h-3.5" />
                <span>Nuestra Tradición</span>
              </div>

              <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                El Arte Clásico de la <br />
                <span className="gold-gradient inline-block">Navaja y la Tijera</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                En <strong>Barber Classic 76 Studio</strong>, ubicado en el centro neurálgico de Garzón, Huila, creemos que un corte no es un mero trámite, sino un ritual dedicado a potenciar tu imagen y brindarte un espacio de confort sin igual.
              </p>

              <p className="text-stone-400 text-sm leading-relaxed font-light">
                Nuestro compromiso inquebrantable se basa en tres pilares de oro:
              </p>

              {/* Pillars list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <h4 className="font-serif text-white text-sm font-bold tracking-wider uppercase">
                      Higiene Absoluta
                    </h4>
                  </div>
                  <p className="text-[12px] text-stone-400 leading-relaxed pl-3 font-light">
                    Sometemos cada tijera, portanavajas y peine a autoclaves de calor seco y esterilización UV para tu entera protección y tranquilidad.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <h4 className="font-serif text-white text-sm font-bold tracking-wider uppercase">
                      Calidez & Buena Atención
                    </h4>
                  </div>
                  <p className="text-[12px] text-stone-400 leading-relaxed pl-3 font-light">
                    Te recibimos con total agrado, música cuidadosamente seleccionada en vinilo digital y un aromático café artesanal local como cortesía.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <h4 className="font-serif text-white text-sm font-bold tracking-wider uppercase">
                      Maestría de Autor
                    </h4>
                  </div>
                  <p className="text-[12px] text-stone-400 leading-relaxed pl-3 font-light">
                    Analizamos las características físicas de tu rostro para elaborar cortes y barba optimizados, conservando tu esencia clásica.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                    <h4 className="font-serif text-white text-sm font-bold tracking-wider uppercase">
                      Cuidado Sostenible
                    </h4>
                  </div>
                  <p className="text-[12px] text-stone-400 leading-relaxed pl-3 font-light">
                    Uso exclusivo de aceites, ceras hidrosolubles y acondicionadores sin parabenos, enriquecidos para la salud capilar.
                  </p>
                </div>

              </div>

              {/* Experience strip */}
              <div className="border-t border-stone-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl sm:text-5xl font-serif font-extrabold text-gold-500">
                    5.0
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-white">Valoración Perfecta</span>
                    <span className="block text-[11px] text-stone-400 leading-none">Más de 48 opiniones unánimes en Google</span>
                  </div>
                </div>
                
                <a 
                  href={CONTACT_INFO.whatsappMessageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-transparent hover:bg-stone-900 border border-gold-500 text-gold-500 hover:text-white px-5 py-2.5 rounded font-serif font-bold text-xs uppercase tracking-wider transition-all duration-200 block text-center w-full sm:w-auto"
                  id="about-action-btn"
                >
                  Conoce Nuestro Equipo Vía Chat
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* 6. IMMERSIVE OPINIONES / TESTIMONIALS (WITH LIVE CLIENT ADDER) */}
      <section id="opiniones" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-stone-900 px-3.5 py-1.5 rounded-full text-gold-500 text-xs tracking-widest font-mono uppercase mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Testimonios Reales de Nuestro Studio</span>
            </div>
            
            <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-none">
              La Voz de <span className="gold-gradient inline-block">Nuestros Clientes</span>
            </h2>
            <p className="text-stone-400 mt-4 text-sm sm:text-base leading-relaxed font-light">
              Revisa las opiniones extraídas directamente de nuestro perfil de Google. Nuestra calificación de 5.0 es el resultado del amor por los detalles.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-3 bg-stone-900/40 border border-stone-850 p-4 rounded-lg">
            <div className="text-right">
              <span className="block text-[10px] text-stone-400 font-mono uppercase tracking-wider">Estrellas en Google</span>
              <span className="text-2xl font-serif text-white font-extrabold tracking-tight">5.0 / 5.0</span>
            </div>
            <div className="flex flex-col text-amber-400">
              <div className="flex">
                <Star className="w-4.5 h-4.5 fill-current text-gold-500" />
                <Star className="w-4.5 h-4.5 fill-current text-gold-500" />
                <Star className="w-4.5 h-4.5 fill-current text-gold-500" />
                <Star className="w-4.5 h-4.5 fill-current text-gold-500" />
                <Star className="w-4.5 h-4.5 fill-current text-gold-500" />
              </div>
              <span className="text-[9px] text-[#fdfaa9] mt-1 text-center font-mono uppercase">100% Muy Recomendado</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              key={review.id}
              className="bg-stone-900/30 border border-stone-900 hover:border-stone-800 p-6 rounded-lg relative flex flex-col justify-between transition-all duration-200 group hover:bg-stone-900/50"
              id={`review-card-${review.id}`}
            >
              <div>
                {/* 5-Star system in review card */}
                <div className="flex items-center space-x-1 text-gold-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-gold-500" />
                  ))}
                  <span className="text-[10px] text-stone-400 ml-1 font-mono">{review.rating.toFixed(1)}</span>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed italic font-light font-sans">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-stone-905/30 pt-4 mt-6">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">{review.author}</h4>
                  <span className="text-[10px] text-stone-400 font-mono">{review.date}</span>
                </div>
                {review.badge && (
                  <span className="text-[9px] font-semibold bg-stone-900 border border-gold-500/30 text-gold-400 px-2 py-0.5 rounded-full font-mono uppercase">
                    {review.badge}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Client Feedback Button Trigger */}
        <div className="mt-12 text-center">
          <p className="text-stone-400 text-xs font-mono mb-4">¿Ya nos visitaste en el Studio en Garzón?</p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-transparent hover:bg-gold-500/10 border border-gold-500 text-gold-500 py-3 px-8 rounded font-serif font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 hover:text-white"
            id="btn-leave-review"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Compartir mi Opinión</span>
          </button>
        </div>

        {/* Live Submission Modal Drawer */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Blur Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowReviewModal(false)}
              />

              {/* Form Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-stone-900 border border-gold-500/30 p-6 rounded-lg w-full max-w-lg z-10 relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-white transition duration-150 text-sm font-mono"
                  id="modal-close"
                >
                  ✕
                </button>

                <h3 className="font-serif font-bold text-xl text-white mb-2">
                  Escribe tu Testimonio
                </h3>
                <p className="text-stone-400 text-xs mb-6">
                  Ayuda a más personas de Garzón a encontrar un servicio de calidad. Tu comentario se añadirá instantáneamente a nuestra página.
                </p>

                {reviewSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 bg-gold-500/20 text-gold-500 rounded-full flex items-center justify-center mx-auto border border-gold-500/50">
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h4 className="font-serif font-bold text-white text-lg">¡Testimonio publicado en esta web!</h4>
                    <p className="text-stone-300 text-xs px-2 leading-relaxed">
                      Muchas gracias por calificar a **Barber Classic 76 Studio**. Tu confianza es nuestro motor de trabajo diario.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-stone-400 uppercase tracking-widest mb-1.5">Tu Nombre Completo</label>
                      <input 
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Ej. Juan Manuel Muñoz"
                        className="w-full bg-stone-950 border border-stone-800 focus:border-gold-500 focus:outline-none rounded p-3 text-stone-100 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-400 uppercase tracking-widest mb-1.5">Calificación (Estrellas)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setNewRating(starValue)}
                            className="p-1 focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${starValue <= newRating ? 'fill-gold-500 text-gold-500' : 'text-stone-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-stone-400 uppercase tracking-widest mb-1.5">Cuéntanos tu experiencia</label>
                      <textarea
                        required
                        rows={4}
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Ej. Excelente servicio, la atención de los barberos fue estupenda, muy recomendada la higiene de las toallas y el perfilado de barba..."
                        className="w-full bg-stone-950 border border-stone-800 focus:border-gold-500 focus:outline-none rounded p-3 text-stone-100 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 font-serif font-bold text-xs uppercase py-3.5 rounded mt-4 cursor-pointer transition"
                    >
                      Enviar Valoración al Sitio
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </section>


      {/* 7. GALLERY SECTION PREPARED FOR HIGH QUALITY IMAGES */}
      <section id="galeria" className="py-20 sm:py-28 bg-stone-900/30 border-t border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex justify-center items-center space-x-1.5 bg-stone-900/80 px-3.5 py-1.5 rounded-full border border-stone-800 text-gold-500 text-xs tracking-widest font-mono uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galería Fotográfica</span>
            </div>
            
            <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Mira Nuestro <span className="gold-gradient inline-block">Trabajo Real</span>
            </h2>
            <p className="text-stone-400 mt-4 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
              Trabajos meticulosos con navaja de afeitar para barba, cortes degradados de alta definición con peinados a la temperatura perfecta y toallas calientes.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={() => setGalleryFilter('todos')}
                className={`px-4.5 py-2 rounded-full cursor-pointer text-xs font-mono font-bold transition-all duration-150 ${
                  galleryFilter === 'todos' 
                    ? 'text-gold-500 underline decoration-2 underline-offset-4' 
                    : 'text-stone-400 hover:text-white'
                }`}
                id="gallery-filter-all"
              >
                Todos los Estilos
              </button>
              <button 
                onClick={() => setGalleryFilter('coke_or_beard')}
                className={`px-4.5 py-2 rounded-full cursor-pointer text-xs font-mono font-bold transition-all duration-150 ${
                  galleryFilter === 'coke_or_beard' 
                    ? 'text-gold-500 underline decoration-2 underline-offset-4' 
                    : 'text-stone-400 hover:text-white'
                }`}
                id="gallery-filter-featured"
              >
                Cortes & Barba Clásicos
              </button>
            </div>
          </div>

          {/* Masonry / Grid representation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={item.id}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-900 bg-stone-950 shadow-lg cursor-pointer"
                  id={`gallery-item-${item.id}`}
                >
                  {/* Photo representation */}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 duration-500 ease-out transition-all"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Title and Overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent p-5 pt-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] text-gold-500 font-mono tracking-wider uppercase">
                      {item.category === 'corte' ? 'Corte fade' : item.category === 'barba' ? 'Afeitado' : item.category === 'local' ? 'Interiores' : 'Esencia'}
                    </span>
                    <h3 className="font-serif font-bold text-white text-sm sm:text-base mt-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* High Quality Camera Lens badge corner decoration */}
                  <div className="absolute top-4 right-4 bg-stone-950/80 backdrop-blur px-2 py-1 rounded text-[8px] font-mono tracking-widest text-stone-400 border border-stone-800 uppercase">
                    Ref: #76-{item.id}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>


      {/* 8. CONTACT INFO & GOOGLE MAPS EMBED SECTION */}
      <section id="contacto" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Block: Contact metrics, and Schedules (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-stone-900 border border-stone-850 px-3.5 py-1.5 rounded-full text-gold-500 text-xs tracking-widest font-mono uppercase mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>Contacto Directo & Horarios</span>
              </div>
              
              <h2 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Visítanos en <br />
                <span className="gold-gradient inline-block">El Studio</span>
              </h2>
              
              <p className="text-stone-400 mt-4 text-xs sm:text-sm font-light leading-relaxed">
                Estamos ubicados en una zona central y de fácil acceso con parqueadero aledaño en Garzón. Ven a relajarte mientras cuidamos tu imagen con profesionalismo óptimo.
              </p>
            </div>

            {/* Quick Contact info boxes */}
            <div className="space-y-4">
              <a 
                href={CONTACT_INFO.googleMapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start space-x-4 p-4 rounded bg-stone-900/30 border border-stone-900 hover:border-gold-500/30 transition-all duration-200 group"
                id="contact-address-link"
              >
                <div className="w-10 h-10 rounded-full bg-stone-950 border border-gold-500/30 flex items-center justify-center shrink-0 group-hover:border-gold-500 transition-colors">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-500 font-mono tracking-wider uppercase">Nuestra Dirección</span>
                  <span className="block font-serif text-white font-bold text-sm tracking-wide mt-0.5">{CONTACT_INFO.address}</span>
                  <span className="text-gold-500 text-xs mt-1 inline-flex items-center gap-1">
                    <span>Ver indicaciones en mapa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>

              <a 
                href={`tel:${CONTACT_INFO.phoneFormatted}`}
                className="flex items-start space-x-4 p-4 rounded bg-stone-900/30 border border-stone-900 hover:border-gold-500/30 transition-all duration-200 group"
                id="contact-phone-link"
              >
                <div className="w-10 h-10 rounded-full bg-stone-950 border border-gold-500/30 flex items-center justify-center shrink-0 group-hover:border-gold-500 transition-colors">
                  <Phone className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-500 font-mono tracking-wider uppercase">Llámanos de inmediato</span>
                  <span className="block font-serif text-white font-bold text-sm tracking-wide mt-0.5">{CONTACT_INFO.phone}</span>
                  <span className="text-gold-500 text-xs mt-1 inline-flex items-center gap-1">
                    <span>Hacer llamada telefónica</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            </div>

            {/* Editable detailed schedules widget */}
            <div className="bg-stone-900 border border-stone-850 p-5 rounded-lg space-y-4">
              <div className="flex items-center space-x-2 text-stone-300 border-b border-stone-800 pb-3">
                <Clock className="w-4 h-4 text-gold-500" />
                <h4 className="font-serif font-bold text-xs tracking-wider uppercase">
                  Horarios de Atención Semanales
                </h4>
              </div>

              <div className="space-y-2.5">
                {schedules.map((sched) => {
                  const isToday = colombiaStatus.currentDayName === sched.day;
                  return (
                    <div 
                      key={sched.day} 
                      className={`flex justify-between items-center text-xs py-1 px-2 rounded ${
                        isToday 
                          ? 'bg-gold-500/10 border-l-2 border-gold-500 font-bold text-white' 
                          : 'text-stone-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />}
                        <span>{sched.day}</span>
                        {isToday && <span className="text-[9px] font-mono font-bold bg-gold-500/20 text-gold-400 px-1 py-0.2 rounded">Hoy</span>}
                      </span>
                      <span className="font-mono text-stone-300">{sched.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Block: Google Maps Iframe integrated within custom gold borders (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-stone-900 border border-gold-500/20 rounded-lg p-3 relative h-[380px] sm:h-[480px] w-full shadow-2xl flex flex-col justify-between">
              
              <div className="flex-1 rounded overflow-hidden relative border border-stone-800">
                {/* Embed Map */}
                <iframe 
                  src={CONTACT_INFO.googleMapsEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer"
                  title="Google Maps Location Barber Classic 76 Studio"
                  className="absolute inset-0 grayscale contrast-[1.1] brightness-[0.8]"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-stone-900">
                <div className="flex items-center space-x-2 text-stone-300">
                  <Map className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                  <span className="font-mono text-stone-400 text-[11px]">Cra. 7 FRENTE al #6-04, Garzón Huila</span>
                </div>
                
                <a 
                  href={CONTACT_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-stone-950 border border-gold-500/45 hover:border-gold-500 text-gold-400 hover:text-white px-4 py-2 rounded font-serif font-bold text-xs uppercase tracking-wider transition-all duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  id="open-maps-directions"
                >
                  <span>Abrir Navegador GPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </section>


      {/* 9. FLOATING ASSISTANT & WHATSAPP BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        
        {/* Help Tooltip Box */}
        <AnimatePresence>
          {showWpTooltip && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-stone-900 border border-gold-500/35 p-4 rounded-lg shadow-2xl max-w-xs relative gold-border-glow"
              id="wp-tooltip-bubble"
            >
              {/* Close Tooltip */}
              <button 
                onClick={() => setShowWpTooltip(false)}
                className="absolute top-2 right-2 text-stone-500 hover:text-stone-300 text-xs font-mono"
                id="btn-close-tooltip"
              >
                ✕
              </button>

              <div className="flex items-center space-x-2 border-b border-stone-800 pb-2 mb-2">
                <Scissors className="w-4 h-4 text-gold-500 animate-spin" />
                <span className="font-serif text-white font-bold text-xs tracking-wider uppercase">
                  Studio Barbería 76
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />
              </div>

              <p className="text-stone-300 text-[11px] leading-relaxed font-sans">
                ¿Deseas agendar tu corte hoy? Chatea directamente con nosotros para reservar tu espacio sin esperar.
              </p>

              <div className="mt-3 flex justify-end">
                <a 
                  href={CONTACT_INFO.whatsappMessageUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowWpTooltip(false)}
                  className="text-stone-950 font-serif font-bold bg-gold-400 px-3 py-1.5 rounded text-[10px] uppercase tracking-wider hover:bg-gold-500 transition duration-150"
                  id="wp-tooltip-action"
                >
                  Chatear Ya
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real Floater Circular Button */}
        <div className="relative group">
          
          {/* External ripple effect circles */}
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-20 pointer-events-none" />
          
          <a 
            href={CONTACT_INFO.whatsappMessageUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setShowWpTooltip(!showWpTooltip)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition-transform duration-200 cursor-pointer active:scale-95 border-2 border-emerald-400/30"
            title="Agendar Cita en WhatsApp"
            id="whatsapp-floater-button"
          >
            <MessageSquare className="w-6 h-6 fill-current" />
          </a>
          
          {/* Side Small Icon indicator */}
          <span className="absolute -top-1 -right-1 bg-gold-500 text-stone-950 font-mono text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-white/80">
            5.0
          </span>
        </div>

      </div>


      {/* 10. PREMIUM LOCAL SEO FOOTER */}
      <footer className="bg-stone-950 border-t border-stone-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Grid Footer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-stone-900">
            
            {/* Brand descriptor (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-stone-900 border border-gold-500 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-gold-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-extrabold text-white text-base tracking-widest uppercase">
                    BARBER CLASSIC 76
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gold-500/80">
                    Estilo & Tradición Masculina
                  </span>
                </div>
              </div>

              <p className="text-stone-400 text-xs leading-relaxed font-light">
                Premium Barbería dedicada a esculpir y mantener la imagen de caballeros exigentes en Garzón, Huila. Ofrecemos tratamientos exclusivos de cabello y acondicionamiento de barba simétrico bajo las máximas normativas de bioseguridad garantizadas.
              </p>

              <div className="flex items-center gap-1 text-gold-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="font-mono text-xs text-stone-300 ml-1">5.0 de Calificación unánime de nuestra clientela local.</span>
              </div>
            </div>

            {/* Quick map routes indexes (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-serif text-white text-xs tracking-wider uppercase font-extrabold">Navegación</h4>
              <ul className="space-y-2 text-xs font-mono">
                <li><a href="#inicio" className="text-stone-400 hover:text-gold-400 transition-colors">Volver al Inicio</a></li>
                <li><a href="#servicios" className="text-stone-400 hover:text-gold-400 transition-colors">Nuestros Servicios</a></li>
                <li><a href="#nosotros" className="text-stone-400 hover:text-gold-400 transition-colors">Sobre el Studio</a></li>
                <li><a href="#opiniones" className="text-stone-400 hover:text-gold-400 transition-colors">Opiniones Reales</a></li>
                <li><a href="#galeria" className="text-stone-400 hover:text-gold-400 transition-colors">Galería Fotográfica</a></li>
                <li><a href="#contacto" className="text-stone-400 hover:text-gold-400 transition-colors">Ubicación & GPS</a></li>
              </ul>
            </div>

            {/* Direct legal location and schema indices (4 cols) */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-serif text-white text-xs tracking-wider uppercase font-extrabold">Localización & Contacto</h4>
              <p className="text-stone-400 text-xs">
                Barber Classic 76 Studio, Garzón<br />
                Dirección Oficial: {CONTACT_INFO.address}<br />
                Departamento del Huila, Colombia.<br />
                Teléfono Directo: <a href={`tel:${CONTACT_INFO.phoneFormatted}`} className="text-gold-400 underline">{CONTACT_INFO.phone}</a>
              </p>

              <div className="bg-stone-900 p-3 rounded border border-stone-850">
                <span className="block text-[10px] text-stone-400 font-serif font-bold uppercase tracking-wider">Ubicación Estratégica</span>
                <span className="block text-[10px] text-stone-500 font-mono mt-1">
                  Encuéntranos en Garzón, Huila sobre la Carrera Septima al lado de los mejores establecimientos del municipio.
                </span>
              </div>
            </div>

          </div>

          {/* Lower segment copyrights */}
          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-stone-500 text-[10px] font-mono">
            <div>
              &copy; {new Date().getFullYear()} Barber Classic 76 Studio. Todos los derechos reservados.
            </div>
            <div>
              Diseño de Alta Conversión • <span className="text-gold-500/80">Estilo Masculino Moderno</span> • Garzón, Huila, Colombia.
            </div>
          </div>

        </div>
      </footer>
      
      {/* 5. MODAL AGENDAMIENTO REAL DE CLIENTE */}
      <AnimatePresence>
        {showUserBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserBookingModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 border border-gold-500/30 p-6 rounded-lg max-w-md w-full relative z-10 space-y-4"
              id="user-booking-modal"
            >
              <div className="flex justify-between items-center border-b border-stone-850 pb-3">
                <div>
                  <h3 className="font-serif font-extrabold text-white text-base tracking-wide uppercase">Detalles de la Reserva</h3>
                  <p className="text-[10px] text-gold-500/80 font-mono tracking-widest uppercase">Classic 76 Studio, Garzón</p>
                </div>
                <button 
                  onClick={() => setShowUserBookingModal(false)}
                  className="text-stone-400 hover:text-white h-7 w-7 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Chosen summary list */}
              <div className="bg-stone-900/60 border border-stone-850 p-3.5 rounded text-xs">
                <span className="block text-[9px] font-mono tracking-wider uppercase text-stone-500 mb-1.5">Servicios Seleccionados</span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between text-stone-300">
                      <span>• {s.name}</span>
                      <span className="font-mono text-gold-400/90">{s.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-800 mt-2 pt-2 flex justify-between font-bold text-white uppercase text-[11px]">
                  <span>Total Estimado:</span>
                  <span className="text-gold-400 font-mono">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(
                      selectedServices.reduce((acc, curr) => {
                        const numericVal = curr.id === "1" ? 20000 : 
                                           curr.id === "2" ? 25000 :
                                           curr.id === "3" ? 15000 :
                                           curr.id === "4" ? 18000 :
                                           curr.id === "5" ? 45000 : 35000;
                        return acc + numericVal;
                      }, 0)
                    )}
                  </span>
                </div>
              </div>

              <form onSubmit={handleConfirmUserBooking} className="space-y-3 text-xs font-sans">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Nombre Completo *</label>
                  <input 
                    type="text"
                    required
                    value={bookingClientName}
                    onChange={(e) => setBookingClientName(e.target.value)}
                    placeholder="Escribe tu nombre completo"
                    className="w-full bg-stone-900 border border-stone-800 p-2.5 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Número de WhatsApp (Celular) *</label>
                  <input 
                    type="tel"
                    required
                    value={bookingClientPhone}
                    onChange={(e) => setBookingClientPhone(e.target.value)}
                    placeholder="Ej. 3124567890"
                    className="w-full bg-stone-900 border border-stone-800 p-2.5 rounded text-white"
                  />
                  <span className="text-[9px] text-stone-500 block mt-0.5">Te enviaremos confirmación directa a este canal.</span>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 font-medium font-sans">Elegir Fecha & Hora Propuesta *</label>
                  <input 
                    type="datetime-local"
                    required
                    value={bookingDateTime}
                    onChange={(e) => setBookingDateTime(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 p-2.5 rounded text-white font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 font-serif font-bold text-xs tracking-wider uppercase py-3 rounded transition-all duration-200 border border-gold-450/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirmar Agendamiento en WhatsApp</span>
                  </button>
                  <span className="block text-[9px] text-stone-500 text-center mt-2 font-light">
                    * Al presionar se registrará su turno en el CRM de la Barbería y se abrirá WhatsApp con el formato de mensaje ya listo.
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. ADMIN PASSCODE AUTHENTICATOR OVERLAY */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasscodeModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-950 border border-gold-500/40 p-6 rounded-lg max-w-sm w-full relative z-10 text-center space-y-4 shadow-2xl shadow-black"
              id="admin-passcode-block"
            >
              <div className="w-12 h-12 bg-stone-900 border border-gold-500 flex items-center justify-center rounded-full mx-auto">
                <Lock className="w-5 h-5 text-gold-500" />
              </div>

              <div>
                <h3 className="font-serif font-extrabold text-white text-sm tracking-widest uppercase">ACCESO CRÍTICO DEL CRM</h3>
                <p className="text-[10px] text-gold-400 font-mono tracking-wider mt-0.5">Classic 76 Studio, Garzón Huila</p>
              </div>

              <div className="text-xs text-stone-400 leading-relaxed font-light">
                Por seguridad, introduce la Clave de Seguridad de Administración para desbloquear y editar el centro de control.
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passcodeInput === '7676') {
                    setIsAdmin(true);
                    setPasscodeError('');
                    setShowPasscodeModal(false);
                  } else {
                    setPasscodeError('ID de Clave Incorrecta. Intenta nuevamente.');
                    setPasscodeInput('');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <input 
                  type="password"
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-stone-900 border border-stone-850 p-2.5 rounded text-center text-white tracking-widest font-mono text-base focus:border-gold-500 outline-none"
                  autoFocus
                />

                {passcodeError && (
                  <p className="text-rose-450 text-[10px] font-mono font-bold">{passcodeError}</p>
                )}

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowPasscodeModal(false)}
                    className="w-1/2 bg-stone-900 border border-stone-800 text-stone-400 p-2.5 rounded hover:text-white transition cursor-pointer font-bold uppercase tracking-wider text-[11px]"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="w-1/2 bg-gold-500 hover:bg-gold-600 text-stone-950 p-2.5 rounded transition cursor-pointer font-bold uppercase tracking-wider text-[11px]"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
