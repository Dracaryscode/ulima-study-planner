import { Check, Lock, Unlock, Bookmark, Info } from './Icons';

export function CourseCard({ course, status, isHovered, onToggle, onMouseEnter, onMouseLeave, specializations = [] }) {
  // Se quitó "flex flex-col h-full" de aquí
  let cardClass = "p-3 rounded-lg border transition-all duration-200 cursor-pointer relative shadow-sm ";
  
  if (status === 'completed') cardClass += "bg-emerald-50 border-emerald-500 text-emerald-900";
  else if (status === 'planned') cardClass += "bg-indigo-50 border-indigo-400 text-indigo-900 ring-1 ring-indigo-400";
  else if (status === 'available') cardClass += "bg-white border-blue-400 text-gray-800 hover:shadow-md hover:border-blue-600";
  else cardClass += "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed grayscale opacity-80";
  
  if (isHovered && status !== 'locked') cardClass += " ring-2 ring-blue-300 ring-offset-1";

  return (
    <div 
      id={`course-${course.id}`} 
      className={cardClass} 
      onClick={() => onToggle(course.id, status, course.credits)} 
      onMouseEnter={() => onMouseEnter(course.id)} 
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-mono opacity-70">{course.id}</span>
        {status === 'completed' && <Check size={14} className="text-emerald-600" />}
        {status === 'planned' && <Bookmark size={14} className="text-indigo-600" />}
        {status === 'locked' && <Lock size={14} className="text-gray-400" />}
        {status === 'available' && <Unlock size={14} className="text-blue-500" />}
      </div>
      
      {/* Se quitó "flex-1" de aquí */}
      <h3 className="text-xs font-bold leading-tight mb-2 min-h-[2.5em] flex items-center">
        {course.name}
      </h3>
      
      <div className="flex justify-between items-center mt-2 border-t pt-2 border-opacity-20 border-black">
         <span className="text-[10px] font-medium">{course.credits} Cr.</span>
         {course.reqs.length > 0 ? (
           <span className="text-[10px] flex items-center gap-0.5" title={`Requiere: ${course.reqs.join(', ')}`}>
             <Info size={10} /> Reqs
           </span>
         ) : (
           <span className="text-[10px] text-gray-400">-</span>
         )}
      </div>

      {/* Etiquetas de Especializaciones */}
      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-black/10">
          {specializations.map(spec => (
            <span 
              key={spec.id} 
              title={`${spec.type}: ${spec.name}`}
              className={`text-[8.5px] leading-none px-1.5 py-1 rounded cursor-help truncate w-full ${
                spec.type === 'Diploma' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
              }`}
            >
              {spec.type === 'Diploma' ? '★ ' : '❖ '}{spec.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}