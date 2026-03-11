export const COURSES = [
  // --- OBLIGATORIOS ---
  { id: '510003', name: 'Lenguaje y Comunicación I', level: 1, credits: 4, reqs: [], type: 'mandatory' },
  { id: '510005', name: 'Introducción a la Ingeniería', level: 1, credits: 3, reqs: [], type: 'mandatory' },
  { id: '6505',   name: 'Desarrollo Personal y Social', level: 1, credits: 3, reqs: [], type: 'mandatory' },
  { id: '6508',   name: 'Metodologías de Investigación', level: 1, credits: 3, reqs: [], type: 'mandatory' },
  { id: '510004', name: 'Ética Cívica', level: 1, credits: 2, reqs: [], type: 'mandatory' },
  { id: '6382',   name: 'Matemática Básica', level: 1, credits: 5, reqs: [], type: 'mandatory' },
  
  { id: '6511',   name: 'Lenguaje y Comunicación II', level: 2, credits: 3, reqs: ['510003'], type: 'mandatory' },
  { id: '6512',   name: 'Procesos Sociales y Políticos', level: 2, credits: 3, reqs: [], type: 'mandatory' },
  { id: '6384',   name: 'Álgebra Lineal', level: 2, credits: 3, reqs: ['6382'], type: 'mandatory' },
  { id: '6510',   name: 'Economía y Empresa', level: 2, credits: 3, reqs: [], type: 'mandatory' },
  { id: '6513',   name: 'Temas de Filosofía', level: 2, credits: 3, reqs: [], type: 'mandatory' },
  { id: '6503',   name: 'Cálculo I', level: 2, credits: 5, reqs: ['6382'], type: 'mandatory' },
  
  { id: '560042', name: 'Cálculo II', level: 3, credits: 5, reqs: ['6503'], type: 'mandatory' },
  { id: '560038', name: 'Sistemas Organizacionales', level: 3, credits: 2, reqs: ['6510'], type: 'mandatory' },
  { id: '650053', name: 'Física para Sistemas', level: 3, credits: 4, reqs: [], type: 'mandatory' }, 
  { id: '650054', name: 'Introducción a la Programación', level: 3, credits: 4, reqs: [], type: 'mandatory' },
  { id: '560040', name: 'Inteligencia Artificial Aplicada', level: 3, credits: 3, reqs: [], type: 'mandatory' },
  { id: '650055', name: 'Estructuras Discretas de Computación', level: 3, credits: 4, reqs: [], type: 'mandatory' },
  
  { id: '560047', name: 'Cálculo III', level: 4, credits: 3, reqs: ['560042'], type: 'mandatory' },
  { id: '560046', name: 'Estadística y Probabilidad', level: 4, credits: 4, reqs: ['6503'], type: 'mandatory' },
  { id: '650008', name: 'Modelación e Integración de Sist.', level: 4, credits: 3, reqs: ['560040'], type: 'mandatory' },
  { id: '650056', name: 'Arquitectura de Computadoras', level: 4, credits: 4, reqs: ['650053'], type: 'mandatory' },
  { id: '560043', name: 'Costeo de Operaciones', level: 4, credits: 3, reqs: ['560038'], type: 'mandatory' },
  { id: '650086', name: 'Programación Orientada a Objetos', level: 4, credits: 4, reqs: ['650054', '650055'], type: 'mandatory' },
  
  { id: '560048', name: 'Investigación de Operaciones I', level: 5, credits: 4, reqs: ['560047', '560046'], type: 'mandatory' },
  { id: '650057', name: 'Sistemas Operativos', level: 5, credits: 4, reqs: ['650056'], type: 'mandatory' },
  { id: '650058', name: 'Estadística Aplicada', level: 5, credits: 4, reqs: ['560046'], type: 'mandatory' }, 
  { id: '650009', name: 'Desarrollo de Competencias Gerenciales', level: 5, credits: 3, reqs: [], type: 'mandatory' },
  { id: '650059', name: 'Estructuras de Datos I', level: 5, credits: 4, reqs: ['650086'], type: 'mandatory' },
  { id: '650060', name: 'Modelamiento de Base de Datos', level: 5, credits: 4, reqs: ['650086'], type: 'mandatory' },
  
  { id: '650010', name: 'Ingeniería de Procesos de Negocio', level: 6, credits: 3, reqs: ['560048'], type: 'mandatory' },
  { id: '650015', name: 'Redes de Computadoras', level: 6, credits: 4, reqs: ['650057'], type: 'mandatory' },
  { id: '650018', name: 'Simulación', level: 6, credits: 3, reqs: ['650008'], type: 'mandatory' },
  { id: '650061', name: 'Estructuras de Datos II', level: 6, credits: 4, reqs: ['650059'], type: 'mandatory' },
  { id: '650022', name: 'Programación Web', level: 6, credits: 3, reqs: ['650059'], type: 'mandatory' },
  { id: '650016', name: 'Gestión Financiera', level: 6, credits: 3, reqs: ['560043'], type: 'mandatory' },
  
  { id: '650062', name: 'Sistemas de Inteligencia Empresarial', level: 7, credits: 4, reqs: ['650060'], type: 'mandatory' },
  { id: '650019', name: 'Gestión de Operaciones', level: 7, credits: 3, reqs: ['650010'], type: 'mandatory' },
  { id: '650063', name: 'Ingeniería de Software I', level: 7, credits: 4, reqs: ['650060'], type: 'mandatory' },
  { id: '650064', name: 'Machine Learning', level: 7, credits: 4, reqs: ['650058'], type: 'mandatory' },
  { id: '650065', name: 'Ciberseguridad', level: 7, credits: 4, reqs: ['650015'], type: 'mandatory' },
  
  { id: '650066', name: 'Propuesta de Investigación', level: 8, credits: 3, reqs: ['650018', '650019'], type: 'mandatory' },
  { id: '650028', name: 'Sistemas ERP', level: 8, credits: 3, reqs: ['650019'], type: 'mandatory' },
  { id: '650042', name: 'Auditoría y Control de Sistemas', level: 8, credits: 3, reqs: ['650016'], type: 'mandatory' },
  { id: '1327',   name: 'Ingeniería de Software II', level: 8, credits: 4, reqs: ['650063'], type: 'mandatory' },
  
  { id: '650033', name: 'Planeamiento Estratégico', level: 9, credits: 3, reqs: [], type: 'mandatory' },
  { id: '5674',   name: 'Gestión de Proyectos', level: 9, credits: 3, reqs: ['650042'], type: 'mandatory' },
  { id: '650035', name: 'Seminario de Investigación I', level: 9, credits: 4, reqs: ['650066'], type: 'mandatory' },
  { id: '650067', name: 'Seguridad de Sistemas', level: 9, credits: 4, reqs: ['650065'], type: 'mandatory' },
  
  { id: '650040', name: 'Seminario de Investigación II', level: 10, credits: 4, reqs: ['650035'], type: 'mandatory' },
  { id: '650068', name: 'Gestión de Servicios Digitales', level: 10, credits: 4, reqs: ['5674'], type: 'mandatory' },
  { id: '650069', name: 'Proyecto Integrador de Sistemas', level: 10, credits: 4, reqs: ['5674'], type: 'mandatory' },

  // --- ELECTIVOS ---
  { id: '650070', name: 'Paradigmas de Programación', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650012', name: 'Internet de las Cosas (IoT)', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650071', name: 'Gestión de Base de Datos', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650072', name: 'Análisis y Diseño de Algoritmos', level: 'E', credits: 3, reqs: ['650061'], minLevelCompleted: 5, type: 'elective' }, // Req: Estructuras de Datos II
  { id: '650073', name: 'Redes Avanzadas', level: 'E', credits: 3, reqs: ['650015'], minLevelCompleted: 5, type: 'elective' }, // Req: Redes de Computadoras
  { id: '650074', name: 'Ingeniería del Conocimiento', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650075', name: 'Deep Learning', level: 'E', credits: 3, reqs: ['650064'], minLevelCompleted: 5, type: 'elective' }, // Req: Machine Learning
  { id: '650030', name: 'Programación Móvil', level: 'E', credits: 3, reqs: ['650022'], minLevelCompleted: 5, type: 'elective' }, // Req: Programación Web
  { id: '650076', name: 'Tópicos Avanzados en Ciberseguridad', level: 'E', credits: 3, reqs: ['650065'], minLevelCompleted: 5, type: 'elective' }, // Req: Ciberseguridad
  { id: '650077', name: 'Sistemas Distribuidos', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650044', name: 'Analítica con Big Data', level: 'E', credits: 3, reqs: ['650062'], minLevelCompleted: 5, type: 'elective' }, // Req: Sis. Inteligencia Empresarial
  { id: '650078', name: 'Analítica de Negocios', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650079', name: 'Proyecto de Desarrollo de Software', level: 'E', credits: 3, reqs: ['1327'], minLevelCompleted: 5, type: 'elective' }, // Req: Ing. de Software II
  { id: '650025', name: 'Computación en la Nube', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650080', name: 'Innovación Digital', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650081', name: 'Proyecto de Videojuegos', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650082', name: 'Arquitectura Empresarial', level: 'E', credits: 3, reqs: ['650033'], minLevelCompleted: 5, type: 'elective' }, // Req: Planeamiento Estratégico
  { id: '650011', name: 'Interacción Humano Computadora', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650083', name: 'Arquitectura de Tecnologías de la Información', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650084', name: 'Devops', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '650085', name: 'Arquitectura de Software', level: 'E', credits: 3, reqs: [], minLevelCompleted: 5, type: 'elective' },
  { id: '520074', name: 'Seguridad, Salud Ocupacional y Bienestar Org.', level: 'E', credits: 3, reqs: [], minLevelCompleted: 6, type: 'elective' }, // Req: Culminado VI ciclo
  
  // --- CURSOS DE COMUNICACIONES PARA DIPLOMA DE VIDEOJUEGOS ---
  { id: '550001', name: 'Storytelling', level: 'E', credits: 3, reqs: [], type: 'elective' },
  { id: '550043', name: 'Diseño de Videojuegos', level: 'E', credits: 5, reqs: ['550001'], type: 'elective' },
  { id: '550029', name: 'Narrativa Gráfica', level: 'E', credits: 3, reqs: ['550001'], type: 'elective' },
];