import { useState, useMemo, useEffect } from 'react';
import { COURSES } from '../data/courses';

const diasStr = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horas = Array.from({length: 15}, (_, i) => i + 7);

export function Scheduler({ plannedIds }) {
  // Estado principal de las secciones (Se guarda en localStorage)
  const [customData, setCustomData] = useState(() => {
    const saved = localStorage.getItem('studyPlan_sections');
    return saved ? JSON.parse(saved) : {};
  });

  const [seleccionados, setSeleccionados] = useState({});
  const [addingFor, setAddingFor] = useState(null); // ID del curso al que le estamos añadiendo sección

  // Estado del formulario
  const [fSec, setFSec] = useState('');
  const [fDoc, setFDoc] = useState('');
  const [fD1, setFD1] = useState(1); const [fI1, setFI1] = useState(7); const [fF1, setFF1] = useState(9);
  const [fD2, setFD2] = useState(3); const [fI2, setFI2] = useState(7); const [fF2, setFF2] = useState(9);
  const [useBlock2, setUseBlock2] = useState(true);

  useEffect(() => {
    localStorage.setItem('studyPlan_sections', JSON.stringify(customData));
  }, [customData]);

  // Filtramos la base de datos de cursos completa para quedarnos solo con los "Para llevar"
  const cursosParaLlevar = Array.from(plannedIds).map(id => {
    const infoCurso = COURSES.find(c => c.id === id);
    const seccionesDisp = customData[id] || [];
    return { ...infoCurso, secciones: seccionesDisp };
  });

  const handleSelect = (cursoId, seccionCodigo) => {
    setSeleccionados(prev => {
      if (prev[cursoId] === seccionCodigo) {
        const newState = { ...prev };
        delete newState[cursoId];
        return newState;
      }
      return { ...prev, [cursoId]: seccionCodigo };
    });
  };

  const handleSaveSection = (cursoId) => {
    if(!fSec) return alert("Ponle un código a la sección (ej. 852)");
    
    const nuevasClases = [];
    nuevasClases.push({ dia: Number(fD1), inicio: Number(fI1), fin: Number(fF1) });
    if(useBlock2) {
        nuevasClases.push({ dia: Number(fD2), inicio: Number(fI2), fin: Number(fF2) });
    }

    const nuevaSeccion = { codigo: fSec, docente: fDoc || 'Sin docente', clases: nuevasClases };

    setCustomData(prev => ({
        ...prev,
        [cursoId]: [...(prev[cursoId] || []), nuevaSeccion]
    }));

    // Limpiar formulario y cerrar
    setAddingFor(null);
    setFSec(''); setFDoc('');
  };

  const handleDeleteSection = (cursoId, secCodigo) => {
      setCustomData(prev => {
          const actualizadas = prev[cursoId].filter(s => s.codigo !== secCodigo);
          return { ...prev, [cursoId]: actualizadas };
      });
      // Si estaba seleccionada, deseleccionarla
      if(seleccionados[cursoId] === secCodigo) {
          handleSelect(cursoId, secCodigo);
      }
  };

  const grid = useMemo(() => {
    let layout = Array(15).fill().map(() => Array(6).fill(null));
    let hayCruce = false;

    cursosParaLlevar.forEach((curso, index) => {
      const seccionActivaId = seleccionados[curso.id];
      if (!seccionActivaId) return;

      const seccion = curso.secciones.find(s => s.codigo === seccionActivaId);
      if (!seccion) return;

      const colores = ['bg-blue-100 border-blue-400', 'bg-purple-100 border-purple-400', 'bg-green-100 border-green-400', 'bg-orange-100 border-orange-400', 'bg-pink-100 border-pink-400'];
      const colorClase = colores[index % colores.length];

      seccion.clases.forEach(clase => {
        for (let h = clase.inicio; h < clase.fin; h++) {
          const fila = h - 7;
          const col = clase.dia - 1;
          
          if(fila < 0 || fila >= 15) continue; // Evitar crash si ingresan horas raras

          if (layout[fila][col]) {
            layout[fila][col] = { nombre: '¡CRUCE!', color: 'bg-red-500 text-white animate-pulse shadow-inner' };
            hayCruce = true;
          } else {
            layout[fila][col] = { nombre: curso.name, sec: seccion.codigo, color: colorClase };
          }
        }
      });
    });
    return { layout, hayCruce };
  }, [seleccionados, cursosParaLlevar]);

  if (cursosParaLlevar.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
        <div className="text-center text-gray-500 bg-white p-8 rounded-xl shadow border">
          <p className="text-xl font-bold mb-2">No tienes cursos "Para llevar"</p>
          <p>Ve a la Malla Curricular y marca algunos cursos para poder armar tu horario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-4 sm:p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto min-h-[800px]">
        
        {/* PANEL IZQUIERDO: SELECTOR E INGRESADOR DE CURSOS */}
        <div className="w-full lg:w-[400px] bg-white rounded-xl shadow-lg p-5 flex flex-col border border-gray-200 shrink-0">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Cursos por llevar</h2>
          <div className="overflow-y-auto pr-2 space-y-4 flex-1">
            {cursosParaLlevar.map(curso => (
              <div key={curso.id} className="border rounded-lg overflow-hidden border-gray-300 shadow-sm">
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 font-bold text-sm text-gray-800 flex justify-between items-center">
                  <span className="truncate pr-2">{curso.name}</span>
                  <button onClick={() => setAddingFor(addingFor === curso.id ? null : curso.id)} className="bg-white border border-gray-300 px-2 py-0.5 rounded text-xs hover:bg-gray-50">+ Añadir</button>
                </div>
                
                <div className="p-2 space-y-2 bg-gray-50">
                  {curso.secciones.length === 0 && addingFor !== curso.id && (
                     <p className="text-xs text-gray-400 italic p-1 text-center">Sin secciones. Añade una.</p>
                  )}
                  
                  {/* LISTA DE SECCIONES GUARDADAS */}
                  {curso.secciones.map(sec => {
                    const isActive = seleccionados[curso.id] === sec.codigo;
                    return (
                      <div key={sec.codigo} className="flex gap-1">
                          <div onClick={() => handleSelect(curso.id, sec.codigo)} className={`flex-1 cursor-pointer text-xs p-2 rounded border transition-colors flex justify-between items-center ${isActive ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>
                            <div>
                                <span className="font-bold">Sec. {sec.codigo}</span>
                                <p className="text-gray-500 text-[10px] truncate max-w-[180px]">{sec.docente}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'bg-indigo-500 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteSection(curso.id, sec.codigo)} className="bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 px-2 rounded flex items-center justify-center" title="Eliminar sección">X</button>
                      </div>
                    );
                  })}

                  {/* FORMULARIO PARA AÑADIR SECCIÓN */}
                  {addingFor === curso.id && (
                      <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-inner mt-2">
                          <p className="text-xs font-bold text-blue-800 mb-2 border-b pb-1">Nueva Sección</p>
                          <div className="flex gap-2 mb-2">
                              <input type="text" placeholder="Sección (ej. 852)" className="w-1/3 border rounded px-2 py-1 text-xs" value={fSec} onChange={e => setFSec(e.target.value)} />
                              <input type="text" placeholder="Docente" className="w-2/3 border rounded px-2 py-1 text-xs" value={fDoc} onChange={e => setFDoc(e.target.value)} />
                          </div>
                          
                          <div className="bg-gray-50 p-2 rounded border text-xs space-y-2 mb-2">
                              <div className="flex gap-2 items-center">
                                  <span className="font-bold w-12">Clase 1:</span>
                                  <select className="border rounded px-1 py-1 flex-1" value={fD1} onChange={e=>setFD1(e.target.value)}>
                                      {diasStr.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                                  </select>
                                  <input type="number" min="7" max="21" className="w-12 border rounded px-1 py-1" value={fI1} onChange={e=>setFI1(e.target.value)} /> a
                                  <input type="number" min="8" max="22" className="w-12 border rounded px-1 py-1" value={fF1} onChange={e=>setFF1(e.target.value)} />
                              </div>
                              
                              {useBlock2 && (
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold w-12">Clase 2:</span>
                                    <select className="border rounded px-1 py-1 flex-1" value={fD2} onChange={e=>setFD2(e.target.value)}>
                                        {diasStr.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                                    </select>
                                    <input type="number" min="7" max="21" className="w-12 border rounded px-1 py-1" value={fI2} onChange={e=>setFI2(e.target.value)} /> a
                                    <input type="number" min="8" max="22" className="w-12 border rounded px-1 py-1" value={fF2} onChange={e=>setFF2(e.target.value)} />
                                </div>
                              )}
                              
                              <label className="flex items-center gap-1 cursor-pointer pt-1">
                                  <input type="checkbox" checked={useBlock2} onChange={() => setUseBlock2(!useBlock2)} /> 
                                  Tiene un segundo día de clases
                              </label>
                          </div>
                          <button onClick={() => handleSaveSection(curso.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded text-xs transition-colors">Guardar Sección</button>
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: CALENDARIO */}
        <div className="w-full lg:flex-1 bg-white rounded-xl shadow-lg p-5 flex flex-col border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tu Horario</h2>
            {grid.hayCruce ? 
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold border border-red-300">⚠️ HAY CRUCE</span> : 
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-300">✅ LIMPIO</span>
            }
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-[600px]">
            <div className="bg-gray-100 p-2 font-bold text-center text-xs flex items-center justify-center">HORA</div>
            {diasStr.map(d => <div key={d} className="bg-gray-100 p-2 font-bold text-center text-[10px] uppercase flex items-center justify-center">{d}</div>)}
            
            {horas.map(hora => (
              <React.Fragment key={hora}>
                <div className="bg-white p-1 text-center text-[10px] font-medium text-gray-500 flex items-center justify-center border-b border-gray-100">
                  {hora}:00<br/>{hora+1}:00
                </div>
                {diasStr.map((_, diaIdx) => {
                  const celda = grid.layout[hora - 7][diaIdx];
                  return (
                    <div key={`${hora}-${diaIdx}`} className={`bg-white p-0.5 relative border-b border-gray-100`}>
                      {celda && (
                        <div className={`absolute inset-0.5 rounded border p-1 flex flex-col justify-center items-center shadow-sm ${celda.color}`}>
                          <span className="text-[10px] font-bold leading-tight text-center truncate w-full text-gray-800">{celda.nombre}</span>
                          {celda.sec && <span className="text-[9px] opacity-80 mt-0.5 text-gray-700">Sec. {celda.sec}</span>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}