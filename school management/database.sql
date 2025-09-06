-- Individual History Database Extensions for EduMaster
-- Add these tables and data to your existing database schema

USE edumaster_db;

-- Create Student Academic Records table for detailed academic history
CREATE TABLE student_academic_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    term ENUM('Term 1', 'Term 2', 'Term 3') NOT NULL,
    grade_level VARCHAR(10) NOT NULL,
    subject_id INT NOT NULL,
    continuous_assessment DECIMAL(5, 2) DEFAULT 0.00,
    mid_term_exam DECIMAL(5, 2) DEFAULT 0.00,
    final_exam DECIMAL(5, 2) DEFAULT 0.00,
    total_score DECIMAL(5, 2) GENERATED ALWAYS AS (
        (continuous_assessment * 0.3) + (mid_term_exam * 0.3) + (final_exam * 0.4)
    ) STORED,
    grade CHAR(2),
    position_in_class INT,
    class_size INT,
    teacher_id INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE RESTRICT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_term_subject (student_id, academic_year, term, subject_id),
    INDEX idx_student_academic (student_id, academic_year, term),
    INDEX idx_grade_level (grade_level),
    INDEX idx_total_score (total_score)
);

-- Create Student Attendance Records table
CREATE TABLE student_attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    term ENUM('Term 1', 'Term 2', 'Term 3') NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
    arrival_time TIME NULL,
    departure_time TIME NULL,
    reason TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_date (student_id, attendance_date),
    INDEX idx_student_attendance (student_id, attendance_date),
    INDEX idx_academic_term (academic_year, term),
    INDEX idx_status (status)
);

-- Create Student Disciplinary Records table
CREATE TABLE student_disciplinary_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    incident_date DATE NOT NULL,
    incident_type ENUM('Minor', 'Major', 'Severe') NOT NULL,
    incident_category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    disciplinary_action ENUM('Verbal Warning', 'Written Warning', 'Detention', 'Suspension', 'Expulsion', 'Community Service') NOT NULL,
    start_date DATE,
    end_date DATE,
    reported_by INT,
    handled_by INT,
    parent_notified BOOLEAN DEFAULT FALSE,
    parent_notification_date DATE NULL,
    status ENUM('Open', 'Resolved', 'Under Review') DEFAULT 'Open',
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (handled_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_student_discipline (student_id, incident_date),
    INDEX idx_incident_type (incident_type),
    INDEX idx_status (status)
);

-- Create Teacher Performance Evaluations table
CREATE TABLE teacher_performance_evaluations (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    evaluation_period_start DATE NOT NULL,
    evaluation_period_end DATE NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    evaluator_id INT NOT NULL,
    teaching_effectiveness DECIMAL(5, 2) NOT NULL CHECK (teaching_effectiveness BETWEEN 0 AND 100),
    student_engagement DECIMAL(5, 2) NOT NULL CHECK (student_engagement BETWEEN 0 AND 100),
    professional_development DECIMAL(5, 2) NOT NULL CHECK (professional_development BETWEEN 0 AND 100),
    punctuality DECIMAL(5, 2) NOT NULL CHECK (punctuality BETWEEN 0 AND 100),
    collaboration DECIMAL(5, 2) NOT NULL CHECK (collaboration BETWEEN 0 AND 100),
    innovation DECIMAL(5, 2) NOT NULL CHECK (innovation BETWEEN 0 AND 100),
    overall_score DECIMAL(5, 2) GENERATED ALWAYS AS (
        (teaching_effectiveness + student_engagement + professional_development + 
         punctuality + collaboration + innovation) / 6
    ) STORED,
    overall_rating ENUM('Outstanding', 'Excellent', 'Very Good', 'Good', 'Satisfactory', 'Needs Improvement', 'Unsatisfactory') NOT NULL,
    strengths TEXT,
    areas_for_improvement TEXT,
    goals_for_next_period TEXT,
    additional_comments TEXT,
    evaluation_status ENUM('Draft', 'Completed', 'Reviewed', 'Approved') DEFAULT 'Draft',
    teacher_signature_date DATE NULL,
    evaluator_signature_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_teacher_evaluation (teacher_id, evaluation_period_start),
    INDEX idx_academic_year (academic_year),
    INDEX idx_overall_rating (overall_rating)
);

-- Create Teacher Professional Development table
CREATE TABLE teacher_professional_development (
    development_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    program_name VARCHAR(200) NOT NULL,
    program_type ENUM('Workshop', 'Seminar', 'Conference', 'Course', 'Certification', 'Training') NOT NULL,
    provider VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_hours INT NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    funding_source ENUM('School', 'Personal', 'Government', 'NGO', 'Other') DEFAULT 'School',
    completion_status ENUM('Registered', 'In Progress', 'Completed', 'Cancelled') NOT NULL,
    certificate_received BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(100) NULL,
    skills_acquired TEXT,
    application_to_teaching TEXT,
    feedback_rating DECIMAL(3, 1) CHECK (feedback_rating BETWEEN 1.0 AND 5.0),
    feedback_comments TEXT,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_teacher_development (teacher_id, start_date),
    INDEX idx_program_type (program_type),
    INDEX idx_completion_status (completion_status)
);

-- Create Teacher Employment History table
CREATE TABLE teacher_employment_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    event_date DATE NOT NULL,
    event_type ENUM('Hire', 'Promotion', 'Transfer', 'Salary_Change', 'Position_Change', 'Leave', 'Return', 'Termination', 'Retirement') NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    previous_value TEXT NULL,
    new_value TEXT NULL,
    effective_date DATE NOT NULL,
    authorized_by INT,
    document_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (authorized_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_teacher_history (teacher_id, event_date),
    INDEX idx_event_type (event_type),
    INDEX idx_effective_date (effective_date)
);

-- Create detailed Fee Payment History table (more detailed than fee_payments)
CREATE TABLE detailed_fee_payment_history (
    payment_history_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT NOT NULL,
    student_id INT NOT NULL,
    fee_id INT NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'Bank Transfer', 'Mobile Money', 'Cheque', 'Card', 'Online') NOT NULL,
    payment_date DATE NOT NULL,
    payment_time TIME NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    term ENUM('Term 1', 'Term 2', 'Term 3') NOT NULL,
    fee_category ENUM('Tuition', 'Activity', 'Library', 'Laboratory', 'Transport', 'Examination', 'Other') NOT NULL,
    transaction_reference VARCHAR(100),
    bank_reference VARCHAR(100),
    receipt_number VARCHAR(50) NOT NULL,
    received_by INT NOT NULL,
    cash_received DECIMAL(10, 2),
    change_given DECIMAL(10, 2) DEFAULT 0.00,
    payment_notes TEXT,
    reversal_reason TEXT NULL,
    is_reversed BOOLEAN DEFAULT FALSE,
    reversed_by INT NULL,
    reversal_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payment_id) REFERENCES fee_payments(payment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (fee_id) REFERENCES student_fees(fee_id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (reversed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_payment_history (student_id, payment_date),
    INDEX idx_academic_term (academic_year, term),
    INDEX idx_receipt_number (receipt_number),
    INDEX idx_payment_method (payment_method)
);

-- Create Student Enrollment History table
CREATE TABLE student_enrollment_history (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    action_date DATE NOT NULL,
    action_type ENUM('Admission', 'Grade_Promotion', 'Grade_Retention', 'Transfer_In', 'Transfer_Out', 'Suspension', 'Readmission', 'Graduation', 'Withdrawal') NOT NULL,
    from_grade VARCHAR(10) NULL,
    to_grade VARCHAR(10) NULL,
    from_section VARCHAR(10) NULL,
    to_section VARCHAR(10) NULL,
    academic_year VARCHAR(9) NOT NULL,
    reason TEXT,
    previous_school VARCHAR(200) NULL,
    transfer_school VARCHAR(200) NULL,
    documents_transferred BOOLEAN DEFAULT FALSE,
    fees_cleared BOOLEAN DEFAULT TRUE,
    authorized_by INT NOT NULL,
    effective_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (authorized_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_student_enrollment (student_id, action_date),
    INDEX idx_action_type (action_type),
    INDEX idx_academic_year (academic_year)
);

-- Insert sample academic records
INSERT INTO student_academic_records (student_id, academic_year, term, grade_level, subject_id, continuous_assessment, mid_term_exam, final_exam, grade, position_in_class, class_size, teacher_id, remarks) VALUES
-- Student 1 (John Doe) - Grade 10 records
(1, '2024-2025', 'Term 1', '10', 1, 85.5, 88.0, 82.5, 'B+', 8, 35, 1, 'Good performance in mathematics'),
(1, '2024-2025', 'Term 1', '10', 2, 78.0, 75.5, 80.0, 'B', 12, 35, 3, 'Improving in English language skills'),
(1, '2024-2025', 'Term 1', '10', 3, 90.0, 87.5, 88.0, 'A', 5, 35, 2, 'Excellent understanding of scientific concepts'),

-- Student 2 (Jane Smith) - Grade 9 records
(2, '2024-2025', 'Term 1', '9', 1, 92.0, 89.5, 91.0, 'A', 3, 30, 1, 'Outstanding mathematical ability'),
(2, '2024-2025', 'Term 1', '9', 2, 88.5, 85.0, 87.0, 'A-', 6, 30, 3, 'Strong communication skills'),
(2, '2024-2025', 'Term 1', '9', 3, 85.0, 82.5, 86.5, 'B+', 9, 30, 2, 'Good grasp of scientific principles'),

-- Student 3 (Michael Johnson) - Grade 11 records
(3, '2024-2025', 'Term 1', '11', 1, 95.0, 92.5, 94.0, 'A+', 1, 32, 1, 'Exceptional mathematical talent'),
(3, '2024-2025', 'Term 1', '11', 2, 89.0, 91.5, 88.5, 'A', 4, 32, 3, 'Excellent analytical writing'),
(3, '2024-2025', 'Term 1', '11', 3, 93.5, 90.0, 92.0, 'A', 2, 32, 2, 'Deep understanding of physics concepts');

-- Insert sample attendance records
INSERT INTO student_attendance (student_id, attendance_date, academic_year, term, status, arrival_time, departure_time, recorded_by) VALUES
(1, '2024-09-01', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1),
(1, '2024-09-02', '2024-2025', 'Term 1', 'Present', '07:50:00', '15:30:00', 1),
(1, '2024-09-03', '2024-2025', 'Term 1', 'Late', '08:15:00', '15:30:00', 1),
(1, '2024-09-04', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1),
(1, '2024-09-05', '2024-2025', 'Term 1', 'Absent', NULL, NULL, 1),

(2, '2024-09-01', '2024-2025', 'Term 1', 'Present', '07:40:00', '15:30:00', 1),
(2, '2024-09-02', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1),
(2, '2024-09-03', '2024-2025', 'Term 1', 'Present', '07:42:00', '15:30:00', 1),
(2, '2024-09-04', '2024-2025', 'Term 1', 'Present', '07:48:00', '15:30:00', 1),
(2, '2024-09-05', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1);

-- Insert sample teacher performance evaluations
INSERT INTO teacher_performance_evaluations (teacher_id, evaluation_period_start, evaluation_period_end, academic_year, evaluator_id, teaching_effectiveness, student_engagement, professional_development, punctuality, collaboration, innovation, overall_rating, strengths, areas_for_improvement, goals_for_next_period) VALUES
(1, '2023-09-01', '2024-06-30', '2023-2024', 1, 92.5, 88.0, 85.5, 95.0, 90.0, 87.5, 'Excellent', 'Strong mathematical knowledge, excellent student rapport', 'Could integrate more technology in lessons', 'Attend technology integration workshop'),
(2, '2023-09-01', '2024-06-30', '2023-2024', 1, 95.0, 92.0, 90.0, 93.5, 88.0, 91.0, 'Outstanding', 'Innovative teaching methods, excellent lab management', 'Improve collaboration with other departments', 'Lead interdisciplinary project'),
(3, '2023-09-01', '2024-06-30', '2023-2024', 1, 89.0, 85.5, 88.0, 92.0, 94.0, 86.5, 'Very Good', 'Strong communication skills, good student feedback', 'Needs more creative lesson planning', 'Attend creative teaching methods course');

-- Insert sample professional development records
INSERT INTO teacher_professional_development (teacher_id, program_name, program_type, provider, start_date, end_date, duration_hours, cost, funding_source, completion_status, certificate_received, skills_acquired, application_to_teaching) VALUES
(1, 'Modern Mathematics Teaching Methods', 'Workshop', 'Ghana Education Service', '2024-07-15', '2024-07-17', 24, 500.00, 'School', 'Completed', TRUE, 'Interactive teaching methods, problem-solving techniques', 'Implemented group problem-solving sessions'),
(2, 'Laboratory Safety and Management', 'Training', 'Science Teachers Association', '2024-06-10', '2024-06-12', 18, 300.00, 'School', 'Completed', TRUE, 'Safety protocols, equipment management', 'Enhanced lab safety procedures'),
(3, 'Creative Writing Instruction', 'Course', 'University of Ghana', '2024-08-01', '2024-08-30', 40, 800.00, 'Personal', 'Completed', TRUE, 'Creative writing techniques, student engagement', 'Introduced creative writing exercises'),
(1, 'Technology Integration in Mathematics', 'Seminar', 'Educational Technology Institute', '2024-09-01', '2024-09-01', 8, 200.00, 'School', 'Completed', FALSE, 'Digital tools, online resources', 'Planning to use math software in lessons');

-- Insert sample employment history
INSERT INTO teacher_employment_history (teacher_id, event_date, event_type, event_title, description, previous_value, new_value, effective_date, authorized_by) VALUES
(1, '2020-01-15', 'Hire', 'Initial Employment', 'Hired as Mathematics teacher', NULL, 'Mathematics Teacher - Grade 10-12', '2020-01-15', 1),
(1, '2022-01-01', 'Salary_Change', 'Annual Salary Increment', 'Merit-based salary increase', '3000.00', '3500.00', '2022-01-01', 1),
(2, '2018-03-01', 'Hire', 'Initial Employment', 'Hired as Physics teacher', NULL, 'Physics Teacher - Grade 10-12', '2018-03-01', 1),
(2, '2020-01-01', 'Salary_Change', 'Annual Salary Increment', 'Performance-based salary increase', '3500.00', '4000.00', '2020-01-01', 1),
(2, '2023-06-01', 'Position_Change', 'Department Head Assignment', 'Appointed as Science Department Head', 'Physics Teacher', 'Head of Science Department', '2023-06-01', 1),
(3, '2021-09-01', 'Hire', 'Initial Employment', 'Hired as English Literature teacher', NULL, 'English Teacher - Grade 8-12', '2021-09-01', 1);

-- Insert detailed fee payment history
INSERT INTO detailed_fee_payment_history (payment_id, student_id, fee_id, payment_amount, payment_method, payment_date, payment_time, academic_year, term, fee_category, receipt_number, received_by, cash_received, change_given) VALUES
(1, 1, 1, 1250.00, 'Cash', '2024-09-01', '09:30:00', '2024-2025', 'Term 1', 'Tuition', 'RCP-001-001', 2, 1300.00, 50.00),
(2, 1, 1, 1250.00, 'Bank Transfer', '2024-10-15', '14:20:00', '2024-2025', 'Term 1', 'Tuition', 'RCP-001-002', 2, NULL, 0.00),
(3, 2, 2, 1100.00, 'Mobile Money', '2024-09-05', '11:15:00', '2024-2025', 'Term 1', 'Tuition', 'RCP-002-001', 2, NULL, 0.00),
(4, 4, 4, 2000.00, 'Cheque', '2024-09-10', '10:45:00', '2024-2025', 'Term 1', 'Tuition', 'RCP-004-001', 2, NULL, 0.00);

-- Insert student enrollment history
INSERT INTO student_enrollment_history (student_id, action_date, action_type, from_grade, to_grade, academic_year, reason, authorized_by, effective_date) VALUES
(1, '2023-09-01', 'Admission', NULL, '10', '2024-2025', 'New student admission', 1, '2023-09-01'),
(2, '2023-09-01', 'Admission', NULL, '9', '2024-2025', 'New student admission', 1, '2023-09-01'),
(3, '2022-09-01', 'Admission', NULL, '10', '2022-2023', 'New student admission', 1, '2022-09-01'),
(3, '2023-06-30', 'Grade_Promotion', '10', '11', '2023-2024', 'Promoted to next grade', 1, '2023-09-01'),
(3, '2024-06-30', 'Grade_Promotion', '11', '12', '2024-2025', 'Promoted to final year', 1, '2024-09-01'),
(4, '2024-01-15', 'Admission', NULL, '8', '2024-2025', 'Mid-year admission', 1, '2024-01-15');

-- Create indexes for better performance
CREATE INDEX idx_student_academic_performance ON student_academic_records(student_id, total_score DESC);
CREATE INDEX idx_teacher_performance_rating ON teacher_performance_evaluations(teacher_id, overall_score DESC);
CREATE INDEX idx_payment_history_amount ON detailed_fee_payment_history(student_id, payment_amount DESC);
CREATE INDEX idx_attendance_percentage ON student_attendance(student_id, status, attendance_date);

-- Create views for quick access to history summaries
CREATE VIEW student_academic_summary AS
SELECT 
    s.student_id,
    s.full_name,
    s.grade_id,
    COUNT(DISTINCT sar.academic_year) as years_enrolled,
    AVG(sar.total_score) as overall_average,
    COUNT(sar.record_id) as total_subjects_taken,
    MAX(sar.created_at) as last_record_date
FROM students s
LEFT JOIN student_academic_records sar ON s.student_id = sar.student_id
GROUP BY s.student_id, s.full_name, s.grade_id;

CREATE VIEW teacher_performance_summary AS
SELECT 
    t.teacher_id,
    t.full_name,
    t.subject_id,
    COUNT(tpe.evaluation_id) as total_evaluations,
    AVG(tpe.overall_score) as average_performance_score,
    tpe.overall_rating as latest_rating,
    MAX(tpe.evaluation_period_end) as last_evaluation_date
FROM teachers t
LEFT JOIN teacher_performance_evaluations tpe ON t.teacher_id = tpe.teacher_id
GROUP BY t.teacher_id, t.full_name, t.subject_id, tpe.overall_rating;

CREATE VIEW student_fee_payment_summary AS
SELECT 
    s.student_id,
    s.full_name,
    s.grade_id,
    COUNT(dfph.payment_history_id) as total_payments,
    SUM(dfph.payment_amount) as total_amount_paid,
    MAX(dfph.payment_date) as last_payment_date,
    GROUP_CONCAT(DISTINCT dfph.payment_method) as payment_methods_used
FROM students s
LEFT JOIN detailed_fee_payment_history dfph ON s.student_id = dfph.student_id
GROUP BY s.student_id, s.full_name, s.grade_id;

-- Stored Procedures for History Reports

DELIMITER //

-- Procedure to get complete student history
CREATE PROCEDURE GetStudentCompleteHistory(IN student_id_param INT)
BEGIN
    -- Student basic information
    SELECT 
        s.*,
        g.grade_level,
        g.grade_name,
        g.section
    FROM students s
    LEFT JOIN grades g ON s.grade_id = g.grade_id
    WHERE s.student_id = student_id_param;
    
    -- Academic records
    SELECT 
        sar.*,
        sub.subject_name,
        t.full_name as teacher_name
    FROM student_academic_records sar
    LEFT JOIN subjects sub ON sar.subject_id = sub.subject_id
    LEFT JOIN teachers t ON sar.teacher_id = t.teacher_id
    WHERE sar.student_id = student_id_param
    ORDER BY sar.academic_year DESC, sar.term DESC;
    
    -- Fee payment history
    SELECT 
        dfph.*,
        u.full_name as received_by_name
    FROM detailed_fee_payment_history dfph
    LEFT JOIN users u ON dfph.received_by = u.user_id
    WHERE dfph.student_id = student_id_param
    ORDER BY dfph.payment_date DESC;
    
    -- Attendance summary
    SELECT 
        academic_year,
        term,
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_days,
        ROUND((SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_percentage
    FROM student_attendance
    WHERE student_id = student_id_param
    GROUP BY academic_year, term
    ORDER BY academic_year DESC, term DESC;
    
    -- Disciplinary records
    SELECT 
        sdr.*,
        u1.full_name as reported_by_name,
        u2.full_name as handled_by_name
    FROM student_disciplinary_records sdr
    LEFT JOIN users u1 ON sdr.reported_by = u1.user_id
    LEFT JOIN users u2 ON sdr.handled_by = u2.user_id
    WHERE sdr.student_id = student_id_param
    ORDER BY sdr.incident_date DESC;
    
    -- Enrollment history
    SELECT 
        seh.*,
        u.full_name as authorized_by_name
    FROM student_enrollment_history seh
    LEFT JOIN users u ON seh.authorized_by = u.user_id
    WHERE seh.student_id = student_id_param
    ORDER BY seh.action_date DESC;
END //

-- Procedure to get complete teacher history
CREATE PROCEDURE GetTeacherCompleteHistory(IN teacher_id_param INT)
BEGIN
    -- Teacher basic information
    SELECT 
        t.*,
        s.subject_name
    FROM teachers t
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    WHERE t.teacher_id = teacher_id_param;
    
    -- Salary payment history
    SELECT 
        ts.*,
        sp.payment_date as actual_payment_date,
        sp.payment_method,
        sp.reference_number,
        u.full_name as processed_by_name
    FROM teacher_salaries ts
    LEFT JOIN salary_payments sp ON ts.salary_id = sp.salary_id
    LEFT JOIN users u ON sp.processed_by = u.user_id
    WHERE ts.teacher_id = teacher_id_param
    ORDER BY ts.salary_month DESC;
    
    -- Performance evaluations
    SELECT 
        tpe.*,
        u.full_name as evaluator_name
    FROM teacher_performance_evaluations tpe
    LEFT JOIN users u ON tpe.evaluator_id = u.user_id
    WHERE tpe.teacher_id = teacher_id_param
    ORDER BY tpe.evaluation_period_start DESC;
    
    -- Professional development
    SELECT 
        tpd.*,
        u.full_name as approved_by_name
    FROM teacher_professional_development tpd
    LEFT JOIN users u ON tpd.approved_by = u.user_id
    WHERE tpd.teacher_id = teacher_id_param
    ORDER BY tpd.start_date DESC;
    
    -- Employment history
    SELECT 
        teh.*,
        u.full_name as authorized_by_name
    FROM teacher_employment_history teh
    LEFT JOIN users u ON teh.authorized_by = u.user_id
    WHERE teh.teacher_id = teacher_id_param
    ORDER BY teh.event_date DESC;
END //

-- Procedure to generate student performance report
CREATE PROCEDURE GenerateStudentPerformanceReport(IN student_id_param INT, IN academic_year_param VARCHAR(9))
BEGIN
    SELECT 
        s.student_id,
        s.full_name as student_name,
        s.grade_id,
        g.grade_level,
        sar.academic_year,
        sar.term,
        sub.subject_name,
        sar.continuous_assessment,
        sar.mid_term_exam,
        sar.final_exam,
        sar.total_score,
        sar.grade,
        sar.position_in_class,
        sar.class_size,
        t.full_name as teacher_name,
        sar.remarks
    FROM students s
    LEFT JOIN grades g ON s.grade_id = g.grade_id
    LEFT JOIN student_academic_records sar ON s.student_id = sar.student_id
    LEFT JOIN subjects sub ON sar.subject_id = sub.subject_id
    LEFT JOIN teachers t ON sar.teacher_id = t.teacher_id
    WHERE s.student_id = student_id_param
    AND (academic_year_param IS NULL OR sar.academic_year = academic_year_param)
    ORDER BY sar.academic_year DESC, sar.term DESC, sub.subject_name;
END //

-- Procedure to generate teacher salary report
CREATE PROCEDURE GenerateTeacherSalaryReport(IN teacher_id_param INT, IN year_param INT)
BEGIN
    SELECT 
        t.teacher_id,
        t.full_name as teacher_name,
        t.employee_id,
        ts.salary_month,
        ts.basic_salary,
        ts.allowances,
        ts.bonuses,
        ts.overtime_pay,
        ts.deductions,
        ts.tax_deduction,
        ts.total_gross,
        ts.total_deductions,
        ts.net_salary,
        ts.salary_status,
        ts.payment_date,
        sp.payment_method,
        sp.reference_number,
        u.full_name as processed_by_name
    FROM teachers t
    LEFT JOIN teacher_salaries ts ON t.teacher_id = ts.teacher_id
    LEFT JOIN salary_payments sp ON ts.salary_id = sp.salary_id
    LEFT JOIN users u ON sp.processed_by = u.user_id
    WHERE t.teacher_id = teacher_id_param
    AND (year_param IS NULL OR YEAR(ts.salary_month) = year_param)
    ORDER BY ts.salary_month DESC;
END //

-- Function to calculate student attendance percentage
CREATE FUNCTION GetStudentAttendancePercentage(student_id_param INT, academic_year_param VARCHAR(9), term_param VARCHAR(10))
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE attendance_percentage DECIMAL(5,2) DEFAULT 0.00;
    
    SELECT 
        ROUND((SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2)
    INTO attendance_percentage
    FROM student_attendance
    WHERE student_id = student_id_param
    AND (academic_year_param IS NULL OR academic_year = academic_year_param)
    AND (term_param IS NULL OR term = term_param);
    
    RETURN IFNULL(attendance_percentage, 0.00);
END //

-- Function to calculate teacher average performance score
CREATE FUNCTION GetTeacherAveragePerformance(teacher_id_param INT, years_back INT)
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE avg_performance DECIMAL(5,2) DEFAULT 0.00;
    
    SELECT AVG(overall_score)
    INTO avg_performance
    FROM teacher_performance_evaluations
    WHERE teacher_id = teacher_id_param
    AND evaluation_period_start >= DATE_SUB(CURDATE(), INTERVAL years_back YEAR);
    
    RETURN IFNULL(avg_performance, 0.00);
END //

DELIMITER ;

-- Create triggers to maintain history automatically

DELIMITER //

-- Trigger to log student grade changes
CREATE TRIGGER student_grade_change_log
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
    IF OLD.grade_id != NEW.grade_id THEN
        INSERT INTO student_enrollment_history (
            student_id, action_date, action_type, from_grade, to_grade, 
            academic_year, reason, authorized_by, effective_date
        ) VALUES (
            NEW.student_id, CURDATE(), 'Grade_Promotion', 
            (SELECT grade_level FROM grades WHERE grade_id = OLD.grade_id),
            (SELECT grade_level FROM grades WHERE grade_id = NEW.grade_id),
            '2024-2025', 'Grade change updated', 1, CURDATE()
        );
    END IF;
END //

-- Trigger to log teacher salary changes
CREATE TRIGGER teacher_salary_change_log
AFTER UPDATE ON teachers
FOR EACH ROW
BEGIN
    IF OLD.monthly_salary != NEW.monthly_salary THEN
        INSERT INTO teacher_employment_history (
            teacher_id, event_date, event_type, event_title, description,
            previous_value, new_value, effective_date, authorized_by
        ) VALUES (
            NEW.teacher_id, CURDATE(), 'Salary_Change', 'Salary Update',
            'Monthly salary updated', 
            CAST(OLD.monthly_salary AS CHAR), CAST(NEW.monthly_salary AS CHAR),
            CURDATE(), 1
        );
    END IF;
END //

-- Trigger to automatically calculate grades from scores
CREATE TRIGGER calculate_grade_from_score
BEFORE INSERT ON student_academic_records
FOR EACH ROW
BEGIN
    SET NEW.grade = CASE
        WHEN NEW.total_score >= 90 THEN 'A+'
        WHEN NEW.total_score >= 85 THEN 'A'
        WHEN NEW.total_score >= 80 THEN 'B+'
        WHEN NEW.total_score >= 75 THEN 'B'
        WHEN NEW.total_score >= 70 THEN 'C+'
        WHEN NEW.total_score >= 65 THEN 'C'
        WHEN NEW.total_score >= 60 THEN 'D+'
        WHEN NEW.total_score >= 55 THEN 'D'
        ELSE 'F'
    END;
END //

CREATE TRIGGER calculate_grade_from_score_update
BEFORE UPDATE ON student_academic_records
FOR EACH ROW
BEGIN
    SET NEW.grade = CASE
        WHEN NEW.total_score >= 90 THEN 'A+'
        WHEN NEW.total_score >= 85 THEN 'A'
        WHEN NEW.total_score >= 80 THEN 'B+'
        WHEN NEW.total_score >= 75 THEN 'B'
        WHEN NEW.total_score >= 70 THEN 'C+'
        WHEN NEW.total_score >= 65 THEN 'C'
        WHEN NEW.total_score >= 60 THEN 'D+'
        WHEN NEW.total_score >= 55 THEN 'D'
        ELSE 'F'
    END;
END //

DELIMITER ;

-- Insert additional sample data for comprehensive testing

-- More academic records for term 2 and term 3
INSERT INTO student_academic_records (student_id, academic_year, term, grade_level, subject_id, continuous_assessment, mid_term_exam, final_exam, position_in_class, class_size, teacher_id, remarks) VALUES
-- Term 2 records
(1, '2024-2025', 'Term 2', '10', 1, 87.0, 85.5, 89.0, 6, 35, 1, 'Consistent improvement in problem-solving'),
(1, '2024-2025', 'Term 2', '10', 2, 82.5, 79.0, 84.0, 10, 35, 3, 'Better essay writing skills demonstrated'),
(1, '2024-2025', 'Term 2', '10', 3, 91.5, 88.0, 90.5, 4, 35, 2, 'Excellent laboratory work and analysis'),

(2, '2024-2025', 'Term 2', '9', 1, 94.0, 91.5, 93.0, 2, 30, 1, 'Exceptional mathematical reasoning'),
(2, '2024-2025', 'Term 2', '9', 2, 90.0, 87.5, 89.5, 4, 30, 3, 'Creative writing shows improvement'),
(2, '2024-2025', 'Term 2', '9', 3, 88.0, 85.0, 87.5, 7, 30, 2, 'Strong experimental design skills');

-- More attendance records for different students and dates
INSERT INTO student_attendance (student_id, attendance_date, academic_year, term, status, arrival_time, departure_time, recorded_by) VALUES
-- September 2024 records for multiple students
(1, '2024-09-06', '2024-2025', 'Term 1', 'Present', '07:48:00', '15:30:00', 1),
(1, '2024-09-09', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1),
(1, '2024-09-10', '2024-2025', 'Term 1', 'Late', '08:10:00', '15:30:00', 1),
(2, '2024-09-06', '2024-2025', 'Term 1', 'Present', '07:43:00', '15:30:00', 1),
(2, '2024-09-09', '2024-2025', 'Term 1', 'Present', '07:40:00', '15:30:00', 1),
(2, '2024-09-10', '2024-2025', 'Term 1', 'Present', '07:45:00', '15:30:00', 1),
(3, '2024-09-01', '2024-2025', 'Term 1', 'Present', '07:35:00', '15:30:00', 1),
(3, '2024-09-02', '2024-2025', 'Term 1', 'Present', '07:40:00', '15:30:00', 1),
(3, '2024-09-03', '2024-2025', 'Term 1', 'Present', '07:38:00', '15:30:00', 1);

-- Sample disciplinary records
INSERT INTO student_disciplinary_records (student_id, incident_date, incident_type, incident_category, description, disciplinary_action, reported_by, handled_by, parent_notified, status) VALUES
(1, '2024-09-15', 'Minor', 'Late Arrival', 'Student arrived 20 minutes late without valid excuse', 'Verbal Warning', 1, 1, TRUE, 'Resolved'),
(2, '2024-08-28', 'Minor', 'Uniform Violation', 'Not wearing proper school shoes', 'Written Warning', 1, 1, TRUE, 'Resolved');

-- Grant appropriate permissions (adjust usernames as needed)
-- GRANT SELECT, INSERT, UPDATE ON edumaster_db.* TO 'school_admin'@'localhost';
-- GRANT SELECT ON edumaster_db.* TO 'teacher_user'@'localhost';
-- GRANT SELECT, INSERT, UPDATE ON edumaster_db.fee_payments TO 'accountant_user'@'localhost';

-- Create backup procedures
DELIMITER //

CREATE PROCEDURE BackupStudentHistory(IN student_id_param INT, IN backup_table_suffix VARCHAR(20))
BEGIN
    SET @sql = CONCAT('CREATE TABLE student_history_backup_', backup_table_suffix, ' AS 
        SELECT sh.*, s.full_name, s.student_number 
        FROM (
            SELECT student_id, "academic" as record_type, record_id as id, created_at, updated_at 
            FROM student_academic_records WHERE student_id = ', student_id_param, '
            UNION ALL
            SELECT student_id, "attendance" as record_type, attendance_id as id, created_at, created_at as updated_at 
            FROM student_attendance WHERE student_id = ', student_id_param, '
            UNION ALL
            SELECT student_id, "enrollment" as record_type, enrollment_id as id, created_at, created_at as updated_at 
            FROM student_enrollment_history WHERE student_id = ', student_id_param, '
        ) sh
        JOIN students s ON sh.student_id = s.student_id');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;

-- Performance optimization indexes
CREATE INDEX idx_performance_lookup ON teacher_performance_evaluations(teacher_id, evaluation_period_start DESC);
CREATE INDEX idx_academic_lookup ON student_academic_records(student_id, academic_year DESC, term DESC);
CREATE INDEX idx_payment_lookup ON detailed_fee_payment_history(student_id, payment_date DESC);
CREATE INDEX idx_attendance_lookup ON student_attendance(student_id, attendance_date DESC);

-- Create summary statistics table for quick access
CREATE TABLE history_statistics (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('student', 'teacher') NOT NULL,
    entity_id INT NOT NULL,
    stat_type VARCHAR(50) NOT NULL,
    stat_value DECIMAL(10,2),
    stat_text VARCHAR(200),
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_entity_stat (entity_type, entity_id, stat_type),
    INDEX idx_entity (entity_type, entity_id)
);

-- Populate initial statistics
INSERT INTO history_statistics (entity_type, entity_id, stat_type, stat_value) 
SELECT 'student', student_id, 'average_score', AVG(total_score)
FROM student_academic_records 
GROUP BY student_id;

INSERT INTO history_statistics (entity_type, entity_id, stat_type, stat_value)
SELECT 'teacher', teacher_id, 'average_performance', AVG(overall_score)
FROM teacher_performance_evaluations
GROUP BY teacher_id;