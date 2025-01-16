from sqlalchemy.sql import text

from . import AppointmentsRepository
from ..service.database import db
from ..model import Schedule
from .base_repo import BaseRepo
from ..repository import UsersRepository, DoctorsRepository


class ScheduleRepository(BaseRepo):
    model = Schedule
    table_name = "schedule"

    @staticmethod
    async def create_new(schedule: dict, doctor_email: str):
        doctor = await DoctorsRepository.find_by_email(doctor_email)
        if not doctor:
            return None
        schedule['doctor_id'] = doctor['id']
        result = await ScheduleRepository.create(**schedule)
        return result

    @staticmethod
    async def find_by_doctor_email(email: str):
        sql = text(f"""
            SELECT
                s.id,
                s.day,
                s.start_time,
                s.end_time
            FROM {ScheduleRepository.table_name} s
            JOIN {DoctorsRepository.table_name} d ON s.doctor_id = d.id
            JOIN {UsersRepository.table_name} u ON d.user_id = u.id
            WHERE
                u.email = :doctor_email;
        """)
        result = await db.exec_query(sql, {'doctor_email': email})
        return result

    @staticmethod
    async def get_all_free_time(date: str = None):
        date = "CURRENT_DATE" if not date else f"'{date}'"
        sql = text(f"""
            WITH doctor_schedules AS (
                SELECT
                    d.id AS doctor_id,
                    s.day,
                    ({date}::date + s.start_time) AS start_time,
                    ({date}::date + s.end_time) AS end_time
                FROM {ScheduleRepository.table_name} s
                JOIN {DoctorsRepository.table_name} d ON s.doctor_id = d.id
            ),
            doctor_appointments AS (
                SELECT
                    a.doctor_id,
                    a.date_time::date AS appointment_date,
                    a.date_time::time AS appointment_time
                FROM {AppointmentsRepository.table_name} a
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
            JOIN {DoctorsRepository.table_name} d ON s.doctor_id = d.id
            JOIN {UsersRepository.table_name} u ON d.user_id = u.id
            ORDER BY doctor_id, slot_date, slot_start;
        """)
        result = await db.exec_query(sql)
        return result
