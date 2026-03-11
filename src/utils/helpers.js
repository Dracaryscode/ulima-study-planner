import { COURSES } from '../data/courses';

// Verifica si todos los cursos obligatorios de un ciclo (y anteriores) están aprobados
export const isCycleCompleted = (cycle, completedIds) => {
  const cycleCourses = COURSES.filter(c => c.level <= cycle && c.type === 'mandatory');
  return cycleCourses.every(c => completedIds.has(c.id));
};

export const getCourseStatus = (course, completedIds, plannedIds) => {
  if (completedIds.has(course.id)) return 'completed';
  if (plannedIds.has(course.id)) return 'planned';

  const allReqsMet = course.reqs.every(reqId => completedIds.has(reqId));
  
  // Si el curso exige haber culminado un ciclo completo (Ej: V ciclo para electivos)
  const minLevelMet = course.minLevelCompleted ? isCycleCompleted(course.minLevelCompleted, completedIds) : true;

  return (allReqsMet && minLevelMet) ? 'available' : 'locked';
};

export const getLevelCourses = (level) => COURSES.filter(c => c.level === level);