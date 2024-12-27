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
        IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_type WHERE typname = 'appointment_status') THEN
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
    role     ROLE         NOT NULL DEFAULT 'patient',
    sex      SEX          NOT NULL
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors
(
    id             serial PRIMARY KEY,
    user_id        int REFERENCES users (id) ON DELETE CASCADE,
    specialization SPECIALIZATION NOT NULL,
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
    status     APPOINT_STATUS DEFAULT 'pending'
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
    day        DAY  NOT NULL,
    start_time time NOT NULL,
    end_time   time NOT NULL
);

INSERT INTO users (name, email, phone, password, role, sex)
VALUES ('Admin Name', 'admin@example.com', '1234567890', 'hashed_password', 'admin', 'male');