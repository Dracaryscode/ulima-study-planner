import React, { useState, useMemo, useEffect } from 'react';
import { COURSES } from '../data/courses';

const diasStr = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horas = Array.from({length: 15}, (_, i) => i + 7);

export function Scheduler({ plannedIds }) {
  const [customData, setCustomData] = useState(() => {
    const saved = localStorage.getItem('studyPlan_sections');
    return saved ? JSON.parse(saved) : {};
  });

  const [seleccionados, setSeleccionados] = useState({});
  const [savedCombinations, setSavedCombinations] = useState(() => {
    const saved = localStorage.getItem('studyPlan_combinations');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeFormCurso, setActiveFormCurso] = useState(null);
  const [editingSecCode, setEditingSecCode] = useState(null);

  const [fSec, setFSec] = useState('');
  const [fDoc, setFDoc] = useState('');
  const [fD1, setFD1] = useState(1); const [fI1, setFI1] = useState(7); const [fF1, setFF1] = useState(9);
  const [fD2, setFD2] = useState(3); const [fI2, setFI2] = useState(7); const [fF2, setFF2] = useState(9);
  const [useBlock2, setUseBlock2] = useState(false);

  useEffect(() => {
    localStorage.setItem('studyPlan_sections', JSON.stringify(customData));
  }, [customData]);

  useEffect(() => {
    localStorage.setItem('studyPlan_combinations', JSON.stringify(savedCombinations));
  }, [savedCombinations]);

  // ORDENAMIENTO INTELIGENTE DE CURSOS
  const cursosParaLlevar = Array.from(plannedIds).map(id => {
    const infoCurso = COURSES.find(c => c.id === id);
    if (!infoCurso) return null; 
    const seccionesDisp = customData[id] || [];
    return { ...infoCurso, secciones: seccionesDisp };
  }).filter(Boolean).sort((a, b) => {
    // 1ro: Obligatorios arriba, Electivos abajo
    if (a.type !== b.type) return a.type === 'mandatory' ? -1 : 1;
    // 2do: Si son obligatorios, ordenar por Nivel (1 al 10)
    if (a.type === 'mandatory') return a.level - b.level;
    // 3ro: Si son electivos, ordenar por nivel de desbloqueo oculto
    return (a.minLevelCompleted || 5) - (b.minLevelCompleted || 5);
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

  const openAddForm = (cursoId) => {
    if (activeFormCurso === cursoId && !editingSecCode) {
      setActiveFormCurso(null);
      return;
    }
    setActiveFormCurso(cursoId);
    setEditingSecCode(null);
    setFSec(''); setFDoc('');
    setFD1(1); setFI1(7); setFF1(9);
    setFD2(3); setFI2(7); setFF2(9);
    setUseBlock2(false);
  };

  const openEditForm = (cursoId, sec) => {
    setActiveFormCurso(cursoId);
    setEditingSecCode(sec.codigo);
    setFSec(sec.codigo);
    setFDoc(sec.docente);
    
    if (sec.clases[0]) {
      setFD1(sec.clases[0].dia); setFI1(sec.clases[0].inicio); setFF1(sec.clases[0].fin);
    }
    
    if (sec.clases[1]) {
      setUseBlock2(true);
      setFD2(sec.clases[1].dia); setFI2(sec.clases[1].inicio); setFF2(sec.clases[1].fin);
    } else {
      setUseBlock2(false);
      setFD2(3); setFI2(7); setFF2(9);
    }
  };

  const handleSaveSection = (cursoId) => {
    if(!fSec) return alert("Ponle un código a la sección (ej. 852)");
    
    const nuevasClases = [];
    nuevasClases.push({ dia: Number(fD1), inicio: Number(fI1), fin: Number(fF1) });
    if(useBlock2) {
        nuevasClases.push({ dia: Number(fD2), inicio: Number(fI2), fin: Number(fF2) });
    }

    const nuevaSeccion = { codigo: fSec, docente: fDoc || 'Sin docente', clases: nuevasClases };

    setCustomData(prev => {
      const actual = prev[cursoId] || [];
      if (editingSecCode) {
        return { ...prev, [cursoId]: actual.map(s => s.codigo === editingSecCode ? nuevaSeccion : s) };
      } else {
        return { ...prev, [cursoId]: [...actual, nuevaSeccion] };
      }
    });

    if (editingSecCode && editingSecCode !== fSec) {
        setSeleccionados(prev => {
            if (prev[cursoId] === editingSecCode) return { ...prev, [cursoId]: fSec };
            return prev;
        });
    }

    setActiveFormCurso(null);
    setEditingSecCode(null);
  };

  const handleDeleteSection = (cursoId, secCodigo) => {
      setCustomData(prev => {
          const actualizadas = prev[cursoId].filter(s => s.codigo !== secCodigo);
          return { ...prev, [cursoId]: actualizadas };
      });
      if(seleccionados[cursoId] === secCodigo) handleSelect(cursoId, secCodigo);
  };

  const handleSaveCombination = () => {
    if (Object.keys(seleccionados).length === 0) return alert("Primero selecciona al menos una sección en el panel izquierdo.");
    const defaultName = `Plan ${String.fromCharCode(65 + savedCombinations.length)}`;
    const name = prompt("Ponle un nombre a este horario:", defaultName);
    if (name) {
      setSavedCombinations([...savedCombinations, { id: Date.now(), name, data: { ...seleccionados } }]);
    }
  };

  const handleLoadCombination = (comboData) => setSeleccionados(comboData);

  const handleDeleteCombination = (idToDelete) => {
    if(confirm("¿Seguro que deseas borrar este plan guardado?")) {
      setSavedCombinations(savedCombinations.filter(c => c.id !== idToDelete));
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
          
          if(fila < 0 || fila >= 15) continue; 

          if (layout[fila][col]) {
            layout[fila][col] = { nombre: '¡CRUCE!', color: 'bg-red-500 text-white animate-pulse shadow-inner border-red-700' };
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
        
        {/* PANEL IZQUIERDO: SELECTOR E INGRESADOR */}
        <div className="w-full lg:w-[400px] bg-white rounded-xl shadow-lg p-5 flex flex-col border border-gray-200 shrink-0">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Cursos por llevar</h2>
          <div className="overflow-y-auto pr-2 space-y-4 flex-1">
            {cursosParaLlevar.map(curso => (
              <div key={curso.id} className="border rounded-lg overflow-hidden border-gray-300 shadow-sm">
                
                {/* HEADER CON ETIQUETAS */}
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-800 truncate pr-2">{curso.name}</span>
                    <button onClick={() => openAddForm(curso.id)} className="bg-white border border-gray-300 px-2 py-0.5 rounded text-xs hover:bg-gray-100 shadow-sm shrink-0">+ Añadir</button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border ${curso.type === 'mandatory' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {curso.type === 'mandatory' ? 'Obligatorio' : 'Electivo'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide bg-white text-gray-600 border border-gray-300">
                        {curso.type === 'mandatory' ? `Nivel ${curso.level}` : `A partir de Nv. ${curso.minLevelCompleted || 5}`}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{curso.credits} Cr.</span>
                  </div>
                </div>
                
                <div className="p-2 space-y-2 bg-white">
                  {curso.secciones.length === 0 && activeFormCurso !== curso.id && (
                     <p className="text-xs text-gray-400 italic p-1 text-center">Sin secciones. Añade una.</p>
                  )}
                  
                  {curso.secciones.map(sec => {
                    const isActive = seleccionados[curso.id] === sec.codigo;
                    const isEditingThis = activeFormCurso === curso.id && editingSecCode === sec.codigo;
                    
                    return (
                      <div key={sec.codigo} className={`flex gap-1 ${isEditingThis ? 'opacity-50 pointer-events-none' : ''}`}>
                          <div onClick={() => handleSelect(curso.id, sec.codigo)} className={`flex-1 cursor-pointer text-xs p-2 rounded border transition-colors flex justify-between items-center ${isActive ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white hover:bg-gray-50 border-gray-300'}`}>
                            <div>
                                <span className="font-bold">Sec. {sec.codigo}</span>
                                <p className="text-gray-500 text-[10px] truncate max-w-[180px]">{sec.docente}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? 'bg-indigo-500 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => openEditForm(curso.id, sec)} className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-2 rounded text-[10px]" title="Editar sección">✏️</button>
                            <button onClick={() => handleDeleteSection(curso.id, sec.codigo)} className="flex-1 bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 px-2 rounded text-[10px] font-bold" title="Eliminar sección">X</button>
                          </div>
                      </div>
                    );
                  })}

                  {activeFormCurso === curso.id && (
                      <div className="bg-gray-50 p-3 border border-blue-300 rounded-lg shadow-inner mt-2">
                          <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                            <p className="text-xs font-bold text-blue-800">{editingSecCode ? 'Editar Sección' : 'Nueva Sección'}</p>
                            <button onClick={() => setActiveFormCurso(null)} className="text-[10px] text-gray-500 hover:text-red-500">Cerrar</button>
                          </div>

                          <div className="flex gap-2 mb-2">
                              <input type="text" placeholder="Sección (ej. 852)" className="w-1/3 border rounded px-2 py-1 text-xs" value={fSec} onChange={e => setFSec(e.target.value)} />
                              <input type="text" placeholder="Docente" className="w-2/3 border rounded px-2 py-1 text-xs" value={fDoc} onChange={e => setFDoc(e.target.value)} />
                          </div>
                          
                          <div className="bg-white p-2 rounded border border-gray-200 text-xs space-y-2 mb-2 shadow-sm">
                              <div className="flex gap-2 items-center">
                                  <span className="font-bold w-12 text-gray-600">Día 1:</span>
                                  <select className="border rounded px-1 py-1 flex-1 bg-white" value={fD1} onChange={e=>setFD1(e.target.value)}>
                                      {diasStr.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                                  </select>
                                  <input type="number" min="7" max="21" className="w-12 border rounded px-1 py-1" value={fI1} onChange={e=>setFI1(e.target.value)} /> a
                                  <input type="number" min="8" max="22" className="w-12 border rounded px-1 py-1" value={fF1} onChange={e=>setFF1(e.target.value)} />
                              </div>
                              
                              {useBlock2 && (
                                <div className="flex gap-2 items-center">
                                    <span className="font-bold w-12 text-gray-600">Día 2:</span>
                                    <select className="border rounded px-1 py-1 flex-1 bg-white" value={fD2} onChange={e=>setFD2(e.target.value)}>
                                        {diasStr.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                                    </select>
                                    <input type="number" min="7" max="21" className="w-12 border rounded px-1 py-1" value={fI2} onChange={e=>setFI2(e.target.value)} /> a
                                    <input type="number" min="8" max="22" className="w-12 border rounded px-1 py-1" value={fF2} onChange={e=>setFF2(e.target.value)} />
                                </div>
                              )}
                              
                              <label className="flex items-center gap-1 cursor-pointer pt-1 text-gray-600 font-medium">
                                  <input type="checkbox" checked={useBlock2} onChange={() => setUseBlock2(!useBlock2)} className="rounded text-blue-600" /> 
                                  Tiene un segundo día de clases
                              </label>
                          </div>
                          <button onClick={() => handleSaveSection(curso.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded text-xs transition-colors shadow-sm">
                            {editingSecCode ? 'Actualizar Sección' : 'Guardar Sección'}
                          </button>
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: CALENDARIO */}
        <div className="w-full lg:flex-1 bg-white rounded-xl shadow-lg p-5 flex flex-col border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 shrink-0">Tu Horario</h2>
            <div className="flex-1 flex flex-wrap gap-2 items-center justify-end">
                {savedCombinations.map(combo => (
                   <div key={combo.id} className="flex bg-indigo-50 border border-indigo-200 rounded overflow-hidden shadow-sm transition-all hover:shadow">
                      <button onClick={() => handleLoadCombination(combo.data)} className="px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors">
                        {combo.name}
                      </button>
                      <button onClick={() => handleDeleteCombination(combo.id)} className="px-2 py-1.5 text-xs font-bold text-indigo-300 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-indigo-200" title="Borrar combinación">X</button>
                   </div>
                ))}
                <button onClick={handleSaveCombination} className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-colors flex items-center gap-1">
                    <span>💾</span> Guardar combinación actual
                </button>
            </div>
            <div className="shrink-0">
                {grid.hayCruce ? 
                <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-300 flex items-center gap-1 shadow-sm">⚠️ HAY CRUCE</span> : 
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-300 flex items-center gap-1 shadow-sm">✅ LIMPIO</span>
                }
            </div>
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