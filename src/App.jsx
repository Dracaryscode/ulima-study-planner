import { useState, useEffect, useRef } from 'react';
import { COURSES } from './data/courses';
import { CERTIFICATIONS } from './data/certifications';
import { getCourseStatus, getLevelCourses } from './utils/helpers';
import { CourseCard } from './components/CourseCard';

export default function App() {
  const initialCompleted = (() => {
    const saved = localStorage.getItem('studyPlan_completed');
    if (saved) return new Set(JSON.parse(saved));
    return new Set(COURSES.filter(c => c.level <= 5 && c.type === 'mandatory').map(c => c.id));
  })();

  const initialPlanned = (() => {
    const saved = localStorage.getItem('studyPlan_planned');
    if (saved) return new Set(JSON.parse(saved));
    return new Set();
  })();

  const [completed, setCompleted] = useState(initialCompleted);
  const [planned, setPlanned] = useState(initialPlanned);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [showSpecializations, setShowSpecializations] = useState(false);
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    localStorage.setItem('studyPlan_completed', JSON.stringify(Array.from(completed)));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem('studyPlan_planned', JSON.stringify(Array.from(planned)));
  }, [planned]);

  // --- CÁLCULO DE CRÉDITOS ---
  const completedCoursesObj = Array.from(completed).map(id => COURSES.find(c => c.id === id)).filter(Boolean);
  const mandatoryCredits = completedCoursesObj.filter(c => c.type === 'mandatory').reduce((sum, c) => sum + c.credits, 0);
  const electiveCredits = completedCoursesObj.filter(c => c.type === 'elective').reduce((sum, c) => sum + c.credits, 0);
  const generalStudiesCredits = 40; // Base por defecto del plan
  const totalCompletedCredits = generalStudiesCredits + mandatoryCredits + electiveCredits;

  const plannedCredits = Array.from(planned).reduce((sum, id) => {
     const course = COURSES.find(c => c.id === id);
     return sum + (course ? course.credits : 0);
  }, 0);

  const toggleCourse = (courseId, status, credits) => {
    if (status === 'locked') return;

    const newCompleted = new Set(completed);
    const newPlanned = new Set(planned);

    if (status === 'available') {
      if (plannedCredits + credits > 27) {
          // Ya no usa un alert feo, simplemente no hace nada. Podrías agregar un toast aquí.
          return;
      }
      newPlanned.add(courseId);
    } else if (status === 'planned') {
      newPlanned.delete(courseId);
      newCompleted.add(courseId);
    } else if (status === 'completed') {
      newCompleted.delete(courseId);
      const toRemove = [courseId];
      while (toRemove.length > 0) {
        const curr = toRemove.pop();
        if (newCompleted.has(curr)) newCompleted.delete(curr);
        if (newPlanned.has(curr)) newPlanned.delete(curr);
        const dependents = COURSES.filter(c => c.reqs.includes(curr)).map(c => c.id);
        toRemove.push(...dependents);
      }
    }
    setCompleted(newCompleted);
    setPlanned(newPlanned);
  };

  useEffect(() => {
    const calculateLines = () => {
      if (!containerRef.current) return;
      const newLines = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      COURSES.forEach(course => {
        const targetEl = document.getElementById(`course-${course.id}`);
        if (!targetEl) return;
        const targetRect = targetEl.getBoundingClientRect();
        const targetX = targetRect.left - containerRect.left;
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;

        course.reqs.forEach(reqId => {
          const sourceEl = document.getElementById(`course-${reqId}`);
          if (!sourceEl) return;
          const sourceRect = sourceEl.getBoundingClientRect();
          const sourceX = sourceRect.right - containerRect.left;
          const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;

          const isSourceCompleted = completed.has(reqId);
          const isTargetCompleted = completed.has(course.id) || planned.has(course.id);
          
          let stroke = '#e5e7eb', strokeWidth = 1.5, zIndex = 0, opacity = 0.6;
          if (hoveredCourse === reqId || hoveredCourse === course.id) {
            stroke = '#3b82f6'; strokeWidth = 3; zIndex = 10; opacity = 1;
          } else if (isSourceCompleted && isTargetCompleted) {
            stroke = completed.has(course.id) ? '#10b981' : '#6366f1'; strokeWidth = 2; opacity = 1;
          } else if (isSourceCompleted) {
             stroke = '#9ca3af'; strokeWidth = 2; opacity = 0.8;
          }

          newLines.push(
            <path key={`${reqId}-${course.id}`} d={`M ${sourceX} ${sourceY} C ${sourceX + 40} ${sourceY}, ${targetX - 40} ${targetY}, ${targetX} ${targetY}`} stroke={stroke} strokeWidth={strokeWidth} fill="none" opacity={opacity} style={{ transition: 'all 0.3s ease', zIndex }} />
          );
        });
      });
      setLines(newLines);
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);
    const timer = setTimeout(calculateLines, 100);
    return () => { window.removeEventListener('resize', calculateLines); clearTimeout(timer); };
  }, [completed, planned, hoveredCourse, showSpecializations]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* HEADER CON CONTADORES */}
      <div className="bg-white shadow-sm p-4 z-20 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 shrink-0 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Plan de Estudios</h1>
          <button onClick={() => setShowSpecializations(!showSpecializations)} className="text-sm text-blue-600 hover:underline font-medium mt-1">
            {showSpecializations ? 'Ver Malla Curricular' : 'Ver Certificaciones y Diplomas'}
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-500">Obligatorios</p>
            <p className="text-lg font-bold text-emerald-600">{mandatoryCredits} <span className="text-xs text-gray-400 font-normal">/ 144</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-gray-500">Electivos</p>
            <p className="text-lg font-bold text-blue-600">{electiveCredits} <span className="text-xs text-gray-400 font-normal">/ 21</span></p>
          </div>
          <div className="text-center bg-gray-100 px-3 py-1 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-gray-600">Total Carrera</p>
            <p className="text-xl font-black text-gray-800">{totalCompletedCredits} <span className="text-sm text-gray-500 font-normal">/ 205</span></p>
          </div>
          
          <div className={`px-4 py-1 rounded-lg border flex flex-col items-center justify-center transition-colors ${plannedCredits > 27 ? 'bg-red-50 border-red-400 text-red-700' : plannedCredits >= 21 ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
              <span className="text-[10px] font-semibold uppercase tracking-wide">Para llevar</span>
              <span className="text-lg font-bold">{plannedCredits} <span className="text-xs font-normal">/ 27</span></span>
          </div>
        </div>
      </div>

{/* VISTA DE CERTIFICACIONES */}
      {showSpecializations ? (
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-300 pb-3">Tu progreso en Especializaciones</h2>
            
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
              
              {/* COLUMNA IZQUIERDA: DIPLOMAS */}
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                    Diplomas de Especialidad
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Requieren 7 cursos electivos específicos (21-23 créditos)</p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {CERTIFICATIONS.filter(c => c.type === 'Diploma').map(cert => {
                    const completedReqs = cert.reqs.filter(id => completed.has(id));
                    const isFinished = completedReqs.length === cert.reqs.length;
                    const progress = (completedReqs.length / cert.reqs.length) * 100;

                    return (
                      <div key={cert.id} className={`p-5 rounded-xl border-2 transition-all flex flex-col ${isFinished ? 'bg-purple-50 border-purple-400 shadow-md' : 'bg-white border-gray-200 hover:border-purple-300'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-purple-100 text-purple-700">{cert.type}</span>
                          <span className="text-xs font-bold text-gray-500">{completedReqs.length} / {cert.reqs.length} cursos</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-base mb-4 flex-1">{cert.name}</h3>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden shrink-0">
                          <div className={`h-2 rounded-full transition-all duration-500 ${isFinished ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ width: `${progress}%` }}></div>
                        </div>

                        <ul className="space-y-2 mt-auto">
                          {cert.reqs.map(reqId => {
                            const course = COURSES.find(c => c.id === reqId);
                            const isDone = completed.has(reqId);
                            return (
                              <li key={reqId} className={`text-[11px] flex items-center gap-2 ${isDone ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full border flex-shrink-0 ${isDone ? 'bg-purple-500 border-purple-600' : 'bg-gray-100 border-gray-300'}`}></div>
                                {course ? course.name : reqId}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LÍNEA DIVISORIA EN PANTALLAS GRANDES */}
              <div className="hidden lg:block w-px bg-gray-300 shrink-0"></div>

              {/* COLUMNA DERECHA: CERTIFICACIONES */}
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    Certificaciones Parciales
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Requieren 3 cursos específicos (9-11 créditos)</p>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {CERTIFICATIONS.filter(c => c.type === 'Certificación').map(cert => {
                    const completedReqs = cert.reqs.filter(id => completed.has(id));
                    const isFinished = completedReqs.length === cert.reqs.length;
                    const progress = (completedReqs.length / cert.reqs.length) * 100;

                    return (
                      <div key={cert.id} className={`p-5 rounded-xl border-2 transition-all flex flex-col ${isFinished ? 'bg-blue-50 border-blue-400 shadow-md' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-blue-100 text-blue-700">{cert.type}</span>
                          <span className="text-xs font-bold text-gray-500">{completedReqs.length} / {cert.reqs.length} cursos</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-base mb-4 flex-1">{cert.name}</h3>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden shrink-0">
                          <div className={`h-2 rounded-full transition-all duration-500 ${isFinished ? 'bg-blue-600' : 'bg-blue-400'}`} style={{ width: `${progress}%` }}></div>
                        </div>

                        <ul className="space-y-2 mt-auto">
                          {cert.reqs.map(reqId => {
                            const course = COURSES.find(c => c.id === reqId);
                            const isDone = completed.has(reqId);
                            return (
                              <li key={reqId} className={`text-[11px] flex items-center gap-2 ${isDone ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full border flex-shrink-0 ${isDone ? 'bg-blue-500 border-blue-600' : 'bg-gray-100 border-gray-300'}`}></div>
                                {course ? course.name : reqId}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* VISTA DE MALLA CURRICULAR (ROADMAP) */
        <div className="flex-1 overflow-x-auto overflow-y-auto relative p-4 sm:p-8" ref={containerRef}>
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ minWidth: '2800px', minHeight: '100%' }}>{lines}</svg>
          
          <div className="flex gap-12" style={{ minWidth: 'max-content' }}>
            {/* Niveles Obligatorios 1-10 */}
            {Array.from({ length: 10 }).map((_, i) => {
              const level = i + 1;
              return (
                <div key={level} className="flex flex-col gap-4 w-48 relative z-10">
                  <div className="text-center mb-2"><span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">Nivel {level}</span></div>
                  {getLevelCourses(level).map(course => (
                    <CourseCard 
  key={course.id} 
  course={course} 
  status={getCourseStatus(course, completed, planned)} 
  isHovered={hoveredCourse === course.id} 
  onToggle={toggleCourse} 
  onMouseEnter={setHoveredCourse} 
  onMouseLeave={() => setHoveredCourse(null)} 
  specializations={CERTIFICATIONS.filter(cert => cert.reqs.includes(course.id))}
/>
                  ))}
                </div>
              );
            })}

            {/* Separador Visual para Electivos */}
            <div className="w-px bg-dashed border-l-2 border-dashed border-gray-300 mx-4"></div>

            {/* Columna Ancha de Electivos */}
            <div className="flex flex-col gap-4 w-96 relative z-10">
              <div className="text-center mb-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
                  Bolsa de Electivos (Nivel E)
                </span>
                <p className="text-[10px] text-gray-500 mt-1">Se desbloquean al culminar el 5to ciclo</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {getLevelCourses('E').map(course => (
                  <CourseCard 
  key={course.id} 
  course={course} 
  status={getCourseStatus(course, completed, planned)} 
  isHovered={hoveredCourse === course.id} 
  onToggle={toggleCourse} 
  onMouseEnter={setHoveredCourse} 
  onMouseLeave={() => setHoveredCourse(null)} 
  specializations={CERTIFICATIONS.filter(cert => cert.reqs.includes(course.id))}
/>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white border-t p-3 text-xs text-gray-500 text-center z-20 shrink-0">
        Haz clic en un curso para cambiar su estado: <strong>Disponible ➔ Para llevar ➔ Aprobado ➔ Disponible</strong>.
      </div>
    </div>
  );
}