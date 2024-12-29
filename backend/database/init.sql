CREATE SCHEMA IF NOT EXISTS doctCore;
SET search_path = doctCore;

-- Create ENUM types if they don't exist
DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'role') THEN
            CREATE TYPE ROLE AS ENUM ('doctor', 'patient', 'admin');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'sex') THEN
            CREATE TYPE SEX AS ENUM ('male', 'female');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'specialization') THEN
            CREATE TYPE SPECIALIZATION AS ENUM ('cardiology', 'pediatrics', 'neurology', 'otorhinolaryngology');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'appoint_status') THEN
            CREATE TYPE APPOINT_STATUS AS ENUM ('pending', 'approved', 'rejected');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'day') THEN
            CREATE TYPE DAY AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Workweek', 'Weekend');
        END IF;
    END
$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users
(
    id       serial PRIMARY KEY,
    name     varchar(255) NOT NULL,
    email    varchar(255) NOT NULL UNIQUE,
    phone    varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role     doctcore.ROLE         NOT NULL DEFAULT 'patient',
    sex      doctcore.SEX          NOT NULL
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors
(
    id             serial PRIMARY KEY,
    user_id        int REFERENCES users (id) ON DELETE CASCADE,
    specialization doctcore.SPECIALIZATION NOT NULL,
    bio            text,
    fee            numeric(10, 2)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients
(
    id         serial PRIMARY KEY,
    user_id    int REFERENCES users (id) ON DELETE CASCADE,
    blood_type varchar(3),
    address    text,
    birthdate  date
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments
(
    id         serial PRIMARY KEY,
    doctor_id  int REFERENCES doctors (id) ON DELETE CASCADE,
    patient_id int REFERENCES patients (id) ON DELETE CASCADE,
    date_time  timestamp,
    status     doctcore.APPOINT_STATUS DEFAULT 'pending'
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments
(
    id             serial PRIMARY KEY,
    appointment_id int REFERENCES appointments (id) ON DELETE CASCADE,
    amount         numeric(10, 2),
    is_paid        boolean
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records
(
    id         serial PRIMARY KEY,
    patient_id int REFERENCES patients (id) ON DELETE CASCADE,
    doctor_id  int REFERENCES doctors (id) ON DELETE CASCADE,
    diagnosis  text,
    treatment  text,
    date       timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule table
CREATE TABLE IF NOT EXISTS schedule
(
    id         serial PRIMARY KEY,
    doctor_id  int REFERENCES doctors (id) ON DELETE CASCADE,
    day        doctcore.DAY  NOT NULL,
    start_time time NOT NULL,
    end_time   time NOT NULL
);

-- Insert sample users with hashed password only if they don't exist
INSERT INTO users (name, email, phone, password, role, sex)
SELECT name, email, phone, password, role::doctcore.ROLE, sex::doctcore.SEX
FROM (VALUES
    ('John Doe', 'johndoe@example.com', '+48 123 456 789', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'doctor', 'male'),
    ('Jane Smith', 'janesmith@example.com', '+48 987 654 321', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'patient', 'female'),
    ('Alice Brown', 'alicebrown@example.com', '+48 112 233 445', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'patient', 'female'),
    ('Bob Johnson', 'bobjohnson@example.com', '+48 556 677 889', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'doctor', 'male'),
    ('Emily Davis', 'emilydavis@example.com', '+48 223 344 556', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'patient', 'female'),
    ('Michael Wilson', 'michaelwilson@example.com', '+48 334 556 778', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'doctor', 'male'),
    ('Sarah Taylor', 'sarahtaylor@example.com', '+48 445 667 889', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'patient', 'female'),
    ('David Anderson', 'davidanderson@example.com', '+48 556 778 990', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'doctor', 'male'),
    ('Laura Martinez', 'lauramartinez@example.com', '+48 667 889 001', '$2b$12$IOIYGuTMwQpKv/OSAc6y8.HGFIlgp47eO4laoYfe4dSltvqbW8YY.', 'patient', 'female')
) AS new_users(name, email, phone, password, role, sex)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = new_users.email);

-- Insert sample doctors
INSERT INTO doctors (user_id, specialization, bio, fee)
SELECT user_id, specialization::doctcore.SPECIALIZATION, bio, fee FROM (VALUES
    ((SELECT id FROM users WHERE email = 'johndoe@example.com'), 'cardiology', 'Experienced cardiologist with over 10 years in practice.', 100.00),
    ((SELECT id FROM users WHERE email = 'bobjohnson@example.com'), 'neurology', 'Specialized in neurological disorders and brain injuries.', 150.00),
    ((SELECT id FROM users WHERE email = 'michaelwilson@example.com'), 'pediatrics', 'Expert in child healthcare and development.', 120.00),
    ((SELECT id FROM users WHERE email = 'davidanderson@example.com'), 'otorhinolaryngology', 'Specialist in ear, nose, and throat disorders.', 130.00)
) AS new_doctors(user_id, specialization, bio, fee)
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE user_id = new_doctors.user_id);

-- Insert sample patients
INSERT INTO patients (user_id, blood_type, address, birthdate)
SELECT user_id, blood_type, address, birthdate::DATE FROM (VALUES
    ((SELECT id FROM users WHERE email = 'janesmith@example.com'), 'A+', '123 Main St, Springfield, IL', '1985-06-15'),
    ((SELECT id FROM users WHERE email = 'alicebrown@example.com'), 'B-', '456 Oak St, Springfield, IL', '1990-11-20'),
    ((SELECT id FROM users WHERE email = 'emilydavis@example.com'), 'O+', '789 Pine St, Springfield, IL', '1992-03-25'),
    ((SELECT id FROM users WHERE email = 'sarahtaylor@example.com'), 'AB-', '101 Maple St, Springfield, IL', '1988-07-30'),
    ((SELECT id FROM users WHERE email = 'lauramartinez@example.com'), 'A-', '202 Birch St, Springfield, IL', '1995-12-10')
) AS new_patients(user_id, blood_type, address, birthdate)
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE user_id = new_patients.user_id);

-- Insert sample appointments
INSERT INTO appointments (doctor_id, patient_id, date_time, status)
SELECT doctor_id, patient_id, date_time::timestamp, status::doctcore.APPOINT_STATUS
FROM (VALUES
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'johndoe@example.com')),
     (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'janesmith@example.com')),
     '2024-12-30 09:00:00', 'pending'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'bobjohnson@example.com')),
     (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'alicebrown@example.com')),
     '2024-12-30 11:00:00', 'approved'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'michaelwilson@example.com')),
     (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'emilydavis@example.com')),
     '2024-12-31 10:00:00', 'pending'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'davidanderson@example.com')),
     (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'sarahtaylor@example.com')),
     '2024-12-31 14:00:00', 'approved')
) AS new_appointments(doctor_id, patient_id, date_time, status)
WHERE NOT EXISTS (
    SELECT 1
    FROM appointments
    WHERE doctor_id = new_appointments.doctor_id
      AND patient_id = new_appointments.patient_id
);


-- Insert sample medical records
INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, date)
SELECT patient_id, doctor_id, diagnosis, treatment, date::date FROM (VALUES
    ((SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'janesmith@example.com')),
     (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'johndoe@example.com')),
     'Hypertension', 'Prescribed medication for blood pressure control.', '2024-12-15'),
    ((SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'alicebrown@example.com')),
     (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'bobjohnson@example.com')),
     'Migraine', 'Recommended neurologist consultation.', '2024-12-20'),
    ((SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'emilydavis@example.com')),
     (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'michaelwilson@example.com')),
     'Asthma', 'Prescribed inhaler and follow-up visit.', '2024-12-22'),
    ((SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'sarahtaylor@example.com')),
     (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'davidanderson@example.com')),
     'Sinusitis', 'Prescribed antibiotics and nasal spray.', '2024-12-25')
) AS new_records(patient_id, doctor_id, diagnosis, treatment, date)
WHERE NOT EXISTS (
    SELECT 1
    FROM medical_records
    WHERE patient_id = new_records.patient_id
      AND doctor_id = new_records.doctor_id
);

-- Insert sample schedule
INSERT INTO schedule (doctor_id, day, start_time, end_time)
SELECT doctor_id, day::doctcore.DAY, start_time::time, end_time::time FROM (VALUES
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'johndoe@example.com')), 'Monday', '09:00:00', '17:00:00'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'bobjohnson@example.com')), 'Tuesday', '10:00:00', '18:00:00'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'michaelwilson@example.com')), 'Wednesday', '08:00:00', '16:00:00'),
    ((SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'davidanderson@example.com')), 'Thursday', '11:00:00', '19:00:00')
) AS new_schedule(doctor_id, day, start_time, end_time)
WHERE NOT EXISTS (
    SELECT 1
    FROM schedule
    WHERE doctor_id = new_schedule.doctor_id
);

-- Insert random payments for existing appointments
-- Insert sample payments
INSERT INTO payments (appointment_id, amount, is_paid)
SELECT appointment_id, amount, is_paid
FROM (VALUES
    ((SELECT id FROM appointments WHERE doctor_id = (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'johndoe@example.com'))
      AND patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'janesmith@example.com'))
      AND date_time = '2024-12-30 09:00:00'), 100.00, TRUE),
    ((SELECT id FROM appointments WHERE doctor_id = (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'bobjohnson@example.com'))
      AND patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'alicebrown@example.com'))
      AND date_time = '2024-12-30 11:00:00'), 120.00, TRUE),
    ((SELECT id FROM appointments WHERE doctor_id = (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'michaelwilson@example.com'))
      AND patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'emilydavis@example.com'))
      AND date_time = '2024-12-31 10:00:00'), 80.00, FALSE),
    ((SELECT id FROM appointments WHERE doctor_id = (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE email = 'davidanderson@example.com'))
      AND patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE email = 'sarahtaylor@example.com'))
      AND date_time = '2024-12-31 14:00:00'), 150.00, TRUE)
) AS new_payments(appointment_id, amount, is_paid);
