'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, CircleStackIcon, TableCellsIcon, ClipboardDocumentListIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline'

interface Tabla {
  nombre: string;
  descripcion: string;
  campos: Array<{
    nombre: string;
    tipo: string;
    descripcion: string;
  }>;
  foreignKeys?: Array<{
    campo: string;
    referencia: string;
  }>;
}

interface DatosCreativa360 {
  proyecto: {
    titulo: string;
    descripcion: string;
    empresa: string;
  };
  metricas: {
    totalTablas: number;
    totalRelaciones: number;
    totalRegistros: number;
    totalConsultas: number;
  };
  tablas: Tabla[];
  datosEjemplo: Record<string, unknown>;
  consultas: Array<{
    titulo: string;
    descripcion: string;
    sql: string;
    resultadoEsperado: string;
  }>;
  casosUso: string[];
  ventajas: string[];
}

export default function Home() {
  const [datos, setDatos] = useState<DatosCreativa360 | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('/creativa360.json')
        const data = await response.json()
        setDatos(data)
        setLoading(false)
      } catch (error) {
        console.error('Error cargando los datos:', error)
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-xl mt-4">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Error al cargar los datos</h1>
          <p>No se pudieron cargar los datos del sistema CREATIVA360</p>
        </div>
      </div>
    )
  }

  const slides = [
    { id: 'portada', title: 'Portada', component: <Portada datos={datos} /> },
    { id: 'metricas', title: 'Métricas', component: <Metricas datos={datos} /> },
    { id: 'codigo-tablas', title: 'Código SQL', component: <CodigoTablas datos={datos} /> },
    { id: 'tablas', title: 'Estructura BD', component: <EstructuraTablas datos={datos} /> },
    { id: 'diagrama', title: 'Diagrama ER', component: <DiagramaRelacional datos={datos} /> },
    { id: 'inserciones', title: 'Inserciones', component: <InsercionesDatos datos={datos} /> },
    { id: 'relaciones', title: 'Relaciones', component: <Relaciones datos={datos} /> },
    { id: 'consultas', title: 'Consultas SQL', component: <ConsultasSQL datos={datos} /> },
    { id: 'casos', title: 'Casos de Uso', component: <CasosUso datos={datos} /> },
    { id: 'ventajas', title: 'Ventajas', component: <Ventajas datos={datos} /> }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800/20 via-purple-800/20 to-indigo-800/20 animate-pulse"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, rgba(147,51,234,0.12) 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      {/* Navegación superior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <CircleStackIcon className="h-8 w-8 text-white" />
              <span className="text-white font-bold text-xl">CREATIVA360</span>
            </div>
            <div className="flex items-center space-x-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 hover:scale-150 relative overflow-hidden ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-xl shadow-blue-500/60 scale-125' 
                      : 'bg-white/40 hover:bg-white/70 hover:shadow-lg hover:shadow-white/30'
                  }`}
                >
                  {index === currentSlide && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full animate-ping opacity-30"></div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="pt-16 h-screen overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {slides[currentSlide].component}
        </motion.div>
      </main>

      {/* Controles de navegación */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-50">
        <button
          onClick={prevSlide}
          className="group relative bg-gradient-to-r from-purple-700/80 to-indigo-800/80 backdrop-blur-xl text-white p-4 rounded-full hover:from-purple-600/90 hover:to-indigo-700/90 hover:scale-125 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 disabled:opacity-30 disabled:hover:scale-100 border border-purple-400/60 disabled:cursor-not-allowed overflow-hidden"
          disabled={currentSlide === 0}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <ChevronLeftIcon className="relative h-7 w-7 group-hover:animate-pulse" />
        </button>
        
        <div className="bg-gradient-to-r from-purple-800/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-2xl text-white px-8 py-4 rounded-2xl border border-purple-400/60 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative font-semibold text-lg tracking-wide">{slides[currentSlide].title}</span>
        </div>
        
        <button
          onClick={nextSlide}
          className="group relative bg-gradient-to-r from-purple-700/80 to-indigo-800/80 backdrop-blur-xl text-white p-4 rounded-full hover:from-purple-600/90 hover:to-indigo-700/90 hover:scale-125 transition-all duration-500 shadow-2xl hover:shadow-purple-500/50 disabled:opacity-30 disabled:hover:scale-100 border border-purple-400/60 disabled:cursor-not-allowed overflow-hidden"
          disabled={currentSlide === slides.length - 1}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <ChevronRightIcon className="relative h-7 w-7 group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  )
}

// Componente Portada
function Portada({ datos }: { datos: DatosCreativa360 }) {
  return (
    <div className="h-full flex items-center justify-center text-center text-white px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
          {datos.proyecto.titulo}
        </h1>
        <p className="text-2xl mb-8 opacity-90">
          {datos.proyecto.descripcion}
        </p>
        <div className="text-lg opacity-75">
          <p className="mb-2">{datos.proyecto.empresa}</p>
          <p>Sistema Completo de Base de Datos Oracle</p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex justify-center space-x-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-300">{datos.metricas.totalTablas}</div>
            <div className="text-sm opacity-75">Tablas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-300">{datos.metricas.totalRelaciones}</div>
            <div className="text-sm opacity-75">Relaciones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-300">{datos.metricas.totalRegistros}</div>
            <div className="text-sm opacity-75">Registros</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Componente Métricas
function Metricas({ datos }: { datos: DatosCreativa360 }) {
  const metricas = [
    { label: 'Total de Tablas', valor: datos.metricas.totalTablas, icon: TableCellsIcon, color: 'text-yellow-300' },
    { label: 'Relaciones FK', valor: datos.metricas.totalRelaciones, icon: CircleStackIcon, color: 'text-green-300' },
    { label: 'Registros de Ejemplo', valor: datos.metricas.totalRegistros, icon: ClipboardDocumentListIcon, color: 'text-blue-300' },
    { label: 'Consultas SQL', valor: datos.metricas.totalConsultas, icon: ChartBarIcon, color: 'text-purple-300' }
  ]

  return (
    <div className="h-full flex items-center justify-center px-8">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">Métricas del Sistema</h2>
        <div className="grid grid-cols-2 gap-8 max-w-4xl">
          {metricas.map((metrica, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border border-white/20"
            >
              <metrica.icon className={`h-16 w-16 mx-auto mb-4 ${metrica.color}`} />
              <div className={`text-5xl font-bold mb-2 ${metrica.color}`}>
                {metrica.valor}
              </div>
              <div className="text-xl opacity-90">{metrica.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente Estructura de Tablas
function EstructuraTablas({ datos }: { datos: DatosCreativa360 }) {
  const [tablaSeleccionada, setTablaSeleccionada] = useState(0)

  return (
    <div className="h-full flex text-white p-8">
      <div className="w-1/3 pr-6">
        <h2 className="text-3xl font-bold mb-6">Estructura de Tablas</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {datos.tablas.map((tabla, index) => (
            <button
              key={index}
              onClick={() => setTablaSeleccionada(index)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                tablaSeleccionada === index
                  ? 'bg-gradient-to-r from-indigo-600/30 to-blue-600/30 border-indigo-400/50 shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/15 border-white/20 hover:border-white/40 hover:shadow-md hover:shadow-white/10'
              }`}
            >
              {tablaSeleccionada === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 animate-pulse"></div>
              )}
              <div className="relative font-semibold text-white group-hover:text-indigo-300 transition-colors duration-300">{tabla.nombre}</div>
              <div className="text-sm opacity-75">{tabla.campos.length} campos</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-2/3 pl-6">
        {datos.tablas[tablaSeleccionada] && (
          <motion.div
            key={tablaSeleccionada}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className=" bg-gray-500 bg-opacity-10 backdrop-blur-md rounded-xl p-6 h-full overflow-y-auto"
          >
            <h3 className="text-2xl font-bold mb-4 text-black">{datos.tablas[tablaSeleccionada].nombre}</h3>
            <p className="text-lg text-gray-200 mb-6">{datos.tablas[tablaSeleccionada].descripcion}</p>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-black">Campos:</h4>
              {datos.tablas[tablaSeleccionada].campos.map((campo, index) => (
                <div key={index} className="bg-black bg-opacity-20 rounded-lg p-4 border border-white border-opacity-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-yellow-300 font-semibold">{campo.nombre}</span>
                    <span className="text-green-300 text-sm font-medium">{campo.tipo}</span>
                  </div>
                  <p className="text-sm text-gray-200 opacity-80">{campo.descripcion}</p>
                </div>
              ))}
              
              {datos.tablas[tablaSeleccionada].foreignKeys && datos.tablas[tablaSeleccionada].foreignKeys!.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-semibold mb-4 text-white">Foreign Keys:</h4>
                  {datos.tablas[tablaSeleccionada].foreignKeys!.map((fk, index) => (
                    <div key={index} className="bg-purple-900 bg-opacity-40 rounded-lg p-4 mb-2 border border-purple-400 border-opacity-30">
                      <span className="font-mono text-purple-200 font-semibold">{fk.campo}</span>
                      <span className="mx-2 text-blue-400 font-bold">→</span>
                      <span className="font-mono text-blue-200 font-semibold">{fk.referencia}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Componente Relaciones
function Relaciones({ datos }: { datos: DatosCreativa360 }) {
  const relaciones = datos.tablas.filter(tabla => tabla.foreignKeys && tabla.foreignKeys.length > 0)

  return (
    <div className="h-full flex items-center justify-center text-white p-8">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">Relaciones entre Tablas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto  ">
          {relaciones.map((tabla, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="   bg-gray-800 bg-opacity-10 backdrop-blur-md rounded-xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-yellow-300">{tabla.nombre}</h3>
              <div className="space-y-2">
                {tabla.foreignKeys!.map((fk, fkIndex) => (
                  <div key={fkIndex} className="flex items-center space-x-2 text-sm">
                    <span className="font-mono bg-purple-900 bg-opacity-50 px-2 py-1 rounded">
                      {fk.campo}
                    </span>
                    <span className="opacity-75">→</span>
                    <span className="font-mono bg-blue-900 bg-opacity-50 px-2 py-1 rounded">
                      {fk.referencia}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente Consultas SQL
function ConsultasSQL({ datos }: { datos: DatosCreativa360 }) {
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(0)
  const [mostrarImagen, setMostrarImagen] = useState(false)
  const [mostrarResultados, setMostrarResultados] = useState(false)

  return (
    <div className="h-full flex text-white p-8">
      <div className="w-1/3 pr-6">
        <h2 className="text-3xl font-bold mb-6 text-white">Consultas SQL</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
          {datos.consultas.map((consulta, index) => (
            <button
              key={index}
              onClick={() => setConsultaSeleccionada(index)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                consultaSeleccionada === index
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-400/50 shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 hover:bg-white/15 border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10'
              }`}
            >
              {consultaSeleccionada === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              )}
              <div className="relative font-semibold text-sm text-white group-hover:text-blue-300 transition-colors duration-300">{consulta.titulo}</div>
            </button>
          ))}
        </div>
        
        {/* Botones para alternar vista */}
        <div className="space-y-3">
          <button
            onClick={() => {setMostrarImagen(false); setMostrarResultados(false)}}
            className={`group w-full p-4 rounded-xl transition-all duration-500 font-semibold text-sm relative overflow-hidden border ${
              !mostrarImagen && !mostrarResultados
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-500/40 border-blue-400 scale-105'
                : 'bg-white/10 backdrop-blur-xl text-gray-200 hover:bg-white/20 hover:scale-105 border-white/30 hover:border-blue-400/50 hover:text-blue-200'
            }`}
          >
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              !mostrarImagen && !mostrarResultados ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } bg-gradient-to-r from-blue-500/20 to-blue-600/20 animate-pulse`}></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>📝 Ver Consulta SQL</span>
            </div>
          </button>
          
          <button
            onClick={() => {setMostrarImagen(true); setMostrarResultados(false)}}
            className={`group w-full p-4 rounded-xl transition-all duration-500 font-semibold text-sm relative overflow-hidden border ${
              mostrarImagen
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl shadow-green-500/40 border-green-400 scale-105'
                : 'bg-white/10 backdrop-blur-xl text-gray-200 hover:bg-white/20 hover:scale-105 border-white/30 hover:border-green-400/50 hover:text-green-200'
            }`}
          >
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              mostrarImagen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } bg-gradient-to-r from-green-500/20 to-green-600/20 animate-pulse`}></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>🖼️ Ver Captura</span>
            </div>
          </button>
          
          <button
            onClick={() => {setMostrarImagen(false); setMostrarResultados(true)}}
            className={`group w-full p-4 rounded-xl transition-all duration-500 font-semibold text-sm relative overflow-hidden border ${
              mostrarResultados
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-2xl shadow-purple-500/40 border-purple-400 scale-105'
                : 'bg-white/10 backdrop-blur-xl text-gray-200 hover:bg-white/20 hover:scale-105 border-white/30 hover:border-purple-400/50 hover:text-purple-200'
            }`}
          >
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              mostrarResultados ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } bg-gradient-to-r from-purple-500/20 to-purple-600/20 animate-pulse`}></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>💻 Ver Resultados</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="w-2/3 pl-6">
        {datos.consultas[consultaSeleccionada] && (
          <motion.div
            key={`${consultaSeleccionada}-${mostrarImagen}-${mostrarResultados}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-50/70 backdrop-blur-xl rounded-2xl p-6 h-full overflow-y-auto border border-slate-200/60 shadow-xl"
          >
            {mostrarResultados ? (
              // Vista de resultados de impresión
              <>
                <h3 className="text-xl font-bold mb-4 text-white">Resultados de Consultas SQL</h3>
                <p className="text-sm text-gray-200 mb-6">Resultados reales obtenidos de la ejecución en Oracle Database</p>
                
                <div className="bg-black bg-opacity-70 rounded-lg p-4 text-green-300 font-mono text-xs overflow-auto border border-green-600 max-h-96">
                  <pre className="whitespace-pre-wrap">{`
CLIENTE_ID NOMBRE                                                                                               CORREO                                                                                               TELEFONO             CIUDAD                                            
---------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- -------------------- --------------------------------------------------
         1 Panadería El Trigo                                                                                   panaderia@gmail.com                                                                                  999111222            Lima                                              
         2 Gimnasio FitLife                                                                                     contacto@fitlife.com                                                                                 988777555            Arequipa                                          
         3 Veterinaria Huellas                                                                                  info@huellas.com                                                                                     987654321            Lima                                              
         4 Café Aroma                                                                                           cafe@aroma.com                                                                                       945632100            Cusco                                             
         5 Consultora Andes                                                                                     consultora@andes.com                                                                                 955222111            Trujillo                                          


NOMBRE                                                                                               FECHA_IN
---------------------------------------------------------------------------------------------------- --------
Campaña Facebook Panadería                                                                           01/01/25
Publicidad Instagram FitLife                                                                         10/02/25
Campaña Huellas Google Ads                                                                           15/03/25
Lanzamiento Café Aroma                                                                               01/04/25
Campaña Consultora LinkedIn                                                                          01/05/25


NOMBRE                                                                                              
----------------------------------------------------------------------------------------------------
María González


FACTURA_ID      TOTAL
---------- ----------
         1       1300
         2       1700
         3       2100
         4       1500
         5       1800


   LEAD_ID CAMPANA_ID NOMBRE                                                                                               CORREO                                                                                               ESTADO                                            
---------- ---------- ---------------------------------------------------------------------------------------------------- ---------------------------------------------------------------------------------------------------- --------------------------------------------------
         1          1 Roberto Silva                                                                                        roberto@email.com                                                                                    Pendiente                                         
         4          4 Sofia Vega                                                                                           sofia@email.com                                                                                      Pendiente                                         


NOMBRE                                                                                               ESTADO                                            
---------------------------------------------------------------------------------------------------- --------------------------------------------------
Panadería El Trigo                                                                                   Activo                                            
Veterinaria Huellas                                                                                  Activo                                            


NOMBRE                                                                                               TOTAL_PAGADO
---------------------------------------------------------------------------------------------------- ------------
Panadería El Trigo                                                                                           1300
Gimnasio FitLife                                                                                             1700
Veterinaria Huellas                                                                                          2100
Café Aroma                                                                                                   1500


TITULO                                                                                               NOMBRE                                                                                              
---------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------
Promoción Pan Integral                                                                               Campaña Facebook Panadería                                                                          
Cuidado de Mascotas                                                                                  Campaña Huellas Google Ads                                                                          


NOMBRE                                                                                                   PRECIO
---------------------------------------------------------------------------------------------------- ----------
Google Ads                                                                                                 1200
SEO                                                                                                         900
Facebook Ads                                                                                               1000


NOMBRE                                                                                               TOTAL_CAMPANAS
---------------------------------------------------------------------------------------------------- --------------
Panadería El Trigo                                                                                                1
Gimnasio FitLife                                                                                                  1
Veterinaria Huellas                                                                                               1
Café Aroma                                                                                                        1
Consultora Andes                                                                                                  1


TABLA                   REGISTROS
---------------------- ----------
CLIENTES                        5
CAMPANAS                        5
EMPLEADOS                       5
SERVICIOS                       5
PROVEEDORES                     5
FACTURAS                        5
DETALLE_FACTURA                 5
PAGOS                           5
CONTRATOS                       5
REDES_SOCIALES                  5
PUBLICACIONES                   5
METRICAS_CAMPANA                5
LEADS                           5
HERRAMIENTAS_DIGITALES          5

14 filas seleccionadas.
Confirmación terminada.`}</pre>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 rounded-xl p-4 border border-green-500/30">
                    <h4 className="text-green-300 font-semibold text-sm mb-2">✅ Consultas Ejecutadas</h4>
                    <p className="text-white text-2xl font-bold">10+</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-800/50 to-cyan-800/50 rounded-xl p-4 border border-blue-500/30">
                    <h4 className="text-blue-300 font-semibold text-sm mb-2">📊 Registros Procesados</h4>
                    <p className="text-white text-2xl font-bold">70+</p>
                  </div>
                </div>
              </>
            ) : !mostrarImagen ? (
              // Vista de consulta
              <>
                <h3 className="text-xl font-bold mb-4 text-white">{datos.consultas[consultaSeleccionada].titulo}</h3>
                <p className="text-sm text-gray-200 mb-4">{datos.consultas[consultaSeleccionada].descripcion}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-white">SQL:</h4>
                  <pre className="bg-black text-green-300 bg-opacity-50 rounded-lg p-4 text-sm font-mono overflow-x-auto border border-gray-600">
                    <code>{datos.consultas[consultaSeleccionada].sql}</code>
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-white">Resultado Esperado:</h4>
                  <div className="bg-green-900 bg-opacity-30 rounded-lg p-4 text-sm text-gray-200 border border-green-600">
                    {datos.consultas[consultaSeleccionada].resultadoEsperado}
                  </div>
                </div>
              </>
            ) : (
              // Vista de imagen
              <>
                <h3 className="text-xl font-bold mb-4 text-white">Ejecución de Consultas SQL</h3>
                <p className="text-sm text-gray-200 mb-6">Imagen de la ejecución de las consultas en Oracle</p>
                
                <div className="flex justify-center">
                  <div className="relative max-w-full max-h-96 overflow-auto border-2 border-white border-opacity-20 rounded-lg">
                    <Image
                      src="/IMG/CONSULTAS/CONSULTAS.png"
                      alt="Ejecución de Consultas SQL"
                      width={800}
                      height={600}
                      className="object-contain"
                      style={{ maxHeight: '400px', width: 'auto' }}
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Componente Casos de Uso
function CasosUso({ datos }: { datos: DatosCreativa360 }) {
  return (
    <div className="h-full flex items-center justify-center text-black p-8">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">Casos de Uso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datos.casosUso.map((caso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className=" text-black font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-lg">{caso}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente Ventajas
function Ventajas({ datos }: { datos: DatosCreativa360 }) {
  return (
    <div className="h-full flex items-center justify-center text-black p-8">
      <div className="max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">Ventajas del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {datos.ventajas.map((ventaja, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <StarIcon className="h-8 w-8 text-yellow-300 flex-shrink-0 mt-1" />
                <p className="text-lg">{ventaja}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente Inserciones de Datos
function InsercionesDatos({ datos }: { datos: DatosCreativa360 }) {
  const [tablaSeleccionada, setTablaSeleccionada] = useState(0)
  
  // Lista de todas las tablas con sus respectivas imágenes de inserción
  const tablasConImagenes = [
    { nombre: 'CLIENTES', imagen: '/IMG/INSERCIONES/INSERCION-CLIENTES.png' },
    { nombre: 'CAMPAÑAS', imagen: '/IMG/INSERCIONES/INSERCION-CAMPAÑAS.png' },
    { nombre: 'EMPLEADOS', imagen: '/IMG/INSERCIONES/INSERCION-EMPLEADOS.png' },
    { nombre: 'SERVICIOS', imagen: '/IMG/INSERCIONES/INSERCION-SERVICIOS.png' },
    { nombre: 'PROVEEDORES', imagen: '/IMG/INSERCIONES/INSERCION-PROVEEDORES.png' },
    { nombre: 'FACTURAS', imagen: '/IMG/INSERCIONES/INSERCION-FACTURAS.png' },
    { nombre: 'DETALLE_FACTURA', imagen: '/IMG/INSERCIONES/INSERCION-DETALLE_FACTURA.png' },
    { nombre: 'PAGOS', imagen: '/IMG/INSERCIONES/INSERCION-PAGOS.png' },
    { nombre: 'CONTRATOS', imagen: '/IMG/INSERCIONES/INSERCION-CONTRATOS.png' },
    { nombre: 'REDES_SOCIALES', imagen: '/IMG/INSERCIONES/INSERCION-REDES_SOCIALES.png' },
    { nombre: 'PUBLICACIONES', imagen: '/IMG/INSERCIONES/INSERCION-PUBLICACIONES.png' },
    { nombre: 'METRICAS_CAMPANA', imagen: '/IMG/INSERCIONES/INSERCION-METRICAS_CAMPAÑAS.png' },
    { nombre: 'LEADS', imagen: '/IMG/INSERCIONES/INSERCION-LEADS.png' },
    { nombre: 'HERRAMIENTAS_DIGITALES', imagen: '/IMG/INSERCIONES/INSERCION-HERRAMIENTAS_DIGITALES.png' },
    { nombre: 'GENERAL', imagen: '/IMG/INSERCIONES/code-general-tablas.png' }
  ]

  return (
    <div className="h-full flex text-black p-8">
      <div className="w-1/4 pr-6">
        <h2 className="text-3xl font-bold mb-6">Inserciones de Datos</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tablasConImagenes.map((tabla, index) => (
            <button
              key={index}
              onClick={() => setTablaSeleccionada(index)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                tablaSeleccionada === index
                  ? 'bg-gradient-to-r from-emerald-600/30 to-green-600/30 border-emerald-400/50 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 hover:shadow-md hover:shadow-white/10'
              }`}
            >
              {tablaSeleccionada === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 animate-pulse"></div>
              )}
              <div className="relative font-semibold text-sm text-white group-hover:text-green-300 transition-colors duration-300">{tabla.nombre}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-3/4 pl-6">
        <motion.div
          key={tablaSeleccionada}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-500 bg-opacity-10 backdrop-blur-md rounded-xl p-6 h-full overflow-y-auto"
        >
          <h3 className="text-2xl font-bold mb-4 text-black">
            {tablasConImagenes[tablaSeleccionada].nombre}
          </h3>
          <p className="text-lg text-black mb-6">
            Script de inserción de datos para la tabla {tablasConImagenes[tablaSeleccionada].nombre}
          </p>
          
          <div className="flex justify-center">
            <div className="relative max-w-full max-h-96 overflow-auto border-2 border-white border-opacity-20 rounded-lg">
              <Image
                src={tablasConImagenes[tablaSeleccionada].imagen}
                alt={`Inserción de datos - ${tablasConImagenes[tablaSeleccionada].nombre}`}
                width={800}
                height={600}
                className="object-contain"
                style={{ maxHeight: '400px', width: 'auto' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Componente Código de Tablas SQL
function CodigoTablas({ datos: _ }: { datos: DatosCreativa360 }) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0)
  
  const imagenesCodigoSQL = [
    { nombre: 'Código SQL - Parte 1', imagen: '/IMG/codigo-tabla/codigo-tabla1.png' },
    { nombre: 'Código SQL - Parte 2', imagen: '/IMG/codigo-tabla/codigo-tabla2.png' },
    { nombre: 'Código SQL - Parte 3', imagen: '/IMG/codigo-tabla/codigo-tabla3.png' },
    { nombre: 'Código SQL - Parte 4', imagen: '/IMG/codigo-tabla/codigo-tabla4.png' }
  ]

  return (
    <div className="h-full flex text-white p-8">
      <div className="w-1/5 pr-6">
        <h2 className="text-3xl font-bold mb-6">Código SQL de Tablas</h2>
        <p className="text-gray-200 text-sm mb-6 bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/20">
          Scripts completos de creación de tablas en Oracle con todas las restricciones y relaciones.
        </p>
        
        <div className="space-y-3">
          {imagenesCodigoSQL.map((imagen, index) => (
            <button
              key={index}
              onClick={() => setImagenSeleccionada(index)}
              className={`group w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                imagenSeleccionada === index
                  ? 'bg-gradient-to-r from-cyan-600/30 to-teal-600/30 border-cyan-400/50 shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50 hover:shadow-md hover:shadow-white/10'
              }`}
            >
              {imagenSeleccionada === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 animate-pulse"></div>
              )}
              <div className="relative">
                <div className="font-semibold text-sm text-white group-hover:text-cyan-200 transition-colors duration-300">{imagen.nombre}</div>
                <div className="text-xs opacity-75 mt-1 text-gray-300 group-hover:text-cyan-300 transition-colors duration-300">CREATE TABLE statements</div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-900 bg-opacity-30 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">📝 Contenido:</h4>
          <ul className="text-xs space-y-1 opacity-90">
            <li>• Definición de tablas</li>
            <li>• Claves primarias</li>
            <li>• Claves foráneas</li>
            <li>• Restricciones</li>
            <li>• Tipos de datos Oracle</li>
          </ul>
        </div>
      </div>
      
      <div className="w-4/5 pl-7">
        <motion.div
          key={imagenSeleccionada}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 h-full overflow-hidden border border-white/20 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">
            {imagenesCodigoSQL[imagenSeleccionada].nombre}
          </h3>
          
          <div className="h-full flex justify-center items-center">
            <div className="relative max-w-full max-h-full overflow-auto border-2 border-white border-opacity-20 rounded-lg shadow-2xl">
              <Image
                src={imagenesCodigoSQL[imagenSeleccionada].imagen}
                alt={imagenesCodigoSQL[imagenSeleccionada].nombre}
                width={1400}
                height={1000}
                className="object-contain"
                style={{ maxHeight: '500px', width: '400' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Componente Diagrama Relacional
function DiagramaRelacional({ datos }: { datos: DatosCreativa360 }) {
  const [vistaAmpliada, setVistaAmpliada] = useState(false)
  
  // Manejar tecla ESC para cerrar modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVistaAmpliada(false)
      }
    }
    
    if (vistaAmpliada) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Prevenir scroll del fondo
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [vistaAmpliada])
  
  return (
    <div className="h-full flex items-center justify-center text-white p-8">
      <div className="w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
            Diagrama Entidad-Relación
          </h2>
          <p className="text-xl opacity-90 mb-2">
            Modelo visual completo de la base de datos CREATIVA360
          </p>
          <p className="text-sm opacity-75">
            Visualización de todas las tablas, campos y relaciones del sistema
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 relative"
        >
          {/* Botón de ampliar */}
          <button
            onClick={() => setVistaAmpliada(true)}
            className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm font-medium"
          >
            <span>🔍</span>
            <span>Ampliar</span>
          </button>
          
          <div className="flex justify-center">
            <div className="relative max-w-full max-h-full overflow-auto border-4 border-white border-opacity-30 rounded-lg shadow-2xl cursor-pointer" onClick={() => setVistaAmpliada(true)}>
              <Image
                src="/IMG/tabla-relacionales/imagen-tablas relacionales.png"
                alt="Diagrama Entidad-Relación CREATIVA360"
                width={1400}
                height={1000}
                className="object-contain hover:scale-105 transition-transform duration-300"
                style={{ maxHeight: '650px', width: 'auto' }}
                priority
              />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-blue-900 bg-opacity-30 rounded-lg p-4"
            >
              <h4 className="font-semibold mb-2">📊 {datos.metricas.totalTablas} Tablas</h4>
              <p className="text-sm opacity-90">Entidades principales del negocio</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="bg-green-900 bg-opacity-30 rounded-lg p-4"
            >
              <h4 className="font-semibold mb-2">🔗 {datos.metricas.totalRelaciones} Relaciones</h4>
              <p className="text-sm opacity-90">Foreign Keys y conexiones</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="bg-purple-900 bg-opacity-30 rounded-lg p-4"
            >
              <h4 className="font-semibold mb-2">💾 {datos.metricas.totalRegistros} Registros</h4>
              <p className="text-sm opacity-90">Datos de ejemplo incluidos</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal de vista ampliada */}
      {vistaAmpliada && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            {/* Botón cerrar */}
            <button
              onClick={() => setVistaAmpliada(false)}
              className="absolute -top-12 right-0 z-60 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <span className="text-xl font-bold">×</span>
            </button>
            
            {/* Imagen ampliada */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-2xl"
            >
              <Image
                src="/IMG/tabla-relacionales/imagen-tablas relacionales.png"
                alt="Diagrama Entidad-Relación CREATIVA360 - Vista Ampliada"
                width={2000}
                height={1400}
                className="object-contain rounded-lg"
                style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                priority
              />
            </motion.div>
            
            {/* Instrucción */}
            <p className="text-center text-white mt-4 text-sm opacity-75">
              Haz clic en la X para cerrar o presiona ESC
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
