
export let MOCK_USERS = [
  { _id: 'u1', id: 'u1', name: 'Admin User', email: 'admin@brivo.com', role: 'ADMIN' },
  { _id: 'u2', id: 'u2', name: 'Manager User', email: 'manager@brivo.com', role: 'MANAGER' },
  { _id: 'u3', id: 'u3', name: 'Jane Employee', email: 'jane@brivo.com', role: 'EMPLOYEE' },
];

export let MOCK_BRANDS = [
  { 
    _id: 'b1', 
    name: 'Nike', 
    color: '#000000', 
    secondaryColor: '#f97316',
    logo: 'https://picsum.photos/seed/nike-logo/200/200',
    description: 'A global leader in athletic footwear, apparel, and equipment.',
    tagline: 'Just Do It',
    contact: { website: 'https://nike.com', email: 'support@nike.com', phone: '1-800-806-6453' },
    socials: { 
      twitter: 'https://twitter.com/nike', 
      linkedin: 'https://linkedin.com/company/nike',
      instagram: 'https://instagram.com/nike'
    },
    styleGuide: 'https://nike.com/styleguide',
    notes: 'Premium partner since 2018.'
  },
  { 
    _id: 'b2', 
    name: 'Puma', 
    color: '#f97316', 
    secondaryColor: '#000000',
    logo: 'https://picsum.photos/seed/puma-logo/200/200',
    description: 'Passionate about sports, fashion and footwear.',
    tagline: 'Forever Faster',
    contact: { website: 'https://puma.com', email: 'service@puma.com' },
    socials: { twitter: 'https://twitter.com/puma', instagram: 'https://instagram.com/puma' }
  },
  { 
    _id: 'b3', 
    name: 'Adidas', 
    color: '#020617', 
    secondaryColor: '#ffffff',
    logo: 'https://picsum.photos/seed/adidas-logo/200/200',
    description: 'Impossible is Nothing.',
    tagline: 'All Day I Dream About Sport',
    contact: { website: 'https://adidas.com' },
    socials: { twitter: 'https://twitter.com/adidas' }
  },
  { 
    _id: 'b4', 
    name: 'Coca-Cola', 
    color: '#ef4444', 
    secondaryColor: '#ffffff',
    logo: 'https://picsum.photos/seed/coke-logo/200/200',
    description: 'The Coca-Cola Company is a total beverage company.',
    tagline: 'Taste the Feeling',
    contact: { website: 'https://coca-cola.com' },
    socials: { twitter: 'https://twitter.com/cocacola' }
  },
];

export let MOCK_PROJECTS = [
  { _id: 'p1', name: 'Summer Campaign 2024', status: 'ACTIVE', brandId: 'b1', progress: 65 },
  { _id: 'p2', name: 'Brand Refresh', status: 'ACTIVE', brandId: 'b2', progress: 30 },
  { _id: 'p3', name: 'Social Media Blast', status: 'COMPLETED', brandId: 'b3', progress: 100 },
];

export let MOCK_TASKS = [
  {
    _id: 't1',
    title: 'Logo Animation',
    description: 'Create a 5s animation for the new logo.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    brandId: MOCK_BRANDS[0],
    projectId: MOCK_PROJECTS[0],
    assignedTo: MOCK_USERS[2],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 't2',
    title: 'Social Media Kit',
    description: 'Design post templates for Instagram and Twitter.',
    status: 'TODO',
    priority: 'MEDIUM',
    brandId: MOCK_BRANDS[1],
    projectId: MOCK_PROJECTS[1],
    assignedTo: MOCK_USERS[1],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 't3',
    title: 'Print Ad for Vogue',
    description: 'Full page print ad for the summer collection.',
    status: 'REVIEW',
    priority: 'URGENT',
    brandId: MOCK_BRANDS[0],
    projectId: MOCK_PROJECTS[0],
    assignedTo: MOCK_USERS[2],
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 't4',
    title: 'New Slogan Brainstorm',
    description: 'Meeting to discuss the new slogan.',
    status: 'COMPLETED',
    priority: 'LOW',
    brandId: MOCK_BRANDS[2],
    projectId: MOCK_PROJECTS[2],
    assignedTo: MOCK_USERS[0],
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 't5',
    title: 'Website Banner Design',
    description: 'Header banners for the homepage.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    brandId: MOCK_BRANDS[3],
    projectId: MOCK_PROJECTS[1],
    assignedTo: MOCK_USERS[2],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString()
  }
];

export let MOCK_NOTIFICATIONS = [
  { _id: 'n1', title: 'New Task Assigned', message: 'You have been assigned to "Logo Animation"', type: 'TASK', read: false, createdAt: new Date().toISOString() },
  { _id: 'n2', title: 'Project Completed', message: 'Social Media Blast has been moved to COMPLETED', type: 'PROJECT', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { _id: 'n3', title: 'Overdue Task', message: 'Print Ad for Vogue is now 2 hours overdue', type: 'ALERT', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export let MOCK_REPORTS = [
  { 
    _id: 'r1', 
    title: 'Monthly Performance Q1', 
    type: 'PERFORMANCE', 
    createdAt: new Date().toISOString(), 
    status: 'COMPLETED',
    employeeId: MOCK_USERS[2],
    month: 4,
    year: 2026,
    totalAssigned: 12,
    totalCompleted: 10,
    totalInProgress: 2,
    totalOverdue: 1,
    averageCompletionTime: 4.5,
    estimatedHours: 40,
    actualHours: 38,
    brandBreakdown: [
      { brandId: 'b1', brandName: 'Nike', count: 5 },
      { brandId: 'b2', brandName: 'Puma', count: 3 },
      { brandId: 'b4', brandName: 'Coca-Cola', count: 2 },
    ]
  },
  { 
    _id: 'r2', 
    title: 'Brand Consistency Audit', 
    type: 'QUALITY', 
    createdAt: new Date().toISOString(), 
    status: 'COMPLETED',
    employeeId: MOCK_USERS[1],
    month: 4,
    year: 2026,
    totalAssigned: 8,
    totalCompleted: 8,
    totalInProgress: 0,
    totalOverdue: 0,
    averageCompletionTime: 2.1,
    estimatedHours: 20,
    actualHours: 18,
    brandBreakdown: [
      { brandId: 'b3', brandName: 'Adidas', count: 8 },
    ]
  },
];
