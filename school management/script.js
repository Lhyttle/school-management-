// School Management System - Complete JavaScript
// Data Storage (In a real application, this would be connected to a database)
let students = [
    {
        id: 1,
        name: "John Doe",
        grade: 10,
        age: 16,
        parentContact: "0244123456",
        totalFee: 5000,
        paidAmount: 3000,
        feeStatus: "Partial",
        lastPayment: "2025-08-15",
        history: [
            { date: "2025-08-15", action: "Fee Payment", amount: 1500, method: "Cash" },
            { date: "2025-07-01", action: "Fee Payment", amount: 1500, method: "Bank Transfer" },
            { date: "2025-06-01", action: "Student Enrolled", amount: 0 }
        ]
    },
    {
        id: 2,
        name: "Jane Smith",
        grade: 8,
        age: 14,
        parentContact: "0244789012",
        totalFee: 4500,
        paidAmount: 4500,
        feeStatus: "Paid",
        lastPayment: "2025-09-01",
        history: [
            { date: "2025-09-01", action: "Fee Payment", amount: 4500, method: "Mobile Money" },
            { date: "2025-06-15", action: "Student Enrolled", amount: 0 }
        ]
    },
    {
        id: 3,
        name: "Michael Johnson",
        grade: 12,
        age: 18,
        parentContact: "0244345678",
        totalFee: 6000,
        paidAmount: 2000,
        feeStatus: "Partial",
        lastPayment: "2025-07-20",
        history: [
            { date: "2025-07-20", action: "Fee Payment", amount: 2000, method: "Cheque" },
            { date: "2025-06-10", action: "Student Enrolled", amount: 0 }
        ]
    }
];

let teachers = [
    {
        id: 1,
        name: "Dr. Sarah Wilson",
        subject: "Mathematics",
        experience: 8,
        contact: "0241234567",
        monthlySalary: 3500,
        history: [
            { date: "2025-09-01", action: "Salary Paid", month: "September 2025", amount: 3500 },
            { date: "2025-08-01", action: "Salary Paid", month: "August 2025", amount: 3500 },
            { date: "2025-06-01", action: "Teacher Hired", amount: 0 }
        ]
    },
    {
        id: 2,
        name: "Prof. David Brown",
        subject: "English Literature",
        experience: 12,
        contact: "0241987654",
        monthlySalary: 4000,
        history: [
            { date: "2025-09-01", action: "Salary Paid", month: "September 2025", amount: 4000 },
            { date: "2025-08-01", action: "Salary Paid", month: "August 2025", amount: 4000 },
            { date: "2025-05-15", action: "Teacher Hired", amount: 0 }
        ]
    },
    {
        id: 3,
        name: "Ms. Emily Davis",
        subject: "Science",
        experience: 5,
        contact: "0241456789",
        monthlySalary: 3200,
        history: [
            { date: "2025-09-01", action: "Salary Paid", month: "September 2025", amount: 3200 },
            { date: "2025-08-01", action: "Salary Paid", month: "August 2025", amount: 3200 },
            { date: "2025-07-01", action: "Teacher Hired", amount: 0 }
        ]
    }
];

let salaryRecords = [];
let recentActivities = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    generateSalaryRecords();
    loadDashboard();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Initialize the application
function initializeApp() {
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadStudentsTable();
    loadTeachersTable();
    loadFeesTable();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup modal handlers
    setupModalHandlers();
    
    console.log('School Management System initialized successfully');
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.dataset.page;
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Update page title
                const pageTitle = document.getElementById('pageTitle');
                pageTitle.textContent = this.querySelector('.nav-text').textContent;
                
                // Load page-specific data
                loadPageData(pageId);
            }
        });
    });
}

// Load page-specific data
function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'students':
            loadStudentsTable();
            break;
        case 'teachers':
            loadTeachersTable();
            break;
        case 'salaries':
            loadSalariesTable();
            break;
        case 'fees':
            loadFeesTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Dashboard Functions
function loadDashboard() {
    // Update statistics
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalTeachers').textContent = teachers.length;
    
    // Calculate total fees collected
    const totalFeesCollected = students.reduce((total, student) => total + student.paidAmount, 0);
    document.getElementById('totalFeesCollected').textContent = `GHS ${totalFeesCollected.toLocaleString()}`;
    
    // Calculate total salaries paid (for current month)
    const currentMonth = new Date().toISOString().substring(0, 7);
    const totalSalariesPaid = salaryRecords
        .filter(record => record.month === currentMonth && record.status === 'Paid')
        .reduce((total, record) => total + record.amount, 0);
    document.getElementById('totalSalariesPaid').textContent = `GHS ${totalSalariesPaid.toLocaleString()}`;
    
    // Load recent activities
    loadRecentActivities();
    
    // Draw charts
    drawMonthlyChart();
}

function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    
    // Collect recent activities from all sources
    let allActivities = [];
    
    // Add student activities
    students.forEach(student => {
        student.history.forEach(activity => {
            allActivities.push({
                date: activity.date,
                description: `${student.name} - ${activity.action}`,
                amount: activity.amount,
                type: 'student'
            });
        });
    });
    
    // Add teacher activities
    teachers.forEach(teacher => {
        teacher.history.forEach(activity => {
            allActivities.push({
                date: activity.date,
                description: `${teacher.name} - ${activity.action}`,
                amount: activity.amount,
                type: 'teacher'
            });
        });
    });
    
    // Sort by date (most recent first)
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only last 10 activities
    const recentActivities = allActivities.slice(0, 10);
    
    let activitiesHTML = '';
    recentActivities.forEach(activity => {
        const icon = activity.type === 'student' ? 'fa-user-graduate' : 'fa-chalkboard-teacher';
        const amountText = activity.amount > 0 ? `GHS ${activity.amount.toLocaleString()}` : '';
        
        activitiesHTML += `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-date">${formatDate(activity.date)}</div>
                </div>
                <div class="activity-amount">${amountText}</div>
            </div>
        `;
    });
    
    activitiesContainer.innerHTML = activitiesHTML;
}

function drawMonthlyChart() {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sample data for monthly overview
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const feesData = [15000, 18000, 22000, 25000, 28000, 32000, 30000, 35000, 40000];
    const salariesData = [12000, 12000, 15000, 15000, 18000, 18000, 21000, 21000, 24000];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart settings
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find max value for scaling
    const maxValue = Math.max(...feesData, ...salariesData);
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw bars
    const barWidth = chartWidth / months.length / 2.5;
    const barSpacing = chartWidth / months.length;
    
    months.forEach((month, index) => {
        const x = padding + index * barSpacing;
        
        // Fees bar (blue)
        const feesHeight = (feesData[index] / maxValue) * chartHeight;
        ctx.fillStyle = '#667eea';
        ctx.fillRect(x, canvas.height - padding - feesHeight, barWidth, feesHeight);
        
        // Salaries bar (purple)
        const salariesHeight = (salariesData[index] / maxValue) * chartHeight;
        ctx.fillStyle = '#764ba2';
        ctx.fillRect(x + barWidth + 5, canvas.height - padding - salariesHeight, barWidth, salariesHeight);
        
        // Month labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(month, x + barWidth + 2.5, canvas.height - padding + 20);
    });
    
    // Legend
    ctx.fillStyle = '#667eea';
    ctx.fillRect(canvas.width - 150, 20, 15, 15);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Fees Collected', canvas.width - 130, 32);
    
    ctx.fillStyle = '#764ba2';
    ctx.fillRect(canvas.width - 150, 40, 15, 15);
    ctx.fillStyle = '#666';
    ctx.fillText('Salaries Paid', canvas.width - 130, 52);
}

// Students Management
function loadStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    let html = '';
    students.forEach(student => {
        const remaining = student.totalFee - student.paidAmount;
        const statusClass = student.feeStatus === 'Paid' ? 'status-paid' : 
                           student.feeStatus === 'Partial' ? 'status-partial' : 'status-unpaid';
        
        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.age}</td>
                <td>${student.parentContact}</td>
                <td><span class="status ${statusClass}">${student.feeStatus}</span></td>
                <td class="actions">
                    <button onclick="editStudent(${student.id})" class="btn btn-sm btn-primary" title="Edit Student">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteStudent(${student.id})" class="btn btn-sm btn-danger" title="Delete Student">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="recordFeePayment(${student.id})" class="btn btn-sm btn-success" title="Record Payment">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                    <button onclick="viewStudentHistory(${student.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function openStudentModal() {
    document.getElementById('studentModal').style.display = 'flex';
    document.getElementById('studentForm').reset();
}

function closeStudentModal() {
    document.getElementById('studentModal').style.display = 'none';
}

function addStudent(formData) {
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name: formData.get('name'),
        grade: parseInt(formData.get('grade')),
        age: parseInt(formData.get('age')),
        parentContact: formData.get('contact'),
        totalFee: parseFloat(formData.get('fee')),
        paidAmount: 0,
        feeStatus: 'Unpaid',
        lastPayment: null,
        history: [
            {
                date: new Date().toISOString().split('T')[0],
                action: 'Student Enrolled',
                amount: 0
            }
        ]
    };
    
    students.push(newStudent);
    loadStudentsTable();
    loadDashboard();
    closeStudentModal();
    
    showNotification('Student added successfully!', 'success');
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    // Open modal with student data
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentGrade').value = student.grade;
    document.getElementById('studentAge').value = student.age;
    document.getElementById('parentContact').value = student.parentContact;
    document.getElementById('studentFee').value = student.totalFee;
    
    openStudentModal();
    
    // Change form handler to update instead of add
    const form = document.getElementById('studentForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateStudent(id);
    };
}

function updateStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    student.name = document.getElementById('studentName').value;
    student.grade = parseInt(document.getElementById('studentGrade').value);
    student.age = parseInt(document.getElementById('studentAge').value);
    student.parentContact = document.getElementById('parentContact').value;
    student.totalFee = parseFloat(document.getElementById('studentFee').value);
    
    // Update fee status
    if (student.paidAmount >= student.totalFee) {
        student.feeStatus = 'Paid';
    } else if (student.paidAmount > 0) {
        student.feeStatus = 'Partial';
    } else {
        student.feeStatus = 'Unpaid';
    }
    
    // Add to history
    student.history.push({
        date: new Date().toISOString().split('T')[0],
        action: 'Student Information Updated',
        amount: 0
    });
    
    loadStudentsTable();
    loadFeesTable();
    loadDashboard();
    closeStudentModal();
    
    showNotification('Student updated successfully!', 'success');
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        students = students.filter(s => s.id !== id);
        loadStudentsTable();
        loadFeesTable();
        loadDashboard();
        showNotification('Student deleted successfully!', 'success');
    }
}

function recordFeePayment(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Fill payment modal with student data
    document.getElementById('paymentStudentName').value = student.name;
    document.getElementById('paymentTotalFee').value = student.totalFee;
    document.getElementById('paymentAlreadyPaid').value = student.paidAmount;
    document.getElementById('paymentAmount').max = student.totalFee - student.paidAmount;
    
    // Show modal
    document.getElementById('feePaymentModal').style.display = 'flex';
    
    // Set form handler
    const form = document.getElementById('feePaymentForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        processPayment(studentId);
    };
}

function processPayment(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (paymentAmount <= 0 || paymentAmount > (student.totalFee - student.paidAmount)) {
        showNotification('Invalid payment amount!', 'error');
        return;
    }
    
    // Update student record
    student.paidAmount += paymentAmount;
    student.lastPayment = new Date().toISOString().split('T')[0];
    
    // Update fee status
    if (student.paidAmount >= student.totalFee) {
        student.feeStatus = 'Paid';
    } else {
        student.feeStatus = 'Partial';
    }
    
    // Add to history
    student.history.push({
        date: student.lastPayment,
        action: 'Fee Payment',
        amount: paymentAmount,
        method: paymentMethod
    });
    
    // Refresh displays
    loadStudentsTable();
    loadFeesTable();
    loadDashboard();
    closeFeePaymentModal();
    
    showNotification(`Payment of GHS ${paymentAmount.toLocaleString()} recorded successfully!`, 'success');
}

function closeFeePaymentModal() {
    document.getElementById('feePaymentModal').style.display = 'none';
    document.getElementById('feePaymentForm').reset();
}

function viewStudentHistory(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const modal = document.getElementById('studentHistoryModal');
    const content = document.getElementById('studentHistoryContent');
    
    let historyHTML = `
        <div class="history-header">
            <h3>${student.name} - Complete History</h3>
            <p><strong>Student ID:</strong> ${student.id} | <strong>Grade:</strong> ${student.grade}</p>
        </div>
        <div class="history-timeline">
    `;
    
    // Sort history by date (most recent first)
    const sortedHistory = [...student.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedHistory.forEach(item => {
        const icon = item.action.includes('Payment') ? 'fa-dollar-sign' : 
                    item.action.includes('Enrolled') ? 'fa-user-plus' : 'fa-edit';
        const amountText = item.amount > 0 ? `<span class="amount">GHS ${item.amount.toLocaleString()}</span>` : '';
        const methodText = item.method ? `<span class="method">(${item.method})</span>` : '';
        
        historyHTML += `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="history-details">
                    <div class="history-action">${item.action} ${methodText}</div>
                    <div class="history-date">${formatDate(item.date)}</div>
                </div>
                <div class="history-amount">${amountText}</div>
            </div>
        `;
    });
    
    historyHTML += `
        </div>
        <div class="history-summary">
            <div class="summary-item">
                <span class="summary-label">Total Fee:</span>
                <span class="summary-value">GHS ${student.totalFee.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Amount Paid:</span>
                <span class="summary-value">GHS ${student.paidAmount.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Balance:</span>
                <span class="summary-value">GHS ${(student.totalFee - student.paidAmount).toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Status:</span>
                <span class="summary-value status-${student.feeStatus.toLowerCase()}">${student.feeStatus}</span>
            </div>
        </div>
    `;
    
    content.innerHTML = historyHTML;
    modal.style.display = 'flex';
}

function closeStudentHistoryModal() {
    document.getElementById('studentHistoryModal').style.display = 'none';
}

function searchStudents(query) {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.grade.toString().includes(query) ||
        student.parentContact.includes(query) ||
        student.feeStatus.toLowerCase().includes(query.toLowerCase())
    );
    
    let html = '';
    filteredStudents.forEach(student => {
        const statusClass = student.feeStatus === 'Paid' ? 'status-paid' : 
                           student.feeStatus === 'Partial' ? 'status-partial' : 'status-unpaid';
        
        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.age}</td>
                <td>${student.parentContact}</td>
                <td><span class="status ${statusClass}">${student.feeStatus}</span></td>
                <td class="actions">
                    <button onclick="editStudent(${student.id})" class="btn btn-sm btn-primary" title="Edit Student">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteStudent(${student.id})" class="btn btn-sm btn-danger" title="Delete Student">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="recordFeePayment(${student.id})" class="btn btn-sm btn-success" title="Record Payment">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                    <button onclick="viewStudentHistory(${student.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Teachers Management
function loadTeachersTable() {
    const tbody = document.getElementById('teachersTableBody');
    if (!tbody) return;
    
    let html = '';
    teachers.forEach(teacher => {
        html += `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience} years</td>
                <td>${teacher.contact}</td>
                <td>GHS ${teacher.monthlySalary.toLocaleString()}</td>
                <td class="actions">
                    <button onclick="editTeacher(${teacher.id})" class="btn btn-sm btn-primary" title="Edit Teacher">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTeacher(${teacher.id})" class="btn btn-sm btn-danger" title="Delete Teacher">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewTeacherHistory(${teacher.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function openTeacherModal() {
    document.getElementById('teacherModal').style.display = 'flex';
    document.getElementById('teacherForm').reset();
}

function closeTeacherModal() {
    document.getElementById('teacherModal').style.display = 'none';
}

function addTeacher(formData) {
    const newTeacher = {
        id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
        name: formData.get('name'),
        subject: formData.get('subject'),
        experience: parseInt(formData.get('experience')),
        contact: formData.get('contact'),
        monthlySalary: parseFloat(formData.get('salary')),
        history: [
            {
                date: new Date().toISOString().split('T')[0],
                action: 'Teacher Hired',
                amount: 0
            }
        ]
    };
    
    teachers.push(newTeacher);
    loadTeachersTable();
    loadDashboard();
    generateSalaryRecords();
    closeTeacherModal();
    
    showNotification('Teacher added successfully!', 'success');
}

function editTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    
    // Open modal with teacher data
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherSubject').value = teacher.subject;
    document.getElementById('teacherExperience').value = teacher.experience;
    document.getElementById('teacherContact').value = teacher.contact;
    document.getElementById('teacherSalary').value = teacher.monthlySalary;
    
    openTeacherModal();
    
    // Change form handler to update instead of add
    const form = document.getElementById('teacherForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateTeacher(id);
    };
}

function updateTeacher(id) {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    
    teacher.name = document.getElementById('teacherName').value;
    teacher.subject = document.getElementById('teacherSubject').value;
    teacher.experience = parseInt(document.getElementById('teacherExperience').value);
    teacher.contact = document.getElementById('teacherContact').value;
    teacher.monthlySalary = parseFloat(document.getElementById('teacherSalary').value);
    
    // Add to history
    teacher.history.push({
        date: new Date().toISOString().split('T')[0],
        action: 'Teacher Information Updated',
        amount: 0
    });
    
    loadTeachersTable();
    loadDashboard();
    generateSalaryRecords();
    closeTeacherModal();
    
    showNotification('Teacher updated successfully!', 'success');
}

function deleteTeacher(id) {
    if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
        teachers = teachers.filter(t => t.id !== id);
        salaryRecords = salaryRecords.filter(record => record.teacherId !== id);
        loadTeachersTable();
        loadSalariesTable();
        loadDashboard();
        showNotification('Teacher deleted successfully!', 'success');
    }
}

function viewTeacherHistory(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const modal = document.getElementById('teacherHistoryModal');
    const content = document.getElementById('teacherHistoryContent');
    
    let historyHTML = `
        <div class="history-header">
            <h3>${teacher.name} - Complete History</h3>
            <p><strong>Teacher ID:</strong> ${teacher.id} | <strong>Subject:</strong> ${teacher.subject}</p>
        </div>
        <div class="history-timeline">
    `;
    
    // Sort history by date (most recent first)
    const sortedHistory = [...teacher.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedHistory.forEach(item => {
        const icon = item.action.includes('Salary') ? 'fa-money-bill-wave' : 
                    item.action.includes('Hired') ? 'fa-user-plus' : 'fa-edit';
        const amountText = item.amount > 0 ? `<span class="amount">GHS ${item.amount.toLocaleString()}</span>` : '';
        const monthText = item.month ? `<span class="month">(${item.month})</span>` : '';
        
        historyHTML += `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="history-details">
                    <div class="history-action">${item.action} ${monthText}</div>
                    <div class="history-date">${formatDate(item.date)}</div>
                </div>
                <div class="history-amount">${amountText}</div>
            </div>
        `;
    });
    
    // Calculate total salary paid
    const totalSalaryPaid = teacher.history
        .filter(item => item.action.includes('Salary') && item.amount > 0)
        .reduce((total, item) => total + item.amount, 0);
    
    historyHTML += `
        </div>
        <div class="history-summary">
            <div class="summary-item">
                <span class="summary-label">Monthly Salary:</span>
                <span class="summary-value">GHS ${teacher.monthlySalary.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Salary Paid:</span>
                <span class="summary-value">GHS ${totalSalaryPaid.toLocaleString()}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Experience:</span>
                <span class="summary-value">${teacher.experience} years</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Subject:</span>
                <span class="summary-value">${teacher.subject}</span>
            </div>
        </div>
    `;
    
    content.innerHTML = historyHTML;
    modal.style.display = 'flex';
}

function closeTeacherHistoryModal() {
    document.getElementById('teacherHistoryModal').style.display = 'none';
}

function searchTeachers(query) {
    const tbody = document.getElementById('teachersTableBody');
    if (!tbody) return;
    
    const filteredTeachers = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(query.toLowerCase()) ||
        teacher.contact.includes(query) ||
        teacher.experience.toString().includes(query)
    );
    
    let html = '';
    filteredTeachers.forEach(teacher => {
        html += `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience} years</td>
                <td>${teacher.contact}</td>
                <td>GHS ${teacher.monthlySalary.toLocaleString()}</td>
                <td class="actions">
                    <button onclick="editTeacher(${teacher.id})" class="btn btn-sm btn-primary" title="Edit Teacher">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteTeacher(${teacher.id})" class="btn btn-sm btn-danger" title="Delete Teacher">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewTeacherHistory(${teacher.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Salary Management
function generateSalaryRecords() {
    // Generate salary records for each teacher for the last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(date.toISOString().substring(0, 7)); // YYYY-MM format
    }
    
    salaryRecords = [];
    
    teachers.forEach(teacher => {
        months.forEach(month => {
            const monthName = new Date(month + '-01').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
            
            // Check if salary was already paid for this month
            const alreadyPaid = teacher.history.some(item => 
                item.action === 'Salary Paid' && 
                item.month === monthName
            );
            
            salaryRecords.push({
                id: `${teacher.id}-${month}`,
                teacherId: teacher.id,
                teacherName: teacher.name,
                subject: teacher.subject,
                amount: teacher.monthlySalary,
                month: month,
                monthName: monthName,
                status: alreadyPaid ? 'Paid' : 'Pending',
                paymentDate: alreadyPaid ? 
                    teacher.history.find(item => 
                        item.action === 'Salary Paid' && 
                        item.month === monthName
                    ).date : null
            });
        });
    });
    
    loadSalariesTable();
}

function loadSalariesTable() {
    const tbody = document.getElementById('salariesTableBody');
    if (!tbody) return;
    
    let html = '';
    salaryRecords.forEach(record => {
        const statusClass = record.status === 'Paid' ? 'status-paid' : 'status-pending';
        const paymentDate = record.paymentDate ? formatDate(record.paymentDate) : '-';
        
        html += `
            <tr>
                <td>${record.teacherId}</td>
                <td>${record.teacherName}</td>
                <td>${record.subject}</td>
                <td>GHS ${record.amount.toLocaleString()}</td>
                <td>${record.monthName}</td>
                <td><span class="status ${statusClass}">${record.status}</span></td>
                <td>${paymentDate}</td>
                <td class="actions">
                    ${record.status === 'Pending' ? 
                        `<button onclick="paySalary('${record.id}')" class="btn btn-sm btn-success" title="Pay Salary">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-secondary" disabled title="Already Paid">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function paySalary(recordId) {
    const record = salaryRecords.find(r => r.id === recordId);
    if (!record || record.status === 'Paid') return;
    
    if (confirm(`Pay salary of GHS ${record.amount.toLocaleString()} to ${record.teacherName} for ${record.monthName}?`)) {
        // Update salary record
        record.status = 'Paid';
        record.paymentDate = new Date().toISOString().split('T')[0];
        
        // Update teacher history
        const teacher = teachers.find(t => t.id === record.teacherId);
        if (teacher) {
            teacher.history.push({
                date: record.paymentDate,
                action: 'Salary Paid',
                month: record.monthName,
                amount: record.amount
            });
        }
        
        // Refresh displays
        loadSalariesTable();
        loadDashboard();
        
        showNotification(`Salary paid successfully to ${record.teacherName}!`, 'success');
    }
}

function markAllSalariesPaid() {
    const pendingSalaries = salaryRecords.filter(record => record.status === 'Pending');
    
    if (pendingSalaries.length === 0) {
        showNotification('All salaries are already paid!', 'info');
        return;
    }
    
    const totalAmount = pendingSalaries.reduce((total, record) => total + record.amount, 0);
    
    if (confirm(`Pay all pending salaries? Total amount: GHS ${totalAmount.toLocaleString()}`)) {
        const paymentDate = new Date().toISOString().split('T')[0];
        
        pendingSalaries.forEach(record => {
            record.status = 'Paid';
            record.paymentDate = paymentDate;
            
            // Update teacher history
            const teacher = teachers.find(t => t.id === record.teacherId);
            if (teacher) {
                teacher.history.push({
                    date: paymentDate,
                    action: 'Salary Paid',
                    month: record.monthName,
                    amount: record.amount
                });
            }
        });
        
        // Refresh displays
        loadSalariesTable();
        loadDashboard();
        
        showNotification(`All salaries paid successfully! Total: GHS ${totalAmount.toLocaleString()}`, 'success');
    }
}

function filterSalariesByMonth() {
    const selectedMonth = document.getElementById('monthFilter').value;
    const tbody = document.getElementById('salariesTableBody');
    if (!tbody) return;
    
    const filteredRecords = selectedMonth ? 
        salaryRecords.filter(record => record.month === selectedMonth) : 
        salaryRecords;
    
    let html = '';
    filteredRecords.forEach(record => {
        const statusClass = record.status === 'Paid' ? 'status-paid' : 'status-pending';
        const paymentDate = record.paymentDate ? formatDate(record.paymentDate) : '-';
        
        html += `
            <tr>
                <td>${record.teacherId}</td>
                <td>${record.teacherName}</td>
                <td>${record.subject}</td>
                <td>GHS ${record.amount.toLocaleString()}</td>
                <td>${record.monthName}</td>
                <td><span class="status ${statusClass}">${record.status}</span></td>
                <td>${paymentDate}</td>
                <td class="actions">
                    ${record.status === 'Pending' ? 
                        `<button onclick="paySalary('${record.id}')" class="btn btn-sm btn-success" title="Pay Salary">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-secondary" disabled title="Already Paid">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function searchSalaries(query) {
    const tbody = document.getElementById('salariesTableBody');
    if (!tbody) return;
    
    const filteredRecords = salaryRecords.filter(record => 
        record.teacherName.toLowerCase().includes(query.toLowerCase()) ||
        record.subject.toLowerCase().includes(query.toLowerCase()) ||
        record.monthName.toLowerCase().includes(query.toLowerCase()) ||
        record.status.toLowerCase().includes(query.toLowerCase()) ||
        record.teacherId.toString().includes(query)
    );
    
    let html = '';
    filteredRecords.forEach(record => {
        const statusClass = record.status === 'Paid' ? 'status-paid' : 'status-pending';
        const paymentDate = record.paymentDate ? formatDate(record.paymentDate) : '-';
        
        html += `
            <tr>
                <td>${record.teacherId}</td>
                <td>${record.teacherName}</td>
                <td>${record.subject}</td>
                <td>GHS ${record.amount.toLocaleString()}</td>
                <td>${record.monthName}</td>
                <td><span class="status ${statusClass}">${record.status}</span></td>
                <td>${paymentDate}</td>
                <td class="actions">
                    ${record.status === 'Pending' ? 
                        `<button onclick="paySalary('${record.id}')" class="btn btn-sm btn-success" title="Pay Salary">
                            <i class="fas fa-money-bill-wave"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-secondary" disabled title="Already Paid">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Fees Management
function loadFeesTable() {
    const tbody = document.getElementById('feesTableBody');
    if (!tbody) return;
    
    let html = '';
    students.forEach(student => {
        const remaining = student.totalFee - student.paidAmount;
        const statusClass = student.feeStatus === 'Paid' ? 'status-paid' : 
                           student.feeStatus === 'Partial' ? 'status-partial' : 'status-unpaid';
        const lastPayment = student.lastPayment ? formatDate(student.lastPayment) : 'Never';
        
        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>GHS ${student.totalFee.toLocaleString()}</td>
                <td>GHS ${student.paidAmount.toLocaleString()}</td>
                <td>GHS ${remaining.toLocaleString()}</td>
                <td><span class="status ${statusClass}">${student.feeStatus}</span></td>
                <td>${lastPayment}</td>
                <td class="actions">
                    ${remaining > 0 ? 
                        `<button onclick="recordFeePayment(${student.id})" class="btn btn-sm btn-success" title="Record Payment">
                            <i class="fas fa-dollar-sign"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-secondary" disabled title="Fully Paid">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                    <button onclick="viewStudentHistory(${student.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function searchFees(query) {
    const tbody = document.getElementById('feesTableBody');
    if (!tbody) return;
    
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.id.toString().includes(query) ||
        student.feeStatus.toLowerCase().includes(query.toLowerCase())
    );
    
    let html = '';
    filteredStudents.forEach(student => {
        const remaining = student.totalFee - student.paidAmount;
        const statusClass = student.feeStatus === 'Paid' ? 'status-paid' : 
                           student.feeStatus === 'Partial' ? 'status-partial' : 'status-unpaid';
        const lastPayment = student.lastPayment ? formatDate(student.lastPayment) : 'Never';
        
        html += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>GHS ${student.totalFee.toLocaleString()}</td>
                <td>GHS ${student.paidAmount.toLocaleString()}</td>
                <td>GHS ${remaining.toLocaleString()}</td>
                <td><span class="status ${statusClass}">${student.feeStatus}</span></td>
                <td>${lastPayment}</td>
                <td class="actions">
                    ${remaining > 0 ? 
                        `<button onclick="recordFeePayment(${student.id})" class="btn btn-sm btn-success" title="Record Payment">
                            <i class="fas fa-dollar-sign"></i>
                        </button>` : 
                        `<button class="btn btn-sm btn-secondary" disabled title="Fully Paid">
                            <i class="fas fa-check"></i>
                        </button>`
                    }
                    <button onclick="viewStudentHistory(${student.id})" class="btn btn-sm btn-info" title="View History">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Analytics
function loadAnalytics() {
    drawTrendChart();
}

function drawTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Sample trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const studentEnrollment = [45, 48, 52, 55, 58, 62, 65, 68, 72];
    const feeCollection = [85, 87, 89, 92, 88, 91, 94, 96, 93];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart settings
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw student enrollment line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const maxStudents = Math.max(...studentEnrollment);
    studentEnrollment.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (studentEnrollment.length - 1);
        const y = canvas.height - padding - (value / maxStudents) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.stroke();
    
    // Draw fee collection line
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const maxFees = Math.max(...feeCollection);
    feeCollection.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (feeCollection.length - 1);
        const y = canvas.height - padding - (value / 100) * chartHeight; // Percentage scale
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = '#764ba2';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.stroke();
    
    // Draw month labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
        const x = padding + (index * chartWidth) / (months.length - 1);
        ctx.fillText(month, x, canvas.height - padding + 20);
    });
    
    // Legend
    ctx.fillStyle = '#667eea';
    ctx.fillRect(canvas.width - 150, 20, 15, 15);
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Student Enrollment', canvas.width - 130, 32);
    
    ctx.fillStyle = '#764ba2';
    ctx.fillRect(canvas.width - 150, 40, 15, 15);
    ctx.fillStyle = '#666';
    ctx.fillText('Fee Collection %', canvas.width - 130, 52);
}

// Form Handlers
function setupFormHandlers() {
    // Student form
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.set('name', document.getElementById('studentName').value);
            formData.set('grade', document.getElementById('studentGrade').value);
            formData.set('age', document.getElementById('studentAge').value);
            formData.set('contact', document.getElementById('parentContact').value);
            formData.set('fee', document.getElementById('studentFee').value);
            addStudent(formData);
        });
    }
    
    // Teacher form
    const teacherForm = document.getElementById('teacherForm');
    if (teacherForm) {
        teacherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.set('name', document.getElementById('teacherName').value);
            formData.set('subject', document.getElementById('teacherSubject').value);
            formData.set('experience', document.getElementById('teacherExperience').value);
            formData.set('contact', document.getElementById('teacherContact').value);
            formData.set('salary', document.getElementById('teacherSalary').value);
            addTeacher(formData);
        });
    }
}

// Modal Handlers
function setupModalHandlers() {
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Print Functions
function printCurrentPage() {
    const activePageId = document.querySelector('.page.active').id;
    switch(activePageId) {
        case 'dashboard':
            printDashboard();
            break;
        case 'students':
            printStudentsReport();
            break;
        case 'teachers':
            printTeachersReport();
            break;
        case 'salaries':
            printSalariesReport();
            break;
        case 'fees':
            printFeesReport();
            break;
        case 'analytics':
            printAnalyticsReport();
            break;
    }
}

function printDashboard() {
    const printContent = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Dashboard Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="print-stats">
            <div class="stat-item">
                <span class="label">Total Students:</span>
                <span class="value">${students.length}</span>
            </div>
            <div class="stat-item">
                <span class="label">Total Teachers:</span>
                <span class="value">${teachers.length}</span>
            </div>
            <div class="stat-item">
                <span class="label">Total Fees Collected:</span>
                <span class="value">GHS ${students.reduce((total, student) => total + student.paidAmount, 0).toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <span class="label">Pending Fee Collection:</span>
                <span class="value">GHS ${students.reduce((total, student) => total + (student.totalFee - student.paidAmount), 0).toLocaleString()}</span>
            </div>
        </div>
    `;
    
    showPrintDialog(printContent);
}

function printStudentsReport() {
    let tableHTML = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Students Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Students: ${students.length}</p>
        </div>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Grade</th>
                    <th>Age</th>
                    <th>Parent Contact</th>
                    <th>Fee Status</th>
                    <th>Amount Paid</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    students.forEach(student => {
        tableHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Grade ${student.grade}</td>
                <td>${student.age}</td>
                <td>${student.parentContact}</td>
                <td>${student.feeStatus}</td>
                <td>GHS ${student.paidAmount.toLocaleString()}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    showPrintDialog(tableHTML);
}

function printTeachersReport() {
    let tableHTML = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Teachers Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Teachers: ${teachers.length}</p>
        </div>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Experience</th>
                    <th>Contact</th>
                    <th>Monthly Salary</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    teachers.forEach(teacher => {
        tableHTML += `
            <tr>
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience} years</td>
                <td>${teacher.contact}</td>
                <td>GHS ${teacher.monthlySalary.toLocaleString()}</td>
            </tr>
        `;
    });
    
    const totalSalaries = teachers.reduce((total, teacher) => total + teacher.monthlySalary, 0);
    
    tableHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5"><strong>Total Monthly Salaries:</strong></td>
                    <td><strong>GHS ${totalSalaries.toLocaleString()}</strong></td>
                </tr>
            </tfoot>
        </table>
    `;
    
    showPrintDialog(tableHTML);
}

function printSalariesReport() {
    let tableHTML = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Salary Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>Teacher ID</th>
                    <th>Teacher Name</th>
                    <th>Subject</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    salaryRecords.forEach(record => {
        const paymentDate = record.paymentDate ? formatDate(record.paymentDate) : 'Pending';
        tableHTML += `
            <tr>
                <td>${record.teacherId}</td>
                <td>${record.teacherName}</td>
                <td>${record.subject}</td>
                <td>${record.monthName}</td>
                <td>GHS ${record.amount.toLocaleString()}</td>
                <td>${record.status}</td>
                <td>${paymentDate}</td>
            </tr>
        `;
    });
    
    const totalPaid = salaryRecords.filter(r => r.status === 'Paid').reduce((total, record) => total + record.amount, 0);
    const totalPending = salaryRecords.filter(r => r.status === 'Pending').reduce((total, record) => total + record.amount, 0);
    
    tableHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4"><strong>Total Paid:</strong></td>
                    <td><strong>GHS ${totalPaid.toLocaleString()}</strong></td>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Total Pending:</strong></td>
                    <td><strong>GHS ${totalPending.toLocaleString()}</strong></td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        </table>
    `;
    
    showPrintDialog(tableHTML);
}

function printFeesReport() {
    let tableHTML = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Fee Collection Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table class="print-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Total Fee</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Last Payment</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    students.forEach(student => {
        const balance = student.totalFee - student.paidAmount;
        const lastPayment = student.lastPayment ? formatDate(student.lastPayment) : 'Never';
        tableHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>GHS ${student.totalFee.toLocaleString()}</td>
                <td>GHS ${student.paidAmount.toLocaleString()}</td>
                <td>GHS ${balance.toLocaleString()}</td>
                <td>${student.feeStatus}</td>
                <td>${lastPayment}</td>
            </tr>
        `;
    });
    
    const totalFees = students.reduce((total, student) => total + student.totalFee, 0);
    const totalPaid = students.reduce((total, student) => total + student.paidAmount, 0);
    const totalBalance = totalFees - totalPaid;
    
    tableHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2"><strong>Totals:</strong></td>
                    <td><strong>GHS ${totalFees.toLocaleString()}</strong></td>
                    <td><strong>GHS ${totalPaid.toLocaleString()}</strong></td>
                    <td><strong>GHS ${totalBalance.toLocaleString()}</strong></td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        </table>
    `;
    
    showPrintDialog(tableHTML);
}

function printAnalyticsReport() {
    const printContent = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Analytics Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="print-analytics">
            <div class="analytics-section">
                <h3>Performance Overview</h3>
                <div class="perf-stats">
                    <div class="stat-item">
                        <span class="label">Average Grade:</span>
                        <span class="value">B+</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Attendance Rate:</span>
                        <span class="value">94%</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Completion Rate:</span>
                        <span class="value">87%</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Class Distribution</h3>
                <div class="distribution-stats">
                    <div class="stat-item">
                        <span class="label">Grade 1-3:</span>
                        <span class="value">35% (${Math.round(students.length * 0.35)} students)</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Grade 4-6:</span>
                        <span class="value">28% (${Math.round(students.length * 0.28)} students)</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Grade 7-9:</span>
                        <span class="value">22% (${Math.round(students.length * 0.22)} students)</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Grade 10-12:</span>
                        <span class="value">15% (${Math.round(students.length * 0.15)} students)</span>
                    </div>
                </div>
            </div>
            
            <div class="analytics-section">
                <h3>Financial Summary</h3>
                <div class="financial-stats">
                    <div class="stat-item">
                        <span class="label">Total Revenue Potential:</span>
                        <span class="value">GHS ${students.reduce((total, student) => total + student.totalFee, 0).toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Revenue Collected:</span>
                        <span class="value">GHS ${students.reduce((total, student) => total + student.paidAmount, 0).toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Pending Collection:</span>
                        <span class="value">GHS ${students.reduce((total, student) => total + (student.totalFee - student.paidAmount), 0).toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Monthly Salary Expenses:</span>
                        <span class="value">GHS ${teachers.reduce((total, teacher) => total + teacher.monthlySalary, 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showPrintDialog(printContent);
}

function printStudentHistory() {
    const content = document.getElementById('studentHistoryContent');
    if (!content) return;
    
    const printContent = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Student History Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="print-history">
            ${content.innerHTML}
        </div>
    `;
    
    showPrintDialog(printContent);
}

function printTeacherHistory() {
    const content = document.getElementById('teacherHistoryContent');
    if (!content) return;
    
    const printContent = `
        <div class="print-header">
            <h1>FLOCKS INTERNATIONAL SCHOOL COMPLEX</h1>
            <h2>Teacher History Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="print-history">
            ${content.innerHTML}
        </div>
    `;
    
    showPrintDialog(printContent);
}

function showPrintDialog(content) {
    const printContainer = document.getElementById('printContainer');
    if (!printContainer) return;
    
    // Enhanced print styles
    const printStyles = `
        <style>
            @media print {
                body * { visibility: hidden; }
                .print-container, .print-container * { visibility: visible; }
                .print-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background: white;
                    color: black;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    padding: 20px;
                }
                
                .print-header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                
                .print-header h1 {
                    font-size: 20px;
                    margin: 0 0 10px 0;
                    color: #333;
                }
                
                .print-header h2 {
                    font-size: 16px;
                    margin: 0 0 10px 0;
                    color: #666;
                }
                
                .print-header p {
                    margin: 5px 0;
                    color: #888;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                
                .print-table th,
                .print-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    font-size: 11px;
                }
                
                .print-table th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                }
                
                .print-table tfoot td {
                    font-weight: bold;
                    background-color: #f9f9f9;
                }
                
                .print-stats,
                .print-analytics {
                    margin: 20px 0;
                }
                
                .stat-item,
                .perf-stats .stat-item,
                .distribution-stats .stat-item,
                .financial-stats .stat-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px dotted #ccc;
                    margin-bottom: 5px;
                }
                
                .stat-item .label,
                .perf-stats .stat-item .label,
                .distribution-stats .stat-item .label,
                .financial-stats .stat-item .label {
                    font-weight: bold;
                }
                
                .analytics-section {
                    margin: 30px 0;
                    page-break-inside: avoid;
                }
                
                .analytics-section h3 {
                    font-size: 14px;
                    margin-bottom: 15px;
                    color: #333;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
                
                .print-history .history-header {
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #ddd;
                }
                
                .print-history .history-header h3 {
                    font-size: 16px;
                    margin: 0 0 10px 0;
                    color: #333;
                }
                
                .print-history .history-timeline {
                    margin: 20px 0;
                }
                
                .print-history .history-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px dotted #ddd;
                    page-break-inside: avoid;
                }
                
                .print-history .history-icon {
                    width: 30px;
                    text-align: center;
                    margin-right: 15px;
                }
                
                .print-history .history-details {
                    flex: 1;
                }
                
                .print-history .history-action {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                
                .print-history .history-date {
                    font-size: 10px;
                    color: #666;
                }
                
                .print-history .history-amount {
                    font-weight: bold;
                    color: #333;
                }
                
                .print-history .history-summary {
                    margin-top: 30px;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border: 1px solid #ddd;
                }
                
                .print-history .summary-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px dotted #ccc;
                }
                
                .print-history .summary-label {
                    font-weight: bold;
                }
                
                .print-history .summary-value {
                    font-weight: bold;
                }
                
                .status-paid { color: #28a745; }
                .status-partial { color: #ffc107; }
                .status-unpaid { color: #dc3545; }
                .status-pending { color: #ffc107; }
            }
            
            @page {
                margin: 1cm;
                size: A4;
            }
        </style>
    `;
    
    printContainer.innerHTML = printStyles + content;
    printContainer.style.display = 'block';
    
    // Trigger print dialog
    setTimeout(() => {
        window.print();
        printContainer.style.display = 'none';
    }, 100);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add CSS animation
    if (!document.querySelector('#notificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'notificationStyles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                margin-left: 15px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Improved Student History Modal with better design
function viewStudentHistory(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const modal = document.getElementById('studentHistoryModal');
    const content = document.getElementById('studentHistoryContent');
    
    let historyHTML = `
        <div class="history-header">
            <div class="student-info">
                <h3><i class="fas fa-user-graduate"></i> ${student.name}</h3>
                <div class="student-details">
                    <span class="detail-item"><strong>ID:</strong> ${student.id}</span>
                    <span class="detail-item"><strong>Grade:</strong> ${student.grade}</span>
                    <span class="detail-item"><strong>Age:</strong> ${student.age}</span>
                    <span class="detail-item"><strong>Contact:</strong> ${student.parentContact}</span>
                </div>
            </div>
        </div>
        
        <div class="history-timeline">
            <h4><i class="fas fa-history"></i> Transaction History</h4>
    `;
    
    // Sort history by date (most recent first)
    const sortedHistory = [...student.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedHistory.length === 0) {
        historyHTML += `
            <div class="no-history">
                <i class="fas fa-info-circle"></i>
                <p>No transaction history available for this student.</p>
            </div>
        `;
    } else {
        sortedHistory.forEach((item, index) => {
            const icon = item.action.includes('Payment') ? 'fa-dollar-sign' : 
                        item.action.includes('Enrolled') ? 'fa-user-plus' : 'fa-edit';
            const iconColor = item.action.includes('Payment') ? '#28a745' : 
                             item.action.includes('Enrolled') ? '#007bff' : '#ffc107';
            const amountText = item.amount > 0 ? `<span class="amount success">+GHS ${item.amount.toLocaleString()}</span>` : '';
            const methodText = item.method ? `<span class="method">${item.method}</span>` : '';
            
            historyHTML += `
                <div class="timeline-item">
                    <div class="timeline-marker">
                        <i class="fas ${icon}" style="color: ${iconColor}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h5>${item.action}</h5>
                            <span class="timeline-date">${formatDate(item.date)}</span>
                        </div>
                        <div class="timeline-details">
                            ${methodText ? `<div class="detail-row"><strong>Method:</strong> ${methodText}</div>` : ''}
                            ${amountText ? `<div class="detail-row"><strong>Amount:</strong> ${amountText}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    historyHTML += `
        </div>
        
        <div class="financial-summary">
            <h4><i class="fas fa-chart-pie"></i> Financial Summary</h4>
            <div class="summary-grid">
                <div class="summary-card total">
                    <div class="summary-icon">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Total Fee</span>
                        <span class="summary-value">GHS ${student.totalFee.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="summary-card paid">
                    <div class="summary-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Amount Paid</span>
                        <span class="summary-value">GHS ${student.paidAmount.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="summary-card balance">
                    <div class="summary-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Outstanding Balance</span>
                        <span class="summary-value">GHS ${(student.totalFee - student.paidAmount).toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="summary-card status">
                    <div class="summary-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Payment Status</span>
                        <span class="summary-value status-${student.feeStatus.toLowerCase()}">${student.feeStatus}</span>
                    </div>
                </div>
            </div>
            
            <div class="payment-progress">
                <div class="progress-header">
                    <span>Payment Progress</span>
                    <span>${Math.round((student.paidAmount / student.totalFee) * 100)}% Complete</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(student.paidAmount / student.totalFee) * 100}%"></div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = historyHTML;
    modal.style.display = 'flex';
}

// Improved Teacher History Modal with better design
function viewTeacherHistory(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    const modal = document.getElementById('teacherHistoryModal');
    const content = document.getElementById('teacherHistoryContent');
    
    let historyHTML = `
        <div class="history-header">
            <div class="teacher-info">
                <h3><i class="fas fa-chalkboard-teacher"></i> ${teacher.name}</h3>
                <div class="teacher-details">
                    <span class="detail-item"><strong>ID:</strong> ${teacher.id}</span>
                    <span class="detail-item"><strong>Subject:</strong> ${teacher.subject}</span>
                    <span class="detail-item"><strong>Experience:</strong> ${teacher.experience} years</span>
                    <span class="detail-item"><strong>Contact:</strong> ${teacher.contact}</span>
                </div>
            </div>
        </div>
        
        <div class="history-timeline">
            <h4><i class="fas fa-history"></i> Employment History</h4>
    `;
    
    // Sort history by date (most recent first)
    const sortedHistory = [...teacher.history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedHistory.length === 0) {
        historyHTML += `
            <div class="no-history">
                <i class="fas fa-info-circle"></i>
                <p>No employment history available for this teacher.</p>
            </div>
        `;
    } else {
        sortedHistory.forEach((item, index) => {
            const icon = item.action.includes('Salary') ? 'fa-money-bill-wave' : 
                        item.action.includes('Hired') ? 'fa-user-plus' : 'fa-edit';
            const iconColor = item.action.includes('Salary') ? '#28a745' : 
                             item.action.includes('Hired') ? '#007bff' : '#ffc107';
            const amountText = item.amount > 0 ? `<span class="amount success">GHS ${item.amount.toLocaleString()}</span>` : '';
            const monthText = item.month ? `<span class="month">${item.month}</span>` : '';
            
            historyHTML += `
                <div class="timeline-item">
                    <div class="timeline-marker">
                        <i class="fas ${icon}" style="color: ${iconColor}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h5>${item.action}</h5>
                            <span class="timeline-date">${formatDate(item.date)}</span>
                        </div>
                        <div class="timeline-details">
                            ${monthText ? `<div class="detail-row"><strong>Period:</strong> ${monthText}</div>` : ''}
                            ${amountText ? `<div class="detail-row"><strong>Amount:</strong> ${amountText}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // Calculate salary statistics
    const salaryPayments = teacher.history.filter(item => item.action.includes('Salary') && item.amount > 0);
    const totalSalaryPaid = salaryPayments.reduce((total, item) => total + item.amount, 0);
    const avgMonthlySalary = salaryPayments.length > 0 ? totalSalaryPaid / salaryPayments.length : 0;
    
    historyHTML += `
        </div>
        
        <div class="employment-summary">
            <h4><i class="fas fa-briefcase"></i> Employment Summary</h4>
            <div class="summary-grid">
                <div class="summary-card current">
                    <div class="summary-icon">
                        <i class="fas fa-money-check-alt"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Current Salary</span>
                        <span class="summary-value">GHS ${teacher.monthlySalary.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="summary-card total">
                    <div class="summary-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Total Paid</span>
                        <span class="summary-value">GHS ${totalSalaryPaid.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="summary-card payments">
                    <div class="summary-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Payments Made</span>
                        <span class="summary-value">${salaryPayments.length}</span>
                    </div>
                </div>
                
                <div class="summary-card experience">
                    <div class="summary-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="summary-details">
                        <span class="summary-label">Experience</span>
                        <span class="summary-value">${teacher.experience} years</span>
                    </div>
                </div>
            </div>
            
            <div class="employment-stats">
                <div class="stat-row">
                    <span class="stat-label">Subject Specialization:</span>
                    <span class="stat-value">${teacher.subject}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Monthly Salary Rate:</span>
                    <span class="stat-value">GHS ${teacher.monthlySalary.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Average Monthly Payment:</span>
                    <span class="stat-value">GHS ${Math.round(avgMonthlySalary).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = historyHTML;
    modal.style.display = 'flex';
}