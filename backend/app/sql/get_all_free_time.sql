SET search_path=doctCore;

WITH doctor_schedules AS (
    SELECT
        d.id AS doctor_id,
        s.day,
        ('2025-01-01'::date + s.start_time) AS start_time,
        ('2025-01-01'::date + s.end_time) AS end_time
    FROM schedule s
    JOIN doctors d ON s.doctor_id = d.id
),
doctor_appointments AS (
    SELECT
        a.doctor_id,
        a.date_time::date AS appointment_date,
        a.date_time::time AS appointment_time
    FROM appointments a
    WHERE a.status IN ('pending', 'approved')
),
time_slots AS (
    SELECT
        doctor_id,
        generate_series(
            start_time,
            end_time - interval '1 second',
            interval '1 hour'
        ) AS slot_start
    FROM doctor_schedules
),
all_slots_with_status AS (
    SELECT
        ts.doctor_id,
        ts.slot_start::date AS slot_date,
        ts.slot_start::time AS slot_start,
        ts.slot_start::time + interval '1 hour' AS slot_end,

        CASE
            WHEN da.appointment_time IS NOT NULL THEN 'occupied'
            ELSE 'free'
        END AS status
    FROM time_slots ts
    LEFT JOIN doctor_appointments da
        ON ts.doctor_id = da.doctor_id
        AND ts.slot_start::date = da.appointment_date
        AND ts.slot_start::time >= da.appointment_time
        AND ts.slot_start::time < (da.appointment_time + interval '1 hour')
)
SELECT
    d.id AS doctor_id,
    u.name AS doctor_name,
    s.slot_date AS day,
    s.slot_start AS time_slot,
    s.status
FROM all_slots_with_status s
JOIN doctors d ON s.doctor_id = d.id
JOIN users u ON d.user_id = u.id
ORDER BY doctor_id, slot_date, slot_start;
