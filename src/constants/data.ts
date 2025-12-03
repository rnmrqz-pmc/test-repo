
// ===============================
// Constants Data
// ===============================
// This contains the constants used in the training module of the application
// such as the list of training sources, delivery methods, statuses, etc.
// ===============================

export const CERTIFICATE_LIST = [
    'Apple Teacher Certification',
    'Apple Certified Support Professionals',
    'Apple Certified Support Professionals - macOS and iOS',
    'Apple Certified Trainer - macOS',
    'Apple Certified Trainer T3 - iOS Deployment',
    'Apple Certified Trainer T3 - Introduction to Swift',
    'Apple Certified Trainer T3 - iOS SDK',
    'Apple Certified Trainer - Final Cut Pro X',
    'Apple Certified Pro - Logic Pro',
    'Apple Professional Learning Specialist',
    'Apple Teacher',
    'Adobe Creative Educator Level 1',
    'Adobe Creative Educator Level 2',
    'Adobe Premier and After Effects',
    'Canva Teacher Essentials',
    'Canva Graphic Design Essentials',
    'Certified Microsoft Innovative Educator',
    'Google Certified Educator Level 1',
    'Google Certified Educator Level 2',
    'Google Guides',
    'Swift and Unity Game Developer',
]

export const TRAINING_CONSTANTS = {
  TRAINING_SOURCES: [
    { ID: 1, name: 'Education Team Request' },
    { ID: 2, name: 'Enterprise Team Request' },
    { ID: 3, name: 'Marketing Team Request' },
    { ID: 4, name: 'Basecamp Initiative' },
    { ID: 5, name: 'Others' }
  ],

  DELIVERY_METHODS: [
    { ID: 1, name: 'One-on-One Tutorial' },
    { ID: 2, name: 'Classroom Session with Hands-On' },
    { ID: 3, name: 'Plenary Session without Hands-On' },
    // { ID: 4, name: 'Virtual' }
  ],

  TRAINING_STATUSES: [
    { ID: 1, name: 'Planned' },
    { ID: 2, name: 'On-Going' },
    // { ID: 3, name: 'Completed' }
  ],

  TRAINING_TYPES: [
    { value: 'Free', label: 'Complimentary/Free' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Others', label: 'Others' }
  ],

  LOCATION_TYPES: [
    { value: 'Physical', label: 'Physical' },
    { value: 'Virtual', label: 'Virtual' }
  ],

  TABLE_HEADERS: [
    { title: 'ID', key: 'ID', align: 'start', sortable: false },
    { title: 'Title', key: 'title', align: 'start', sortable: false },
    { title: 'Start Date', key: 'start_date', align: 'center', sortable: false },
    { title: 'End Date', key: 'end_date', align: 'center', sortable: false },
    { title: 'Participants', key: 'participants', align: 'center', sortable: false },
    { title: 'Status', key: 'training_status', align: 'center', sortable: false },
    { title: 'Actions', key: 'actions', align: 'center', sortable: false }
  ],

  FILE_SIZE_LIMITS: {
    DOCUMENTS: 10, // MB
    IMAGES: 5 // MB
  },

  ACCEPTED_FILE_TYPES: {
    DOCUMENTS: 'application/pdf, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint',
    IMAGES: 'image/jpeg, image/png, image/jpg'
  }
}

export const UNIVERSITY_LIST = [
  "Adamson University",
  "Ateneo de Davao University",
  "Ateneo de Manila University",
  "Batangas State University",
  "Bicol University",
  "Central Luzon State University",
  "Centro Escolar University",
  "Cebu Normal University",
  "Cebu Technological University",
  "De La Salle University",
  "Don Mariano Marcos Memorial State University",
  "Far eastern University",
  "Holy Angel University",
  "Isabela State University",
  "Jose Rizal University",
  "Lyceum of the Philippines University",
  "Mapúa University",
  "Mariano Marcos State University",
  "Mindanao State University - Marawi",
  "National University",
  "Nueva Ecija University of Science and Technology",
  "Pamantasan ng Lungsod ng Maynila",
  "Pangasinan State University",
  "Philippine Normal University",
  "Polytechnic University of the Philippines",
  "Rizal Technological University",
  "San Beda University",
  "Silliman University",
  "Technological Institute of the Philippines",
  "Technological University of the Philippines",
  "University of Asia and the Pacific",
  "University of Baguio",
  "University of Batangas",
  "University of Cebu",
  "University of eastern Philippines",
  "University of La Salette",
  "University of Luzon",
  "University of Mindanao",
  "University of Negros Occidental-Recoletos",
  "University of Northern Philippines",
  "University of San Agustin",
  "University of San Carlos",
  "University of Santo Tomas",
  "University of Southeastern Philippines",
  "University of Southern Mindanao",
  "University of the Cordilleras",
  "University of the East",
  "University of the Philippines Diliman",
  "University of the Philippines Los Baños",
  "University of the Philippines Manila"
]


export const COURSE_LIST = [
  "Bachelor of Science in Accountancy",
  "Bachelor of Science in Architecture",
  "Bachelor of Science in Biology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Chemical Engineering",
  "Bachelor of Science in Civil Engineering",
  "Bachelor of Science in Communication",
  "Bachelor of Science in Computer Engineering",
  "Bachelor of Science in Computer Science",
  "Bachelor of Science in Criminology",
  "Bachelor of Science in Dentistry",
  "Bachelor of Early Childhood Education",
  "Bachelor of Science in Economics",
  "Bachelor of Science in Electrical Engineering",
  "Bachelor of Science in Electronics Engineering",
  "Bachelor of Elementary Education",
  "Bachelor of Science in Entrepreneurship",
  "Bachelor of Science in Environmental Science",
  "Bachelor of Fine Arts",
  "Bachelor of Science in Fisheries",
  "Bachelor of Science in Geology",
  "Bachelor of Science in Hospitality Management",
  "Bachelor of Science in Human Resource Management",
  "Bachelor of Science in Industrial Engineering",
  "Bachelor of Science in Information Technology",
  "Bachelor of Arts in International Studies",
  "Bachelor of Library and Information Science",
  "Bachelor of Science in Marine Biology",
  "Bachelor of Science in Marine Engineering",
  "Bachelor of Arts in Mass Communication",
  "Bachelor of Science in Mathematics",
  "Bachelor of Science in Mechanical Engineering",
  "Bachelor of Science in Medical Laboratory Science",
  "Bachelor of Science in Midwifery",
  "Bachelor of Science in Nursing",
  "Bachelor of Science in Nutrition and Dietetics",
  "Bachelor of Science in Pharmacy",
  "Bachelor of Arts in Philosophy",
  "Bachelor of Physical Education",
  "Bachelor of Science in Physical Therapy",
  "Bachelor of Arts in Political Science",
  "Bachelor of Science in Psychology",
]

export const CUURENT_TEAMS = [
  'Education Support',
  'Paid Training and App Development',
  'Enterprise and The Loop Support',
]

export const CURRENT_POSITIONS = [
  // 'Head',
  'Manager',
  'Supervisor',
  'Assistant Supervisor',
  'Support Specialist'
]